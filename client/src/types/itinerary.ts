// Based on the existing OpenAI JSON schema, but with lat/lng added for map markers

export interface TimeBlock {
  activity: string;
  description: string;
  cost: string;
  icon: string;
  lat: number;
  lng: number;
}

export interface Day {
  day: number;
  title: string;
  morning: TimeBlock;
  afternoon: TimeBlock;
  evening: TimeBlock;
}

export interface CostItem {
  perDay: string;
  total: string;
}

export interface CostBreakdown {
  accommodation: CostItem;
  food: CostItem;
  activities: CostItem;
  transport: CostItem;
  misc: CostItem;
}

export interface Hotel {
  tier: string;
  name: string;
  area: string;
  pricePerNight: string;
  description: string;
}

export interface FlightInfo {
  bestTimeToBook: string;
  recommendedAirlines: string[];
  estimatedPriceRange: string;
  origin: string;
}

export interface Itinerary {
  destination: string;
  tagline: string;
  totalCostPerPerson: string;
  totalCostGroup: string;
  days: Day[];
  costBreakdown: CostBreakdown;
  hotels: Hotel[];
  flights: FlightInfo;
  mapCenter: { lat: number; lng: number };
}
