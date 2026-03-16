import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FlightInfo from "./FlightInfo";
import { mockFlights } from "../../test-fixtures";

describe("FlightInfo", () => {
  it("renders recommended airlines", () => {
    render(<FlightInfo flights={mockFlights} />);
    expect(
      screen.getByText("IndiGo, Air India, SpiceJet")
    ).toBeInTheDocument();
  });

  it("renders estimated price range", () => {
    render(<FlightInfo flights={mockFlights} />);
    expect(screen.getByText("₹3,000 - ₹6,000")).toBeInTheDocument();
  });

  it("renders best time to book", () => {
    render(<FlightInfo flights={mockFlights} />);
    expect(screen.getByText("6-8 weeks in advance")).toBeInTheDocument();
  });
});
