import { useState } from "react";
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

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = (location.pathname.slice(1) as Tab) || "breath";

  const [selectedPattern, setSelectedPattern] =
    useState<BreathingPattern | null>(null);
  const [currentExercise, setCurrentExercise] = useState<{
    name: string;
    startTime: number;
  } | null>(null);

  const handleTabChange = (tab: Tab) => {
    navigate(`/${tab}`);
  };

  const handleStartExercise = (pattern: BreathingPattern, name: string) => {
    setSelectedPattern(pattern);
    setCurrentExercise({ name, startTime: Date.now() });
    navigate("/breath");
  };

  const handleExerciseComplete = () => {
    if (currentExercise && selectedPattern) {
      const duration = Math.floor(
        (Date.now() - currentExercise.startTime) / 1000
      );
      addToHistory({
        name: currentExercise.name,
        pattern: selectedPattern,
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
