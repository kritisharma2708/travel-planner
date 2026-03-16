import { describe, it, expect, vi } from "vitest";

// Mock the openai module so the top-level `new OpenAI()` call doesn't throw
vi.mock("openai", () => {
  return {
    default: class OpenAI {},
  };
});

import {
  extractItineraryJson,
  extractConversationalText,
  buildMessages,
  ChatCompletionMessage,
} from "./openai";

describe("extractItineraryJson", () => {
  it("extracts valid JSON from a markdown ```json code block", () => {
    const text = '```json\n{"destination": "Paris, France", "days": []}\n```';
    const result = extractItineraryJson(text);
    expect(result).toEqual({ destination: "Paris, France", days: [] });
  });

  it("extracts valid JSON from a code block with extra text before/after", () => {
    const text =
      'Here is your itinerary!\n\n```json\n{"destination": "Tokyo, Japan"}\n```\n\nEnjoy your trip!';
    const result = extractItineraryJson(text);
    expect(result).toEqual({ destination: "Tokyo, Japan" });
  });

  it("returns null when no JSON is present (plain text)", () => {
    const text = "Hello! How can I help you plan your trip today?";
    const result = extractItineraryJson(text);
    expect(result).toBeNull();
  });

  it("returns null for malformed JSON in a code block", () => {
    const text = '```json\n{destination: "bad json",,}\n```';
    const result = extractItineraryJson(text);
    expect(result).toBeNull();
  });

  it("falls back to parsing the whole text as JSON when no code block", () => {
    const text = '{"destination": "London, UK", "days": []}';
    const result = extractItineraryJson(text);
    expect(result).toEqual({ destination: "London, UK", days: [] });
  });

  it("returns null for completely invalid input", () => {
    const result = extractItineraryJson("not json at all {{{");
    expect(result).toBeNull();
  });
});

describe("extractConversationalText", () => {
  it("removes the JSON code block from text, returns the conversational part", () => {
    const text =
      'Here is your itinerary!\n\n```json\n{"destination": "Paris"}\n```\n\nEnjoy!';
    const result = extractConversationalText(text);
    expect(result).toBe("Here is your itinerary!\n\n\n\nEnjoy!");
  });

  it("returns the full text when there's no code block", () => {
    const text = "Sure! Tell me more about your trip.";
    const result = extractConversationalText(text);
    expect(result).toBe("Sure! Tell me more about your trip.");
  });

  it("handles empty string", () => {
    const result = extractConversationalText("");
    expect(result).toBe("");
  });
});

describe("buildMessages", () => {
  it("returns system prompt + user message for a basic call", () => {
    const result = buildMessages("Plan a trip to Paris");
    expect(result).toHaveLength(2);
    expect(result[0].role).toBe("system");
    expect(result[0].content).toContain("Wanderly");
    expect(result[1]).toEqual({ role: "user", content: "Plan a trip to Paris" });
  });

  it("includes previous messages in the context", () => {
    const prev: ChatCompletionMessage[] = [
      { role: "user", content: "Hi" },
      { role: "assistant", content: "Hello!" },
    ];
    const result = buildMessages("Plan a trip", prev);
    expect(result).toHaveLength(4); // system + 2 prev + user
    expect(result[1]).toEqual({ role: "user", content: "Hi" });
    expect(result[2]).toEqual({ role: "assistant", content: "Hello!" });
    expect(result[3]).toEqual({ role: "user", content: "Plan a trip" });
  });

  it("truncates to last 10 previous messages", () => {
    const prev: ChatCompletionMessage[] = Array.from({ length: 15 }, (_, i) => ({
      role: "user" as const,
      content: `Message ${i}`,
    }));
    const result = buildMessages("Latest", prev);
    // system + 10 recent prev + user = 12
    expect(result).toHaveLength(12);
    expect(result[1].content).toBe("Message 5");
    expect(result[10].content).toBe("Message 14");
    expect(result[11]).toEqual({ role: "user", content: "Latest" });
  });

  it("includes current itinerary context for refinement calls", () => {
    const itinerary = { destination: "Paris", days: [] };
    const result = buildMessages("Change day 1", [], itinerary);
    // system + itinerary system msg + user = 3
    expect(result).toHaveLength(3);
    expect(result[0].role).toBe("system");
    expect(result[1].role).toBe("system");
    expect(result[1].content).toContain("current itinerary");
    expect(result[1].content).toContain("Paris");
    expect(result[2]).toEqual({ role: "user", content: "Change day 1" });
  });

  it("system prompt is always the first message", () => {
    const prev: ChatCompletionMessage[] = [
      { role: "user", content: "Hi" },
    ];
    const itinerary = { destination: "Tokyo" };
    const result = buildMessages("Update", prev, itinerary);
    expect(result[0].role).toBe("system");
    expect(result[0].content).toContain("Wanderly");
  });
});
