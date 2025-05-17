import { useEffect, useState } from "react";
import type { ExerciseHistory } from "../utils/history";
import { getHistory, clearHistory, getStreakInfo } from "../utils/history";
import "./History.css";

const StreakDisplay = () => {
  const { streak, lastExerciseDate } = getStreakInfo();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastExerciseDay = lastExerciseDate ? new Date(lastExerciseDate) : null;
  if (lastExerciseDay) {
    lastExerciseDay.setHours(0, 0, 0, 0);
  }

  const needsExerciseToday = !lastExerciseDay || lastExerciseDay < today;

  return (
    <div className="streak-display">
      <div className="streak-info">
        <span className="streak-count">{streak}</span>
        <span className="streak-label">day streak</span>
      </div>
      {needsExerciseToday && (
        <div
          className="streak-warning"
          title="Complete an exercise today to maintain your streak!"
        >
          ⚠️
        </div>
      )}
    </div>
  );
};

export const History = () => {
  const [history, setHistory] = useState<ExerciseHistory[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const formatPattern = (pattern: ExerciseHistory["pattern"]) => {
    const parts = [];
    if (pattern.inhale) parts.push(`${pattern.inhale}s in`);
    if (pattern.holdIn) parts.push(`${pattern.holdIn}s hold`);
    if (pattern.exhale) parts.push(`${pattern.exhale}s out`);
    if (pattern.holdOut) parts.push(`${pattern.holdOut}s hold`);
    return parts.join(", ");
  };

  const handleClearHistory = () => {
    if (
      window.confirm("Are you sure you want to clear your exercise history?")
    ) {
      clearHistory();
      setHistory([]);
    }
  };

  if (history.length === 0) {
    return (
      <div className="history-container">
        <h1>Exercise History</h1>
        <StreakDisplay />
        <div className="empty-state">
          <p>No exercises completed yet</p>
          <p className="subtitle">Your completed exercises will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <h1>Exercise History</h1>
        <div className="header-actions">
          <StreakDisplay />
          <button className="clear-button" onClick={handleClearHistory}>
            Clear History
          </button>
        </div>
      </div>
      <div className="history-list">
        {history.map((entry) => (
          <div key={entry.id} className="history-card">
            <div className="history-card-header">
              <h2>{entry.name}</h2>
              <span className="timestamp">{formatDate(entry.completedAt)}</span>
            </div>
            <div className="history-card-details">
              <div className="detail">
                <span className="label">Pattern:</span>
                <span className="value">{formatPattern(entry.pattern)}</span>
              </div>
              <div className="detail">
                <span className="label">Duration:</span>
                <span className="value">{formatDuration(entry.duration)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
