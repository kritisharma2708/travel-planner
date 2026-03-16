import OpenAI from "openai";

let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _openai;
}

const SYSTEM_PROMPT = `You are Wanderly, an expert AI travel planner. You help users plan amazing trips.

When a user describes a trip they want to take, generate a detailed travel itinerary.

IMPORTANT RULES:
1. Extract trip details from the user's natural language message (destination, duration, budget, trip type, number of travelers, etc.)
2. If the user's message is too vague to generate an itinerary (e.g. just "hi" or "help me plan a trip" with no details), respond conversationally and ask what destination, duration, and budget they have in mind. Do NOT generate an itinerary in this case.
3. When you have enough information, respond with a brief friendly message followed by the itinerary JSON in a markdown code block.
4. For refinement requests ("swap Day 2 for a beach activity"), update the itinerary accordingly.

When generating an itinerary, return it inside a \`\`\`json code block with this EXACT structure:
{
  "destination": "City, Country",
  "tagline": "Why you'll love this trip (2-3 sentences)",
  "totalCostPerPerson": "₹XX,XXX or $X,XXX",
  "totalCostGroup": "₹XX,XXX or $X,XXX",
  "days": [
    {
      "day": 1,
      "title": "Arrival & First Impressions",
      "morning": { "activity": "Activity name", "description": "2-3 sentence description", "cost": "₹X,XXX or $XX", "icon": "🚶", "lat": 28.6139, "lng": 77.2090 },
      "afternoon": { "activity": "Activity name", "description": "2-3 sentence description", "cost": "₹X,XXX or $XX", "icon": "🏛️", "lat": 28.6127, "lng": 77.2295 },
      "evening": { "activity": "Activity name", "description": "2-3 sentence description", "cost": "₹X,XXX or $XX", "icon": "🍽️", "lat": 28.6304, "lng": 77.2177 }
    }
  ],
  "costBreakdown": {
    "accommodation": { "perDay": "₹X,XXX or $XX", "total": "₹XX,XXX or $X,XXX" },
    "food": { "perDay": "₹X,XXX or $XX", "total": "₹XX,XXX or $X,XXX" },
    "activities": { "perDay": "₹X,XXX or $XX", "total": "₹XX,XXX or $X,XXX" },
    "transport": { "perDay": "₹X,XXX or $XX", "total": "₹XX,XXX or $X,XXX" },
    "misc": { "perDay": "₹X,XXX or $XX", "total": "₹XX,XXX or $X,XXX" }
  },
  "hotels": [
    { "tier": "Budget", "name": "Hotel Name", "area": "Area Name", "pricePerNight": "₹X,XXX or $XX", "description": "2-line description" },
    { "tier": "Mid-range", "name": "Hotel Name", "area": "Area Name", "pricePerNight": "₹X,XXX or $XX", "description": "2-line description" },
    { "tier": "Luxury", "name": "Hotel Name", "area": "Area Name", "pricePerNight": "₹X,XXX or $XX", "description": "2-line description" }
  ],
  "flights": {
    "bestTimeToBook": "Advice on when to book",
    "recommendedAirlines": ["Airline 1", "Airline 2"],
    "estimatedPriceRange": "₹XX,XXX - ₹XX,XXX or $XXX - $X,XXX",
    "origin": "India"
  },
  "mapCenter": { "lat": 28.6139, "lng": 77.2090 }
}

Use ₹ for India destinations, $ for abroad. Make costs realistic. Include a mix of popular and hidden-gem activities. Always provide accurate lat/lng coordinates for real locations.`;

export interface ChatCompletionMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export function buildMessages(
  userMessage: string,
  previousMessages: ChatCompletionMessage[] = [],
  currentItinerary?: unknown
): ChatCompletionMessage[] {
  const messages: ChatCompletionMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
  ];

  // Add previous conversation context (last 10 messages max)
  const recentMessages = previousMessages.slice(-10);
  messages.push(...recentMessages);

  // If refining, include the current itinerary as context
  if (currentItinerary) {
    messages.push({
      role: "system",
      content: `The current itinerary is:\n\`\`\`json\n${JSON.stringify(currentItinerary)}\n\`\`\`\nThe user wants to modify it. Return the full updated itinerary JSON in a code block.`,
    });
  }

  messages.push({ role: "user", content: userMessage });

  return messages;
}

export async function* streamChat(
  messages: ChatCompletionMessage[]
): AsyncGenerator<{ type: "token"; text: string } | { type: "done"; fullText: string }> {
  const stream = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages,
    stream: true,
    temperature: 0.9,
  });

  let fullText = "";

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content;
    if (delta) {
      fullText += delta;
      yield { type: "token", text: delta };
    }
  }

  yield { type: "done", fullText };
}

export function extractItineraryJson(text: string): unknown | null {
  // Look for JSON in a markdown code block (use greedy match to get the full block)
  const codeBlockMatch = text.match(/```json\s*([\s\S]*)```/);
  if (codeBlockMatch?.[1]) {
    const jsonStr = codeBlockMatch[1].trim();
    try {
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error("[extractItineraryJson] Code block parse failed:", (e as Error).message);
      console.error("[extractItineraryJson] First 200 chars:", jsonStr.substring(0, 200));
      console.error("[extractItineraryJson] Last 200 chars:", jsonStr.substring(jsonStr.length - 200));

      // Try fixing common issues: trailing commas before } or ]
      try {
        const fixed = jsonStr.replace(/,\s*([\]}])/g, "$1");
        return JSON.parse(fixed);
      } catch {
        // Fall through
      }
    }
  }

  // Try to find JSON object directly in text (between first { and last })
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    try {
      return JSON.parse(text.substring(firstBrace, lastBrace + 1));
    } catch {
      // Fall through
    }
  }

  return null;
}

export function extractConversationalText(text: string): string {
  // Remove the JSON code block to get just the conversational part
  return text.replace(/```json[\s\S]*```/, "").trim();
}
