import React, { useState, useRef, useEffect, useCallback } from "react";
import "./App.css";
import Groq from "groq-sdk";
import Dashboard from "./Dashboard";
import Profile from "./Profile";
import Breathe from "./Breathe";
import Affirmation from "./Affirmation";
import Welcome from "./Welcome";
import Crisis from "./Crisis";
import VoiceInput from "./VoiceInput";
import Feedback from "./Feedback";
import Suggestions from "./Suggestions";
import DwellTracker from "./DwellTracker";
import FaceDetector from "./FaceDetector";

const groq = new Groq({
  apiKey: process.env.REACT_APP_GROQ_KEY,
  dangerouslyAllowBrowser: true
});

const moods = [
  { emoji: "😊", label: "Happy" },
  { emoji: "😔", label: "Sad" },
  { emoji: "😤", label: "Stressed" },
  { emoji: "😴", label: "Tired" },
  { emoji: "😐", label: "Neutral" },
];

const moodThemes = {
  Happy:    { bg: "#1a1200", grad: "linear-gradient(135deg, #7a4500, #b8860b)", accent: "#fda085" },
  Sad:      { bg: "#000d1a", grad: "linear-gradient(135deg, #001a33, #003366)", accent: "#5b8dee" },
  Stressed: { bg: "#1a0000", grad: "linear-gradient(135deg, #4a0000, #8b0000)", accent: "#ff6b6b" },
  Tired:    { bg: "#0d0019", grad: "linear-gradient(135deg, #1a0033, #4a1a6e)", accent: "#a29bfe" },
  Neutral:  { bg: "#0f0c29", grad: "linear-gradient(135deg, #0f0c29, #302b63)", accent: "#667eea" },
};

