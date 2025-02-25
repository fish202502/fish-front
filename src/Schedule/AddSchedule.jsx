import React, {useEffect, useState} from "react";
import styles from './AddSchedule.module.css'
import ErrorModal from "../ui/Modal/ErrorModal.jsx";

import ScheduleDate from "./ScheduleDate.jsx";
import error from "eslint-plugin-react/lib/util/error.js";

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


  const handleSubmit = async(e) => {
    e.preventDefault();

    const isSuccess= await addSchedule(
        enteredTitle,enteredStartDate,enteredStartTime,enteredEndDate,enteredEndTime);

    if(isSuccess){

    setEnteredTitle('');
    setEnteredStartDate('');
    setEnteredStartTime('');
    setEnteredEndDate('');
    setEnteredEndTime('');

    }

  }


  return (
      <>
        <form className={styles.addScheduleContainer} onSubmit={handleSubmit}>
          <p> Add New Schedule</p>
          <div className={styles.titleContainer}>
            <label className={styles.titleLabel}>Title</label>
            <input
                type="text"
                className={styles.scheduleTitle}
                onChange={handleTitleInput}
                value={enteredTitle}
            />
          </div>

          {/* 시작 날짜 & 시작 시간 */}
          <div className={styles.formGroup}>
            <div className={styles.dateInputContainer}>
              <label>시작 날짜</label>
              <input
                  type="date"
                  onChange={handleStartDateInput}
                  value={enteredStartDate}
                  min={tripStartDate}
                  max={tripEndDate}
              />
            </div>
            <div className={styles.dateInputContainer}>
              <label>시작 시간</label>
              <input
                  type="time"
                  onChange={handleStartTimeInput}
                  value={enteredStartTime}
              />
            </div>
          </div>

          {/* 종료 날짜 & 종료 시간 */}
          <div className={styles.formGroup}>
            <div className={styles.dateInputContainer}>
              <label>종료 날짜</label>
              <input
                  type="date"
                  onChange={handleEndDateInput}
                  value={enteredEndDate}
                  min={enteredStartDate}
                  max={tripEndDate}
              />
            </div>
            <div className={styles.dateInputContainer}>
              <label>종료 시간</label>
              <input
                  type="time"
                  onChange={handleEndTimeInput}
                  value={enteredEndTime}
              />
            </div>
          </div>

          {/* 버튼 */}
          <div className={styles.BtnContainer}>
            <button type="submit" className={styles.submitBtn}>추가</button>
          </div>
        </form>
      </>
  );
};

export default AddSchedule;