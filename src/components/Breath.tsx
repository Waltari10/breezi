import { useState } from "react";
import { BreathingCircle, type BreathingPattern } from "./BreathingCircle";
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
        <BreathingCircle pattern={currentPattern} onComplete={onComplete} />
      </div>
    </div>
  );
};
