import "./Navigation.css";

type Tab = "breath" | "templates" | "history" | "settings";

interface NavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  return (
    <nav className="navigation">
      <div className="nav-content">
        <button
          className={`nav-tab ${activeTab === "breath" ? "active" : ""}`}
          onClick={() => onTabChange("breath")}
        >
          Breath
        </button>
        <button
          className={`nav-tab ${activeTab === "templates" ? "active" : ""}`}
          onClick={() => onTabChange("templates")}
        >
          Templates
        </button>
        <button
          className={`nav-tab ${activeTab === "history" ? "active" : ""}`}
          onClick={() => onTabChange("history")}
        >
          History
        </button>
        <button
          className={`nav-tab ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => onTabChange("settings")}
        >
          Settings
        </button>
      </div>
    </nav>
  );
};
