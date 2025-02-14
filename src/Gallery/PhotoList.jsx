import React from 'react';
import PhotoItem from "./PhotoItem.jsx";

const PhotoList = ({photos, removePhoto }) => {

  return (
    <>
      {photos.length === 0 ?(
        <p>공유할 사진을 올려주세요</p>
        ): (
          <form>
            {photos.map((photo) => (
          <PhotoItem key={photo.id} photo={photo} onDelete={() => removePhoto(photo.id)}/>
        ))}
      </form>

      )}

    </>
  );
};

export default PhotoList;