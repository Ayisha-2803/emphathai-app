import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Dashboard from "./Dashboard";
import Profile from "./Profile";
import Breathe from "./Breathe";
import Affirmation from "./Affirmation";
import Welcome from "./Welcome";

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_KEY);

const moods = [
  { emoji: "😊", label: "Happy" },
  { emoji: "😔", label: "Sad" },
  { emoji: "😤", label: "Stressed" },
  { emoji: "😴", label: "Tired" },
  { emoji: "😐", label: "Neutral" },
];

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
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleMood = async (selectedMood) => {
    setMood(selectedMood);
    const emoji = moods.find((m) => m.label === selectedMood).emoji;
    const userMsg = `I'm feeling ${selectedMood} ${emoji}`;
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setMoodHistory((prev) => [...prev, { mood: selectedMood, emoji, time }]);
    setMessages((prev) => [...prev, { from: "user", text: userMsg }]);

    if (selectedMood === "Stressed" || selectedMood === "Sad") {
      setTimeout(() => setShowBreathe(true), 1000);
    }

    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `You are EmpathAI, a warm and emotionally intelligent AI assistant. 
      The user says: "${userMsg}". 
      Respond with empathy in 2-3 short sentences. Be supportive and ask what they need help with.`;
      const result = await model.generateContent(prompt);
      setMessages((prev) => [...prev, { from: "ai", text: result.response.text() }]);
    } catch {
      setMessages((prev) => [...prev, { from: "ai", text: "I'm here for you 💙 Tell me more." }]);
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
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `You are EmpathAI, a warm and emotionally intelligent AI assistant.
      The user is feeling ${mood || "Neutral"} and says: "${userText}".
      Respond with empathy and practical help in 2-3 short sentences.`;
      const result = await model.generateContent(prompt);
      setMessages((prev) => [...prev, { from: "ai", text: result.response.text() }]);
    } catch {
      setMessages((prev) => [...prev, { from: "ai", text: "I'm here for you 💙 Please keep sharing." }]);
    }
    setLoading(false);
  };

  if (!started) return <Welcome onStart={() => setStarted(true)} />;

  return (
    <div className="app">
      {showBreathe && <Breathe onClose={() => setShowBreathe(false)} />}

      <div className="header">
        <h1>🧠 EmpathAI</h1>
        <p>Your emotionally intelligent assistant</p>
        {mood && page === "chat" && (
          <div className="mood-badge">
            {moods.find((m) => m.label === mood)?.emoji} {mood}
          </div>
        )}
      </div>

      <Affirmation mood={mood} />

      <div className="nav">
        <button className={page === "chat" ? "active" : ""} onClick={() => setPage("chat")}>💬 Chat</button>
        <button className={page === "dashboard" ? "active" : ""} onClick={() => setPage("dashboard")}>📊 Dashboard</button>
        <button className={page === "profile" ? "active" : ""} onClick={() => setPage("profile")}>👤 Profile</button>
      </div>

      {page === "chat" && (
        <>
          <div className="chat-box">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.from}`}>
                {msg.from === "ai" && <span className="avatar">🤖</span>}
                <div className="bubble">{msg.text}</div>
                {msg.from === "user" && <span className="avatar">🧑</span>}
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
            <div ref={bottomRef} />
          </div>

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
              placeholder="Type how you feel or what you need..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={loading}
            />
            <button onClick={handleSend} disabled={loading}>
              {loading ? "..." : "Send"}
            </button>
          </div>
        </>
      )}

      {page === "dashboard" && <Dashboard moodHistory={moodHistory} />}
      {page === "profile" && <Profile />}
    </div>
  );
}

export default App;