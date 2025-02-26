import React, {useState, useEffect} from 'react';
import {useParams} from "react-router-dom";
import PhotoList from "./PhotoList.jsx";
import PhotoUpload from "./PhotoUpload.jsx";
import PhotoDetailModal from "./PhotoDetailModal.jsx";
import ErrorModal from "../ui/Modal/ErrorModal.jsx";
import styles from "./GalleryManager.module.css"
import DeleteConfirmModal from "../ui/Modal/DeleteConfirmModal.jsx";
import {PHOTO_API_URL} from "../config/host-config.js"

const GalleryManager = () => {
  // 권한 상태 추가
  const [permission,setPermission] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [deletePhoto, setDeletePhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,setError] = useState(null);
  // 라우터 파라미터 가져오기
  const {roomCode,url} =useParams();

  const API_BASE_URL = 'http://localhost:8999/api/fish/rooms'
  const IMAGE_BASE_URL = 'http://localhost:8999';

  useEffect(() => {
    const fetchPermission = async () =>{
      try{
        const response = await fetch (
          `${API_BASE_URL}/${roomCode}/${url}`,
          {
              method:"POST",
              headers:{"Content-Type":"application/json"},
          });
        const data = await response.json();
        console.log("권한 확인 응답",data);

        setPermission(true)
      }catch(error){
        console.log("권한확인중 오류 발생",error);
        handleError("권한 오류","권한 확인에 실패했습니다.");
        setPermission(false);
      }
    };
    fetchPermission();
  }, [roomCode,url]);

  // 컴포넌트가 처음 마운트될 때 이미지 목록을 가져옵니다
  useEffect(()=>{
    fetchPhotos();
  },[])

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
    const response = await fetch(`${PHOTO_API_URL}/${roomCode}/${url}`);
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
    // 권한이 없으면 함수 실행하지 않음
    if(!permission){
      handleError("권한없음","추가 권한이 없습니다.")
      return;
    }
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('images', file);

      const response = await fetch(`${PHOTO_API_URL}/${roomCode}/${url}`, {
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
    if(!permission){
      handleError("권한없음","삭제권한이 없습니다.");
      return;
    }
    if (deletePhoto !== null) {
      try {
        setLoading(true);
        const response = await fetch(`${PHOTO_API_URL}/${roomCode}/${url}/${deletePhoto}`, {
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

  const handleError = (title, message) => {
    setError({title, message});
  }

  // 모달 닫기 함수
  const closeErrorModal = () => {
    // 무조건 에러 상태 초기화
    setError(null);

  };

  return (
    <div className={styles.full_container}>
      {error && <ErrorModal title={error.title} message={error.message} onClose={closeErrorModal} />}
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
          {permission &&
          <PhotoUpload
            handleAddPhoto={handleAddPhoto}
            loading={loading}
          />
          }
          <PhotoList
            photos={photos}
            removePhoto={confirmDeletePhoto}
            onPhotoClick={setSelectedPhoto}
            permission ={permission}
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