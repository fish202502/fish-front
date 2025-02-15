import React, {useState, useRef} from 'react';
import ErrorModal from "../ui/Modal/ErrorModal.jsx"





const PhotoUpload = ({handleAddPhoto}) => {

  const [enteredFile,setEnteredFile] = useState(null);

  // 에러의 데이터를 관리하는 상태변수
  const [error,setError] = useState(null);

  const fileInputRef = useRef(null);




  const fileChangeHandler = (e) =>{
    const file = e.target.files[0];
    if (file) {
      setEnteredFile(file); // 상태 업데이트
    }
  }


  const handleSubmit =  (e) => {
    e.preventDefault();


    if(!enteredFile){
      setError({
        title: '유효하지 않은 입력값',
        message: '제목을 입력해주세요.'
      });
      return;
    }

    const fileURL = URL.createObjectURL(enteredFile);

    handleAddPhoto(fileURL);

    setEnteredFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

  };

  // 에러모달을 닫아주는 함수
  const closeModal = () =>{
    setError(null);
  };



  return (
    <>
      {error && <ErrorModal title = {error.title} message= {error.message} onClose = {closeModal}/>}
      <input type="file" onChange = {fileChangeHandler} />
        <button onClick ={handleSubmit}>
        업로드
        </button>

    </>
  );
};

export default PhotoUpload;