import React from 'react';
import styles from './ErrorModal.module.css'

const ErrorModal = ({title,message,closeModal,onConfirm}) => {
  return (
    <>
      <div onClick={closeModal} className={styles.backdrop}>

      <div className={styles.modal} onClick ={(e) =>e.stopPropagation()}>
        <h2 className={styles.title}>{title}</h2>
        <p className ={styles.message}>{message}</p>
        <button className={styles.button} onClick={onConfirm}>확인</button>
        <button className={styles.button} onClick={closeModal}>취소</button>
      </div>

      </div>
    </>
  );
};

export default ErrorModal;