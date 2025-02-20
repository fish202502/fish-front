import React, {useState} from 'react';
import ErrorModal from "../ui/Modal/ErrorModal.jsx";
import styles from "./ScheduleDate.module.css"
import DeleteConfirmModal from "../ui/Modal/DeleteConfirmModal.jsx";

const ScheduleDate = ({onDateRangeChange, onResetSchedules }) => {

  const [tripStartDate,setTripStartDate] = useState(null);
  const [tripEndDate,setTripEndDate] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);


  // 에러의 데이터를 관리하는 상태변수
  const [error,setError] = useState(null);

  const handleTripStartDateChange = (e) => {
    setTripStartDate(e.target.value);
  };

  const handleTripEndDateChange = (e) => {
    setTripEndDate(e.target.value);
  };


  // 에러모달을 닫아주는 함수
  const closeModal = () =>{
    setError(null)
  };

  const confirmDates = () => {
    if (tripStartDate && tripEndDate) {
      setIsConfirmed(true);
      onDateRangeChange(tripStartDate,tripEndDate)
    }
  };

  const openConfirmModal = () => {
    setShowConfirmModal(true);
  };



  const resetDates = () => {
    setTripStartDate(null);
    setTripEndDate(null);
    setIsConfirmed(false);
    onResetSchedules();
    setShowConfirmModal(false);
  };

  // 모달 컴포넌트 정리
  const ConfirmModal = showConfirmModal && (
    <DeleteConfirmModal
      title="여행 일정 수정"
      message="정말로 여행 기간을 수정하시겠습니까? 기록했던 모든 일정들이 사라집니다."
    >
      <button onClick={resetDates}>확인</button>
      <button >취소</button>
    </DeleteConfirmModal>
  );


  return (
      <>
        {error && <ErrorModal title={error.title} message={error.message} onClose={closeModal} />}
        {ConfirmModal}
        <h2>📅 여행 일정 관리</h2>
        {(!tripStartDate || !tripEndDate) &&<p className={styles.beforeComment}> 일정을 짜기 전, 여행 시작일과 종료일을 입력해주세요</p>}
        {tripStartDate && tripEndDate && <p className={styles.beforeComment}>✈️ 여행 기간: {tripStartDate} ~ {tripEndDate}</p>}
        {!isConfirmed && (
          <>
            <label>여행 시작일:</label>
            <input type="date" value={tripStartDate || ""} onChange={handleTripStartDateChange} />
            <label className={styles.endDate}>여행 종료일:</label>
            <input type="date" value={tripEndDate || ""} onChange={handleTripEndDateChange} min={tripStartDate} />
            <button onClick={confirmDates}>확인</button>
          </>
        )}
        {isConfirmed && <button onClick={openConfirmModal}>수정</button>}



      </>

  );
};

export default ScheduleDate;