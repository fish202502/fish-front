import styles from './ScheduleList.module.css'
import {useState} from "react";
import AddSchedule from "./AddSchedule.jsx";
import ErrorModal from "../ui/Modal/ErrorModal.jsx";

const ScheduleList = ({schedules, removeSchedule, modifySchedule, tripStartDate, tripEndDate}) => {
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({title: "", startDate: "", startTime: "", endDate: "", endTime: ""});
    const [error, setError] = useState(null);

    const handleEditClick = (schedule) => {
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

        // modifySchedule이 이제 Promise를 반환하므로 await 사용
        const isSuccess = await modifySchedule(editingId, editData);

        if (isSuccess) {
            setEditingId(null); // 수정 모드 종료
        }
    };

    const handleDelete = async (id) => {
        try {
            const isSuccess = await removeSchedule(id);
            if (isSuccess) {
                // 성공 시 아무것도 하지 않음 (이미 removeSchedule에서 상태 업데이트)
                console.log('일정 삭제 성공:', id);
            }
        } catch (error) {
            console.error('삭제 처리 중 오류:', error);
        }
    };

    const closeErrorModal = () => {
        setError(null);
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
            {Object.keys(groupedSchedules).length === 0 ? (
                <p>등록된 일정이 없습니다 일정을 등록해주세요</p>
            ) : (
                Object.keys(groupedSchedules).map((dayLabel) => (
                    <div className={styles.dayGroup} key={dayLabel}>
                        <h2> {dayLabel} <span
                            style={{fontSize: "14px", color: "#888"}}>({groupedSchedules[dayLabel].date})</span></h2>
                        <ul>
                            {groupedSchedules[dayLabel].schedules.map((schedule) => (
                                <li key={schedule.id} className={styles.scheduleItem}>
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

                                            <span className={styles.title}>{schedule.title}</span>
                                            <span>🕒 {schedule.startDateTime.replace("T", " ")} - {schedule.endDateTime.replace("T", " ")} </span>
                                            </section>

                                            <section>
                                                <button onClick={() => handleEditClick(schedule)}>✏️ 수정</button>
                                                <button onClick={() => handleDelete(schedule.id)}>❌ 삭제</button>
                                            </section>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            )}
        </div>
    );
};

export default ScheduleList;
