# Wanderly — AI Travel Planner

A chat-first web app that generates personalized, day-by-day travel itineraries using AI. Describe your dream trip in natural language and get a detailed plan with an interactive map, cost breakdowns, hotel suggestions, and flight recommendations.

**Live demo:** [wanderly-sxk1.onrender.com](https://wanderly-sxk1.onrender.com)

## Features

- **Chat-first UI** — describe your trip in natural language, no forms to fill out
- **Streaming responses** — see the AI's response in real-time via Server-Sent Events
- **Iterative refinement** — refine your itinerary with follow-up messages ("swap Day 2 for a beach day")
- **Interactive map** — Leaflet map with clickable markers for every activity, color-coded by time of day
- **Day-by-day itinerary** — expandable cards for each day with morning, afternoon, and evening activities
- **Cost breakdown** — per-day and total estimates for accommodation, food, activities, transport
- **Hotel recommendations** — budget, mid-range, and luxury tiers
- **Flight suggestions** — estimated prices, best booking times, and recommended airlines
- **Saved trips** — itineraries are persisted to PostgreSQL with shareable links
- **Engaging loader** — rotating travel emojis and fun facts while your itinerary builds
- **Responsive design** — split-panel on desktop, stacked layout on mobile

## Tech Stack

- **Frontend:** React + TypeScript + Vite
- **Backend:** Node.js + Express + TypeScript
- **AI:** OpenAI API (GPT-4o)
- **Database:** PostgreSQL (Neon) + Drizzle ORM
- **Maps:** Leaflet + OpenStreetMap (free, no API key)
- **Testing:** Vitest + React Testing Library (60 tests)
- **Deployment:** Render

## Getting Started

### Prerequisites

- Node.js (v18+)
- An [OpenAI API key](https://platform.openai.com/api-keys)
- PostgreSQL database (optional — app works without it, but trips won't be saved)

### Setup

```bash
git clone https://github.com/kritisharma2708/travel-planner.git
cd travel-planner
npm install
```

### Configure

Create a `.env` file in the project root:

```
OPENAI_API_KEY=your-openai-api-key
DATABASE_URL=postgresql://user:pass@host/dbname  # optional
```

### Run migrations (if using a database)

```bash
npm run db:migrate
```

### Start development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. The Vite dev server proxies API calls to the Express server on port 3001.

### Run tests

```bash
npm test
```

### Build for production

```bash
npm run build
npm start
```

## Project Structure

```
travel-planner/
├── client/                        # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── chat/              # ChatPanel, ChatInput, ChatMessage, Suggestions
│   │   │   ├── itinerary/         # HeroCard, DayCard, TimeBlock, CostBreakdown, etc.
│   │   │   ├── map/               # MapView, MapMarker, FitBounds, FlyToMarker
│   │   │   ├── layout/            # Header, Layout
│   │   │   └── ui/                # ItineraryLoader
│   │   ├── hooks/                 # useChat, useMap
│   │   ├── pages/                 # ChatPage, TripPage
│   │   ├── lib/                   # API client with SSE streaming
│   │   └── types/                 # TypeScript interfaces
│   └── vite.config.ts
├── server/                        # Express + TypeScript backend
│   └── src/
│       ├── routes/                # /api/chat (SSE), /api/trips (CRUD)
│       ├── services/              # OpenAI integration + prompt
│       ├── db/                    # Drizzle schema, migrations, connection
│       └── middleware/            # Error handler
├── drizzle/                       # SQL migration files
├── render.yaml                    # Render deployment blueprint
└── package.json                   # npm workspaces root
```

## How It Works

1. User describes their trip in the chat ("3-day adventure trip to Manali for 2 people")
2. The message is sent to the Express backend via POST /api/chat
3. Backend streams the response from OpenAI GPT-4o using Server-Sent Events
4. AI returns a conversational message + a JSON itinerary with day-by-day plans, costs, hotels, flights, and lat/lng coordinates
5. Frontend renders the itinerary cards and plots activity markers on the interactive map
6. User can refine the itinerary with follow-up messages — full conversation context is maintained
7. Trip is saved to PostgreSQL for shareable links

## License

MIT
