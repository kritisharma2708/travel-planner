const express = require("express");
const OpenAI = require("openai");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/api/generate", async (req, res) => {
  const {
    destinationType,
    tripType,
    days,
    budget,
    travelers,
    destination,
    requirements,
  } = req.body;

  const reqList = requirements && requirements.length > 0
    ? requirements.join(", ")
    : "None";

  const dest = destination || "Suggest the best destination for their preferences";

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an expert travel planner. Generate detailed, realistic, and exciting travel itineraries. Always return valid JSON only, no extra text.",
        },
        {
          role: "user",
          content: `Generate a travel itinerary with this information:
- Destination type: ${destinationType} (India or Abroad)
- Specific destination: ${dest}
- Trip type: ${tripType}
- Duration: ${days} days
- Budget per person: ${budget}
- Number of travelers: ${travelers}
- Special requirements: ${reqList}

Return a JSON object with this exact structure:
{
  "destination": "City, Country",
  "tagline": "Why you'll love this trip (2-3 sentences)",
  "totalCostPerPerson": "₹XX,XXX or $X,XXX",
  "totalCostGroup": "₹XX,XXX or $X,XXX",
  "days": [
    {
      "day": 1,
      "title": "Arrival & First Impressions",
      "morning": { "activity": "Activity name", "description": "2-3 sentence description", "cost": "₹X,XXX or $XX", "icon": "🚶" },
      "afternoon": { "activity": "Activity name", "description": "2-3 sentence description", "cost": "₹X,XXX or $XX", "icon": "🏛️" },
      "evening": { "activity": "Activity name", "description": "2-3 sentence description", "cost": "₹X,XXX or $XX", "icon": "🍽️" }
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
  "mapCenter": "destination name for Google Maps embed"
}

Generate exactly ${days} day entries. Use the appropriate currency (₹ for India, $ for abroad). Make costs realistic for the given budget. Include a mix of popular and hidden-gem activities.`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.9,
    });

    const itinerary = JSON.parse(response.choices[0].message.content);
    res.json(itinerary);
  } catch (err) {
    console.error("OpenAI API error:", err.message);
    res.status(500).json({
      error: "Failed to generate itinerary. Please try again.",
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Travel Planner running at http://localhost:${PORT}`);
});
