import React, { useState } from "react";
import './AddSchedule.css'

const AddSchedule = ({addSchedule}) => {


  const [enteredTitle,setEnteredTitle] = useState("");

  const [enteredTime,setEnteredTime] =useState("");

  const [enteredDate,setEnteredDate] = useState("");

  const handleTitleInput = e =>{
    setEnteredTitle(e.target.value);
  };

  const handleTimeInput = e => {
    setEnteredTime(e.target.value);
  }

  const handleDateInput = e => {
    setEnteredDate(e.target.value);
  }

  const handleSubmit = e => {
    e.preventDefault();

    addSchedule(enteredTitle,enteredDate,enteredTime);

    setEnteredTitle('');
    setEnteredTime('');
    setEnteredDate('');
  }

  return (
    <form>
      <input type="text" placeholder="일정 제목" onInput={handleTitleInput} value={enteredTitle} />
      <input type="date" onInput={handleDateInput} value = {enteredDate}/>
      <input type="time" onInput={handleTimeInput} value ={enteredTime}/>
      <button type="submit" onClick={handleSubmit}>➕ 추가</button>
    </form>
  );
};

export default AddSchedule;