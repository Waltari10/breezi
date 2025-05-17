import { useState, useEffect } from "react";
import "./Timer.css";

interface TimerProps {
  startTime: number | null;
  duration: number;
  onComplete?: () => void;
}

export const Timer = ({ startTime, duration, onComplete }: TimerProps) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!startTime) {
      setElapsed(0);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - startTime) / 1000);
      setElapsed(elapsedSeconds);

      if (duration > 0 && elapsedSeconds >= duration) {
        clearInterval(interval);
        onComplete?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, duration, onComplete]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (elapsed / duration) * 100 : 0;

  return (
    <div className={`timer ${!startTime ? "timer-paused" : ""}`}>
      <div className="timer-display">
        {formatTime(elapsed)}/{formatTime(duration)}
      </div>
      {duration > 0 && (
        <div className="timer-progress">
          <div
            className="timer-progress-bar"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
};
