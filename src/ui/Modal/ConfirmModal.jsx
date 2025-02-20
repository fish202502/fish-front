import React from 'react';
import styles from './DeleteConfirmModal.module.css'

const DeleteConfirmModal = ({title, message, onClose, onConfirm, onCancel}) => {
  return (
    <div onClick={onCancel} className={styles.backdrop}>

      <div className={styles.modal}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>
        <button onClick={onConfirm} className={styles.button}>예</button>
        <button onClick ={onCancel} className={styles.button}>아니오</button>
      </div>


    </div>

  );
};

export default DeleteConfirmModal;