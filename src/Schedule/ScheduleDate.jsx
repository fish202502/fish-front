import React, {useState,useEffect} from 'react';
import ErrorModal from "../ui/Modal/ErrorModal.jsx";
import styles from "./ScheduleDate.module.css"
import DeleteConfirmModal from "../ui/Modal/DeleteConfirmModal.jsx";

const ScheduleDate = ({onDateRangeChange, onResetSchedules,initialStartDate, initialEndDate}) => {
    const [tripStartDate, setTripStartDate] = useState(null);
    const [tripEndDate, setTripEndDate] = useState(null);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [error, setError] = useState(null);

    // 임시 날짜 상태 추가
    const [tempStartDate, setTempStartDate] = useState(null);
    const [tempEndDate, setTempEndDate] = useState(null);

    // useEffect를 추가하여 초기값 변경 감지
    useEffect(() => {
        if (initialStartDate && initialEndDate) {
            setTripStartDate(initialStartDate);
            setTripEndDate(initialEndDate);
            setIsConfirmed(true);
        }
    }, [initialStartDate, initialEndDate]);


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
            {error && <ErrorModal title={error.title} message={error.message} onClose={closeModal}/>}
            {showConfirmModal && (
                <DeleteConfirmModal
                    title="여행 일정 수정"
                    message="여행기간을 수정하면 기록했던 모든 일정들이 사라집니다. 수정하시겠습니까?"
                    onConfirm={handleConfirmEdit}
                    onClose={handleCloseModal}
                />
            )}


            {!isConfirmed ? (
                <>
                  <div className={styles.scheduleDateContainer}>
                    <p className={styles.beforeComment}>일정을 짜기 전, 여행 시작일과 종료일을 입력해주세요</p>
                    <div className={styles.dateContainer}>

                        <label>Start Date</label>
                        <input
                            type="date"
                            value={tripStartDate || ""}
                            onChange={handleTripStartDateChange}
                            className={styles.dateInput}
                        />
                        <label className={styles.endDate}>End Date</label>
                        <input
                            type="date"
                            value={tripEndDate || ""}
                            onChange={handleTripEndDateChange}
                            min={tripStartDate}
                            className={styles.dateInput}
                        />
                        <button onClick={confirmDates} className={styles.confirmBtn}>확인</button>
                    </div>

                  </div>

                </>
            ) : (
                <>
                    <div className={styles.fixContainer}>

                      <p className={styles.beforeComment}>✈ 여행기간 :️ {tripStartDate} ~ {tripEndDate}</p>

                        <button onClick={startDateEdit} className={styles.fixBtn}>수정</button>




                    </div>
                </>
            )}

        </>
    );
};

export default ScheduleDate;