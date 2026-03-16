import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import type { Itinerary, Day } from "../types/itinerary";
import { fetchTrip } from "../lib/api";
import ItineraryPanel from "../components/itinerary/ItineraryPanel";
import MapView from "../components/map/MapView";
import "./TripPage.css";

export default function TripPage() {
  const { idOrSlug } = useParams();
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!idOrSlug) return;

    setLoading(true);
    fetchTrip(idOrSlug)
      .then((data) => {
        setItinerary(data.trip.itinerary);
      })
      .catch(() => {
        setError("Trip not found. It may have been deleted or the link is invalid.");
      })
      .finally(() => setLoading(false));
  }, [idOrSlug]);

  const handleDaySelect = useCallback((day: Day) => {
    setSelectedDay((prev) => (prev === day.day ? null : day.day));
  }, []);

  if (loading) {
    return (
      <div className="trip-page-status">
        <p>Loading trip...</p>
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div className="trip-page-status">
        <h2>Oops!</h2>
        <p>{error || "Trip not found."}</p>
        <a href="/" className="back-link">Plan a new trip</a>
      </div>
    );
  }

  return (
    <div className="trip-page">
      <div className="trip-page-content">
        <MapView itinerary={itinerary} selectedDay={selectedDay} />
        <ItineraryPanel itinerary={itinerary} onDaySelect={handleDaySelect} />
        <div className="trip-page-footer">
          <a href="/" className="plan-new-btn">Plan your own trip</a>
        </div>
      </div>
    </div>
  );
}
