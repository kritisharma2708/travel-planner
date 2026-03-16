import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ChatPanel from "./ChatPanel";
import type { ChatMessage } from "../../types/chat";

beforeAll(() => {
  // jsdom doesn't implement scrollIntoView
  Element.prototype.scrollIntoView = vi.fn();
});

describe("ChatPanel", () => {
  it("shows welcome message and suggestions when no messages", () => {
    render(<ChatPanel messages={[]} isStreaming={false} onSend={vi.fn()} />);
    expect(screen.getByText("Where to next?")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Tell me about your dream trip and I'll plan every detail."
      )
    ).toBeInTheDocument();
    // Suggestions should be visible
    expect(screen.getByText("Try one of these:")).toBeInTheDocument();
  });

  it("renders messages when provided", () => {
    const messages: ChatMessage[] = [
      {
        id: "msg-1",
        role: "user",
        content: "Plan a trip to Goa",
        timestamp: new Date(),
      },
      {
        id: "msg-2",
        role: "assistant",
        content: "Here is your itinerary!",
        timestamp: new Date(),
      },
    ];

    render(
      <ChatPanel messages={messages} isStreaming={false} onSend={vi.fn()} />
    );
    expect(screen.getByText("Plan a trip to Goa")).toBeInTheDocument();
    expect(screen.getByText("Here is your itinerary!")).toBeInTheDocument();
    // Welcome should not be shown
    expect(screen.queryByText("Where to next?")).not.toBeInTheDocument();
  });

  it("passes onSend to ChatInput", () => {
    const onSend = vi.fn();
    render(<ChatPanel messages={[]} isStreaming={false} onSend={onSend} />);

    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "Hello" } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    expect(onSend).toHaveBeenCalledWith("Hello");
  });
});
