import React from 'react';
import './Loading.css';

const Loading = ({ message = "Načítám data..." }) => {
  return (
    <div className="spinner-wrapper">
      <div className="spinner"></div>
      <p className="spinner-text">{message}</p>
    </div>
  );
};

export default Loading;