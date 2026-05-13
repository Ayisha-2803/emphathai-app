import React, { useState, useRef, useEffect, useCallback } from "react";
import "./App.css";
import Groq from "groq-sdk";
import Dashboard from "./Dashboard";
import Profile from "./Profile";
import Breathe from "./Breathe";
import Welcome from "./Welcome";
import Crisis from "./Crisis";
import VoiceInput from "./VoiceInput";
import Feedback from "./Feedback";
import Suggestions from "./Suggestions";
import DwellTracker from "./DwellTracker";
import FaceDetector from "./FaceDetector";
import useWeatherContext from "./WeatherContext";


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
  Happy:    { grad: "linear-gradient(135deg, #7a4500, #b8860b)" },
  Sad:      { grad: "linear-gradient(135deg, #001a33, #003366)" },
  Stressed: { grad: "linear-gradient(135deg, #4a0000, #8b0000)" },
  Tired:    { grad: "linear-gradient(135deg, #1a0033, #4a1a6e)" },
  Neutral:  { grad: "linear-gradient(135deg, #0f0c29, #302b63)" },
};

function formatMessage(text) {
  if (!text) return "";
  // Handle code blocks first
  text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, 
    '<pre><code>$2</code></pre>');
  // Inline code
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
  // Bold
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Italic
  text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // Headers
  text = text.replace(/^### (.*?)$/gm, '<strong style="font-size:15px;color:#f5c518">$1</strong>');
  text = text.replace(/^## (.*?)$/gm, '<strong style="font-size:16px;color:#f5c518">$1</strong>');
  text = text.replace(/^# (.*?)$/gm, '<strong style="font-size:17px;color:#f5c518">$1</strong>');
  // Bullet points
  text = text.replace(/^- (.*?)$/gm, '• $1');
  text = text.replace(/^\* (.*?)$/gm, '• $1');
  // Numbered lists
  text = text.replace(/^(\d+)\. (.*?)$/gm, '<span style="color:#f5c518">$1.</span> $2');
  // Line breaks
  text = text.replace(/\n/g, '<br/>');
  return text;
}

const affirmations = {
  Happy: ["🌟 Your energy is contagious!", "☀️ You're at your best today!", "🎉 Happiness looks great on you!"],
  Sad: ["💙 Better days are coming.", "🤗 You are stronger than you think.", "🌱 This too shall pass."],
  Stressed: ["🧘 Breathe. One step at a time.", "💪 You've got this!", "🌊 You won't drown."],
  Tired: ["😴 Rest is productive too.", "🌙 Recharge and rise again.", "💤 Champions rest too."],
  Neutral: ["✨ Every day is a fresh start.", "🎯 Small steps move you forward.", "🌈 Great things await."],
};

function App() {
  const [started, setStarted] = useState(false);
  const [page, setPage] = useState("chat");
  const [mood, setMood] = useState(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "ai", text: "Hi! I'm **EmpathAI** 👋 — your emotionally intelligent assistant powered by advanced AI.\n\nI can help you with **anything** — emotional support, answering questions, creating plans, solving problems, writing code, and much more!\n\nHow are you feeling today? Select your mood below to get started! 😊" },
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
  const [conversationHistory, setConversationHistory] = useState([]);
  const [affirmation, setAffirmation] = useState("");

  const bottomRef = useRef(null);
  const dwellTimesRef = useRef([]);
  const userName = localStorage.getItem("empathaiName") || "";
  const weatherCtx = useWeatherContext();

  const handleDwell = useCallback((ms) => {
    dwellTimesRef.current.push(ms);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    document.body.style.fontSize = accessibility.largeText ? "18px" : "16px";
    document.body.style.filter = accessibility.highContrast ? "contrast(1.5)" : "none";
  }, [accessibility]);
  useEffect(() => {
    if (mood) {
      const theme = moodThemes[mood];
      document.querySelector(".main-content").style.background =
        `linear-gradient(180deg, ${
          mood === "Happy" ? "rgba(122,69,0,0.15)" :
          mood === "Sad" ? "rgba(0,26,51,0.3)" :
          mood === "Stressed" ? "rgba(74,0,0,0.3)" :
          mood === "Tired" ? "rgba(26,0,51,0.3)" :
          "rgba(15,12,41,0.3)"
        } 0%, var(--bg-primary) 100%)`;

      document.querySelector(".topbar").style.borderBottom =
        `1px solid ${
          mood === "Happy" ? "rgba(248,180,0,0.3)" :
          mood === "Sad" ? "rgba(91,141,238,0.3)" :
          mood === "Stressed" ? "rgba(255,107,107,0.3)" :
          mood === "Tired" ? "rgba(162,155,254,0.3)" :
          "rgba(255,255,255,0.08)"
        }`;
    }
  }, [mood]);

  useEffect(() => {
    if (mood) {
      const list = affirmations[mood];
      setAffirmation(list[Math.floor(Math.random() * list.length)]);
    }
  }, [mood]);

  const buildSystemPrompt = useCallback((currentMood) => {
    return `You are EmpathAI — the world's most advanced emotionally intelligent AI assistant. You combine:
- The empathy and warmth of a therapist
- The knowledge depth of an expert researcher  
- The coding ability of a senior developer
- The creativity of an artist
- The wisdom of a life coach

USER CONTEXT:
- Name: ${userName || "the user"}
- Current mood: ${currentMood || "Neutral"}
- Recent moods: ${moodHistory.slice(-5).map(m => m.mood).join(", ") || "No history"}
- Time: ${weatherCtx.timeOfDay || "unknown"}
- Weather: ${weatherCtx.weather ? `${weatherCtx.weather}, ${weatherCtx.temp}°C` : "unknown"}

CAPABILITIES:
✓ Answer any question with expert knowledge
✓ Write, debug and explain code in any language
✓ Create detailed timetables, study plans, workout plans
✓ Provide emotional support and mental wellness guidance
✓ Tell stories, jokes, riddles, poems
✓ Solve complex math problems step by step
✓ Give medical, legal, financial information (with appropriate disclaimers)
✓ Help with homework and academic topics
✓ Create recipes, travel plans, bucket lists
✓ Analyse situations and give strategic advice

TONE (adapt to mood):
- Happy → enthusiastic, energetic, celebratory 🎉
- Sad → gentle, deeply empathetic, healing 💙  
- Stressed → calm, structured, reassuring 🧘
- Tired → soft, simple, nurturing 💤
- Neutral → professional, friendly, helpful

FORMATTING:
- Use **bold** for key points
- Use bullet points for lists
- Use numbered lists for steps
- Use code blocks for code
- Use headers for long responses
- Use emojis naturally but not excessively

RULES:
- NEVER refuse to help — always find a way
- Always consider emotional state in your tone
- Give complete, thorough answers
- Be concise but never skip important details
- If asked to generate an image, describe it in vivid detail instead and explain you can describe but not render images
- Always be warm, never cold or robotic`;
  }, [userName, moodHistory, weatherCtx]);

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
      const result = await groq.chat.completions.create({
        messages: [
          { role: "system", content: buildSystemPrompt(selectedMood) },
          { role: "user", content: `I'm feeling ${selectedMood} right now.${recentMoods ? ` My recent moods: ${recentMoods}.` : ""} Please acknowledge my mood warmly${userName ? ` (my name is ${userName})` : ""} and ask what I need help with today.` }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.8,
        max_tokens: 400,
      });

      const aiText = result.choices[0].message.content;
      setMessages((prev) => [...prev, { from: "ai", text: aiText, showFeedback: true }]);
      setConversationHistory([
        { role: "user", content: userMsg },
        { role: "assistant", content: aiText }
      ]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [...prev, { from: "ai", text: "I'm here for you 💙 Tell me more about how you're feeling.", showFeedback: false }]);
    }
    setLoading(false);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userText = input;
    setInput("");
    setMessages((prev) => [...prev, { from: "user", text: userText }]);
    setLoading(true);

    const newHistory = [...conversationHistory, { role: "user", content: userText }];

    try {
      const result = await groq.chat.completions.create({
        messages: [
          { role: "system", content: buildSystemPrompt(mood) },
          ...newHistory.slice(-8),
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.8,
        max_tokens: 1500,
      });

      const aiText = result.choices[0].message.content;
      setMessages((prev) => [...prev, { from: "ai", text: aiText, showFeedback: true }]);
      setConversationHistory([...newHistory, { role: "assistant", content: aiText }]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [...prev, { from: "ai", text: "I'm here for you 💙 Please keep sharing.", showFeedback: false }]);
    }
    setLoading(false);
  };

  if (!started) return <Welcome onStart={() => setStarted(true)} />;

  const currentMoodData = moods.find(m => m.label === mood);

  return (
    <div className="app-layout">
      {showBreathe && <Breathe onClose={() => setShowBreathe(false)} />}
      {showCrisis && <Crisis onClose={() => setShowCrisis(false)} />}

      {/* ── SIDEBAR ── */}
      <div className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">🧠</div>
          <div className="logo-text">
            <h2>EmpathAI</h2>
            <p>Intelligent & Empathetic</p>
          </div>
        </div>

        <div className="sidebar-nav">
          <div className="nav-section-title">Main</div>

          <button className={`nav-item ${page === "chat" ? "active" : ""}`} onClick={() => setPage("chat")}>
            <span className="nav-icon">💬</span>
            Chat
            {messages.length > 1 && <span className="nav-badge">{messages.filter(m => m.from === "ai").length}</span>}
          </button>

          <button className={`nav-item ${page === "dashboard" ? "active" : ""}`} onClick={() => setPage("dashboard")}>
            <span className="nav-icon">📊</span>
            Mood Dashboard
          </button>

          <button className={`nav-item ${page === "profile" ? "active" : ""}`} onClick={() => setPage("profile")}>
            <span className="nav-icon">👤</span>
            Profile & Settings
          </button>

          <div className="nav-section-title" style={{ marginTop: 16 }}>Mood</div>

          {moods.map((m) => (
            <button
              key={m.label}
              className={`nav-item ${mood === m.label ? "active" : ""}`}
              onClick={() => { handleMood(m.label); setPage("chat"); }}
            >
              <span className="nav-icon">{m.emoji}</span>
              {m.label}
            </button>
          ))}

          <div className="nav-section-title" style={{ marginTop: 16 }}>Tools</div>

          <button className="nav-item" onClick={() => { setInput("Give me a motivational quote"); setPage("chat"); }}>
            <span className="nav-icon">💫</span>
            Daily Motivation
          </button>

          <button className="nav-item" onClick={() => { setInput("Create a study timetable for me"); setPage("chat"); }}>
            <span className="nav-icon">📅</span>
            Study Planner
          </button>

          <button className="nav-item" onClick={() => { setInput("Tell me a joke to cheer me up"); setPage("chat"); }}>
            <span className="nav-icon">😄</span>
            Cheer Me Up
          </button>

          <button className="nav-item" onClick={() => { setInput("Give me a breathing exercise"); setPage("chat"); }}>
            <span className="nav-icon">🧘</span>
            Wellness Tips
          </button>
        </div>

        <div className="sidebar-footer">
          <div className="user-card" onClick={() => setPage("profile")}>
            <div className="user-avatar">🧑</div>
            <div className="user-info">
              <h4>{userName || "Guest User"}</h4>
              <p>{localStorage.getItem("empathaiPersona") || "EmpathAI User"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="main-content">

        {/* TOP BAR */}
        <div className="topbar">
          <div className="topbar-left">
            <div>
              <div className="topbar-title">
                {page === "chat" ? "💬 AI Chat" : page === "dashboard" ? "📊 Mood Dashboard" : "👤 Profile & Settings"}
              </div>
              <div className="topbar-subtitle">
                {page === "chat" ? "Ask me anything — I'm here to help!" : page === "dashboard" ? "Track your emotional journey" : "Personalise your experience"}
              </div>
            </div>
          </div>

          <div className="topbar-right">
            {weatherCtx.loaded && weatherCtx.weather && (
              <div className="topbar-btn">
                🌤️ {weatherCtx.weather} {weatherCtx.temp}°C
              </div>
            )}
            {mood && (
              <div className="mood-pill">
                {currentMoodData?.emoji} {mood}
              </div>
            )}
            <button
              className={`topbar-btn ${faceDetectionActive ? "camera-on" : ""}`}
              onClick={() => setFaceDetectionActive(!faceDetectionActive)}
            >
              📷 {faceDetectionActive ? "Camera On" : "Camera Off"}
            </button>
          </div>
        </div>

        {/* FACE DETECTOR */}
        <FaceDetector
          active={faceDetectionActive}
          onEmotionDetected={(detectedMood) => {
            if (!mood && !loading) handleMood(detectedMood);
          }}
        />

        {/* CONTEXT BAR */}
        {(weatherCtx.loaded || mood || affirmation) && (
          <div className="context-bar">
            {weatherCtx.timeOfDay && (
              <div className="context-item">
                <span>🕐</span>
                <span>Good {weatherCtx.timeOfDay}{userName ? `, ${userName}` : ""}!</span>
              </div>
            )}
            {weatherCtx.weather && (
              <div className="context-item">
                <span>🌡️</span>
                <span>{weatherCtx.weather}, {weatherCtx.temp}°C</span>
              </div>
            )}
            {moodHistory.length > 0 && (
              <div className="context-item">
                <span>🔥</span>
                <span>{moodHistory.length} check-ins</span>
              </div>
            )}
            {affirmation && (
              <div className="affirmation-text">{affirmation}</div>
            )}
          </div>
        )}

        {/* PAGES */}
        {page === "chat" && (
          <>
            <div className="chat-area">
              {messages.map((msg, i) => (
                <div key={i} className="message-group">
                  <div className={`message ${msg.from}`}>
                    <div className="msg-avatar">
                      {msg.from === "ai" ? "🤖" : "🧑"}
                    </div>
                    <div
                      className="bubble"
                      dangerouslySetInnerHTML={
                        msg.from === "ai"
                          ? { __html: formatMessage(msg.text) }
                          : undefined
                      }
                    >
                      {msg.from === "user" ? msg.text : undefined}
                    </div>
                  </div>
                  {msg.from === "ai" && msg.showFeedback && (
                    <Feedback onRate={(r) => console.log("Rating:", r)} />
                  )}
                </div>
              ))}

              {loading && (
                <div className="message ai">
                  <div className="msg-avatar">🤖</div>
                  <div className="bubble typing">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              )}

              <DwellTracker messageCount={messages.length} onDwell={handleDwell} />
              <div ref={bottomRef} />
            </div>

            <Suggestions mood={mood} />

            {!mood && (
              <div className="mood-selector">
                <p>Select your mood to get started</p>
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
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="Ask me anything — coding, emotions, plans, riddles, advice..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  disabled={loading}
                />
                <div className="input-actions">
                  <VoiceInput onResult={(text) => setInput(text)} />
                  <button
                    className="send-btn"
                    onClick={handleSend}
                    disabled={loading}
                  >
                    {loading ? "..." : "Send ➤"}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {page === "dashboard" && <Dashboard moodHistory={moodHistory} />}
        {page === "profile" && (
          <Profile accessibility={accessibility} setAccessibility={setAccessibility} />
        )}
      </div>
    </div>
  );
}

export default App;