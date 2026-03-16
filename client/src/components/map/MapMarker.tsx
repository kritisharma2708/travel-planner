import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { MapMarkerData } from "../../hooks/useMap";

const periodColors: Record<string, string> = {
  morning: "#F5C542",
  afternoon: "#FF8C00",
  evening: "#8B5CF6",
};

const periodLabels: Record<string, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
};

function createMarkerIcon(day: number, period: string, isActive: boolean): L.DivIcon {
  const dotColor = periodColors[period] ?? "#999";
  const size = isActive ? 44 : 36;
  const activeClass = isActive ? "marker-active" : "";

  return L.divIcon({
    className: "custom-map-marker",
    html: `
      <div class="marker-pin ${activeClass}">
        <span class="marker-day">${day}</span>
        <span class="marker-dot" style="background:${dotColor}"></span>
      </div>
    `,
    iconSize: [size, size + 8],
    iconAnchor: [size / 2, size + 8],
    popupAnchor: [0, -(size + 8)],
  });
}

interface MapMarkerProps {
  marker: MapMarkerData;
  isActive?: boolean;
}

export default function MapMarker({ marker, isActive = false }: MapMarkerProps) {
  const icon = createMarkerIcon(marker.day, marker.period, isActive);

  return (
    <Marker position={[marker.lat, marker.lng]} icon={icon} zIndexOffset={isActive ? 1000 : 0}>
      <Popup>
        <div className="marker-popup">
          <h3 className="marker-popup-title">{marker.label}</h3>
          <p className="marker-popup-period">
            <span
              className="marker-popup-dot"
              style={{ background: periodColors[marker.period] }}
            />
            Day {marker.day} &middot; {periodLabels[marker.period]}
          </p>
          <p className="marker-popup-desc">{marker.description}</p>
        </div>
      </Popup>
    </Marker>
  );
}
