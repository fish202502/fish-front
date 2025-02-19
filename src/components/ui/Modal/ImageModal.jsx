import React from 'react';
import './ImageModal.css';

const ImageModal = ({ imageUrl, closeModal }) => {
  return (
    <div className="image-modal-overlay" onClick={closeModal}>
      <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="image-modal-close" onClick={closeModal}>×</button>
        <img 
          src={imageUrl} 
          alt="확대된 이미지" 
          className="image-modal-img" 
        />
      </div>
    </div>
  );
};

export default ImageModal;