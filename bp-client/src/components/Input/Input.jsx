import React, { forwardRef } from 'react';
import './Input.css'; 

export const Input = forwardRef(({ label, error, type = "text", ...props }, ref) => {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <input
        ref={ref}
        type={type}
        {...props}
      />
      {error && <span className="error-message">{error.message || "Povinný údaj"}</span>}
    </div>
  );
});