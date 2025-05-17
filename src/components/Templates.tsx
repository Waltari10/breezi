import type { BreathingPattern } from "./BreathingCircle";
import "./Templates.css";

type Exercise = {
  id: string;
  name: string;
  description: string;
  pattern: BreathingPattern;
};

const exercises: Exercise[] = [
  {
    id: "box-breath",
    name: "Box Breath",
    description: "Equal breathing pattern for stress reduction and focus",
    pattern: {
      inhale: 4,
      holdIn: 4,
      exhale: 4,
      holdOut: 4,
    },
  },
  {
    id: "hrv-breath",
    name: "HRV Breath",
    description: "Optimized for heart rate variability and relaxation",
    pattern: {
      inhale: 6,
      exhale: 6,
    },
  },
  {
    id: "test-exercise",
    name: "Test Exercise",
    description: "Balanced breathing with holds for mindfulness",
    pattern: {
      inhale: 6,
      holdIn: 2,
      exhale: 6,
      holdOut: 2,
    },
  },
];

interface TemplatesProps {
  onStartExercise: (pattern: BreathingPattern) => void;
}

export const Templates = ({ onStartExercise }: TemplatesProps) => {
  const formatPattern = (pattern: Exercise["pattern"]) => {
    const parts = [];
    if (pattern.inhale) parts.push(`${pattern.inhale}s in`);
    if (pattern.holdIn) parts.push(`${pattern.holdIn}s hold`);
    if (pattern.exhale) parts.push(`${pattern.exhale}s out`);
    if (pattern.holdOut) parts.push(`${pattern.holdOut}s hold`);
    return parts.join(", ");
  };

  return (
    <div className="templates-container">
      <h1>Breathing Templates</h1>
      <div className="templates-grid">
        {exercises.map((exercise) => (
          <div key={exercise.id} className="template-card">
            <h2>{exercise.name}</h2>
            <p className="description">{exercise.description}</p>
            <div className="pattern">
              <span className="pattern-label">Pattern:</span>
              <span className="pattern-value">
                {formatPattern(exercise.pattern)}
              </span>
            </div>
            <button
              className="start-button"
              onClick={() => onStartExercise(exercise.pattern)}
            >
              Start Exercise
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
