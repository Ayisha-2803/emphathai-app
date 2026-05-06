import React, { useState, useEffect } from "react";

const affirmations = {
  Happy: [
    "🌟 Your energy is contagious. Keep spreading joy!",
    "☀️ You're at your best today. Make the most of it!",
    "🎉 Happiness looks great on you. Own it!",
  ],
  Sad: [
    "💙 It's okay to not be okay. You're allowed to feel this.",
    "🌱 Every storm runs out of rain. Better days are coming.",
    "🤗 You are stronger than you think. One step at a time.",
  ],
  Stressed: [
    "🧘 You don't have to do everything at once. Breathe first.",
    "💪 Pressure makes diamonds. You've got this.",
    "🌊 Take it one wave at a time. You won't drown.",
  ],
  Tired: [
    "😴 Rest is productive too. Give yourself permission to recharge.",
    "🌙 Even the sun sets to rise again. Rest well.",
    "💤 Taking breaks is how champions stay sharp.",
  ],
  Neutral: [
    "✨ Every day is a fresh start. What will you create today?",
    "🎯 Small steps still move you forward. Keep going.",
    "🌈 You have more potential than you realise.",
  ],
};

function Affirmation({ mood }) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (mood) {
      const list = affirmations[mood];
      setText(list[Math.floor(Math.random() * list.length)]);
    }
  }, [mood]);

  if (!mood || !text) return null;

  return (
    <div className="affirmation-bar">
      <p>{text}</p>
    </div>
  );
}

export default Affirmation;