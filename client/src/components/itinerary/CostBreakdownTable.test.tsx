import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CostBreakdownTable from "./CostBreakdownTable";
import { mockCostBreakdown } from "../../test-fixtures";

describe("CostBreakdownTable", () => {
  it("renders all cost categories", () => {
    render(
      <CostBreakdownTable
        costBreakdown={mockCostBreakdown}
        totalCostPerPerson="₹15,000"
        totalCostGroup="₹30,000"
      />
    );
    expect(screen.getByText(/Accommodation/)).toBeInTheDocument();
    expect(screen.getByText(/Food & Dining/)).toBeInTheDocument();
    expect(screen.getByText(/Activities/)).toBeInTheDocument();
    expect(screen.getByText(/Transport/)).toBeInTheDocument();
    expect(screen.getByText(/Miscellaneous/)).toBeInTheDocument();
  });

  it("renders per-day and total values", () => {
    render(
      <CostBreakdownTable
        costBreakdown={mockCostBreakdown}
        totalCostPerPerson="₹15,000"
        totalCostGroup="₹30,000"
      />
    );

    // Check accommodation perDay and total appear (₹2,000 appears twice: perDay for accommodation and total for food)
    const cells2000 = screen.getAllByText("₹2,000");
    expect(cells2000.length).toBe(2); // accommodation perDay + food total

    expect(screen.getByText("₹4,000")).toBeInTheDocument(); // accommodation total

    // Check food perDay and transport total (both ₹1,000)
    const cells1000 = screen.getAllByText("₹1,000");
    expect(cells1000.length).toBe(2);

    // Total cost per person in the total row
    expect(screen.getByText("₹15,000")).toBeInTheDocument();

    // Group total
    expect(screen.getByText("₹30,000")).toBeInTheDocument();
  });
});
