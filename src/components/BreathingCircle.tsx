import { useEffect, useState } from "react";
import "./BreathingCircle.css";

type BreathingState = "inhale" | "holdIn" | "exhale" | "holdOut" | "idle";

export const BreathingCircle = () => {
  const [breathingState, setBreathingState] = useState<BreathingState>("idle");
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    if (!isStarted) return;

    const breathingCycle = async () => {
      while (isStarted) {
        // Inhale for 6 seconds
        setBreathingState("inhale");
        await new Promise((resolve) => setTimeout(resolve, 6000));

        // Hold breath for 2 seconds
        setBreathingState("holdIn");
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Exhale for 6 seconds
        setBreathingState("exhale");
        await new Promise((resolve) => setTimeout(resolve, 6000));

        // Hold breath for 2 seconds
        setBreathingState("holdOut");
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    };

    breathingCycle();

    return () => {
      setIsStarted(false);
    };
  }, [isStarted]);

  const handleStart = () => {
    setIsStarted(true);
    setBreathingState("inhale");
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
