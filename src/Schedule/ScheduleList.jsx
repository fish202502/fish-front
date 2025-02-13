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

  return (
      <form>
          <ul>
          {schedules.length === 0 ? (
              <p> 등록된 일정이 없습니다.</p>
          ) : (
              schedules.map((schedule) => (
                  <li key={schedule.id}>
                    {editingId === schedule.id? (
                      <>
                        <input type="text" name="title" value={editData.title} onChange={handleChange} />
                        <input type="date" name="date" value={editData.date} onChange={handleChange} min={startDate} max={endDate} />
                        <input type="time" name="time" value={editData.time} onChange={handleChange} />
                        <button onClick={(e) => handleSave(e)}>💾 저장</button>
                        <button onClick={(e) => setEditingId(null)}>❌ 취소</button>
                      </>


                    ):(
                      <>
                    📌 {schedule.date} {schedule.time} - {schedule.title}
                    <button onClick={() => removeSchedule(schedule.id)}>❌ 삭제</button>
                    <button onClick={() => handleEditClick(schedule)}>✏️수정</button>

                   </>
                    )

                    }
                  </li>
              ))
          )}
        </ul>

      </form>

  );
};

export default ScheduleList;