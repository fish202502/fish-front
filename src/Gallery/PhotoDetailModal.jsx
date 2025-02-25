import React from 'react';
import styles from './PhotoDetailModal.module.css'

const PhotoDetailModal = ({photo, onClose}) => {
  return (
    <div onClick={onClose} className={styles.backdrop}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.image_container}>
          <button className={styles.deleteBtn} onClick={onClose}>
            ✖
          </button>
          <img src={photo.url} alt={photo.name || 'Detailed photo'} />
        </div>
      </div>
    </div>
  );
};

export default PhotoDetailModal;