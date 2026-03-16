import type { Hotel } from "../../types/itinerary";
import "./HotelCard.css";

interface HotelCardProps {
  hotel: Hotel;
}

export default function HotelCard({ hotel }: HotelCardProps) {
  return (
    <div className="hotel-card">
      <div className="hotel-tier">{hotel.tier}</div>
      <div className="hotel-name">{hotel.name}</div>
      <div className="hotel-area">📍 {hotel.area}</div>
      <div className="hotel-price">
        {hotel.pricePerNight} <span>/ night</span>
      </div>
      <div className="hotel-desc">{hotel.description}</div>
    </div>
  );
}
