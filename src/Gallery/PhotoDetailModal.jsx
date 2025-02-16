import React from 'react';
import styles from './PhotoDetailModal.module.css'

const PhotoDetailModal = ({photo,onClose}) => {
    return (
        <div onClick={onClose} className={styles.backdrop}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} >
                    ✖ 닫기
                </button>
                <img src={photo.url} alt={photo.name} />

            </div>
        </div>
    );
};

export default PhotoDetailModal;