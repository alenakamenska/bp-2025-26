import React from "react";
import "../Error/Error.css"

const Error = ({ serverErrors }) => {
  if (!Array.isArray(serverErrors) || serverErrors.length === 0) {
    return null;
  }

  return (
    <div className="server-error-container">
        {serverErrors.map((err, index) => (
            <div key={index}>{err.description}</div>
        ))}
    </div>
  );
};

export default Error;