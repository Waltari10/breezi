import type { BreathingPattern } from "../components/BreathingCircle";

export type ExerciseHistory = {
  id: string;
  name: string;
  pattern: BreathingPattern;
  completedAt: string;
  duration: number; // in seconds
};

const HISTORY_KEY = "breezi-exercise-history";
const MAX_HISTORY_ITEMS = 50;

export const getHistory = (): ExerciseHistory[] => {
  try {
    const history = localStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error("Error reading exercise history:", error);
    return [];
  }
};

export const addToHistory = (exercise: Omit<ExerciseHistory, "id" | "completedAt">) => {
  try {
    const history = getHistory();
    const newEntry: ExerciseHistory = {
      ...exercise,
      id: crypto.randomUUID(),
      completedAt: new Date().toISOString(),
    };

    // Add new entry at the beginning
    history.unshift(newEntry);

    // Keep only the most recent entries
    const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS);

    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));
    return newEntry;
  } catch (error) {
    console.error("Error saving exercise history:", error);
    return null;
  }
};

export const clearHistory = () => {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error("Error clearing exercise history:", error);
  }
};

export const getStreakInfo = () => {
  const history = getHistory();
  if (history.length === 0) return { streak: 0, lastExerciseDate: null };

  // Sort by date descending
  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );

  const lastExerciseDate = new Date(sortedHistory[0].completedAt);
  const today = new Date();
  
  // Reset time part for date comparison
  lastExerciseDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  // If last exercise was before today, streak is broken
  if (lastExerciseDate < today) {
    return { streak: 0, lastExerciseDate };
  }

  // Calculate streak
  let streak = 1;
  const currentDate = new Date(lastExerciseDate);
  currentDate.setDate(currentDate.getDate() - 1); // Move to previous day

  while (true) {
    const hasExerciseOnDate = sortedHistory.some(entry => {
      const entryDate = new Date(entry.completedAt);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === currentDate.getTime();
    });

    if (!hasExerciseOnDate) break;
    
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return { streak, lastExerciseDate };
}; 