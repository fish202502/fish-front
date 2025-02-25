import React, {useState, useEffect} from 'react';
import PhotoList from "./PhotoList.jsx";
import PhotoUpload from "./PhotoUpload.jsx";
import PhotoDetailModal from "./PhotoDetailModal.jsx";
import styles from "./GalleryManager.module.css"
import DeleteConfirmModal from "../ui/Modal/DeleteConfirmModal.jsx";

const GalleryManager = () => {
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [deletePhoto, setDeletePhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  // API 상수
  const ROOM_CODE = '7340c7bb';
  const URL_ID = '174037426298d6e418';
  const API_BASE_URL = 'http://localhost:8999/api/fish/photo';
  const IMAGE_BASE_URL = 'http://localhost:8999';

  // 컴포넌트가 처음 마운트될 때 이미지 목록을 가져옵니다
  useEffect(() => {
    fetchPhotos();
  }, []);

  // 이미지 URL 처리 헬퍼 함수
  const processImageUrl = (url) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `${IMAGE_BASE_URL}${url.startsWith('/') ? url : '/' + url}`;
  };

  // 이미지 목록 조회 함수
  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${ROOM_CODE}/${URL_ID}`);
      if (!response.ok) throw new Error('사진을 조회하는데 실패했습니다.');

      const data = await response.json();
      const transformedPhotos = data
        .map(photo => ({
          id: photo.imageId,
          url: processImageUrl(photo.url),
          uploadedAt: photo.createdAt || new Date().toISOString()
        }))
        // 업로드 시간 역순으로 정렬 (최신 순)
        .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

      setPhotos(transformedPhotos);
    } catch (error) {
      console.error('사진 조회 에러:', error);
    } finally {
      setLoading(false);
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

      // 서버 응답 후 반드시 사진 목록 다시 불러오기
      await fetchPhotos();
    } catch (error) {
      console.error('업로드 사진 에러:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const confirmDeletePhoto = (id) => {
    setDeletePhoto(id);
  }

  // 실제 삭제를 수행하는 함수
  const removePhoto = async () => {
    if (deletePhoto !== null) {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/${ROOM_CODE}/${URL_ID}/${deletePhoto}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('사진삭제에 실패했습니다');

        // 삭제 후 반드시 사진 목록 다시 불러오기
        await fetchPhotos();
      } catch (error) {
        console.error('사진 삭제 에러:', error);
      } finally {
        setDeletePhoto(null);
        setLoading(false);
      }
    }
  };

  return (
    <div className={styles.full_container}>
      {deletePhoto !== null && (
        <DeleteConfirmModal
          title="사진삭제"
          message="정말로 사진을 삭제하시겠습니까?"
          onConfirm={removePhoto}
          onClose={() => setDeletePhoto(null)}
        />
      )}
      <div className={styles.diaryContainer}>
        <h1 className={styles.title}>Photo Book </h1>
        <div className={styles.uploadContainer}>
          <PhotoUpload
            handleAddPhoto={handleAddPhoto}
            loading={loading}
          />
          <PhotoList
            photos={photos}
            removePhoto={confirmDeletePhoto}
            onPhotoClick={setSelectedPhoto}
          />

          {selectedPhoto && (
            <PhotoDetailModal
              photo={selectedPhoto}
              onClose={() => setSelectedPhoto(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GalleryManager;