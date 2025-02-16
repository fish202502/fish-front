import React from 'react';
import PhotoItem from "./PhotoItem.jsx";

const PhotoList = ({photos, removePhoto, onPhotoClick }) => {

  return (
    <>
      {photos.length === 0 ?(
        <p>공유할 사진을 올려주세요</p>
        ): (
          <div>
            {photos.map((photo) => (
          <PhotoItem key={photo.id} photo={photo} onDelete={() => removePhoto(photo.id)} onPhotoClick ={onPhotoClick}/>
        ))}
      </div>

      )}

    </>
  );
};

export default PhotoList;