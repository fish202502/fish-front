import React from 'react';
import styles from './PhotoItem.module.css'

const PhotoItem = ({photo,onDelete,onPhotoClick}) => {

  return (
    <>

      <div className={styles.image_container}>
        <img src={`http://localhost:8999${photo.url}`} alt={photo.name} onClick={() => onPhotoClick(photo)}/>
        <button className={styles.deleteBtn} onClick={() => onDelete(photo.id)} >
          X
        </button>

      </div>


    </>
  );
};

export default PhotoItem;