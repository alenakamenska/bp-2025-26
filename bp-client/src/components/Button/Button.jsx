import React, { forwardRef } from 'react';
import './Button.css';

export const Button = forwardRef(({ text, onClick, variant = 'primary' }, ref) => {
  return (
    <button 
      ref={ref} 
      onClick={onClick} 
      className={`btn btn-${variant}`} 
    >
      {text}
    </button>
  );
});