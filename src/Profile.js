import React, { useState, useEffect } from "react";

function Profile({ accessibility, setAccessibility }) {
  const [name, setName] = useState(localStorage.getItem("empathaiName") || "");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (name.trim()) {
      localStorage.setItem("empathaiName", name);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const toggle = (key) => {
    setAccessibility((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="dashboard">
      <h2>👤 My Profile</h2>
      <p className="dash-sub">Personalise your EmpathAI experience</p>

      <div className="profile-card">
        <div className="profile-avatar">🧑</div>
        <div className="profile-form">
          <label>Your Name</label>
          <input
            type="text"
            placeholder="Enter your name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="profile-input"
          />
          <button className="save-btn" onClick={handleSave}>
            {saved ? "✅ Saved!" : "Save Profile"}
          </button>
        </div>
      </div>

      <div className="features-card">
        <h3>⚙️ Accessibility Settings</h3>

        <div className="toggle-row">
          <span>🔤 Large Text Mode</span>
          <input
            type="checkbox"
            className="toggle"
            checked={accessibility.largeText}
            onChange={() => toggle("largeText")}
          />
        </div>

        <div className="toggle-row">
          <span>🌙 Calm Mode (reduced animations)</span>
          <input
            type="checkbox"
            className="toggle"
            checked={accessibility.calmMode}
            onChange={() => toggle("calmMode")}
          />
        </div>

        <div className="toggle-row">
          <span>🔆 High Contrast Mode</span>
          <input
            type="checkbox"
            className="toggle"
            checked={accessibility.highContrast}
            onChange={() => toggle("highContrast")}
          />
        </div>

        <div className="toggle-row">
          <span>🔔 Daily Mood Reminders</span>
          <input
            type="checkbox"
            className="toggle"
            checked={accessibility.reminders}
            onChange={() => toggle("reminders")}
          />
        </div>
      </div>

      {/* Preview */}
      <div className="features-card" style={{ marginTop: 12 }}>
        <h3>👁️ Current Mode Preview</h3>
        <div style={{
          padding: "12px",
          borderRadius: "10px",
          background: accessibility.highContrast ? "#000" : "rgba(255,255,255,0.05)",
          border: accessibility.highContrast ? "2px solid #fff" : "none",
          fontSize: accessibility.largeText ? "18px" : "13px",
          color: "white",
          transition: "all 0.3s"
        }}>
          {accessibility.largeText && "🔤 Large Text is ON\n"}
          {accessibility.highContrast && "🔆 High Contrast is ON\n"}
          {accessibility.calmMode && "🌙 Calm Mode is ON\n"}
          {!accessibility.largeText && !accessibility.highContrast && !accessibility.calmMode
            ? "Default mode — toggle settings above to preview!"
            : ""}
        </div>
      </div>
    </div>
  );
}

export default Profile;