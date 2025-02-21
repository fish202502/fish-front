import React, {useState} from 'react';
import ErrorModal from "../ui/Modal/ErrorModal.jsx";
import styles from "./ScheduleDate.module.css"
import DeleteConfirmModal from "../ui/Modal/DeleteConfirmModal.jsx";

const ScheduleDate = ({onDateRangeChange, onResetSchedules }) => {
  const [tripStartDate,setTripStartDate] = useState(null);
  const [tripEndDate,setTripEndDate] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [error,setError] = useState(null);

  // 임시 날짜 상태 추가
  const [tempStartDate, setTempStartDate] = useState(null);
  const [tempEndDate, setTempEndDate] = useState(null);

  const handleTripStartDateChange = (e) => {
    if (!isConfirmed) {
      setTripStartDate(e.target.value);
    } else {
      setTempStartDate(e.target.value);
    }
  };

  const handleTripEndDateChange = (e) => {
    if (!isConfirmed) {
      setTripEndDate(e.target.value);
    } else {
      setTempEndDate(e.target.value);
    }
  };

  const closeModal = () => {
    setError(null);
  };

  const confirmDates = () => {
    if (tripStartDate && tripEndDate) {
      setIsConfirmed(true);
      onDateRangeChange(tripStartDate, tripEndDate);
    }
  };

  const startDateEdit = () => {
    setTempStartDate(tripStartDate);
    setTempEndDate(tripEndDate);
    setShowConfirmModal(true);
  };

  const handleConfirmEdit = () => {
    // 날짜 변경 및 일정 초기화
    onResetSchedules(); // 기존 일정 초기화
    setTripStartDate(null);
    setTripEndDate(null);
    setTempStartDate(null);
    setTempEndDate(null);
    setIsConfirmed(false);
    setShowConfirmModal(false);
    onDateRangeChange(null, null);
  };

  const handleCloseModal = () => {
    // 모달 닫기 및 임시 데이터 초기화
    setShowConfirmModal(false);
    setTempStartDate(tripStartDate);
    setTempEndDate(tripEndDate);
  };

  return (
    <>
      {error && <ErrorModal title={error.title} message={error.message} onClose={closeModal} />}
      {showConfirmModal && (
        <DeleteConfirmModal
          title="여행 일정 수정"
          message="정말로 여행 기간을 수정하시겠습니까? 기록했던 모든 일정들이 사라집니다."
          onConfirm={handleConfirmEdit}
          onClose={handleCloseModal}
        />
      )}
      <h2>📅 여행 일정 관리</h2>
      {(!tripStartDate || !tripEndDate) &&
        <p className={styles.beforeComment}>일정을 짜기 전, 여행 시작일과 종료일을 입력해주세요</p>
      }
      {tripStartDate && tripEndDate &&
        <p className={styles.beforeComment}>✈️ 여행 기간: {tripStartDate} ~ {tripEndDate}</p>
      }
      {!isConfirmed ? (
        <>
          <label>여행 시작일:</label>
          <input
            type="date"
            value={tripStartDate || ""}
            onChange={handleTripStartDateChange}
          />
          <label className={styles.endDate}>여행 종료일:</label>
          <input
            type="date"
            value={tripEndDate || ""}
            onChange={handleTripEndDateChange}
            min={tripStartDate}
          />
          <button onClick={confirmDates}>확인</button>
        </>
      ) : (

          <button onClick={startDateEdit}>수정</button>
      )}
    </>
  );
};

export default ScheduleDate;