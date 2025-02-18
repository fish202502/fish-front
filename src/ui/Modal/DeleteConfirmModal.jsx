import React from 'react';
import styles from './DeleteConfirmModal.module.css'

const DeleteConfirmModal = ({onConfirm, onCancel}) => {
  return (
      <div onClick={onCancel} className={styles.backdrop}>

      <div className={styles.modal}>
        <h2>삭제 확인</h2>
        <p>정말로 삭제하시겠습니까?</p>
        <button onClick={onConfirm}>예</button>
        <button onClick ={onCancel}>아니오</button>
      </div>


      </div>

  );
};

export default DeleteConfirmModal;