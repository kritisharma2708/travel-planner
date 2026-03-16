import type { Itinerary } from "../../types/itinerary";
import "./HeroCard.css";

interface HeroCardProps {
  itinerary: Itinerary;
}

export default function HeroCard({ itinerary }: HeroCardProps) {
  return (
    <div className="hero-card">
      <div className="hero-banner">
        <div className="hero-banner-icon">✈️</div>
        <div className="hero-banner-dest">{itinerary.destination}</div>
      </div>
      <div className="hero-content">
        <h1 className="hero-destination">{itinerary.destination}</h1>
        <div className="hero-meta">
          <span>💰 {itinerary.totalCostPerPerson} per person</span>
          <span>👥 {itinerary.totalCostGroup} group total</span>
          <span>📅 {itinerary.days.length} days</span>
        </div>
        <p className="hero-tagline">{itinerary.tagline}</p>
        <div className="ai-badge">🤖 AI-generated itinerary</div>
      </div>
    </div>
  );
}
