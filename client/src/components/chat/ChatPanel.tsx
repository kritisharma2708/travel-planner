import { useEffect, useRef } from "react";
import type { ChatMessage as ChatMessageType } from "../../types/chat";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import ChatSuggestions from "./ChatSuggestions";
import "./ChatPanel.css";

interface Props {
  messages: ChatMessageType[];
  isStreaming: boolean;
  onSend: (text: string) => void;
}

export default function ChatPanel({ messages, isStreaming, onSend }: Props) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const hasMessages = messages.length > 0;

  return (
    <div className="chat-panel">
      <div className="chat-messages">
        {!hasMessages && (
          <div className="chat-welcome">
            <h2>Where to next?</h2>
            <p>Tell me about your dream trip and I'll plan every detail.</p>
            <ChatSuggestions onSelect={onSend} />
          </div>
        )}

        {messages.map((msg, i) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            isStreaming={
              isStreaming &&
              msg.role === "assistant" &&
              i === messages.length - 1
            }
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput
        onSend={onSend}
        disabled={isStreaming}
        placeholder={
          hasMessages
            ? "Refine your trip... (e.g. 'swap Day 2 for a beach day')"
            : "Describe your dream trip..."
        }
      />
    </div>
  );
}
