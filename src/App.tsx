import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import {
  BreathingCircle,
  type BreathingPattern,
} from "./components/BreathingCircle";
import { Navigation } from "./components/Navigation";
import { Templates } from "./components/Templates";
import { History } from "./components/History";
import { Settings } from "./components/Settings";
import { Breath } from "./components/Breath";
import { addToHistory } from "./utils/history";
import "./App.css";

type Tab = "breath" | "templates" | "history" | "settings";

const STORAGE_KEY = "breezi-selected-pattern";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = (location.pathname.slice(1) as Tab) || "breath";

  const [selectedPattern, setSelectedPattern] =
    useState<BreathingPattern | null>(() => {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    });

  const [currentExercise, setCurrentExercise] = useState<{
    name: string;
    startTime: number;
  } | null>(null);

  useEffect(() => {
    if (selectedPattern) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedPattern));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [selectedPattern]);

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
                pattern={selectedPattern ?? undefined}
                onComplete={handleExerciseComplete}
              />
            }
          />
          <Route
            path="/breath"
            element={
              <Breath
                pattern={selectedPattern ?? undefined}
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
