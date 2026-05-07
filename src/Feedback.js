import React, { useState } from "react";

function Feedback({ onRate }) {
  const [rated, setRated] = useState(false);
  const [selected, setSelected] = useState(null);

  const ratings = [
    { emoji: "😞", label: "Not helpful" },
    { emoji: "😐", label: "Okay" },
    { emoji: "😊", label: "Helpful" },
    { emoji: "🤩", label: "Amazing!" },
  ];

  const handleRate = (i) => {
    setSelected(i);
    setRated(true);
    onRate(i + 1);
  };

  if (rated) {
    return (
      <div className="feedback-done">
        ✅ Thanks for your feedback! {ratings[selected].emoji}
      </div>
    );
  }

  return (
    <div className="feedback-box">
      <p>Was this response helpful?</p>
      <div className="feedback-options">
        {ratings.map((r, i) => (
          <button key={i} onClick={() => handleRate(i)} title={r.label}>
            {r.emoji}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Feedback;