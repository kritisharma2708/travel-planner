import { Router, Request, Response } from "express";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "../db";
import { trips, messages as messagesTable } from "../db/schema";
import {
  buildMessages,
  streamChat,
  extractItineraryJson,
  extractConversationalText,
  ChatCompletionMessage,
} from "../services/openai";

const router = Router();

function sendSSE(res: Response, event: string, data: unknown) {
  res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

// POST /api/chat — Start a new conversation
router.post("/", async (req: Request, res: Response) => {
  const { message, history, currentItinerary } = req.body;

  if (!message || typeof message !== "string") {
    res.status(400).json({ error: "message is required" });
    return;
  }

  // Set up SSE
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  try {
    // Use client-provided history and itinerary for context (works without DB)
    const previousMessages: ChatCompletionMessage[] = Array.isArray(history)
      ? history.map((m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        }))
      : [];
    const aiMessages = buildMessages(message, previousMessages, currentItinerary || undefined);
    const stream = streamChat(aiMessages);

    for await (const event of stream) {
      if (event.type === "token") {
        sendSSE(res, "token", { text: event.text });
      } else if (event.type === "done") {
        const itinerary = extractItineraryJson(event.fullText);
        const conversationalText = extractConversationalText(event.fullText);

        console.log("[DEBUG] Full response length:", event.fullText.length);
        console.log("[DEBUG] Has code block:", /```json/.test(event.fullText));
        console.log("[DEBUG] Itinerary extracted:", itinerary !== null);

        if (itinerary && db) {
          // Save trip to database
          const shareSlug = nanoid(10);
          const itineraryData = itinerary as Record<string, unknown>;
          const destination =
            (itineraryData.destination as string) || "Unknown";

          const [trip] = await db
            .insert(trips)
            .values({
              shareSlug,
              title: `Trip to ${destination}`,
              destination,
              itinerary: itineraryData,
              userInput: { message },
            })
            .returning();

          // Save messages
          if (trip) {
            await db.insert(messagesTable).values([
              { tripId: trip.id, role: "user", content: message },
              {
                tripId: trip.id,
                role: "assistant",
                content: conversationalText,
              },
            ]);

            sendSSE(res, "itinerary", itinerary);
            sendSSE(res, "trip", {
              tripId: trip.id,
              shareSlug: trip.shareSlug,
            });
          }
        } else if (itinerary) {
          // No DB, still send itinerary to client
          sendSSE(res, "itinerary", itinerary);
        }

        sendSSE(res, "done", {});
      }
    }
  } catch (err) {
    console.error("Chat stream error:", (err as Error).message);
    sendSSE(res, "error", { message: "Failed to generate response" });
  }

  res.end();
});

// POST /api/chat/:tripId — Refine an existing itinerary
router.post("/:tripId", async (req: Request, res: Response) => {
  const tripId = req.params.tripId as string;
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    res.status(400).json({ error: "message is required" });
    return;
  }

  if (!db) {
    res.status(503).json({ error: "Database not available" });
    return;
  }

  // Load existing trip and messages
  const trip = await db.query.trips.findFirst({
    where: eq(trips.id, tripId),
  });

  if (!trip) {
    res.status(404).json({ error: "Trip not found" });
    return;
  }

  const previousDbMessages = await db.query.messages.findMany({
    where: eq(messagesTable.tripId, tripId),
    orderBy: (m, { asc }) => [asc(m.createdAt)],
  });

  // Build conversation history
  const previousMessages: ChatCompletionMessage[] = previousDbMessages.map(
    (m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })
  );

  // Set up SSE
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  try {
    const aiMessages = buildMessages(message, previousMessages, trip.itinerary);
    const stream = streamChat(aiMessages);

    for await (const event of stream) {
      if (event.type === "token") {
        sendSSE(res, "token", { text: event.text });
      } else if (event.type === "done") {
        const itinerary = extractItineraryJson(event.fullText);
        const conversationalText = extractConversationalText(event.fullText);

        // Save new messages
        await db.insert(messagesTable).values([
          { tripId, role: "user", content: message },
          { tripId, role: "assistant", content: conversationalText },
        ]);

        if (itinerary) {
          // Update the trip's itinerary
          const itineraryData = itinerary as Record<string, unknown>;
          const destination =
            (itineraryData.destination as string) || trip.destination;

          await db
            .update(trips)
            .set({
              itinerary: itineraryData,
              destination,
              updatedAt: new Date(),
            })
            .where(eq(trips.id, tripId));

          sendSSE(res, "itinerary", itinerary);
          sendSSE(res, "trip", {
            tripId: trip.id,
            shareSlug: trip.shareSlug,
          });
        }

        sendSSE(res, "done", {});
      }
    }
  } catch (err) {
    console.error("Chat refinement error:", (err as Error).message);
    sendSSE(res, "error", { message: "Failed to generate response" });
  }

  res.end();
});

export default router;
