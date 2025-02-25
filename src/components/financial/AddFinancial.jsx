import React, { useState } from "react";
import "./AddFinancial.css";
import ErrorModal from "../ui/Modal/ErrorModal"


const AddFinancial = ({ addFinancial }) => {
  const [formData, setFormData] = useState({
    spender: "",          // 지출자 이름
    description: "",      // 설명
    amount: "",           // 금액
    spendAt: ""           // 지출 시간
  });
  const [imageFile, setImageFile] = useState(null);  // 실제 파일 객체
  const [previewImg, setPreviewImg] = useState(null);  // 미리보기용 Base64
  const [modalOpen, setModalOpen] = useState(false);

  // 입력 필드 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 이미지 처리 함수
  const handlePreview = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);  // 파일 객체 저장

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImg(reader.result);  // 미리보기용 Base64
    };
    reader.readAsDataURL(file);

    e.target.value = "";  // 같은 파일 재선택 가능하도록 초기화
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.spender.trim() || !formData.amount) {
      alert("지출자와 금액을 올바르게 입력하세요!");
      return;
    }
    setModalOpen(true);
  };

  const handleConfirmAdd = () => {
    // FormData 객체 생성
    const submitFormData = new FormData();
    
    // JSON 데이터 생성
    const expenseData = {
      spender: formData.spender,
      description: formData.description,
      amount: Number(formData.amount),
      spendAt: formData.spendAt
    };
    
    // JSON 데이터를 Blob으로 변환하여 application/json 타입으로 추가
    const jsonBlob = new Blob([JSON.stringify(expenseData)], { type: 'application/json' });
    submitFormData.append('expense', jsonBlob);
    
    // 이미지가 있는 경우 추가
    if (imageFile) {
      submitFormData.append('images', imageFile);
    }
  
    // 데이터 전송
    addFinancial(submitFormData);
    
    // 폼 초기화
    setFormData({
      spender: "",
      description: "",
      amount: "",
      spendAt: ""
    });
    setPreviewImg(null);
    setImageFile(null);
    setModalOpen(false);
  };

  return (
    <>
      <form className="addForm"onSubmit={handleSubmit}>
        <input
          className="addInput"
          type="text"
          name="spender"
          placeholder="지출자 이름"
          value={formData.spender}
          onChange={handleChange}
        />
        <input
        className="addInput"
          type="text"
          name="description"
          placeholder="지출 내용"
          value={formData.description}
          onChange={handleChange}
        />
        <input
        className="addInput"
          type="number"
          name="amount"
          placeholder="금액"
          value={formData.amount}
          onChange={handleChange}
        />
        <input
        className="addInput"
          type="datetime-local"
          name="spendAt"
          value={formData.spendAt}
          onChange={handleChange}
        />

        <input 
          type="file"
          name="images"
          accept="image/*" 
          value={formData.Images}
          onChange={handlePreview}
          className="file-upload-input" 
        />

        {previewImg && (
          <div>
            <img 
              src={previewImg} 
              alt="미리보기" 
              className="preview-image"
            />
            <button 
              type="button" 
              className="financialButton" 
              onClick={() => {
                setPreviewImg(null);
                setImageFile(null);
              }}
            >
              ❌ 삭제
            </button>
          </div>
        )}

        <button className="financialButton" type="submit">
          ➕ 추가
        </button>
      </form>

      {modalOpen && (
        <ErrorModal
          title="추가 확인"
          message="정말 추가하시겠습니까?"
          closeModal={() => setModalOpen(false)}
          onConfirm={handleConfirmAdd}
        />
      )}
    </>
  );
};

export default AddFinancial;