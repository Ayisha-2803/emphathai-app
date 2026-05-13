import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    if (name.trim()) localStorage.setItem("empathaiName", name);
    if (selectedPersona !== null) localStorage.setItem("empathaiPersona", personas[selectedPersona].label);
    onStart();
  };

  return (
    <div className="welcome">
      {/* Animated background particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.4, 0.1],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${4 + Math.random() * 8}px`,
              height: `${4 + Math.random() * 8}px`,
            }}
          />
        ))}
      </div>

      <motion.div
        className="welcome-content"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className="welcome-logo"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          🧠
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          EmpathAI
        </motion.h1>

        <motion.p
          className="welcome-tagline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Your emotionally intelligent companion
        </motion.p>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}
            >
              <div className="welcome-features">
                {[
                  { icon: "💬", text: "AI that understands how you feel" },
                  { icon: "🧘", text: "Breathing exercises when stressed" },
                  { icon: "📊", text: "Track your emotional journey" },
                  { icon: "♿", text: "Accessible for everyone" },
                  { icon: "📷", text: "Face emotion detection" },
                  { icon: "🌤️", text: "Weather & context awareness" },
                ].map((f, i) => (
                  <motion.div
                    key={i}
                    className="feature-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                  >
                    <span>{f.icon}</span>
                    <span>{f.text}</span>
                  </motion.div>
                ))}
              </div>
              <motion.button
                className="start-btn"
                onClick={() => setStep(2)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Get Started ✨
              </motion.button>
              <p className="welcome-note">🔒 Your data stays private.</p>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}
            >
              <p className="onboard-label">What's your name?</p>
              <input
                className="onboard-input"
                type="text"
                placeholder="Enter your name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && setStep(3)}
                autoFocus
              />
              <motion.button
                className="start-btn"
                onClick={() => setStep(3)}
                disabled={!name.trim()}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Next →
              </motion.button>
              <button className="skip-btn" onClick={() => setStep(3)}>Skip</button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}
            >
              <p className="onboard-label">Which best describes you?</p>
              <div className="persona-grid">
                {personas.map((p, i) => (
                  <motion.div
                    key={i}
                    className={`persona-card ${selectedPersona === i ? "selected" : ""}`}
                    onClick={() => setSelectedPersona(i)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <span className="persona-emoji">{p.emoji}</span>
                    <span className="persona-label">{p.label}</span>
                    <span className="persona-desc">{p.desc}</span>
                  </motion.div>
                ))}
              </div>
              <motion.button
                className="start-btn"
                onClick={handleStart}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Start My Journey 🚀
              </motion.button>
              <button className="skip-btn" onClick={handleStart}>Skip</button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default Welcome;