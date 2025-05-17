import { useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { BreathingCircle } from "./components/BreathingCircle";
import { Navigation } from "./components/Navigation";
import { Templates } from "./components/Templates";
import { History } from "./components/History";
import { Settings } from "./components/Settings";
import { Breath } from "./components/Breath";
import { addToHistory } from "./utils/history";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { STORAGE_KEYS, DEFAULT_PATTERN } from "./constants/storage";
import type { BreathingPattern, Tab, CurrentExercise } from "./types/breathing";
import "./App.css";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = (location.pathname.slice(1) as Tab) || "breath";

  const [selectedPattern, setSelectedPattern] =
    useLocalStorage<BreathingPattern | null>(
      STORAGE_KEYS.SELECTED_PATTERN,
      null
    );

  const [currentExercise, setCurrentExercise] =
    useState<CurrentExercise | null>(null);

  const handleTabChange = (tab: Tab) => {
    navigate(`/${tab}`);
  };

  const handleStartExercise = (pattern: BreathingPattern, name: string) => {
    const newPattern = { ...pattern, name };
    setSelectedPattern(newPattern);
    setCurrentExercise({ name, startTime: Date.now() });
    navigate("/breath");
  };

  const handleExerciseComplete = () => {
    if (currentExercise && selectedPattern) {
      const duration = Math.floor(
        (Date.now() - currentExercise.startTime) / 1000
      );
      addToHistory({
        name: selectedPattern.name,
        pattern: { ...selectedPattern, duration },
        duration,
      });
      setCurrentExercise(null);
    }
  };

  return (
    <>
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
      <main className="app-content">
        <Routes>
          <Route
            path="/"
            element={
              <BreathingCircle
                pattern={selectedPattern ?? DEFAULT_PATTERN}
                onComplete={handleExerciseComplete}
              />
            }
          />
          <Route
            path="/breath"
            element={
              <Breath
                pattern={selectedPattern ?? DEFAULT_PATTERN}
                onComplete={handleExerciseComplete}
              />
            }
          />
          <Route
            path="/templates"
            element={<Templates onStartExercise={handleStartExercise} />}
          />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
