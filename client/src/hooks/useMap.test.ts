import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useMapData } from "./useMap";
import { mockItinerary, mockDay1, mockDay2 } from "../test-fixtures";
import type { Itinerary } from "../types/itinerary";

describe("useMapData", () => {
  it("returns empty markers and default center when itinerary is null", () => {
    const { result } = renderHook(() => useMapData(null));
    expect(result.current.markers).toEqual([]);
    expect(result.current.center).toEqual({ lat: 20.5937, lng: 78.9629 });
  });

  it("derives correct markers from an itinerary", () => {
    const { result } = renderHook(() => useMapData(mockItinerary));
    const markers = result.current.markers;

    // 2 days * 3 periods = 6 markers
    expect(markers).toHaveLength(6);

    // Check first marker (day 1 morning)
    expect(markers[0]).toEqual({
      lat: mockDay1.morning.lat,
      lng: mockDay1.morning.lng,
      label: mockDay1.morning.activity,
      description: mockDay1.morning.description,
      day: 1,
      period: "morning",
      icon: mockDay1.morning.icon,
    });

    // Check a day 2 marker
    const day2Afternoon = markers.find(
      (m) => m.day === 2 && m.period === "afternoon"
    );
    expect(day2Afternoon).toBeDefined();
    expect(day2Afternoon!.label).toBe(mockDay2.afternoon.activity);
    expect(day2Afternoon!.lat).toBe(mockDay2.afternoon.lat);
    expect(day2Afternoon!.lng).toBe(mockDay2.afternoon.lng);
  });

  it("filters markers by selectedDay", () => {
    const { result } = renderHook(() => useMapData(mockItinerary, 1));
    const markers = result.current.markers;

    expect(markers).toHaveLength(3);
    expect(markers.every((m) => m.day === 1)).toBe(true);
  });

  it("returns all markers when selectedDay is null", () => {
    const { result } = renderHook(() => useMapData(mockItinerary, null));
    expect(result.current.markers).toHaveLength(6);
  });

  it("skips time blocks with missing lat/lng", () => {
    const itineraryWithMissing: Itinerary = {
      ...mockItinerary,
      days: [
        {
          ...mockDay1,
          morning: {
            ...mockDay1.morning,
            lat: undefined as unknown as number,
            lng: undefined as unknown as number,
          },
        },
      ],
    };

    const { result } = renderHook(() => useMapData(itineraryWithMissing));
    // morning is skipped, only afternoon and evening remain
    expect(result.current.markers).toHaveLength(2);
    expect(result.current.markers.every((m) => m.day === 1)).toBe(true);
  });

  it("uses itinerary.mapCenter as center", () => {
    const { result } = renderHook(() => useMapData(mockItinerary));
    expect(result.current.center).toEqual({
      lat: mockItinerary.mapCenter.lat,
      lng: mockItinerary.mapCenter.lng,
    });
  });
});
