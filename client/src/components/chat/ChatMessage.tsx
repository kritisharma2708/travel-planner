import type { ChatMessage as ChatMessageType } from "../../types/chat";
import "./ChatMessage.css";

interface Props {
  message: ChatMessageType;
  isStreaming?: boolean;
}

export default function ChatMessage({ message, isStreaming }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={`chat-message ${isUser ? "user" : "assistant"}`}>
      <div className="message-avatar">{isUser ? "You" : "W"}</div>
      <div className="message-bubble">
        {message.content || (isStreaming ? <StreamingDots /> : null)}
      </div>
    </div>
  );
}

function StreamingDots() {
  return (
    <span className="streaming-dots">
      <span />
      <span />
      <span />
    </span>
  );
}
