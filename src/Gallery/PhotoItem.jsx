import React from 'react';

const PhotoItem = ({photo,onDelete,onPhotoClick}) => {
  return (
    <>
      <img src={photo.url} alt={photo.name} onClick={() => onPhotoClick(photo)}/>
      <button onClick={() => onDelete(photo.id)} >
        삭제
      </button>

    </>
  );
};

export default PhotoItem;