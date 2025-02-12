import React, { useState } from "react";
import './AddFinancial.css';

const AddFinancial = ({ addFinancial }) => {
  const [enteredName, setEnteredName] = useState("");
  const [enteredTitle, setEnteredTitle] = useState("");
  const [enteredExpense, setEnteredExpense] = useState("");
  const [enteredTime, setEnteredTime] = useState("");
  const [enteredDate, setEnteredDate] = useState("");

  const handleNameInput = (e) => setEnteredName(e.target.value);
  const handleTitleInput = (e) => setEnteredTitle(e.target.value);
  const handleExpenseInput = (e) => setEnteredExpense(Number(e.target.value)); // 숫자로 변환
  const handleTimeInput = (e) => setEnteredTime(e.target.value);
  const handleDateInput = (e) => setEnteredDate(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();


    if (!enteredName.trim()) {
      alert("이름을 입력하세요!");
      return;
    }

    addFinancial(enteredName, enteredTitle, enteredExpense, enteredDate, enteredTime);
    
    setEnteredName('');
    setEnteredTitle('');
    setEnteredExpense('');
    setEnteredTime('');
    setEnteredDate('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="이름" onChange={handleNameInput} value={enteredName} />
      <input type="text" placeholder="일정 제목" onChange={handleTitleInput} value={enteredTitle} />
      <input type="number" placeholder="금액" onChange={handleExpenseInput} value={enteredExpense} />
      <input type="date" onChange={handleDateInput} value={enteredDate} />
      <input type="time" onChange={handleTimeInput} value={enteredTime} />
      <button type="submit">➕ 추가</button>
    </form>
  );
};

export default AddFinancial;
