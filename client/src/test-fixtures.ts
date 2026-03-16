import type { Itinerary, Day, CostBreakdown, Hotel, FlightInfo } from "./types/itinerary";

export const mockDay1: Day = {
  day: 1,
  title: "Arrival & Beach Day",
  morning: {
    activity: "Airport Pickup",
    description: "Arrive at Goa airport and transfer to hotel",
    cost: "₹500",
    icon: "🚕",
    lat: 15.3809,
    lng: 73.8314,
  },
  afternoon: {
    activity: "Baga Beach",
    description: "Relax at Baga Beach and enjoy water sports",
    cost: "₹1,000",
    icon: "🏖️",
    lat: 15.5524,
    lng: 73.7517,
  },
  evening: {
    activity: "Tito's Lane",
    description: "Dinner and nightlife at Tito's Lane",
    cost: "₹1,500",
    icon: "🍽️",
    lat: 15.5490,
    lng: 73.7553,
  },
};

export const mockDay2: Day = {
  day: 2,
  title: "Culture & History",
  morning: {
    activity: "Old Goa Churches",
    description: "Visit the Basilica of Bom Jesus and Se Cathedral",
    cost: "₹200",
    icon: "⛪",
    lat: 15.5009,
    lng: 73.9116,
  },
  afternoon: {
    activity: "Spice Plantation",
    description: "Tour a spice plantation with lunch",
    cost: "₹800",
    icon: "🌿",
    lat: 15.4376,
    lng: 74.0151,
  },
  evening: {
    activity: "Fontainhas Walk",
    description: "Explore the Latin Quarter of Panaji",
    cost: "₹300",
    icon: "🚶",
    lat: 15.4989,
    lng: 73.8278,
  },
};

export const mockCostBreakdown: CostBreakdown = {
  accommodation: { perDay: "₹2,000", total: "₹4,000" },
  food: { perDay: "₹1,000", total: "₹2,000" },
  activities: { perDay: "₹800", total: "₹1,600" },
  transport: { perDay: "₹500", total: "₹1,000" },
  misc: { perDay: "₹200", total: "₹400" },
};

export const mockHotel: Hotel = {
  tier: "Mid-Range",
  name: "Goa Beach Resort",
  area: "Baga Beach, North Goa",
  pricePerNight: "₹2,000",
  description: "A comfortable beachfront resort with pool and breakfast included.",
};

export const mockFlights: FlightInfo = {
  bestTimeToBook: "6-8 weeks in advance",
  recommendedAirlines: ["IndiGo", "Air India", "SpiceJet"],
  estimatedPriceRange: "₹3,000 - ₹6,000",
  origin: "Mumbai",
};

export const mockItinerary: Itinerary = {
  destination: "Goa, India",
  tagline: "Sun, sand, and serenity on India's tropical coast",
  totalCostPerPerson: "₹15,000",
  totalCostGroup: "₹30,000",
  days: [mockDay1, mockDay2],
  costBreakdown: mockCostBreakdown,
  hotels: [mockHotel],
  flights: mockFlights,
  mapCenter: { lat: 15.4909, lng: 73.8278 },
};
