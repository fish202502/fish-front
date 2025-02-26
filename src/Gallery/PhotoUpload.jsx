import React, {useState, useRef} from 'react';
import ErrorModal from "../ui/Modal/ErrorModal.jsx"
import styles from "./PhotoUpload.module.css"
import DeleteConfirmModal from "../ui/Modal/DeleteConfirmModal.jsx";

const PhotoUpload = ({handleAddPhoto}) => {

  const [enteredFile,setEnteredFile] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  // 에러의 데이터를 관리하는 상태변수
  const [error,setError] = useState(null);
  const fileInputRef = useRef(null);

  const fileChangeHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError({
          title: '유효하지 않은 입력값',
          message: '이미지 파일만 업로드 할 수 있습니다.'
        });
        fileInputRef.current.value = "";
        return;
      }
      // 파일 선택 시 바로 enteredFile 설정 및 모달 표시
      setEnteredFile(file);
      setShowConfirmModal(true);
    }
  };


  const confirmUpload = () => {
    handleAddPhoto(enteredFile);
    resetForm();
  };

  const cancelUpload = () => {
    setShowConfirmModal(false);
    resetForm();
  };

  const resetForm = () => {
    setEnteredFile(null);
    setShowConfirmModal(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const closeErrorModal = () => {
    setError(null);
  };

  return (
    <>
      {error && <ErrorModal title={error.title} message={error.message} onClose={closeErrorModal}/>}
      {showConfirmModal && (
        <DeleteConfirmModal
          title="사진 추가"
          message="이미지를 추가하시겠습니까?"
          onConfirm={confirmUpload}
          onClose={cancelUpload}
        />
      )}
      <div className={styles.container}>
        <div className={styles.addContainer}>
        {/* 파일 업로드 라벨 추가 */}
        <label htmlFor="fileUpload" className={styles.uploadLabel}>
          이미지 추가
        </label>
        <input
          id="fileUpload"
          type="file"
          onChange={fileChangeHandler}
          ref={fileInputRef}
        />
        </div>
      </div>
    </>
  );
};

export default PhotoUpload;