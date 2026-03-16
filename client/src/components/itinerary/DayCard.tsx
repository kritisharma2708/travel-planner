import { useState } from "react";
import type { Day } from "../../types/itinerary";
import TimeBlock from "./TimeBlock";
import "./DayCard.css";

export interface ActivityLocation {
  day: number;
  period: "morning" | "afternoon" | "evening";
}

interface DayCardProps {
  day: Day;
  defaultExpanded?: boolean;
  onDaySelect?: (day: Day) => void;
  onActivityClick?: (location: ActivityLocation) => void;
  activeActivity?: ActivityLocation | null;
}

export default function DayCard({
  day,
  defaultExpanded = false,
  onDaySelect,
  onActivityClick,
  activeActivity,
}: DayCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const handleToggle = () => {
    setExpanded((prev) => !prev);
    if (!expanded && onDaySelect) {
      onDaySelect(day);
    }
  };

  const periods = ["morning", "afternoon", "evening"] as const;
  const periodLabels = { morning: "Morning", afternoon: "Afternoon", evening: "Evening" } as const;

  return (
    <div className={`day-card ${expanded ? "expanded" : ""}`}>
      <div className="day-header" onClick={handleToggle}>
        <div>
          <div className="day-number">Day {day.day}</div>
          <div className="day-title">{day.title}</div>
        </div>
        <div className="day-toggle">▾</div>
      </div>
      <div className="day-body">
        {periods.map((period) => (
          <TimeBlock
            key={period}
            period={periodLabels[period]}
            block={day[period]}
            isActive={
              activeActivity?.day === day.day &&
              activeActivity?.period === period
            }
            onClick={() =>
              onActivityClick?.({ day: day.day, period })
            }
          />
        ))}
      </div>
    </div>
  );
}
