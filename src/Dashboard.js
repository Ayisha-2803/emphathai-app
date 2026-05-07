import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell
} from "recharts";

const moodColors = {
  Happy: "#fda085",
  Sad: "#5b8dee",
  Stressed: "#ff6b6b",
  Tired: "#a29bfe",
  Neutral: "#74b9ff",
};

function Dashboard({ moodHistory }) {
  // Build chart data — count each mood
  const moodCounts = ["Happy", "Sad", "Stressed", "Tired", "Neutral"].map((mood) => ({
    mood,
    count: moodHistory.filter((m) => m.mood === mood).length,
  }));

  return (
    <div className="dashboard">
      <h2>📊 Mood Dashboard</h2>
      <p className="dash-sub">Your emotional journey so far</p>

      {/* ── CHART ── */}
      <div className="chart-box">
        <h3>Mood Frequency</h3>
        {moodHistory.length === 0 ? (
          <p className="empty-state">
            🌱 No data yet! Start chatting to see your chart.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={moodCounts} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="mood"
                tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(0,0,0,0.8)",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {moodCounts.map((entry) => (
                  <Cell
                    key={entry.mood}
                    fill={moodColors[entry.mood]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ── HISTORY LIST ── */}
      {moodHistory.length > 0 && (
        <div className="mood-history">
          <h3 style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, marginBottom: 10 }}>
            Recent Check-ins
          </h3>
          {[...moodHistory].reverse().slice(0, 5).map((entry, i) => (
            <div
              className="mood-card"
              key={i}
              style={{ borderLeft: `4px solid ${moodColors[entry.mood] || "#667eea"}` }}
            >
              <div className="mood-card-top">
                <span className="mood-emoji">{entry.emoji}</span>
                <span className="mood-label">{entry.mood}</span>
              </div>
              <div className="mood-time">{entry.time}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── STATS ── */}
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