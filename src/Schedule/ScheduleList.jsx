import './ScheduleList.css'
import {useState} from "react";

const ScheduleList = ({ schedules, removeSchedule, selectedDay }) => {


  return (
      <form>
          <ul>
          {schedules.length === 0 ? (
              <p> 등록된 일정이 없습니다.</p>
          ) : (
              schedules.map((schedule) => (
                  <li key={schedule.id}>
                    📅 {schedule.date} {schedule.time} - {schedule.title}
                    <button onClick={() => removeSchedule(schedule.id)}>❌ 삭제</button>
                    <button>✏️수정</button>
                  </li>
              ))
          )}
        </ul>

      </form>

  );
};

export default ScheduleList;