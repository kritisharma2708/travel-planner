import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ChatMessage from "./ChatMessage";
import type { ChatMessage as ChatMessageType } from "../../types/chat";

const userMessage: ChatMessageType = {
  id: "msg-1",
  role: "user",
  content: "Plan a trip to Goa",
  timestamp: new Date(),
};

const assistantMessage: ChatMessageType = {
  id: "msg-2",
  role: "assistant",
  content: "Here is your Goa itinerary!",
  timestamp: new Date(),
};

describe("ChatMessage", () => {
  it('renders user message with "You" avatar and correct styling', () => {
    const { container } = render(<ChatMessage message={userMessage} />);
    expect(screen.getByText("You")).toBeInTheDocument();
    expect(container.querySelector(".chat-message.user")).toBeInTheDocument();
  });

  it('renders assistant message with "W" avatar', () => {
    const { container } = render(<ChatMessage message={assistantMessage} />);
    expect(screen.getByText("W")).toBeInTheDocument();
    expect(
      container.querySelector(".chat-message.assistant")
    ).toBeInTheDocument();
  });

  it("shows message content text", () => {
    render(<ChatMessage message={userMessage} />);
    expect(screen.getByText("Plan a trip to Goa")).toBeInTheDocument();
  });

  it("shows streaming dots when isStreaming is true and content is empty", () => {
    const emptyAssistant: ChatMessageType = {
      id: "msg-3",
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };
    const { container } = render(
      <ChatMessage message={emptyAssistant} isStreaming={true} />
    );
    expect(container.querySelector(".streaming-dots")).toBeInTheDocument();
  });
});
