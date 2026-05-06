import React from "react";

function Welcome({ onStart }) {
  return (
    <div className="welcome">
      <div className="welcome-content">
        <div className="welcome-logo">🧠</div>
        <h1>EmpathAI</h1>
        <p className="welcome-tagline">
          Your emotionally intelligent companion
        </p>

        <div className="welcome-features">
          <div className="feature-item">
            <span>💬</span>
            <span>AI that understands how you feel</span>
          </div>
          <div className="feature-item">
            <span>🧘</span>
            <span>Breathing exercises when you're stressed</span>
          </div>
          <div className="feature-item">
            <span>📊</span>
            <span>Track your emotional journey</span>
          </div>
          <div className="feature-item">
            <span>♿</span>
            <span>Accessible for everyone</span>
          </div>
        </div>

        <button className="start-btn" onClick={onStart}>
          Get Started ✨
        </button>

        <p className="welcome-note">
          🔒 Your data stays private. No data leaves your device.
        </p>
      </div>
    </div>
  );
}

export default Welcome;