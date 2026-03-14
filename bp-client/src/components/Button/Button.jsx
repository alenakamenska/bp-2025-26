import React, { forwardRef } from 'react';
import './Button.css';

export const Button = forwardRef(({ text, onClick, variant = 'primary', disabled, type }, ref) => {
  return (
    <button 
      ref={ref} 
      onClick={onClick} 
      className={`btn btn-${variant}`} 
      disabled={disabled}
      type={type}
    >
      {text}
    </button>
  );
});