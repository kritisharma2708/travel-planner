import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ChatSuggestions from "./ChatSuggestions";

const suggestions = [
  "Plan a 5-day beach trip to Goa under ₹15,000",
  "3-day adventure trip to Manali for 2 people",
  "Week-long Japan trip, mid-range budget",
  "Romantic 4-day getaway to Bali for a couple",
  "Budget family trip to Kerala, 5 days, 4 people",
  "5-day cultural trip to Rajasthan under ₹20,000",
];

describe("ChatSuggestions", () => {
  it("renders all suggestion chips", () => {
    render(<ChatSuggestions onSelect={vi.fn()} />);
    for (const suggestion of suggestions) {
      expect(screen.getByText(suggestion)).toBeInTheDocument();
    }
  });

  it("calls onSelect with the suggestion text when clicked", () => {
    const onSelect = vi.fn();
    render(<ChatSuggestions onSelect={onSelect} />);

    fireEvent.click(screen.getByText(suggestions[0]!));
    expect(onSelect).toHaveBeenCalledWith(suggestions[0]);

    fireEvent.click(screen.getByText(suggestions[2]!));
    expect(onSelect).toHaveBeenCalledWith(suggestions[2]);
  });
});
