import React, { useEffect, useState } from 'react';
import './Toast.css';

const Toast = ({ id, message, type = 'info', onClose, duration = 30000 }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 300); // Match animation duration
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  return (
    <div className={`toast ${type} ${isExiting ? 'exit' : ''}`}>
      <div className="toast-icon">{getIcon()}</div>
      <div className="toast-content">{message}</div>
      <button className="toast-close" onClick={handleClose} aria-label="Close">
        ×
      </button>
      <div className="toast-progress"></div>
    </div>
  );
};

export default Toast;
