import { useState, useEffect } from "react";
import {
  BreathingCircle,
  type BreathingPattern,
} from "./components/BreathingCircle";
import { Navigation } from "./components/Navigation";
import { Templates } from "./components/Templates";
import { History } from "./components/History";
import { Settings } from "./components/Settings";
import { addToHistory } from "./utils/history";
import "./App.css";

type Tab = "breath" | "templates" | "history" | "settings";
const ACTIVE_TAB_KEY = "breezi-active-tab";

function App() {
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    const savedTab = localStorage.getItem(ACTIVE_TAB_KEY);
    return (savedTab as Tab) || "breath";
  });

  const [selectedPattern, setSelectedPattern] =
    useState<BreathingPattern | null>(null);
  const [currentExercise, setCurrentExercise] = useState<{
    name: string;
    startTime: number;
  } | null>(null);

  useEffect(() => {
    localStorage.setItem(ACTIVE_TAB_KEY, activeTab);
  }, [activeTab]);

  const handleStartExercise = (pattern: BreathingPattern, name: string) => {
    setSelectedPattern(pattern);
    setCurrentExercise({ name, startTime: Date.now() });
    setActiveTab("breath");
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

  const renderContent = () => {
    switch (activeTab) {
      case "breath":
        return (
          <BreathingCircle
            pattern={selectedPattern ?? undefined}
            onComplete={handleExerciseComplete}
          />
        );
      case "templates":
        return <Templates onStartExercise={handleStartExercise} />;
      case "history":
        return <History />;
      case "settings":
        return <Settings />;
      default:
        return <BreathingCircle />;
    }
  };

  return (
    <>
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="app-content">{renderContent()}</main>
    </>
  );
}

export default App;
