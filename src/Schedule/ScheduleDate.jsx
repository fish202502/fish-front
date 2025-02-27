import React, {useState, useEffect} from 'react';
import ErrorModal from "../ui/Modal/ErrorModal.jsx";
import styles from "./ScheduleDate.module.css"
import DeleteConfirmModal from "../ui/Modal/DeleteConfirmModal.jsx";

const ScheduleDate = ({onDateRangeChange, initialStartDate, initialEndDate, noModalNeeded = false, onCancel, permission}) => {
    const [tripStartDate, setTripStartDate] = useState(null);
    const [tripEndDate, setTripEndDate] = useState(null);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [error, setError] = useState(null);

    // useEffect를 추가하여 초기값 변경 감지
    useEffect(() => {
        if (initialStartDate && initialEndDate) {
            setTripStartDate(initialStartDate);
            setTripEndDate(initialEndDate);
            setIsConfirmed(true);
        }
    }, [initialStartDate, initialEndDate]);

    const handleTripStartDateChange = (e) => {
        setTripStartDate(e.target.value);
    };

    const handleTripEndDateChange = (e) => {
        setTripEndDate(e.target.value);
    };

    const closeModal = () => {
        setError(null);
    };

    const confirmDates = () => {
        if (tripStartDate && tripEndDate) {
            setIsConfirmed(true);
            onDateRangeChange(tripStartDate, tripEndDate);
        } else {
            setError({
                title: "입력 오류",
                message: "여행 시작일과 종료일을 모두 입력해주세요."
            });
        }
    };

    const cancelEdit = () => {
        if (onCancel) {
            onCancel();
        }
    };

    return (
      <>
          {error && <ErrorModal title={error.title} message={error.message} onClose={closeModal}/>}
          {showConfirmModal && !noModalNeeded && (
            <DeleteConfirmModal
              title="여행 일정 수정"
              message="여행기간을 수정하면 기록했던 모든 일정들이 사라집니다. 수정하시겠습니까?"
              onConfirm={() => {
                  setShowConfirmModal(false);
                  onDateRangeChange(tripStartDate, tripEndDate);
              }}
              onClose={() => setShowConfirmModal(false)}
            />
          )}
          {!permission ? (
            <div className={styles.scheduleDateContainer}>
                <p className={styles.beforeComment}>일정이 등록되어 있지 않습니다.</p>
            </div>
          ) : (
            <div className={styles.scheduleDateContainer}>
                <p className={styles.beforeComment}>
                    {isConfirmed
                      ? "여행 기간을 수정해주세요"
                      : "일정을 짜기 전, 여행 시작일과 종료일을 입력해주세요"}
                </p>
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
                    <div>
                        <button onClick={confirmDates} className={styles.editBtn}>확인</button>
                        {onCancel && (
                          <button onClick={cancelEdit} className={styles.editBtn}>취소</button>
                        )}
                    </div>
                </div>
            </div>
          )
          }
      </>
    );
};

export default ScheduleDate;