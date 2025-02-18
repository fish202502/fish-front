import React, { useState } from "react";
import './AddSchedule.css'
import ErrorModal from "../ui/Modal/ErrorModal.jsx";
import DdayCounter from "./DdayCounter.jsx";
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

    // if(!enteredTitle.trim()){
    //   onError({
    //     title: '유효하지 않은 입력값',
    //   message: '제목을 입력해주세요.'
    //   });
    //   return;
    // }
    //
    // if(!enteredDate.trim()){
    //   onError({
    //     title: '유효하지 않은 시간',
    //     message: '시간을 입력해주세요.'
    //   });
    //   return;
    // }
    //
    //
    //
    // if(!enteredTime.trim()){
    //   onError({
    //     title: '유효하지 않은 시간',
    //     message: '시간을 입력해주세요.'
    //   });
    //   return;
    // }


    addSchedule(enteredTitle,enteredDate,enteredTime);

    setEnteredTitle('');
    setEnteredTime('');
    setEnteredDate('');

  }


  return (
    <>

      <form>
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