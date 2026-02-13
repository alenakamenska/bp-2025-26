import React from "react";
import "../Error/Error.css";

const Error = ({ serverErrors }) => {
  if (!Array.isArray(serverErrors) || serverErrors.length === 0) {
    return null;
  }

  return (
    <div className="server-error-container">
      {serverErrors.map((err, index) => (
        <div key={index}>
          {typeof err === "object" && err.description ? err.description : err}
        </div>
      ))}
    </div>
  );
};

export default Error;