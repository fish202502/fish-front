import React from 'react';
import styles from './PhotoItem.module.css'

const PhotoItem = ({photo, onDelete, onPhotoClick, permission}) => {
  return (
    <div className={styles.image_container}>
      <img
        src={photo.url}
        alt={photo.name || 'Uploaded photo'}
        onClick={() => onPhotoClick(photo)}
      />
      {permission &&
      <button className={styles.deleteBtn} onClick={() => onDelete(photo.id)}>
        X
      </button>
      }
    </div>
  );
};

export default PhotoItem;