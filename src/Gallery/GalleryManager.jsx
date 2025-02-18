import React, {useState} from 'react';
import PhotoList from "./PhotoList.jsx";
import PhotoUpload from "./PhotoUpload.jsx";
import flower from '../assets/img/flower.jpg';
import forest from '../assets/img/forest.jpg';
import fruit from '../assets/img/fruit.jpg';
import horse from '../assets/img/horse.jpg';
import rock from '../assets/img/rock.jpg';
import tea from '../assets/img/tea.jpg';
import wave from '../assets/img/wave.jpg';
import PhotoDetailModal from "./PhotoDetailModal.jsx";
import styles from "./GalleryManager.module.css"
import deleteConfirmModal from "../ui/Modal/DeleteConfirmModal.jsx";
import DeleteConfirmModal from "../ui/Modal/DeleteConfirmModal.jsx";


const DUMMY_PHOTOS = [
  {id:1, url:flower, uploadedAt:"2025-02-27" },
  {id:2, url:forest, uploadedAt:"2025-02-27" },
  {id:3, url:fruit, uploadedAt:"2025-02-27" },
  {id:4, url:horse, uploadedAt:"2025-02-28" },
  {id:5, url:rock, uploadedAt:"2025-02-28" },
  {id:6, url:tea, uploadedAt:"2025-02-28" },
  {id:7, url:wave, uploadedAt:"2025-02-28" },

]

const GalleryManager = () => {

  const [photos,setPhotos] = useState(DUMMY_PHOTOS);
  const [selectedPhoto,setSelectedPhoto] =useState(null);
  const [deletePhoto,setDeletePhoto] = useState(null);



  const handleAddPhoto = (fileURL) =>{
    const newPhoto = {
      id:photos.length + 1,
      url:fileURL,
      uploadedAt: Date.now()
    };
    setPhotos((photos) =>
    [...photos,newPhoto])
  };

  const confirmDeletePhoto =(id) =>{
    setDeletePhoto(id);
  }

  const removePhoto = (id) => {
    if(deletePhoto !== null){
      setPhotos(photos.filter((photo) => photo.id !== deletePhoto));
      setDeletePhoto(null);

    }


  }

  return (
    <>
      {deletePhoto !== null && (
        <DeleteConfirmModal onConfirm={removePhoto} onCancel={() => setDeletePhoto(null)}/>
      )}
      <PhotoUpload handleAddPhoto = {handleAddPhoto}/>
      <PhotoList photos ={photos} removePhoto ={confirmDeletePhoto} onPhotoClick = {setSelectedPhoto}/>
      {selectedPhoto && (
          <PhotoDetailModal  photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
      )}


    </>
  );
};

export default GalleryManager;