import { useEffect, useRef } from "react";

function DwellTracker({ messageCount, onDwell }) {
  const startTime = useRef(Date.now());
  const lastCount = useRef(messageCount);

  useEffect(() => {
    if (messageCount !== lastCount.current) {
      const dwell = Date.now() - startTime.current;
      onDwell(dwell);
      startTime.current = Date.now();
      lastCount.current = messageCount;
    }
  }, [messageCount, onDwell]);

  return null;
}

export default DwellTracker;