import React, { useState } from "react";
import "./AddFinancial.css";
import ErrorModal from "./ErrorModal";

const AddFinancial = ({ addFinancial }) => {
  const [enteredName, setEnteredName] = useState("");
  const [enteredTitle, setEnteredTitle] = useState("");
  const [enteredExpense, setEnteredExpense] = useState("");
  const [enteredTime, setEnteredTime] = useState("");
  const [enteredDate, setEnteredDate] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!enteredName.trim() || enteredExpense < 1) {
      alert("이름과 금액을 올바르게 입력하세요!");
      return;
    }
    setModalOpen(true); // 모달 열기
  };

  const handleConfirmAdd = () => {
    addFinancial(enteredName, enteredTitle, enteredExpense, enteredDate, enteredTime);
    setEnteredName('');
    setEnteredTitle('');
    setEnteredExpense('');
    setEnteredTime('');
    setEnteredDate('');
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
