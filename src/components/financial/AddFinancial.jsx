import React, { useState } from "react";
import "./AddFinancial.css";
import ErrorModal from "./ErrorModal";

const AddFinancial = ({ addFinancial }) => {
  const [enteredName, setEnteredName] = useState("");
  const [enteredTitle, setEnteredTitle] = useState("");
  const [enteredExpense, setEnteredExpense] = useState("");
  const [enteredTime, setEnteredTime] = useState("");
  const [enteredDate, setEnteredDate] = useState("");
  const [previewImg, setPreviewImg] = useState(null); // Base64 문자열만 저장하도록 수정
  const [modalOpen, setModalOpen] = useState(false);

  // 이미지 처리 함수를 Base64만 사용하도록 수정
  const handlePreview = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImg(reader.result); // Base64 문자열 직접 저장
    };
    reader.readAsDataURL(file);

    e.target.value = ""; // 같은 파일 재선택 가능하도록 초기화
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!enteredName.trim() || enteredExpense < 1) {
      alert("이름과 금액을 올바르게 입력하세요!");
      return;
    }
    setModalOpen(true);
  };

  const imgOpenHandler = (e) => {
    console.log('이미지 클릭');
    
  }
  const handleConfirmAdd = () => {
    // Base64 문자열을 직접 img로 전달
    addFinancial(
      enteredName,
      enteredTitle,
      enteredExpense,
      enteredDate,
      enteredTime,
      previewImg
    );
    setEnteredName("");
    setEnteredTitle("");
    setEnteredExpense("");
    setEnteredTime("");
    setEnteredDate("");
    setPreviewImg(null);
    setModalOpen(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="이름"
          value={enteredName}
          onChange={(e) => setEnteredName(e.target.value)}
        />
        <input
          type="text"
          placeholder="일정 제목"
          value={enteredTitle}
          onChange={(e) => setEnteredTitle(e.target.value)}
        />
        <input
          type="number"
          placeholder="금액"
          value={enteredExpense}
          onChange={(e) => setEnteredExpense(Number(e.target.value))}
        />
        <input
          type="date"
          value={enteredDate}
          onChange={(e) => setEnteredDate(e.target.value)}
        />
        <input
          type="time"
          value={enteredTime}
          onChange={(e) => setEnteredTime(e.target.value)}
        />

        <input type="file" accept="image/*" onChange={handlePreview} />

        {previewImg && (
          <div>
            <img src={previewImg} alt="미리보기" className="preview-image"  onClick={imgOpenHandler}/>
            <button type="button" className="financialButton" onClick={() => setPreviewImg(null)}>
              ❌ 삭제
            </button>
          </div>
        )}

        <button className="financialButton" type="submit">➕ 추가</button>
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
