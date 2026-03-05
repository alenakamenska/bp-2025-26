import React, { forwardRef } from "react";
import "./TextArea.css";

export const TextArea = forwardRef(({ label, error, rows = 4, ...props }, ref) => {
  return (
    <div className="input-group">
      {label && <label>{label}</label>}
      <textarea
        ref={ref}
        className={`custom-textarea ${error ? "input-error" : ""}`}
        rows={rows}
        {...props}
      />
      {error && <span className="error-message">{error.message}</span>}
    </div>
  );
});