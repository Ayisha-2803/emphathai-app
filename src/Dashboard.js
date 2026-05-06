import React from "react";

function Dashboard({ moodHistory }) {
  const moodColors = {
    Happy: "#f9d71c",
    Sad: "#5b8dee",
    Stressed: "#ff6b6b",
    Tired: "#a29bfe",
    Neutral: "#74b9ff",
  };

  return (
    <div className="dashboard">
      <h2>📊 Mood Dashboard</h2>
      <p className="dash-sub">Your emotional journey so far</p>

      {moodHistory.length === 0 ? (
        <div className="empty-state">
          <p>🌱 No mood data yet!</p>
          <p>Start chatting to track your emotions.</p>
        </div>
      ) : (
        <div className="mood-history">
          {moodHistory.map((entry, i) => (
            <div className="mood-card" key={i}
              style={{ borderLeft: `4px solid ${moodColors[entry.mood] || "#667eea"}` }}>
              <div className="mood-card-top">
                <span className="mood-emoji">{entry.emoji}</span>
                <span className="mood-label">{entry.mood}</span>
              </div>
              <div className="mood-time">{entry.time}</div>
            </div>
          ))}
        </div>
      )}

      <div className="stats-box">
        <h3>📈 Quick Stats</h3>
        <div className="stats-grid">
          <div className="stat">
            <span className="stat-num">{moodHistory.length}</span>
            <span className="stat-label">Total Check-ins</span>
          </div>
          <div className="stat">
            <span className="stat-num">
              {moodHistory.filter((m) => m.mood === "Happy").length}
            </span>
            <span className="stat-label">Happy Moments</span>
          </div>
          <div className="stat">
            <span className="stat-num">
              {moodHistory.length > 0
                ? moodHistory[moodHistory.length - 1].mood
                : "—"}
            </span>
            <span className="stat-label">Latest Mood</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;