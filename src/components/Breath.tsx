import { useState, useEffect, useRef } from "react";
import { BreathingCircle, type BreathingPattern } from "./BreathingCircle";
import { Timer } from "./Timer";
import chimeSound from "../assets/chime.mp3";
import "./Breath.css";

const defaultPattern: BreathingPattern = {
  inhale: 6,
  holdIn: 2,
  exhale: 6,
  holdOut: 2,
  name: "Default Exercise",
  duration: 0,
};

interface BreathProps {
  pattern?: BreathingPattern;
  onComplete?: () => void;
}

export const Breath = ({
  pattern = defaultPattern,
  onComplete,
}: BreathProps) => {
  const [currentPattern] = useState<BreathingPattern>(pattern);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const requestWakeLock = async () => {
    try {
      if ("wakeLock" in navigator) {
        const lock = await navigator.wakeLock.request("screen");
        setWakeLock(lock);
      }
    } catch (err) {
      // Wake Lock request failed - usually because the user denied permission
      console.log("Wake Lock request failed:", err);
    }
  };

  const releaseWakeLock = async () => {
    if (wakeLock) {
      try {
        await wakeLock.release();
        setWakeLock(null);
      } catch (err) {
        console.log("Wake Lock release failed:", err);
      }
    }
  };

  // Request wake lock when component mounts
  useEffect(() => {
    requestWakeLock();

    // Release wake lock when component unmounts
    return () => {
      releaseWakeLock();
    };
  }, []);

  // Handle visibility change
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible" && startTime) {
        // Re-request wake lock when page becomes visible again
        await requestWakeLock();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [startTime]);

  useEffect(() => {
    // Initialize audio element
    audioRef.current = new Audio(chimeSound);
    audioRef.current.volume = 0.5; // Set volume to 50%

    return () => {
      // Cleanup audio element
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleStart = () => {
    setStartTime(Date.now());
  };

  const handleComplete = async () => {
    setStartTime(null);
    await releaseWakeLock();

    // Play completion sound
    if (audioRef.current) {
      try {
        await audioRef.current.play();
      } catch (err) {
        console.log("Failed to play completion sound:", err);
      }
    }

    onComplete?.();
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="breath-container">
      <div className="breath-header">
        <h1>{currentPattern.name}</h1>
        <div className="pattern-info">
          <div className="pattern-detail">
            <span className="label">Duration:</span>
            <span className="value">
              {formatDuration(currentPattern.duration)}
            </span>
          </div>
          <div className="pattern-detail">
            <span className="label">Inhale:</span>
            <span className="value">{currentPattern.inhale}s</span>
          </div>
          {currentPattern.holdIn && (
            <div className="pattern-detail">
              <span className="label">Hold In:</span>
              <span className="value">{currentPattern.holdIn}s</span>
            </div>
          )}
          <div className="pattern-detail">
            <span className="label">Exhale:</span>
            <span className="value">{currentPattern.exhale}s</span>
          </div>
          {currentPattern.holdOut && (
            <div className="pattern-detail">
              <span className="label">Hold Out:</span>
              <span className="value">{currentPattern.holdOut}s</span>
            </div>
          )}
        </div>
      </div>
      <div className="breath-content">
        <Timer
          startTime={startTime}
          duration={currentPattern.duration}
          onComplete={handleComplete}
        />
        <BreathingCircle
          pattern={currentPattern}
          onStart={handleStart}
          onComplete={handleComplete}
        />
      </div>
    </div>
  );
};
