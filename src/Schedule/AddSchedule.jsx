import React, { useState } from "react";
import styles from './AddSchedule.module.css'
import ErrorModal from "../ui/Modal/ErrorModal.jsx";

import ScheduleDate from "./ScheduleDate.jsx";

const AddSchedule = ({addSchedule, tripStartDate, tripEndDate}) => {


  const [enteredTitle,setEnteredTitle] = useState("");
  const [enteredStartDate,setEnteredStartDate] =useState('');
  const [enteredStartTime,setEnteredStartTime] =useState('');
  const [enteredEndDate,setEnteredEndDate] =useState('');
  const [enteredEndTime,setEnteredEndTime] =useState('');



  const handleTitleInput = e =>{
    setEnteredTitle(e.target.value);
  };
  const handleStartDateInput = e => {
    setEnteredStartDate(e.target.value);
  }
  const handleStartTimeInput = e => {
    setEnteredStartTime(e.target.value);
  }
  const handleEndDateInput = e => {
    setEnteredEndDate(e.target.value);
  }
  const handleEndTimeInput = e => {
    setEnteredEndTime(e.target.value);
  }


  const handleSubmit = e => {
    e.preventDefault();

    addSchedule(enteredTitle,enteredStartDate,enteredStartTime,enteredEndDate,enteredEndTime);

    setEnteredTitle('');
    setEnteredStartDate('');
    setEnteredStartTime('');
    setEnteredEndDate('');
    setEnteredEndTime('');

  }


  return (
    <>

      <form className={styles.addScheduleContainer} onSubmit={handleSubmit}>
        <label>일정 제목: </label>
        <input type="text" placeholder="일정 제목" onInput={handleTitleInput} value={enteredTitle}/>
        <label> 시작날짜: </label>
        <input type="date" onChange={handleStartDateInput} value={enteredStartDate} min={tripStartDate} max={tripEndDate}/>
        <label> 시작시간: </label>
        <input type="time" onChange={handleStartTimeInput} value={enteredStartTime}/>
        <label> 종료날짜: </label>
        <input type="date" onChange={handleEndDateInput} value={enteredEndDate} min={enteredStartDate} max={tripEndDate}/>
        <label> 종료시간: </label>
        <input type="time" onChange={handleEndTimeInput} value={enteredEndTime}/>
        <button type="submit">➕ 추가</button>
      </form>
    </>
  );
};

export default AddSchedule;