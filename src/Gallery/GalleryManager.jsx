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

  const handleAddPhoto = (url,uploadedAt) =>{
    const newPhoto = {
      id:photos.length + 1,
      url:url,
      uploadedAt: uploadedAt
    };
    setPhotos((photos) =>
    [...photos,newPhoto])
  };

  const removePhoto = (id) => {
    setPhotos(photos.filter((photo) => photo.id !== id));
  }

  return (
    <>
      <h1 >📸 Photo Book</h1>
      <PhotoUpload handleAddPhoto = {handleAddPhoto}/>
      <PhotoList photos ={photos} removePhoto ={removePhoto} />
    </>
  );
};

export default GalleryManager;