# Wanderly — AI Travel Planner

A web app that generates personalized, day-by-day travel itineraries using OpenAI. Answer a few questions about your travel preferences and get a detailed plan with cost breakdowns, hotel suggestions, and flight recommendations.

## Features

- **Conversational wizard** — step-by-step onboarding with smooth animations
- **AI-powered itineraries** — generates detailed day-by-day plans via GPT-4o
- **Cost breakdown** — per-day and total estimates for accommodation, food, activities, transport
- **Hotel recommendations** — budget, mid-range, and luxury tiers with Booking.com links
- **Flight suggestions** — estimated prices, best booking times, and Google Flights search
- **Map view** — embedded Google Maps centered on the destination
- **Share & print** — copy itinerary to clipboard or print a clean version
- **Responsive design** — works on desktop and mobile

## Tech Stack

- **Backend:** Node.js + Express
- **Frontend:** Single HTML file (vanilla JS + CSS)
- **AI:** OpenAI API (GPT-4o)
- **Maps:** Google Maps Embed

## Getting Started

### Prerequisites

- Node.js (v18+)
- An [OpenAI API key](https://platform.openai.com/api-keys)

### Setup

```bash
git clone https://github.com/<your-username>/travel-planner.git
cd travel-planner
npm install
```

### Run

```bash
export OPENAI_API_KEY="your-api-key-here"
npm start
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

## Project Structure

```
travel-planner/
├── server.js          # Express server + OpenAI API integration
├── public/
│   └── index.html     # Full frontend (HTML + CSS + JS)
├── package.json
└── README.md
```

## How It Works

1. User answers 7 questions (destination type, trip style, duration, budget, travelers, destination, requirements)
2. Answers are sent to the Express backend
3. Backend calls OpenAI GPT-4o with a structured prompt
4. AI returns a JSON itinerary with day-by-day plans, costs, hotels, and flight info
5. Frontend renders the results with an interactive UI

## License

MIT
