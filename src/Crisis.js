import React, { useState } from "react";

function Crisis({ onClose }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="crisis-bar">
      <div className="crisis-content">
        <span className="crisis-icon">💙</span>
        <div className="crisis-text">
          <p className="crisis-title">You're not alone</p>
          <p className="crisis-sub">
            If you're struggling, please reach out to iCall:{" "}
            <strong>9152987821</strong> (India) or text a trusted person.
          </p>
        </div>
        <button className="crisis-close" onClick={() => { setDismissed(true); onClose(); }}>
          ✕
        </button>
      </div>
    </div>
  );
}

export default Crisis;