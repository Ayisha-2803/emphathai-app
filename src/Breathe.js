import React, { useState, useEffect } from "react";

function Breathe({ onClose }) {
  const [phase, setPhase] = useState("inhale");
  const [count, setCount] = useState(4);
  const [cycles, setCycles] = useState(0);

  const phases = {
    inhale:  { label: "Breathe In 🌬️",  next: "hold",   duration: 4, color: "#667eea" },
    hold:    { label: "Hold 🤫",          next: "exhale", duration: 4, color: "#a29bfe" },
    exhale:  { label: "Breathe Out 😮‍💨", next: "inhale", duration: 6, color: "#74b9ff" },
  };

  useEffect(() => {
    if (count === 0) {
      const nextPhase = phases[phase].next;
      if (phase === "exhale") setCycles((c) => c + 1);
      setPhase(nextPhase);
      setCount(phases[nextPhase].duration);
      return;
    }
    const timer = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [count, phase]);

  return (
    <div className="breathe-overlay">
      <div className="breathe-box">
        <h3>🧘 Breathing Exercise</h3>
        <p className="breathe-sub">Let's calm your mind together</p>

        <div
          className="breathe-circle"
          style={{
            background: phases[phase].color,
            transform: phase === "inhale"
              ? "scale(1.3)"
              : phase === "hold"
              ? "scale(1.3)"
              : "scale(0.9)",
          }}
        >
          <span className="breathe-count">{count}</span>
        </div>

        <p className="breathe-phase">{phases[phase].label}</p>
        <p className="breathe-cycles">Cycles completed: {cycles} / 3</p>

        {cycles >= 3 && (
          <p className="breathe-done">
            🎉 Great job! You've completed 3 cycles.
          </p>
        )}

        <button className="breathe-close" onClick={onClose}>
          {cycles >= 3 ? "Feel Better ✨" : "Skip for now"}
        </button>
      </div>
    </div>
  );
}

export default Breathe;