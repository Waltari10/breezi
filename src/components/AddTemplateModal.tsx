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
  const [holdIn, setHoldIn] = useState(4);
  const [exhale, setExhale] = useState(4);
  const [holdOut, setHoldOut] = useState(4);
  const [duration, setDuration] = useState(300); // 5 minutes default

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const pattern: BreathingPattern = {
      name: name.trim(),
      inhale,
      holdIn,
      exhale,
      holdOut,
      duration,
    };

    onSave(pattern);
    // Reset form
    setName("");
    setInhale(4);
    setHoldIn(4);
    setExhale(4);
    setHoldOut(4);
    setDuration(300);
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
              <label htmlFor="inhale">Inhale (seconds)</label>
              <input
                id="inhale"
                type="number"
                value={inhale}
                onChange={(e) => setInhale(Number(e.target.value))}
                min="1"
                max="20"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="holdIn">Hold In (seconds)</label>
              <input
                id="holdIn"
                type="number"
                value={holdIn}
                onChange={(e) => setHoldIn(Number(e.target.value))}
                min="0"
                max="20"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="exhale">Exhale (seconds)</label>
              <input
                id="exhale"
                type="number"
                value={exhale}
                onChange={(e) => setExhale(Number(e.target.value))}
                min="1"
                max="20"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="holdOut">Hold Out (seconds)</label>
              <input
                id="holdOut"
                type="number"
                value={holdOut}
                onChange={(e) => setHoldOut(Number(e.target.value))}
                min="0"
                max="20"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="duration">Exercise Duration (seconds)</label>
            <input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              min="60"
              max="3600"
              step="30"
              required
            />
            <small>Enter duration in seconds (1-60 minutes)</small>
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
