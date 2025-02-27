import styles from './ScheduleList.module.css'
import {useState} from "react";
import ErrorModal from "../ui/Modal/ErrorModal.jsx";
import DeleteConfirmModal from "../ui/Modal/DeleteConfirmModal.jsx";

const ScheduleList = ({schedules, removeSchedule, modifySchedule, tripStartDate, tripEndDate, invalidSchedules,permission= false }) => {
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({title: "", startDate: "", startTime: "", endDate: "", endTime: ""});
    const [error, setError] = useState(null);
    // 삭제 확인 모달 상태
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    // 삭제할 일정 ID
    const [scheduleToDelete, setScheduleToDelete] = useState(null);


    const handleEditClick = (schedule) => {
        if (!permission) {
            setError("편집 권한이 없습니다.");
            return;
        }
        setEditingId(schedule.id);
        setEditData({
            title: schedule.title,
            startDate: schedule.startDateTime.split('T')[0],
            startTime: schedule.startDateTime.split('T')[1],
            endDate: schedule.endDateTime.split('T')[0],
            endTime: schedule.endDateTime.split('T')[1]
        });
    };

    const handleChange = (e) => {
        setEditData({...editData, [e.target.name]: e.target.value});
    };

    const handleSave = async (e) => {
        e.preventDefault();

        const isSuccess = await modifySchedule(editingId, editData);

        if (isSuccess) {
            setEditingId(null); // 수정 모드 종료
        }
    };

    // 삭제 버튼 클릭 시 삭제 확인 모달 표시
    const handleDeleteClick = (id) => {
        if (!permission) {
            setError("삭제 권한이 없습니다.");
            return;
        }
        setScheduleToDelete(id);
        setShowDeleteModal(true);
    };

    // 삭제 확인 시 실제 삭제 처리
    const confirmDelete = async () => {
        try {
            const isSuccess = await removeSchedule(scheduleToDelete);
            if (isSuccess) {
                console.log('일정 삭제 성공:', scheduleToDelete);
            }
        } catch (error) {
            console.error('삭제 처리 중 오류:', error);
        } finally {
            setShowDeleteModal(false);
            setScheduleToDelete(null);
        }
    };

    // 삭제 취소
    const cancelDelete = () => {
        setShowDeleteModal(false);
        setScheduleToDelete(null);
    };




    const closeErrorModal = () => {
        setError(null);
    };

    // 일정이 유효하지 않은지 체크하는 함수
    const isInvalidSchedule = (scheduleId) => {
        return invalidSchedules.some(s => s.id === scheduleId);
    };

    const groupedSchedules = schedules.reduce((acc, schedule) => {
        // dayLabel이 없는 일정은 처리하지 않음
        if (!schedule || !schedule.dayLabel) {
            return acc;
        }

        if (!acc[schedule.dayLabel]) {
            acc[schedule.dayLabel] = {
                date: schedule.startDateTime.split("T")[0],
                schedules: [],
            };
        }
        acc[schedule.dayLabel].schedules.push(schedule);
        return acc;
    }, {});

    return (
      <div className={styles.scheduleList}>
          {error && <ErrorModal title="입력 오류" message={error} onClose={closeErrorModal}/>}
          {showDeleteModal && (<DeleteConfirmModal
          title ="일정삭제"
          message ="일정을 삭제하시겠습니까?"
          onConfirm={confirmDelete}
          onClose={cancelDelete}
          />)}
          {Object.keys(groupedSchedules).length === 0 ? (
            <p>등록된 일정이 없습니다 일정을 등록해주세요</p>
          ) : (
            Object.keys(groupedSchedules).map((dayLabel) => (
              <div className={styles.dayGroup} key={dayLabel}>
                  <h2> {dayLabel} <span
                    style={{fontSize: "14px", color: "#888"}}>({groupedSchedules[dayLabel].date})</span></h2>
                  <ul>
                      {groupedSchedules[dayLabel].schedules.map((schedule) => {
                          const isInvalid = isInvalidSchedule(schedule.id);

                          return (
                            <li key={schedule.id} className={`${styles.scheduleItem} ${isInvalid ? styles.invalidSchedule : ''}`}>
                                {editingId === schedule.id ? (
                                  <>
                                      <section className={styles.editInputContainer}>
                                          <input type="text" name="title" value={editData.title}
                                                 onChange={handleChange}/>
                                          <input type="date" name="startDate" value={editData.startDate}
                                                 min={tripStartDate} max={tripEndDate} onChange={handleChange}/>
                                          <input type="time" name="startTime" value={editData.startTime}
                                                 onChange={handleChange}/>
                                          <input type="date" name="endDate" value={editData.endDate}
                                                 min={editData.startDate} max={tripEndDate} onChange={handleChange}/>
                                          <input type="time" name="endTime" value={editData.endTime}
                                                 onChange={handleChange}/>
                                      </section>
                                      <section className={styles.buttonContainer}>
                                          <button onClick={(e) => handleSave(e)}>확인</button>
                                          <button onClick={() => setEditingId(null)}>취소</button>
                                      </section>
                                  </>
                                ) : (
                                  <>
                                      <section className={styles.titleDateContainer}>
                                          {isInvalid && <span className={styles.warningIcon} title="여행 기간을 벗어난 일정입니다">⚠️</span>}
                                          <span className={styles.title}>{schedule.title}</span>
                                          <span>🕒 {schedule.startDateTime.replace("T", " ")} - {schedule.endDateTime.replace("T", " ")} </span>
                                      </section>
                                      {permission &&
                                      <section>
                                          <button onClick={() => handleEditClick(schedule)}>✏️ 수정</button>
                                          <button onClick={() => handleDeleteClick(schedule.id)}>❌ 삭제</button>
                                      </section>
                                      }
                                  </>
                                )}
                            </li>
                          )
                      })}
                  </ul>
              </div>
            ))
          )}
      </div>
    );
};

export default ScheduleList;