import type { FlightInfo as FlightInfoType } from "../../types/itinerary";
import "./FlightInfo.css";

interface FlightInfoProps {
  flights: FlightInfoType;
}

export default function FlightInfo({ flights }: FlightInfoProps) {
  return (
    <div className="flight-section">
      <h3>✈️ Flight Information</h3>
      <div className="flight-info">
        <div className="flight-info-card">
          <div className="flight-info-label">Best Time to Book</div>
          <div className="flight-info-value">{flights.bestTimeToBook}</div>
        </div>
        <div className="flight-info-card">
          <div className="flight-info-label">Estimated Price</div>
          <div className="flight-info-value">
            {flights.estimatedPriceRange}
          </div>
        </div>
        <div className="flight-info-card">
          <div className="flight-info-label">Origin</div>
          <div className="flight-info-value">{flights.origin}</div>
        </div>
        <div className="flight-info-card">
          <div className="flight-info-label">Recommended Airlines</div>
          <div className="flight-info-value">
            {flights.recommendedAirlines.join(", ")}
          </div>
        </div>
      </div>
    </div>
  );
}
