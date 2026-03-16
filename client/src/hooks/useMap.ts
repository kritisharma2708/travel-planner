import { useMemo } from "react";
import type { Itinerary } from "../types/itinerary";

export interface MapMarkerData {
  lat: number;
  lng: number;
  label: string;
  description: string;
  day: number;
  period: "morning" | "afternoon" | "evening";
  icon: string;
}

export function useMapData(
  itinerary: Itinerary | null,
  selectedDay: number | null = null
) {
  const markers = useMemo<MapMarkerData[]>(() => {
    if (!itinerary) return [];

    const periods = ["morning", "afternoon", "evening"] as const;
    const allMarkers: MapMarkerData[] = [];

    for (const day of itinerary.days) {
      for (const period of periods) {
        const block = day[period];
        if (block && block.lat != null && block.lng != null) {
          allMarkers.push({
            lat: block.lat,
            lng: block.lng,
            label: block.activity,
            description: block.description,
            day: day.day,
            period,
            icon: block.icon,
          });
        }
      }
    }

    if (selectedDay != null) {
      return allMarkers.filter((m) => m.day === selectedDay);
    }

    return allMarkers;
  }, [itinerary, selectedDay]);

  const center = useMemo(() => {
    if (itinerary?.mapCenter) {
      return { lat: itinerary.mapCenter.lat, lng: itinerary.mapCenter.lng };
    }
    return { lat: 20.5937, lng: 78.9629 };
  }, [itinerary]);

  return { markers, center };
}
