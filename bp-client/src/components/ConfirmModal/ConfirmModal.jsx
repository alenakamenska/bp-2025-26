import React from "react";
import "./ConfirmModal.css";
import { Button } from "../Button/Button";

export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <Button onClick={onClose} text="Zrušit"/>
          <Button onClick={onConfirm} text="Smazat" variant="danger"/>
        </div>
      </div>
    </div>
  );
};