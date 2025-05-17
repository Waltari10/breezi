import { useEffect, useState } from "react";
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

  const updateBreathingState = (newState: BreathingState) => {
    setBreathingState(newState);
    onStateChange?.(newState);
  };

  useEffect(() => {
    if (!isStarted) return;

    const breathingCycle = async () => {
      while (isStarted) {
        // Inhale
        updateBreathingState("inhale");
        await new Promise((resolve) =>
          setTimeout(resolve, pattern.inhale * 1000)
        );

        // Hold in if specified
        const holdInTime = pattern.holdIn ?? 0;
        if (holdInTime > 0) {
          updateBreathingState("holdIn");
          await new Promise((resolve) =>
            setTimeout(resolve, holdInTime * 1000)
          );
        }

        // Exhale
        updateBreathingState("exhale");
        await new Promise((resolve) =>
          setTimeout(resolve, pattern.exhale * 1000)
        );

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
      setIsStarted(false);
      if (onComplete) {
        onComplete();
      }
    };
  }, [isStarted, pattern, onComplete, onStateChange]);

  const handleStart = () => {
    setIsStarted(true);
    updateBreathingState("inhale");
    onStart?.();
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
