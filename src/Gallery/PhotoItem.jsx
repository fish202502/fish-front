import React from 'react';

const PhotoItem = ({photo,onDelete}) => {
  return (
    <>
      <img src={photo.url} alt={photo.name} />
      <button onClick={() => onDelete(photo.id)} >
        삭제
      </button>

    </>
  );
};

export default PhotoItem;