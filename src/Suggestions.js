import React, { useState } from "react";

const moodSuggestions = {
  Happy: [
    { icon: "🎯", text: "Set a goal for today!" },
    { icon: "📚", text: "Learn something new" },
    { icon: "🤝", text: "Reach out to a friend" },
    { icon: "💪", text: "Take on a challenge" },
  ],
  Sad: [
    { icon: "🎵", text: "Listen to uplifting music" },
    { icon: "🚶", text: "Take a short walk outside" },
    { icon: "📖", text: "Read something inspiring" },
    { icon: "☕", text: "Make yourself a warm drink" },
  ],
  Stressed: [
    { icon: "📝", text: "Write down your top 3 tasks" },
    { icon: "🧘", text: "Take a 5 min breathing break" },
    { icon: "📵", text: "Put phone on silent for 30 min" },
    { icon: "💧", text: "Drink a glass of water" },
  ],
  Tired: [
    { icon: "😴", text: "Take a 20 min power nap" },
    { icon: "🍎", text: "Have a healthy snack" },
    { icon: "🌿", text: "Step outside for fresh air" },
    { icon: "📋", text: "Focus on just one task today" },
  ],
  Neutral: [
    { icon: "🎯", text: "Plan your day ahead" },
    { icon: "📚", text: "Read for 15 minutes" },
    { icon: "🏃", text: "Do a quick workout" },
    { icon: "🎨", text: "Try something creative" },
  ],
};

function Suggestions({ mood }) {
  const [dismissed, setDismissed] = useState(false);
  const [completed, setCompleted] = useState([]);

  if (!mood || dismissed) return null;

  const suggestions = moodSuggestions[mood] || moodSuggestions.Neutral;

  const toggleComplete = (i) => {
    setCompleted((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );
  };

  return (
    <div className="suggestions-box">
      <div className="suggestions-header">
        <span>💡 Suggested for you</span>
        <button onClick={() => setDismissed(true)}>✕</button>
      </div>
      <div className="suggestions-list">
        {suggestions.map((s, i) => (
          <div
            key={i}
            className={`suggestion-item ${completed.includes(i) ? "done" : ""}`}
            onClick={() => toggleComplete(i)}
          >
            <span className="suggestion-icon">{s.icon}</span>
            <span className="suggestion-text">{s.text}</span>
            {completed.includes(i) && <span className="suggestion-check">✅</span>}
          </div>
        ))}
      </div>
      <p className="suggestions-footer">
        {completed.length}/{suggestions.length} completed today
      </p>
    </div>
  );
}

export default Suggestions;