import "./ChatSuggestions.css";

const suggestions = [
  "Plan a 5-day beach trip to Goa under ₹15,000",
  "3-day adventure trip to Manali for 2 people",
  "Week-long Japan trip, mid-range budget",
  "Romantic 4-day getaway to Bali for a couple",
  "Budget family trip to Kerala, 5 days, 4 people",
  "5-day cultural trip to Rajasthan under ₹20,000",
];

interface Props {
  onSelect: (suggestion: string) => void;
}

export default function ChatSuggestions({ onSelect }: Props) {
  return (
    <div className="chat-suggestions">
      <p className="suggestions-label">Try one of these:</p>
      <div className="suggestions-grid">
        {suggestions.map((s) => (
          <button
            key={s}
            className="suggestion-chip"
            onClick={() => onSelect(s)}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
