import { useState, useEffect } from "react";
import type { BreathingPattern } from "./BreathingCircle";
import { getTemplates, saveTemplates } from "../utils/templates";
import AddTemplateModal from "./AddTemplateModal";
import "./Templates.css";

export type Exercise = {
  id: string;
  name: string;
  description: string;
  pattern: BreathingPattern;
};

interface TemplatesProps {
  onStartExercise: (pattern: BreathingPattern, name: string) => void;
}

const BreathingPatternVisualizer = ({
  pattern,
}: {
  pattern: Exercise["pattern"];
}) => {
  const totalDuration =
    pattern.inhale +
    (pattern.holdIn ?? 0) +
    pattern.exhale +
    (pattern.holdOut ?? 0);

  const getSegmentAngle = (duration: number) =>
    (duration / totalDuration) * 360;

  const segments = [
    {
      type: "inhale",
      duration: pattern.inhale,
      angle: getSegmentAngle(pattern.inhale),
    },
    ...(pattern.holdIn
      ? [
          {
            type: "holdIn",
            duration: pattern.holdIn,
            angle: getSegmentAngle(pattern.holdIn),
          },
        ]
      : []),
    {
      type: "exhale",
      duration: pattern.exhale,
      angle: getSegmentAngle(pattern.exhale),
    },
    ...(pattern.holdOut
      ? [
          {
            type: "holdOut",
            duration: pattern.holdOut,
            angle: getSegmentAngle(pattern.holdOut),
          },
        ]
      : []),
    {
      type: "duration",
      duration: pattern.duration,
      angle: 0, // Not used in visualization
    },
  ];

  let currentAngle = 0;
  const segmentPaths = segments.map((segment, index) => {
    const startAngle = currentAngle;
    currentAngle += segment.angle;

    const x1 = 50 + 40 * Math.cos(((startAngle - 90) * Math.PI) / 180);
    const y1 = 50 + 40 * Math.sin(((startAngle - 90) * Math.PI) / 180);
    const x2 = 50 + 40 * Math.cos(((currentAngle - 90) * Math.PI) / 180);
    const y2 = 50 + 40 * Math.sin(((currentAngle - 90) * Math.PI) / 180);

    const largeArcFlag = segment.angle > 180 ? 1 : 0;
    const path = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

    const segmentLabel =
      segment.type === "holdIn" || segment.type === "holdOut"
        ? "Hold"
        : segment.type === "inhale"
        ? "Inhale"
        : "Exhale";

    return (
      <g key={index}>
        <title>{`${segmentLabel} for ${segment.duration}s`}</title>
        <path d={path} className={`pattern-segment ${segment.type}`} />
      </g>
    );
  });

  return (
    <div className="pattern-visualizer">
      <div className="pattern-circle">
        <svg viewBox="0 0 100 100" className="pattern-svg">
          {segmentPaths}
          <circle cx="50" cy="50" r="35" className="pattern-center" />
          <text x="50" y="50" className="pattern-total">
            {totalDuration}s
          </text>
        </svg>
      </div>
      <div className="pattern-legend">
        {segments.map((segment, index) => (
          <div key={index} className="legend-item">
            <div className={`legend-color ${segment.type}`} />
            <span className="legend-label">
              {segment.type === "holdIn" || segment.type === "holdOut"
                ? "Hold"
                : segment.type === "inhale"
                ? "Inhale"
                : segment.type === "exhale"
                ? "Exhale"
                : "Duration"}
            </span>
            <span className="legend-duration">{segment.duration}s</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Templates = ({ onStartExercise }: TemplatesProps) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setExercises(getTemplates());
  }, []);

  const handleDeleteTemplate = (id: string) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      const updatedExercises = exercises.filter(
        (exercise) => exercise.id !== id
      );
      setExercises(updatedExercises);
      saveTemplates(updatedExercises);
    }
  };

  const handleAddTemplate = (pattern: BreathingPattern) => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: pattern.name,
      description: `${pattern.inhale}s inhale, ${pattern.holdIn}s hold, ${pattern.exhale}s exhale, ${pattern.holdOut}s rest`,
      pattern,
    };

    const updatedExercises = [...exercises, newExercise];
    setExercises(updatedExercises);
    saveTemplates(updatedExercises);
    setIsModalOpen(false);
  };

  return (
    <div className="templates-container">
      <div className="templates-header">
        <h1>Breathing Templates</h1>
        <button
          className="add-template-button"
          onClick={() => setIsModalOpen(true)}
          aria-label="Add new template"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 5V19M5 12H19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <div className="templates-grid">
        {exercises.map((exercise) => (
          <div
            key={exercise.id}
            className="template-card"
            onClick={() => onStartExercise(exercise.pattern, exercise.name)}
            style={{ cursor: "pointer" }}
          >
            <div className="template-header">
              <h2>{exercise.name}</h2>
              <button
                className="delete-template-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTemplate(exercise.id);
                }}
                title="Delete template"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <p className="description">{exercise.description}</p>
            <BreathingPatternVisualizer pattern={exercise.pattern} />
            <button
              className="start-button"
              onClick={(e) => {
                e.stopPropagation();
                onStartExercise(exercise.pattern, exercise.name);
              }}
            >
              Start Exercise
            </button>
          </div>
        ))}
      </div>

      <AddTemplateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddTemplate}
      />
    </div>
  );
};
