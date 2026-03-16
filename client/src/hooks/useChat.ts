import { useState, useCallback, useRef } from "react";
import type { ChatMessage } from "../types/chat";
import type { Itinerary } from "../types/itinerary";
import { streamChat, type TripMeta, type SSEEvent } from "../lib/api";

interface UseChatReturn {
  messages: ChatMessage[];
  itinerary: Itinerary | null;
  tripMeta: TripMeta | null;
  isStreaming: boolean;
  isBuildingItinerary: boolean;
  sendMessage: (text: string) => Promise<void>;
  setItinerary: (itinerary: Itinerary | null) => void;
  setMessages: (messages: ChatMessage[]) => void;
  setTripMeta: (meta: TripMeta | null) => void;
}

let messageCounter = 0;
function nextId() {
  return `msg-${++messageCounter}-${Date.now()}`;
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [tripMeta, setTripMeta] = useState<TripMeta | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isBuildingItinerary, setIsBuildingItinerary] = useState(false);
  const streamingTextRef = useRef("");
  // Keep refs to latest values so the callback always has current state
  const messagesRef = useRef<ChatMessage[]>([]);
  const itineraryRef = useRef<Itinerary | null>(null);
  const tripMetaRef = useRef<TripMeta | null>(null);

  // Keep refs in sync
  messagesRef.current = messages;
  itineraryRef.current = itinerary;
  tripMetaRef.current = tripMeta;

  const sendMessage = useCallback(
    async (text: string) => {
      if (isStreaming || !text.trim()) return;

      // Add user message
      const userMsg: ChatMessage = {
        id: nextId(),
        role: "user",
        content: text.trim(),
        timestamp: new Date(),
      };

      // Add placeholder for assistant message
      const assistantMsg: ChatMessage = {
        id: nextId(),
        role: "assistant",
        content: "",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setIsStreaming(true);
      streamingTextRef.current = "";

      const onEvent = (event: SSEEvent) => {
        switch (event.type) {
          case "token": {
            const { text: token } = event.data as { text: string };
            streamingTextRef.current += token;

            // Detect when JSON block starts streaming
            if (streamingTextRef.current.includes("```json") && !isBuildingItinerary) {
              setIsBuildingItinerary(true);
            }

            // Strip JSON code blocks in real-time so they never show in the chat
            let displayText = streamingTextRef.current;
            // Remove complete code blocks
            displayText = displayText.replace(/```json[\s\S]*```/g, "");
            // Remove in-progress code block (started but not yet closed)
            displayText = displayText.replace(/```json[\s\S]*$/, "");
            displayText = displayText.trim();
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMsg.id
                  ? { ...m, content: displayText }
                  : m
              )
            );
            break;
          }
          case "itinerary":
            setItinerary(event.data as Itinerary);
            itineraryRef.current = event.data as Itinerary;
            break;
          case "trip":
            setTripMeta(event.data as TripMeta);
            tripMetaRef.current = event.data as TripMeta;
            break;
          case "error": {
            const { message: errMsg } = event.data as { message: string };
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMsg.id
                  ? { ...m, content: errMsg || "Something went wrong." }
                  : m
              )
            );
            break;
          }
        }
      };

      // Build conversation history from existing messages (excluding the new ones)
      const history = messagesRef.current
        .filter((m) => m.content) // skip empty placeholders
        .map((m) => ({ role: m.role, content: m.content }));

      try {
        await streamChat(
          text.trim(),
          {
            tripId: tripMetaRef.current?.tripId,
            history,
            currentItinerary: itineraryRef.current,
          },
          onEvent
        );
      } catch {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsg.id
              ? {
                  ...m,
                  content: "Sorry, something went wrong. Please try again.",
                }
              : m
          )
        );
      } finally {
        // Clean up the JSON code block from the displayed message
        setMessages((prev) =>
          prev.map((m) => {
            if (m.id === assistantMsg.id) {
              const cleaned = m.content
                .replace(/```json[\s\S]*```/g, "")
                .trim();
              return { ...m, content: cleaned || "Here's your itinerary!" };
            }
            return m;
          })
        );
        setIsStreaming(false);
        setIsBuildingItinerary(false);
      }
    },
    [isStreaming, isBuildingItinerary]
  );

  return {
    messages,
    itinerary,
    tripMeta,
    isStreaming,
    isBuildingItinerary,
    sendMessage,
    setItinerary,
    setMessages,
    setTripMeta,
  };
}
