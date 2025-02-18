import React from 'react';
import styles from './ErrorModal.module.css'

const ErrorModal = ({title,message,onClose}) => {
    return (

            <div onClick={onClose} className={styles.backdrop}>

            <div className={styles.modal}>
                <h2>{title}</h2>
                <p>{message}</p>
                <button onClick={onClose}>확인</button>
            </div>


            </div>

    );
};

export default ErrorModal;