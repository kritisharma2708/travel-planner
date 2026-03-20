import { useState, useEffect } from "react";
import "./ItineraryLoader.css";

const loadingSteps = [
  { emoji: "🗺️", text: "Mapping out the perfect route..." },
  { emoji: "🏨", text: "Scouting the best places to stay..." },
  { emoji: "🍜", text: "Finding must-try local food spots..." },
  { emoji: "📸", text: "Picking Instagram-worthy locations..." },
  { emoji: "💰", text: "Crunching the numbers for your budget..." },
  { emoji: "🎒", text: "Packing your days with adventures..." },
  { emoji: "✈️", text: "Checking the best flight deals..." },
  { emoji: "🌅", text: "Reserving the best sunset viewpoints..." },
  { emoji: "🧭", text: "Discovering hidden gems off the beaten path..." },
  { emoji: "🎶", text: "Adding a soundtrack to your journey..." },
  { emoji: "☕", text: "Locating the coziest cafés nearby..." },
  { emoji: "🏔️", text: "Plotting scenic detours worth the extra mile..." },
];

const funFacts = [
  "France is the most visited country in the world with 90M+ tourists/year",
  "Japan has over 6,800 islands but most people only visit 4",
  "Iceland has no mosquitoes — the only country in the world!",
  "The shortest commercial flight is 57 seconds (Scotland)",
  "Thailand's full name has 168 characters — the longest city name ever",
  "New Zealand was the first country to see sunrise each day",
  "There's a water slide that goes through a shark tank in Vegas",
  "Singapore's airport has a butterfly garden with 1,000+ butterflies",
  "Norway has a town called Hell — and it freezes over every winter",
  "Bhutan measures success by Gross National Happiness, not GDP",
];

export default function ItineraryLoader() {
  const [stepIndex, setStepIndex] = useState(0);
  const [factIndex, setFactIndex] = useState(
    () => Math.floor(Math.random() * funFacts.length)
  );
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setStepIndex((prev) => (prev + 1) % loadingSteps.length);
        setFactIndex((prev) => (prev + 1) % funFacts.length);
        setFadeIn(true);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const step = loadingSteps[stepIndex]!;
  const fact = funFacts[factIndex]!;

  return (
    <div className="itinerary-loader">
      <div className={`loader-emoji ${fadeIn ? "fade-in" : "fade-out"}`}>
        {step.emoji}
      </div>
      <h3 className={`loader-step ${fadeIn ? "fade-in" : "fade-out"}`}>
        {step.text}
      </h3>
      <div className="loader-progress">
        <div className="loader-progress-bar" />
      </div>
      <p className={`loader-fact ${fadeIn ? "fade-in" : "fade-out"}`}>
        <span className="fact-label">Did you know?</span> {fact}
      </p>
    </div>
  );
}
