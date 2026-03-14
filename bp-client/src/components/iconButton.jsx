import React from "react";

const IconButton = ({ icon: Icon, color = "#fff", size = 24, bg = "transparent", onClick }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: bg,
        border: "none",
        borderRadius: "50%",
        padding: "0.5rem",
        cursor: "pointer",
        flexShrink: 0,
        color: color
      }}
    >
      {Icon && <Icon size={size} color={color} />}    
    </button>
  );
};

export default IconButton;
