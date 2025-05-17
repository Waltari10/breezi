export type BreathingState = "inhale" | "holdIn" | "exhale" | "holdOut" | "idle";

export type BreathingPattern = {
  inhale: number;
  holdIn?: number;
  exhale: number;
  holdOut?: number;
  name: string;
  duration: number; // in seconds
};

export type Exercise = {
  id: string;
  name: string;
  description: string;
  pattern: BreathingPattern;
};

export type ExerciseHistory = {
  id: string;
  name: string;
  pattern: BreathingPattern;
  completedAt: string;
  duration: number; // in seconds
};

export type Tab = "breath" | "templates" | "history" | "settings";

export type CurrentExercise = {
  name: string;
  startTime: number;
}; 