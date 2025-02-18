import './ScheduleList.css'
import {useState} from "react";

const ScheduleList = ({ schedules, removeSchedule, modifySchedule ,startDate,endDate,selectedDay }) => {
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
    if (!acc[schedule.dayLabel]) {
      acc[schedule.dayLabel] = {
        date: schedule.date, // DayX 그룹의 대표 날짜 (가장 첫 일정 날짜)
        schedules: [],
      };
    }
    acc[schedule.dayLabel].schedules.push(schedule);
    return acc;
  }, {});


  return (
      <form>
        {Object.keys(groupedSchedules).length === 0 ? (
            <p>등록된 일정이 없습니다.</p>
        ) : (
            Object.keys(groupedSchedules).map((dayLabel) => (
                <div key={dayLabel}>
                  {/* ✅ DayX + 대표 날짜 출력 */}
                  <h2> {dayLabel} <span style={{ fontSize: "14px", color: "#888" }}>({groupedSchedules[dayLabel].date})</span></h2>
                  <ul>
                    {groupedSchedules[dayLabel].schedules.map((schedule) => (
                        <li key={schedule.id}>
                          {editingId === schedule.id ? (
                              <>
                                <input type="text" name="title" value={editData.title} onChange={handleChange} />
                                <input type="date" name="date" value={editData.date} onChange={handleChange} min={startDate} max={endDate} />
                                <input type="time" name="time" value={editData.time} onChange={handleChange} />
                                <button onClick={(e) => handleSave(e)}>💾 저장</button>
                                <button onClick={() => setEditingId(null)}>❌ 취소</button>
                              </>
                          ) : (
                              <>
                                🕒 {schedule.time} - {schedule.title}
                                <button onClick={() => removeSchedule(schedule.id)}>❌ 삭제</button>
                                <button onClick={() => handleEditClick(schedule)}>✏️ 수정</button>
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