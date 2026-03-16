import { MapContainer, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapView.css";

import type { Itinerary } from "../../types/itinerary";
import type { ActivityLocation } from "../itinerary/DayCard";
import { useMapData } from "../../hooks/useMap";
import MapMarker from "./MapMarker";
import FitBounds from "./FitBounds";
import FlyToMarker from "./FlyToMarker";

// Fix Leaflet default icon issue with bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface MapViewProps {
  itinerary: Itinerary | null;
  selectedDay: number | null;
  activeActivity?: ActivityLocation | null;
}

const DEFAULT_CENTER: [number, number] = [20.5937, 78.9629];
const DEFAULT_ZOOM = 5;

export default function MapView({ itinerary, selectedDay, activeActivity }: MapViewProps) {
  const { markers, center } = useMapData(itinerary, selectedDay);

  // Find the marker matching the active activity
  const activeMarker = activeActivity
    ? markers.find(
        (m) => m.day === activeActivity.day && m.period === activeActivity.period
      )
    : null;

  return (
    <MapContainer
      center={itinerary ? [center.lat, center.lng] : DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      className="map-container"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((marker, idx) => (
        <MapMarker
          key={`${marker.day}-${marker.period}-${idx}`}
          marker={marker}
          isActive={
            activeMarker?.day === marker.day &&
            activeMarker?.period === marker.period
          }
        />
      ))}
      {markers.length > 0 && !activeMarker && <FitBounds markers={markers} />}
      {activeMarker && (
        <FlyToMarker lat={activeMarker.lat} lng={activeMarker.lng} />
      )}
    </MapContainer>
  );
}
