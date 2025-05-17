import { useState } from "react";
import "./Navigation.css";

type Tab = "breath" | "templates" | "history" | "settings";

export const Navigation = () => {
  const [activeTab, setActiveTab] = useState<Tab>("breath");

  return (
    <nav className="navigation">
      <div className="nav-content">
        <button
          className={`nav-tab ${activeTab === "breath" ? "active" : ""}`}
          onClick={() => setActiveTab("breath")}
        >
          Breath
        </button>
        <button
          className={`nav-tab ${activeTab === "templates" ? "active" : ""}`}
          onClick={() => setActiveTab("templates")}
        >
          Templates
        </button>
        <button
          className={`nav-tab ${activeTab === "history" ? "active" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          History
        </button>
        <button
          className={`nav-tab ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          Settings
        </button>
      </div>
    </nav>
  );
};
