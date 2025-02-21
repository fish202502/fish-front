import React from 'react';
import styles from './DeleteConfirmModal.module.css'

const DeleteConfirmModal = ({title,message, onConfirm, onClose}) => {
  return (
    <div onClick={onClose} className={styles.backdrop}>

      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>
        <button onClick={onConfirm} className={styles.button}>예</button>
        <button onClick={onClose} className={styles.button}>아니오</button>
      </div>


    </div>

  );
};

export default DeleteConfirmModal;