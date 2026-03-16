import { useState, useEffect } from "react";
import { fetchTrips } from "../../lib/api";
import "./Header.css";

interface TripSummary {
  id: string;
  shareSlug: string;
  title: string;
  destination: string;
  createdAt: string;
}

export default function Header() {
  const [trips, setTrips] = useState<TripSummary[]>([]);
  const [showTrips, setShowTrips] = useState(false);

  useEffect(() => {
    fetchTrips()
      .then(setTrips)
      .catch(() => {});
  }, []);

  return (
    <header className="header">
      <a href="/" className="logo">
        Wanderly
      </a>

      {trips.length > 0 && (
        <div className="trips-dropdown-wrapper">
          <button
            className="trips-btn"
            onClick={() => setShowTrips(!showTrips)}
          >
            My Trips ({trips.length})
          </button>

          {showTrips && (
            <div className="trips-dropdown">
              {trips.map((trip) => (
                <a
                  key={trip.id}
                  href={`/trip/${trip.shareSlug}`}
                  className="trip-item"
                  onClick={() => setShowTrips(false)}
                >
                  <span className="trip-item-dest">{trip.destination}</span>
                  <span className="trip-item-date">
                    {new Date(trip.createdAt).toLocaleDateString()}
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
