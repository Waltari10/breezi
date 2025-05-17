import { clearHistory } from "../utils/history";
import "./Settings.css";

export function Settings() {
  const handleClearHistory = () => {
    if (
      window.confirm(
        "Are you sure you want to clear your exercise history? This action cannot be undone."
      )
    ) {
      clearHistory();
      // Force a page reload to update all components
      window.location.reload();
    }
  };

  return (
    <div className="settings-container">
      <h1>Settings</h1>
      <div className="settings-section">
        <h2>Data Management</h2>
        <div className="settings-card">
          <div className="settings-card-content">
            <div className="settings-info">
              <h3>Clear Exercise History</h3>
              <p>
                Delete all your exercise history and streak data. This action
                cannot be undone.
              </p>
            </div>
            <button
              className="clear-history-button"
              onClick={handleClearHistory}
            >
              Clear History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
