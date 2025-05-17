import React, { useState } from "react";
import type { BreathingPattern } from "./BreathingCircle";
import "./AddTemplateModal.css";

interface AddTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pattern: BreathingPattern) => void;
}

const AddTemplateModal: React.FC<AddTemplateModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState("");
  const [inhale, setInhale] = useState(4);
  const [holdIn, setHoldIn] = useState(0);
  const [exhale, setExhale] = useState(4);
  const [holdOut, setHoldOut] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const pattern: BreathingPattern = {
      name: name.trim(),
      inhale,
      holdIn,
      exhale,
      holdOut,
      duration: inhale + holdIn + exhale + holdOut,
    };

    onSave(pattern);
    // Reset form
    setName("");
    setInhale(4);
    setHoldIn(0);
    setExhale(4);
    setHoldOut(0);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Template</h2>
          <button
            className="close-button"
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Template Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter template name"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="inhale">Inhale Duration (seconds)</label>
              <input
                id="inhale"
                type="number"
                min="1"
                max="20"
                value={inhale}
                onChange={(e) =>
                  setInhale(
                    Math.max(1, Math.min(20, parseInt(e.target.value) || 1))
                  )
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="holdIn">Hold In Duration (seconds)</label>
              <input
                id="holdIn"
                type="number"
                min="0"
                max="20"
                value={holdIn}
                onChange={(e) =>
                  setHoldIn(
                    Math.max(0, Math.min(20, parseInt(e.target.value) || 0))
                  )
                }
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="exhale">Exhale Duration (seconds)</label>
              <input
                id="exhale"
                type="number"
                min="1"
                max="20"
                value={exhale}
                onChange={(e) =>
                  setExhale(
                    Math.max(1, Math.min(20, parseInt(e.target.value) || 1))
                  )
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="holdOut">Hold Out Duration (seconds)</label>
              <input
                id="holdOut"
                type="number"
                min="0"
                max="20"
                value={holdOut}
                onChange={(e) =>
                  setHoldOut(
                    Math.max(0, Math.min(20, parseInt(e.target.value) || 0))
                  )
                }
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="submit" className="save-button">
              Save Template
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTemplateModal;
