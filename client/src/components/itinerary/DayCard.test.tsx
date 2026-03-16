import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DayCard from "./DayCard";
import { mockDay1, mockDay2 } from "../../test-fixtures";

describe("DayCard", () => {
  it("renders day number and title", () => {
    render(<DayCard day={mockDay1} />);
    expect(screen.getByText("Day 1")).toBeInTheDocument();
    expect(screen.getByText("Arrival & Beach Day")).toBeInTheDocument();
  });

  it("day 1 is expanded by default when defaultExpanded=true", () => {
    const { container } = render(
      <DayCard day={mockDay1} defaultExpanded={true} />
    );
    expect(container.querySelector(".day-card.expanded")).toBeInTheDocument();
  });

  it("other days are collapsed by default", () => {
    const { container } = render(<DayCard day={mockDay2} />);
    expect(
      container.querySelector(".day-card.expanded")
    ).not.toBeInTheDocument();
  });

  it("clicking header toggles expansion", () => {
    const { container } = render(<DayCard day={mockDay2} />);
    const header = container.querySelector(".day-header")!;

    // Initially collapsed
    expect(
      container.querySelector(".day-card.expanded")
    ).not.toBeInTheDocument();

    // Click to expand
    fireEvent.click(header);
    expect(container.querySelector(".day-card.expanded")).toBeInTheDocument();

    // Click to collapse
    fireEvent.click(header);
    expect(
      container.querySelector(".day-card.expanded")
    ).not.toBeInTheDocument();
  });

  it("calls onDaySelect when header is clicked to expand", () => {
    const onDaySelect = vi.fn();
    const { container } = render(
      <DayCard day={mockDay2} onDaySelect={onDaySelect} />
    );
    const header = container.querySelector(".day-header")!;

    fireEvent.click(header);
    expect(onDaySelect).toHaveBeenCalledWith(mockDay2);
  });
});
