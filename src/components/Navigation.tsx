import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navigation.css";

type Tab = "breath" | "templates" | "history" | "settings";

interface NavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleTabClick = (tab: Tab) => {
    onTabChange(tab);
    setIsOpen(false);
  };

  return (
    <nav className="navigation">
      <div className="nav-content">
        <Link
          to="/"
          className="nav-logo"
          onClick={() => handleTabClick("breath")}
        >
          <span className="logo-text">Breezi</span>
        </Link>
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
          <Link
            to="/breath"
            className={`nav-tab ${activeTab === "breath" ? "active" : ""}`}
            onClick={() => handleTabClick("breath")}
          >
            Breath
          </Link>
          <Link
            to="/templates"
            className={`nav-tab ${activeTab === "templates" ? "active" : ""}`}
            onClick={() => handleTabClick("templates")}
          >
            Templates
          </Link>
          <Link
            to="/history"
            className={`nav-tab ${activeTab === "history" ? "active" : ""}`}
            onClick={() => handleTabClick("history")}
          >
            History
          </Link>
          <Link
            to="/settings"
            className={`nav-tab ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => handleTabClick("settings")}
          >
            Settings
          </Link>
        </div>
      </div>
    </nav>
  );
};
