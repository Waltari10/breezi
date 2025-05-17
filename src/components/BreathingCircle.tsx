import { useEffect, useState, useRef } from "react";
import "./BreathingCircle.css";

type BreathingState = "inhale" | "holdIn" | "exhale" | "holdOut" | "idle";

export type BreathingPattern = {
  inhale: number;
  holdIn?: number;
  exhale: number;
  holdOut?: number;
  name: string;
  duration: number; // in seconds
};

const defaultPattern: BreathingPattern = {
  inhale: 6,
  holdIn: 2,
  exhale: 6,
  holdOut: 2,
  name: "Default Exercise",
  duration: 0,
};

interface BreathingCircleProps {
  pattern?: BreathingPattern;
  onComplete?: () => void;
  onStart?: () => void;
  onStateChange?: (state: BreathingState) => void;
}

export const BreathingCircle = ({
  pattern = defaultPattern,
  onComplete,
  onStart,
  onStateChange,
}: BreathingCircleProps) => {
  const [breathingState, setBreathingState] = useState<BreathingState>("idle");
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const pauseTimeRef = useRef<number | null>(null);
  const totalPausedTimeRef = useRef<number>(0);

  const updateBreathingState = (newState: BreathingState) => {
    setBreathingState(newState);
    onStateChange?.(newState);
  };

  useEffect(() => {
    if (!isStarted) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setIsPaused(true);
        pauseTimeRef.current = Date.now();
      } else if (document.visibilityState === "visible" && isPaused) {
        if (pauseTimeRef.current) {
          totalPausedTimeRef.current += Date.now() - pauseTimeRef.current;
        }
        setIsPaused(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    const breathingCycle = async () => {
      startTimeRef.current = Date.now();
      totalPausedTimeRef.current = 0;

      while (isStarted && !isCompleted) {
        if (isPaused) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          continue;
        }

        const now = Date.now();
        const elapsed =
          (now - (startTimeRef.current || now) - totalPausedTimeRef.current) /
          1000;

        if (elapsed >= pattern.duration) {
          handleComplete();
          return;
        }

        // Inhale
        updateBreathingState("inhale");
        await new Promise((resolve) =>
          setTimeout(resolve, pattern.inhale * 1000)
        );

        if (isPaused) continue;

        // Hold in if specified
        const holdInTime = pattern.holdIn ?? 0;
        if (holdInTime > 0) {
          updateBreathingState("holdIn");
          await new Promise((resolve) =>
            setTimeout(resolve, holdInTime * 1000)
          );
        }

        if (isPaused) continue;

        // Exhale
        updateBreathingState("exhale");
        await new Promise((resolve) =>
          setTimeout(resolve, pattern.exhale * 1000)
        );

        if (isPaused) continue;

        // Hold out if specified
        const holdOutTime = pattern.holdOut ?? 0;
        if (holdOutTime > 0) {
          updateBreathingState("holdOut");
          await new Promise((resolve) =>
            setTimeout(resolve, holdOutTime * 1000)
          );
        }
      }
    };

    breathingCycle();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      setIsStarted(false);
      if (isCompleted) {
        onComplete?.();
      }
    };
  }, [isStarted, pattern, onComplete, onStateChange, isCompleted, isPaused]);

  const handleStart = () => {
    setIsStarted(true);
    setIsCompleted(false);
    setIsPaused(false);
    totalPausedTimeRef.current = 0;
    updateBreathingState("inhale");
    onStart?.();
  };

  const handleComplete = () => {
    setIsStarted(false);
    setIsCompleted(true);
    setIsPaused(false);
    onComplete?.();
  };

  return (
    <div className="breathing-container">
      <div
        className={`breathing-circle ${breathingState}`}
        onClick={!isStarted ? handleStart : undefined}
        style={{ cursor: !isStarted ? "pointer" : "default" }}
      />
      <div className="instruction">
        {!isStarted ? (
          "Start"
        ) : isPaused ? (
          "Paused"
        ) : (
          <>
            {breathingState === "inhale" && "Inhale"}
            {breathingState === "holdIn" && "Hold"}
            {breathingState === "exhale" && "Exhale"}
            {breathingState === "holdOut" && "Hold"}
          </>
        )}
      </div>
    </div>
  );
};
