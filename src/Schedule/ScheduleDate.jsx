import React, {useState} from 'react';
import ErrorModal from "../ui/Modal/ErrorModal.jsx";
import styles from "./ScheduleDate.module.css"

const ScheduleDate = ({onDateRangeChange }) => {

  const [startDate,setStartDate] = useState(null);
  const [endDate,setEndDate] = useState(null);


  // 에러의 데이터를 관리하는 상태변수
  const [error,setError] = useState(null);

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    onDateRangeChange(newStartDate, endDate);
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    onDateRangeChange(startDate, newEndDate);
  };


  // 에러모달을 닫아주는 함수
  const closeModal = () =>{
    setError(null)
  };

  return (
      <>
        {error && <ErrorModal title={error.title} message={error.message} onClose={closeModal} />}
        <h2>📅 여행 일정 관리</h2>
        {(!startDate || !endDate) &&<p className={styles.beforeComment}> 일정을 짜기 전, 여행 시작일과 종료일을 입력해주세요</p>}
        {startDate && endDate && <p className={styles.beforeComment}>✈️ 여행 기간: {startDate} ~ {endDate}</p>}
        <label>여행 시작일:</label>
        <input type="date" value={startDate || ""} onChange={handleStartDateChange} />
        <label className={styles.endDate}>여행 종료일:</label>
        <input type="date" value={endDate || ""} onChange={handleEndDateChange} min={startDate} />



      </>

  );
};

export default ScheduleDate;