import React, { forwardRef } from 'react';
import "./Select.css"

export const Select = forwardRef(({ label, error, multiple, options, ...props }, ref) => {
  return (
    <div className="input-group">
      {label && <label>{label}</label>}
      <select
        ref={ref}
        multiple={multiple}
        {...props}
        >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="error-message">{error.message}</span>}
    </div>
  );
});