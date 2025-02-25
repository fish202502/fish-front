import React, {useState,useEffect} from 'react';
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

  const [photos,setPhotos] = useState([]);
  const [selectedPhoto,setSelectedPhoto] =useState(null);
  const [deletePhoto,setDeletePhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  // API 상수
  const ROOM_CODE = '7340c7bb';
  const URL_ID = '174037426298d6e418';
  const API_BASE_URL = 'http://localhost:8999/api/fish/photo';

  // 컴포넌트가 처음 마운트될 때 이미지 목록을 가져옵니다
  useEffect(() => {
    fetchPhotos();
  }, []);

  // 이미지 목록 조회 함수
  const fetchPhotos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/${ROOM_CODE}/${URL_ID}`);
      if (!response.ok) throw new Error('사진을 조회하는데 실패했습니다.');

      const data = await response.json();
      // 서버에서 받은 데이터를 현재 구조에 맞게 변환합니다
      const transformedPhotos = data.map(photo => ({
        id: photo.imageId,
        url: photo.url,
        uploadedAt: new Date().toISOString().split('T')[0]
      }));
      console.log(transformedPhotos);

      setPhotos(transformedPhotos);
    } catch (error) {
      console.error('사진 조회 에러:', error);
    }
  };

  // 이미지 추가 함수 - PhotoUpload에서 호출됩니다
  const handleAddPhoto = async (file) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('images', file);

      const response = await fetch(`${API_BASE_URL}/${ROOM_CODE}/${URL_ID}`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || '사진을 업로드하는데 실패했습니다.');
      }

      const data = await response.json();
      console.log('Upload response:', data);

      // 새 이미지를 상태에 추가합니다
      const newPhoto = {
        id: data.imageId,
        url: data.url,
        uploadedAt: new Date().toISOString().split('T')[0]
      };
      console.log(newPhoto)

      // 새로운 사진을 추가한 후 목록을 다시 가져옵니다
      await fetchPhotos();
    } catch (error) {
      console.error('업로드 사진 에러:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const confirmDeletePhoto =(id) =>{
    setDeletePhoto(id);
  }

  // 실제 삭제를 수행하는 함수
  const removePhoto = async () => {
    if (deletePhoto !== null) {
      try {
        const response = await fetch(`${API_BASE_URL}/${ROOM_CODE}/${URL_ID}/${deletePhoto}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('사진삭제에 실패했습니다');

        // 백엔드와 상태 동기화를 위해 목록을 다시 가져옵니다
        await fetchPhotos();
      } catch (error) {
        console.error('사진 삭제 에러:', error);
      } finally {
        setDeletePhoto(null);
      }
    }
  };

  return (
    <div className={styles.full_container}>
      {deletePhoto !== null && (
        <DeleteConfirmModal title="사진삭제" message="정말로 사진을 삭제하시겠습니까?"  onConfirm={removePhoto} onClose={() => setDeletePhoto(null)}/>
      )}
      <div className={styles.diaryContainer}>

      <h1 className={styles.title}>Photo Book </h1>
      <div className={styles.uploadContainer}>
        <PhotoUpload handleAddPhoto={handleAddPhoto} lodaing={loading}/>
        <PhotoList photos={photos} removePhoto={confirmDeletePhoto} onPhotoClick={setSelectedPhoto}/>

        {selectedPhoto && (
            <PhotoDetailModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)}/>
        )}
      </div>

      </div>

    </div>
  );
};

export default GalleryManager;