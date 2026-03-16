import type { TimeBlock as TimeBlockType } from "../../types/itinerary";
import "./TimeBlock.css";

interface TimeBlockProps {
  period: "Morning" | "Afternoon" | "Evening";
  block: TimeBlockType;
  onClick?: () => void;
  isActive?: boolean;
}

export default function TimeBlock({ period, block, onClick, isActive }: TimeBlockProps) {
  const hasLocation = block.lat != null && block.lng != null;

  return (
    <div
      className={`time-block ${hasLocation ? "clickable" : ""} ${isActive ? "active" : ""}`}
      onClick={hasLocation ? onClick : undefined}
    >
      <div className="time-label">{period}</div>
      <div className="time-icon">{block.icon}</div>
      <div className="time-content">
        <div className="time-activity">
          {block.activity}
          {hasLocation && <span className="time-map-hint">📍</span>}
        </div>
        <div className="time-desc">{block.description}</div>
        <div className="time-cost">{block.cost}</div>
      </div>
    </div>
  );
}
