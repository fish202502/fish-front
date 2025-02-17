import React, { useState } from "react";
import "./AddFinancial.css";
import ErrorModal from "./ErrorModal";

const AddFinancial = ({ addFinancial }) => {
  const [enteredName, setEnteredName] = useState("");
  const [enteredTitle, setEnteredTitle] = useState("");
  const [enteredExpense, setEnteredExpense] = useState("");
  const [enteredTime, setEnteredTime] = useState("");
  const [enteredDate, setEnteredDate] = useState("");
  const [postImg, setPostImg] = useState(null); // 파일을 배열 대신 객체로 설정
  const [previewImg, setPreviewImg] = useState(null); // 미리보기 이미지를 하나의 파일로 처리
  const [modalOpen, setModalOpen] = useState(false);

  // 이미지 선택 시 실행되는 함수
  const handlePreview = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPostImg(file); // 하나의 파일 객체를 저장
      setPreviewImg(reader.result); // Base64로 미리보기 이미지 설정
    };
    reader.readAsDataURL(file);

    e.target.value = ""; // 같은 파일 선택 시 onChange 동작하도록 초기화
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!enteredName.trim() || enteredExpense < 1) {
      alert("이름과 금액을 올바르게 입력하세요!");
      return;
    }
    setModalOpen(true); // 모달 열기
  };

  const handleConfirmAdd = () => {
    addFinancial(enteredName, enteredTitle, enteredExpense, enteredDate, enteredTime, postImg);
    setEnteredName('');
    setEnteredTitle('');
    setEnteredExpense('');
    setEnteredTime('');
    setEnteredDate('');
    setPostImg(null); // 이미지 초기화
    setPreviewImg(null); // 미리보기 이미지 초기화
    setModalOpen(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="이름" value={enteredName} onChange={(e) => setEnteredName(e.target.value)} />
        <input type="text" placeholder="일정 제목" value={enteredTitle} onChange={(e) => setEnteredTitle(e.target.value)} />
        <input type="number" placeholder="금액" value={enteredExpense} onChange={(e) => setEnteredExpense(Number(e.target.value))} />
        <input type="date" value={enteredDate} onChange={(e) => setEnteredDate(e.target.value)} />
        <input type="time" value={enteredTime} onChange={(e) => setEnteredTime(e.target.value)} />

        {/* 이미지 업로드 */}
        <input type="file" accept="image/*" onChange={handlePreview} />
        
        {/* 미리보기 이미지 */}
        {previewImg && (
          <div>
            <img src={previewImg} alt="미리보기" className="preview-image" />
            <button type="button" onClick={() => { setPostImg(null); setPreviewImg(null); }}>❌ 삭제</button>
          </div>
        )}
        
        <button type="submit">➕ 추가</button>
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
