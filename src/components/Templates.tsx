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
      name: "Box Breath",
      duration: 0,
    },
  },
  {
    id: "hrv-breath",
    name: "HRV Breath",
    description: "Optimized for heart rate variability and relaxation",
    pattern: {
      inhale: 6,
      exhale: 6,
      name: "HRV Breath",
      duration: 0,
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
      name: "Test Exercise",
      duration: 0,
    },
  },
];

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
                : "Exhale"}
            </span>
            <span className="legend-duration">{segment.duration}s</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Templates = ({ onStartExercise }: TemplatesProps) => {
  return (
    <div className="templates-container">
      <div className="templates-header">
        <h1>Breathing Templates</h1>
        <button className="add-template-button" title="Add custom template">
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
          <div key={exercise.id} className="template-card">
            <h2>{exercise.name}</h2>
            <p className="description">{exercise.description}</p>
            <BreathingPatternVisualizer pattern={exercise.pattern} />
            <button
              className="start-button"
              onClick={() => onStartExercise(exercise.pattern, exercise.name)}
            >
              Start Exercise
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
