import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import HeroCard from "./HeroCard";
import { mockItinerary } from "../../test-fixtures";

describe("HeroCard", () => {
  it("renders destination name", () => {
    render(<HeroCard itinerary={mockItinerary} />);
    const destinations = screen.getAllByText("Goa, India");
    expect(destinations.length).toBeGreaterThanOrEqual(1);
  });

  it("renders tagline", () => {
    render(<HeroCard itinerary={mockItinerary} />);
    expect(
      screen.getByText("Sun, sand, and serenity on India's tropical coast")
    ).toBeInTheDocument();
  });

  it("renders cost per person and group cost", () => {
    render(<HeroCard itinerary={mockItinerary} />);
    expect(screen.getByText(/₹15,000 per person/)).toBeInTheDocument();
    expect(screen.getByText(/₹30,000 group total/)).toBeInTheDocument();
  });
});
