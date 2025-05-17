import type { Exercise } from "../components/Templates";

const STORAGE_KEY = "breezi-templates";

const defaultExercises: Exercise[] = [
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

export const getTemplates = (): Exercise[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    // Initialize with default templates
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultExercises));
    return defaultExercises;
  }
  return JSON.parse(stored);
};

export const saveTemplates = (templates: Exercise[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
};

export const resetTemplates = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultExercises));
  return defaultExercises;
}; 