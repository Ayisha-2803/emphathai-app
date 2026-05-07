import React, { useState } from "react";

const personas = [
  { emoji: "👴", label: "Elderly User", desc: "Large text, simple navigation, calm tone" },
  { emoji: "🧠", label: "Neurodiverse", desc: "Focus mode, reduced distractions, structured help" },
  { emoji: "🎓", label: "Student", desc: "Study support, stress detection, motivation" },
  { emoji: "💼", label: "Professional", desc: "Productivity focus, quick responses, task management" },
];

function Welcome({ onStart }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [selectedPersona, setSelectedPersona] = useState(null);

  const handleStart = () => {
    if (name.trim()) {
      localStorage.setItem("empathaiName", name);
    }
    if (selectedPersona !== null) {
      localStorage.setItem("empathaiPersona", personas[selectedPersona].label);
    }
    onStart();
  };

  return (
    <div className="welcome">
      <div className="welcome-content">
        <div className="welcome-logo">🧠</div>
        <h1>EmpathAI</h1>
        <p className="welcome-tagline">Your emotionally intelligent companion</p>

        {step === 1 && (
          <>
            <div className="welcome-features">
              <div className="feature-item"><span>💬</span><span>AI that understands how you feel</span></div>
              <div className="feature-item"><span>🧘</span><span>Breathing exercises when stressed</span></div>
              <div className="feature-item"><span>📊</span><span>Track your emotional journey</span></div>
              <div className="feature-item"><span>♿</span><span>Accessible for everyone</span></div>
            </div>
            <button className="start-btn" onClick={() => setStep(2)}>
              Get Started ✨
            </button>
            <p className="welcome-note">🔒 Your data stays private.</p>
          </>
        )}

        {step === 2 && (
          <>
            <p className="onboard-label">What's your name?</p>
            <input
              className="onboard-input"
              type="text"
              placeholder="Enter your name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && setStep(3)}
            />
            <button
              className="start-btn"
              onClick={() => setStep(3)}
              disabled={!name.trim()}
            >
              Next →
            </button>
            <button className="skip-btn" onClick={() => setStep(3)}>
              Skip
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <p className="onboard-label">Which best describes you?</p>
            <div className="persona-grid">
              {personas.map((p, i) => (
                <div
                  key={i}
                  className={`persona-card ${selectedPersona === i ? "selected" : ""}`}
                  onClick={() => setSelectedPersona(i)}
                >
                  <span className="persona-emoji">{p.emoji}</span>
                  <span className="persona-label">{p.label}</span>
                  <span className="persona-desc">{p.desc}</span>
                </div>
              ))}
            </div>
            <button className="start-btn" onClick={handleStart}>
              Start My Journey 🚀
            </button>
            <button className="skip-btn" onClick={handleStart}>
              Skip
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Welcome;