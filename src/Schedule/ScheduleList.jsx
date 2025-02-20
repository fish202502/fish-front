import styles from './ScheduleList.module.css'
import {useState} from "react";
import App from "../App.jsx";
import AddSchedule from "./AddSchedule.jsx";

const ScheduleList = ({ schedules, removeSchedule, modifySchedule }) => {
  const [editingId,setEditingId] = useState(null);
  const [editData, setEditData] = useState({title:"",date:"",time:""});

  const handleEditClick = (schedule) => {
    setEditingId(schedule.id);
    setEditData(schedule);
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    modifySchedule(editingId, editData);
    setEditingId(null);
  };

  const groupedSchedules = schedules.reduce((acc, schedule) => {
    // 처음 등장한 dayX일 경우 새로운 그룹을 만든다.
    if (!acc[schedule.dayLabel]) {
      acc[schedule.dayLabel] = {
        date: schedule.startDateTime.split("T")[0], // 가장 첫 일정 날짜 저장
        schedules: [],
      };
    }
    // 같은 Day에 속하는 일정들은 해당 그룹에 추가
    acc[schedule.dayLabel].schedules.push(schedule);
    return acc;
  }, {});


  return (
      <form className={styles.scheduleList}>
        {Object.keys(groupedSchedules).length === 0 ? (
            <p>등록된 일정이 없습니다.</p>
        ) : (
            Object.keys(groupedSchedules).map((dayLabel) => (
                <div className={styles.dayGroup} key={dayLabel}>
                  {/*  Day + Day의 해당날짜 출력 */}
                  <h2> {dayLabel} <span style={{ fontSize: "14px", color: "#888" }}>({groupedSchedules[dayLabel].date})</span></h2>
                  <ul>
                        {groupedSchedules[dayLabel].schedules.map((schedule) => (
                          <li key={schedule.id} className={styles.scheduleItem}>
                            {editingId === schedule.id ? (
                              <>
                                <input type="text" name="title" value={editData.title} onChange={handleChange}/>
                                <input type="time" name="time" value={editData.time} onChange={handleChange}/>
                                <section className={styles.buttonContainer}>
                                  <button onClick={(e) => handleSave(e)}>💾 저장</button>
                                  <button onClick={() => setEditingId(null)}>❌ 취소</button>

                                </section>
                              </>
                            ) : (
                              <>
                                <span>🕒시작: {schedule.startDateTime.replace("T", " ")} - 종료: {schedule.endDateTime.replace("T", " ")} </span>
                                <span>{schedule.title}</span>
                                <section>
                                  <button onClick={() => removeSchedule(schedule.id)}>❌ 삭제</button>
                                  <button onClick={() => handleEditClick(schedule)}>✏️ 수정</button>

                                </section>
                              </>
                            )}
                          </li>
                        ))}
                  </ul>
                </div>
          ))
          )}
      </form>
  );
};

export default ScheduleList;