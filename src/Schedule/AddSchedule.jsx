import React, { useState } from "react";
import styles from './AddSchedule.module.css'
import ErrorModal from "../ui/Modal/ErrorModal.jsx";

import ScheduleDate from "./ScheduleDate.jsx";

const AddSchedule = ({addSchedule, startDate, endDate}) => {


  const [enteredTitle,setEnteredTitle] = useState("");
  const [enteredTime,setEnteredTime] =useState("");
  const [enteredDate,setEnteredDate] =useState("");


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
    <>

      <form className={styles.addScheduleContainer}>
        <label>일정 제목: </label>
        <input type="text" placeholder="일정 제목" onInput={handleTitleInput} value={enteredTitle}/>
        <label> 날짜: </label>
        <input type="date" onInput={handleDateInput} value={enteredDate} min={startDate} max={endDate}/>
        <label> 시간: </label>
        <input type="time" onInput={handleTimeInput} value={enteredTime}/>
        <button type="submit" onClick={handleSubmit}>➕ 추가</button>
      </form>
    </>
  );
};

export default AddSchedule;