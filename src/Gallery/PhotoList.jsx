import React from 'react';
import PhotoItem from "./PhotoItem.jsx";
import styles from "./PhotoList.module.css"

const PhotoList = ({photos, removePhoto, onPhotoClick }) => {

  return (
    <div className={styles.photoListContainer}>
      {photos.length === 0 ?(
        <p>공유할 사진을 올려주세요</p>
        ): (
          <div className={styles.photoList}>
            {photos.map((photo) => (
          <PhotoItem key={photo.id.toString()} photo={photo} onDelete={() => removePhoto(photo.id)} onPhotoClick ={onPhotoClick}/>
        ))}
      </div>

      )}

    </div>
  );
};

export default PhotoList;