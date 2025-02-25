import React from "react";
import styles from "./SendModal.module.css"; // CSS 모듈 임포트

export const SendModal = ({ onModal }) => {
  const handleSubmit = () => {
    onModal();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>전송되었습니다.</h2>
        <button onClick={handleSubmit} className={styles.modalSubmitButton}>
          확인
        </button>
      </div>
    </div>
  );
};
