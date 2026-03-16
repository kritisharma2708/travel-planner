import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import type { MapMarkerData } from "../../hooks/useMap";

interface FitBoundsProps {
  markers: MapMarkerData[];
}

export default function FitBounds({ markers }: FitBoundsProps) {
  const map = useMap();

  useEffect(() => {
    if (markers.length === 0) return;

    const bounds = L.latLngBounds(
      markers.map((m) => [m.lat, m.lng] as [number, number])
    );

    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
  }, [markers, map]);

  return null;
}
