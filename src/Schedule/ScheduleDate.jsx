import React, {useState} from 'react';
import ErrorModal from "../ui/Modal/ErrorModal.jsx";
import styles from "./ScheduleDate.module.css"

const ScheduleDate = ({onDateRangeChange }) => {

  const [tripStartDate,setTripStartDate] = useState(null);
  const [tripEndDate,setTripEndDate] = useState(null);


  // 에러의 데이터를 관리하는 상태변수
  const [error,setError] = useState(null);

  const handleTripStartDateChange = (e) => {
    const newTripStartDate = e.target.value;
    setTripStartDate(newTripStartDate);
    onDateRangeChange(newTripStartDate, tripEndDate);
  };

  const handleTripEndDateChange = (e) => {
    const newTripEndDate = e.target.value;
    setTripEndDate(newTripEndDate);
    onDateRangeChange(tripStartDate, newTripEndDate);
  };


  // 에러모달을 닫아주는 함수
  const closeModal = () =>{
    setError(null)
  };

  return (
      <>
        {error && <ErrorModal title={error.title} message={error.message} onClose={closeModal} />}
        <h2>📅 여행 일정 관리</h2>
        {(!tripStartDate || !tripEndDate) &&<p className={styles.beforeComment}> 일정을 짜기 전, 여행 시작일과 종료일을 입력해주세요</p>}
        {tripStartDate && tripEndDate && <p className={styles.beforeComment}>✈️ 여행 기간: {tripStartDate} ~ {tripEndDate}</p>}
        <label>여행 시작일:</label>
        <input type="date" value={tripStartDate || ""} onChange={handleTripStartDateChange} />
        <label className={styles.endDate}>여행 종료일:</label>
        <input type="date" value={tripEndDate || ""} onChange={handleTripEndDateChange} min={tripStartDate} />



      </>

  );
};

export default ScheduleDate;