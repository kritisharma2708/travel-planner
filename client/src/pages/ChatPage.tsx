import { useCallback, useRef, useState } from "react";
import { useChat } from "../hooks/useChat";
import type { Day } from "../types/itinerary";
import type { ActivityLocation } from "../components/itinerary/DayCard";
import ChatPanel from "../components/chat/ChatPanel";
import ItineraryPanel from "../components/itinerary/ItineraryPanel";
import MapView from "../components/map/MapView";
import ItineraryLoader from "../components/ui/ItineraryLoader";
import "./ChatPage.css";

export default function ChatPage() {
  const { messages, itinerary, isStreaming, isBuildingItinerary, sendMessage } =
    useChat();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [activeActivity, setActiveActivity] = useState<ActivityLocation | null>(
    null
  );
  const mapRef = useRef<HTMLDivElement>(null);

  const handleDaySelect = useCallback((day: Day) => {
    setSelectedDay((prev) => (prev === day.day ? null : day.day));
    setActiveActivity(null);
  }, []);

  const handleActivityClick = useCallback((location: ActivityLocation) => {
    setActiveActivity((prev) =>
      prev?.day === location.day && prev?.period === location.period
        ? null
        : location
    );
    setSelectedDay(location.day);

    // Scroll to the map
    mapRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="chat-page">
      <div className="chat-side">
        <ChatPanel
          messages={messages}
          isStreaming={isStreaming}
          onSend={sendMessage}
        />
      </div>

      <div className="result-side">
        {itinerary ? (
          <div className="result-content">
            <div ref={mapRef}>
              <MapView
                itinerary={itinerary}
                selectedDay={selectedDay}
                activeActivity={activeActivity}
              />
            </div>
            <ItineraryPanel
              itinerary={itinerary}
              onDaySelect={handleDaySelect}
              onActivityClick={handleActivityClick}
              activeActivity={activeActivity}
            />
          </div>
        ) : isBuildingItinerary ? (
          <ItineraryLoader />
        ) : (
          <div className="result-empty">
            <div className="empty-icon">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--border)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <h3>Your itinerary will appear here</h3>
            <p>Start by describing your dream trip in the chat.</p>
          </div>
        )}
      </div>
    </div>
  );
}
