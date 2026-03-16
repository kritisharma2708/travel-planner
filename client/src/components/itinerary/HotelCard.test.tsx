import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import HotelCard from "./HotelCard";
import { mockHotel } from "../../test-fixtures";

describe("HotelCard", () => {
  it("renders hotel name, tier, area, and price", () => {
    render(<HotelCard hotel={mockHotel} />);
    expect(screen.getByText("Goa Beach Resort")).toBeInTheDocument();
    expect(screen.getByText("Mid-Range")).toBeInTheDocument();
    expect(screen.getByText(/Baga Beach, North Goa/)).toBeInTheDocument();
    expect(screen.getByText(/₹2,000/)).toBeInTheDocument();
  });

  it("renders description", () => {
    render(<HotelCard hotel={mockHotel} />);
    expect(
      screen.getByText(
        "A comfortable beachfront resort with pool and breakfast included."
      )
    ).toBeInTheDocument();
  });
});
