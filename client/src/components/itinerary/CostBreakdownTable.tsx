import type { CostBreakdown } from "../../types/itinerary";
import "./CostBreakdownTable.css";

interface CostBreakdownTableProps {
  costBreakdown: CostBreakdown;
  totalCostPerPerson: string;
  totalCostGroup: string;
}

const CATEGORY_META: Record<
  keyof CostBreakdown,
  { icon: string; label: string }
> = {
  accommodation: { icon: "🏨", label: "Accommodation" },
  food: { icon: "🍽️", label: "Food & Dining" },
  activities: { icon: "🎯", label: "Activities" },
  transport: { icon: "🚗", label: "Transport" },
  misc: { icon: "📦", label: "Miscellaneous" },
};

export default function CostBreakdownTable({
  costBreakdown,
  totalCostPerPerson,
  totalCostGroup,
}: CostBreakdownTableProps) {
  const categories = Object.keys(CATEGORY_META) as (keyof CostBreakdown)[];

  return (
    <div className="cost-breakdown">
      <table className="cost-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Per Day</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((key) => (
            <tr key={key}>
              <td>
                <span className="row-label">
                  {CATEGORY_META[key].icon} {CATEGORY_META[key].label}
                </span>
              </td>
              <td>{costBreakdown[key].perDay}</td>
              <td>{costBreakdown[key].total}</td>
            </tr>
          ))}
          <tr className="cost-total-row">
            <td>
              <span className="row-label">Total</span>
            </td>
            <td></td>
            <td>{totalCostPerPerson}</td>
          </tr>
        </tbody>
      </table>
      <div className="cost-group-note">
        👥 Group total: <strong>{totalCostGroup}</strong>
      </div>
    </div>
  );
}
