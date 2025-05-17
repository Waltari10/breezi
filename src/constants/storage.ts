export const STORAGE_KEYS = {
  TEMPLATES: "breezi-templates",
  SELECTED_PATTERN: "breezi-selected-pattern",
  HISTORY: "breezi-history",
} as const;

export const DEFAULT_PATTERN = {
  inhale: 6,
  holdIn: 2,
  exhale: 6,
  holdOut: 2,
  name: "Default Exercise",
  duration: 300, // 5 minutes
} as const;

export const DEFAULT_TEMPLATES = [
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
      duration: 300,
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
      duration: 300,
    },
  },
] as const; 