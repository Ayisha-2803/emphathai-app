import React, { useEffect, useRef, useState, useCallback } from "react";

const emotionMap = {
  happy: "Happy",
  sad: "Sad",
  angry: "Stressed",
  fearful: "Stressed",
  disgusted: "Stressed",
  surprised: "Happy",
  neutral: "Neutral",
};

function FaceDetector({ onEmotionDetected, active }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  const faceApiRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const [detected, setDetected] = useState(null);

  const stopEverything = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStatus("idle");
    setDetected(null);
  }, []);

  const detectEmotion = useCallback(async () => {
    if (!videoRef.current || !streamRef.current || !faceApiRef.current) return;
    try {
      const faceapi = faceApiRef.current;
      const result = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();
      if (result) {
        const dominant = Object.entries(result.expressions).reduce((a, b) =>
          a[1] > b[1] ? a : b
        )[0];
        const mappedMood = emotionMap[dominant] || "Neutral";
        setDetected(mappedMood);
        onEmotionDetected(mappedMood);
      }
    } catch {}
  }, [onEmotionDetected]);

  const startCamera = useCallback(async (faceapi) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240 }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        intervalRef.current = setInterval(detectEmotion, 3000);
      }
    } catch {
      setStatus("denied");
    }
  }, [detectEmotion]);

  const loadModels = useCallback(async () => {
    try {
      setStatus("loading");
      const faceapi = await import("face-api.js");
      faceApiRef.current = faceapi;
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      ]);
      setStatus("ready");
      await startCamera(faceapi);
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  }, [startCamera]);

  useEffect(() => {
    if (active) {
      loadModels();
    } else {
      stopEverything();
    }
    return () => stopEverything();
  }, [active, loadModels, stopEverything]);

  if (!active) return null;

  return (
    <div className="face-detector">
      <video
        ref={videoRef}
        style={{ display: "none" }}
        width="320"
        height="240"
        muted
        playsInline
      />
      <div className="face-status">
        {status === "loading" && <span>📷 Loading face detection...</span>}
        {status === "ready" && (
          <span>📷 Camera active {detected && `— detected: ${detected}`}</span>
        )}
        {status === "denied" && <span>📷 Camera access denied</span>}
        {status === "error" && <span>📷 Face detection unavailable</span>}
      </div>
    </div>
  );
}

export default FaceDetector;