function App() {
  const [started, setStarted] = useState(false);
  const [page, setPage] = useState("chat");
  const [mood, setMood] = useState(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "ai", text: "Hi! I'm EmpathAI 👋 How are you feeling today?" },
  ]);
  const [loading, setLoading] = useState(false);
  const [moodHistory, setMoodHistory] = useState([]);
  const [showBreathe, setShowBreathe] = useState(false);
  const [showCrisis, setShowCrisis] = useState(false);
  const [faceDetectionActive, setFaceDetectionActive] = useState(false);
  const [accessibility, setAccessibility] = useState({
    largeText: false,
    calmMode: false,
    highContrast: false,
    reminders: false,
  });

  const bottomRef = useRef(null);
  const dwellTimesRef = useRef([]);
  const theme = moodThemes[mood] || moodThemes.Neutral;
  const userName = localStorage.getItem("empathaiName") || "";

  const handleDwell = useCallback((ms) => {
    dwellTimesRef.current.push(ms);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    document.body.style.background = theme.grad;
  }, [theme]);

  useEffect(() => {
    document.body.style.fontSize = accessibility.largeText ? "18px" : "16px";
    document.body.style.filter = accessibility.highContrast ? "contrast(1.5)" : "none";
  }, [accessibility]);

  const handleMood = async (selectedMood) => {
    setMood(selectedMood);
    const emoji = moods.find((m) => m.label === selectedMood).emoji;
    const userMsg = `I'm feeling ${selectedMood} ${emoji}`;
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setMoodHistory((prev) => [...prev, { mood: selectedMood, emoji, time }]);
    setMessages((prev) => [...prev, { from: "user", text: userMsg }]);

    if (selectedMood === "Stressed" || selectedMood === "Sad") {
      setTimeout(() => setShowBreathe(true), 1000);
      setTimeout(() => setShowCrisis(true), 500);
    }

    setLoading(true);
    try {
      const recentMoods = moodHistory.slice(-3).map(m => m.mood).join(", ");
      const moodContext = recentMoods ? `Their recent moods have been: ${recentMoods}.` : "";
      const name = userName ? `The user's name is ${userName}.` : "";
      const prompt = `You are EmpathAI, a warm and emotionally intelligent AI assistant.
      ${name}
      The user says: "${userMsg}".
      ${moodContext}
      Respond with empathy in 2-3 short sentences.
      If you notice a pattern in their moods, mention it warmly.
      Be supportive and ask what they need help with.`;

      const result = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
      });
      setMessages((prev) => [...prev, { 
        from: "ai", 
        text: result.choices[0].message.content, 
        showFeedback: true 
      }]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [...prev, { 
        from: "ai", 
        text: "I'm here for you 💙 Tell me more.", 
        showFeedback: false 
      }]);
    }
    setLoading(false);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userText = input;
    setInput("");
    setMessages((prev) => [...prev, { from: "user", text: userText }]);
    setLoading(true);

    try {
      const recentMoods = moodHistory.slice(-3).map(m => m.mood).join(", ");
      const moodContext = recentMoods ? `The user's recent moods have been: ${recentMoods}.` : "";
      const name = userName ? `The user's name is ${userName}.` : "";
      const prompt = `You are EmpathAI, a warm and emotionally intelligent AI assistant.
      ${name}
      The user is currently feeling ${mood || "Neutral"}.
      ${moodContext}
      The user says: "${userText}".
      Respond with empathy and practical help in 2-3 short sentences.
      Adapt your tone based on their emotional state and history.`;

      const result = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
      });
      setMessages((prev) => [...prev, { 
        from: "ai", 
        text: result.choices[0].message.content, 
        showFeedback: true 
      }]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [...prev, { 
        from: "ai", 
        text: "I'm here for you 💙 Please keep sharing.", 
        showFeedback: false 
      }]);
    }
    setLoading(false);
  };

  if (!started) return <Welcome onStart={() => setStarted(true)} />;

  return (
    <div className="app" style={{
      background: theme.bg,
      fontSize: accessibility.largeText ? "17px" : undefined,
    }}>
      {showBreathe && <Breathe onClose={() => setShowBreathe(false)} />}
      {showCrisis && <Crisis onClose={() => setShowCrisis(false)} />}

      <div className="header" style={{ background: theme.grad }}>
        <h1>🧠 EmpathAI</h1>
        <p>{userName ? `Hello, ${userName} 👋` : "Your emotionally intelligent assistant"}</p>
        <div className="header-controls">
          {mood && page === "chat" && (
            <div className="mood-badge">
              {moods.find((m) => m.label === mood)?.emoji} {mood}
            </div>
          )}
          <button
            className={`camera-toggle ${faceDetectionActive ? "active" : ""}`}
            onClick={() => setFaceDetectionActive(!faceDetectionActive)}
            title="Toggle face emotion detection"
          >
            {faceDetectionActive ? "📷 On" : "📷 Off"}
          </button>
        </div>
      </div>

      <FaceDetector
        active={faceDetectionActive}
        onEmotionDetected={(detectedMood) => {
          if (!mood && !loading) {
            setMood(detectedMood);
            setMoodHistory((prev) => [...prev, {
              mood: detectedMood,
              emoji: moods.find((m) => m.label === detectedMood)?.emoji || "😐",
              time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            }]);
          }
        }}
      />

      <Affirmation mood={mood} />

      <div className="nav" style={{ background: "rgba(0,0,0,0.3)" }}>
        <button className={page === "chat" ? "active" : ""} onClick={() => setPage("chat")}>💬 Chat</button>
        <button className={page === "dashboard" ? "active" : ""} onClick={() => setPage("dashboard")}>📊 Dashboard</button>
        <button className={page === "profile" ? "active" : ""} onClick={() => setPage("profile")}>👤 Profile</button>
      </div>

      {page === "chat" && (
        <>
          <div className="chat-box">
            {messages.map((msg, i) => (
              <div key={i}>
                <div className={`message ${msg.from}`}>
                  {msg.from === "ai" && <span className="avatar">🤖</span>}
                  <div
                    className="bubble"
                    style={
                      msg.from === "user"
                        ? { background: theme.grad }
                        : { background: "rgba(255,255,255,0.1)" }
                    }
                  >
                    {msg.text}
                  </div>
                  {msg.from === "user" && <span className="avatar">🧑</span>}
                </div>
                {msg.from === "ai" && msg.showFeedback && (
                  <div style={{ paddingLeft: "40px", marginTop: "-6px", marginBottom: "6px" }}>
                    <Feedback onRate={(r) => console.log("Rating:", r)} />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="message ai">
                <span className="avatar">🤖</span>
                <div className="bubble typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <DwellTracker
              messageCount={messages.length}
              onDwell={handleDwell}
            />
            <div ref={bottomRef} />
          </div>

          <Suggestions mood={mood} theme={theme} />

          {!mood && (
            <div className="mood-selector">
              <p>How are you feeling right now?</p>
              <div className="moods">
                {moods.map((m) => (
                  <button key={m.label} onClick={() => handleMood(m.label)}>
                    <span>{m.emoji}</span>
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="input-area">
            <input
              type="text"
              placeholder="Type or speak how you feel..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={loading}
            />
            <VoiceInput onResult={(text) => setInput(text)} />
            <button
              onClick={handleSend}
              disabled={loading}
              style={{ background: theme.grad }}
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </>
      )}

      {page === "dashboard" && <Dashboard moodHistory={moodHistory} />}
      {page === "profile" && (
        <Profile
          accessibility={accessibility}
          setAccessibility={setAccessibility}
        />
      )}
    </div>
  );
}

export default App;