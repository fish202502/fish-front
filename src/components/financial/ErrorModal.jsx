import React from "react";
import "./ErrorModal.css";

const ErrorModal = ({ title, message, closeModal, onConfirm }) => {
  return (
    <div className="modal-background" onClick={closeModal}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <h2>{title}</h2>
          <p>{message}</p>
          <div className="button-group">
            <button className="modal-close-btn"  onClick={closeModal}>
              취소
            </button>
            <button className="modal-confirm-btn" onClick={onConfirm}>
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
