import type { Itinerary } from "../types/itinerary";

export interface SSEEvent {
  type: "token" | "itinerary" | "trip" | "done" | "error";
  data: unknown;
}

export interface TripMeta {
  tripId: string;
  shareSlug: string;
}

export interface ChatContext {
  tripId?: string;
  history?: { role: string; content: string }[];
  currentItinerary?: Itinerary | null;
}

export async function streamChat(
  message: string,
  context?: ChatContext,
  onEvent?: (event: SSEEvent) => void
): Promise<void> {
  const url = context?.tripId ? `/api/chat/${context.tripId}` : "/api/chat";

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      history: context?.history,
      currentItinerary: context?.currentItinerary,
    }),
  });

  if (!response.ok) {
    throw new Error(`Chat request failed: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // Parse SSE events from buffer
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    let eventType = "";
    for (const line of lines) {
      if (line.startsWith("event: ")) {
        eventType = line.slice(7);
      } else if (line.startsWith("data: ") && eventType) {
        try {
          const data = JSON.parse(line.slice(6));
          onEvent?.({ type: eventType as SSEEvent["type"], data });
        } catch {
          // Skip malformed data
        }
        eventType = "";
      }
    }
  }
}

export async function fetchTrip(
  idOrSlug: string
): Promise<{ trip: { id: string; shareSlug: string; title: string; destination: string; itinerary: Itinerary; createdAt: string }; messages: { id: string; role: string; content: string; createdAt: string }[] }> {
  const res = await fetch(`/api/trips/${idOrSlug}`);
  if (!res.ok) throw new Error("Trip not found");
  return res.json();
}

export async function fetchTrips(): Promise<
  { id: string; shareSlug: string; title: string; destination: string; createdAt: string }[]
> {
  const res = await fetch("/api/trips");
  const data = await res.json();
  return data.trips;
}

export async function deleteTrip(id: string): Promise<void> {
  await fetch(`/api/trips/${id}`, { method: "DELETE" });
}
