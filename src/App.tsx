import { useState } from "react";
import {
  BreathingCircle,
  type BreathingPattern,
} from "./components/BreathingCircle";
import { Navigation } from "./components/Navigation";
import { Templates } from "./components/Templates";
import "./App.css";

type Tab = "breath" | "templates" | "history" | "settings";

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("breath");
  const [selectedPattern, setSelectedPattern] =
    useState<BreathingPattern | null>(null);

  const handleStartExercise = (pattern: BreathingPattern) => {
    setSelectedPattern(pattern);
    setActiveTab("breath");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "breath":
        return <BreathingCircle pattern={selectedPattern ?? undefined} />;
      case "templates":
        return <Templates onStartExercise={handleStartExercise} />;
      case "history":
        return <div className="placeholder">History coming soon</div>;
      case "settings":
        return <div className="placeholder">Settings coming soon</div>;
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
