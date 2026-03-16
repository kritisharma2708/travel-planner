import type { Itinerary, Day } from "../../types/itinerary";
import HeroCard from "./HeroCard";
import DayCard, { type ActivityLocation } from "./DayCard";
import CostBreakdownTable from "./CostBreakdownTable";
import HotelCard from "./HotelCard";
import FlightInfo from "./FlightInfo";
import "./ItineraryPanel.css";

interface ItineraryPanelProps {
  itinerary: Itinerary;
  onDaySelect?: (day: Day) => void;
  onActivityClick?: (location: ActivityLocation) => void;
  activeActivity?: ActivityLocation | null;
}

export default function ItineraryPanel({
  itinerary,
  onDaySelect,
  onActivityClick,
  activeActivity,
}: ItineraryPanelProps) {
  return (
    <div className="itinerary-panel">
      <HeroCard itinerary={itinerary} />

      <section className="days-section">
        <h2 className="days-section-title">Your Itinerary</h2>
        {itinerary.days.map((day) => (
          <DayCard
            key={day.day}
            day={day}
            defaultExpanded={day.day === 1}
            onDaySelect={onDaySelect}
            onActivityClick={onActivityClick}
            activeActivity={activeActivity}
          />
        ))}
      </section>

      <section className="panel-section">
        <h2 className="panel-section-title">Cost Breakdown</h2>
        <CostBreakdownTable
          costBreakdown={itinerary.costBreakdown}
          totalCostPerPerson={itinerary.totalCostPerPerson}
          totalCostGroup={itinerary.totalCostGroup}
        />
      </section>

      <section className="panel-section">
        <h2 className="panel-section-title">Where to Stay</h2>
        {itinerary.hotels.map((hotel, index) => (
          <HotelCard key={index} hotel={hotel} />
        ))}
      </section>

      <FlightInfo flights={itinerary.flights} />
    </div>
  );
}
