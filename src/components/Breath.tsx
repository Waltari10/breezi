import { useState, useEffect, useRef } from "react";
import { BreathingCircle, type BreathingPattern } from "./BreathingCircle";
import { Timer } from "./Timer";
import chimeSound from "../assets/chime.mp3";
import inhaleSound from "../assets/inhale.mp3";
import exhaleSound from "../assets/exhale.mp3";
import holdSound from "../assets/hold.mp3";
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
  const [isPaused, setIsPaused] = useState(false);
  const chimeAudioRef = useRef<HTMLAudioElement | null>(null);
  const inhaleAudioRef = useRef<HTMLAudioElement | null>(null);
  const exhaleAudioRef = useRef<HTMLAudioElement | null>(null);
  const holdAudioRef = useRef<HTMLAudioElement | null>(null);
  const lastStateRef = useRef<string>("idle");

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

  const stopAllSounds = () => {
    if (chimeAudioRef.current) {
      chimeAudioRef.current.pause();
      chimeAudioRef.current.currentTime = 0;
    }
    if (inhaleAudioRef.current) {
      inhaleAudioRef.current.pause();
      inhaleAudioRef.current.currentTime = 0;
    }
    if (exhaleAudioRef.current) {
      exhaleAudioRef.current.pause();
      exhaleAudioRef.current.currentTime = 0;
    }
    if (holdAudioRef.current) {
      holdAudioRef.current.pause();
      holdAudioRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    // Initialize audio elements
    chimeAudioRef.current = new Audio(chimeSound);
    chimeAudioRef.current.volume = 0.5;

    inhaleAudioRef.current = new Audio(inhaleSound);
    inhaleAudioRef.current.volume = 0.5;

    exhaleAudioRef.current = new Audio(exhaleSound);
    exhaleAudioRef.current.volume = 0.5;

    holdAudioRef.current = new Audio(holdSound);
    holdAudioRef.current.volume = 0.5;

    // Handle visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setIsPaused(true);
        stopAllSounds();
      } else if (document.visibilityState === "visible") {
        setIsPaused(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stopAllSounds();
      // Cleanup audio elements
      chimeAudioRef.current = null;
      inhaleAudioRef.current = null;
      exhaleAudioRef.current = null;
      holdAudioRef.current = null;
    };
  }, []);

  const handleStart = () => {
    setStartTime(Date.now());
  };

  const handleStateChange = (
    state: "inhale" | "exhale" | "holdIn" | "holdOut" | "idle"
  ) => {
    // Don't play sounds if the tab is hidden or paused
    if (document.visibilityState === "hidden" || isPaused) return;

    // Don't play the same sound twice in a row
    if (state === lastStateRef.current) return;
    lastStateRef.current = state;

    if (state === "inhale" && inhaleAudioRef.current) {
      inhaleAudioRef.current.currentTime = 0;
      inhaleAudioRef.current.play().catch(console.error);
    } else if (state === "exhale" && exhaleAudioRef.current) {
      exhaleAudioRef.current.currentTime = 0;
      exhaleAudioRef.current.play().catch(console.error);
    } else if (
      (state === "holdIn" || state === "holdOut") &&
      holdAudioRef.current
    ) {
      holdAudioRef.current.currentTime = 0;
      holdAudioRef.current.play().catch(console.error);
    }
  };

  const handleComplete = async () => {
    setStartTime(null);
    setIsPaused(false);
    lastStateRef.current = "idle";
    await releaseWakeLock();

    // Only play completion sound if the tab is visible
    if (document.visibilityState === "visible" && chimeAudioRef.current) {
      try {
        await chimeAudioRef.current.play();
      } catch (err) {
        console.error("Failed to play completion sound:", err);
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
          onStateChange={handleStateChange}
        />
      </div>
    </div>
  );
};
