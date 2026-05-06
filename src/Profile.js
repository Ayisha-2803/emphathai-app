import React, { useState } from "react";

function Profile() {
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (name.trim()) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
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
          <input type="checkbox" className="toggle" />
        </div>
        <div className="toggle-row">
          <span>🌙 Calm Mode (reduced animations)</span>
          <input type="checkbox" className="toggle" />
        </div>
        <div className="toggle-row">
          <span>🔔 Daily Mood Reminders</span>
          <input type="checkbox" className="toggle" />
        </div>
      </div>
    </div>
  );
}

export default Profile;