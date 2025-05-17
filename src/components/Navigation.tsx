import { useState } from "react";
import "./Navigation.css";

type Tab = "breath" | "templates" | "history" | "settings";

interface NavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navigation">
      <div className="nav-content">
        <div className="nav-logo">
          <span className="logo-text">Breezi</span>
        </div>
        <button
          className="menu-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <div className={`menu-icon ${isOpen ? "open" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
        <div className={`nav-tabs ${isOpen ? "open" : ""}`}>
          <button
            className={`nav-tab ${activeTab === "breath" ? "active" : ""}`}
            onClick={() => {
              onTabChange("breath");
              setIsOpen(false);
            }}
          >
            Breath
          </button>
          <button
            className={`nav-tab ${activeTab === "templates" ? "active" : ""}`}
            onClick={() => {
              onTabChange("templates");
              setIsOpen(false);
            }}
          >
            Templates
          </button>
          <button
            className={`nav-tab ${activeTab === "history" ? "active" : ""}`}
            onClick={() => {
              onTabChange("history");
              setIsOpen(false);
            }}
          >
            History
          </button>
          <button
            className={`nav-tab ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => {
              onTabChange("settings");
              setIsOpen(false);
            }}
          >
            Settings
          </button>
        </div>
      </div>
    </nav>
  );
};
