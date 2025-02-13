import { useState } from "react";
import AddSchedule from "./AddSchedule";
import ScheduleList from "./ScheduleList";
import ScheduleDate from "./ScheduleDate.jsx";



const DUMMY_SCHEDULES =[
  {id:1, title: '금오름 가기',date:'2025-02-28', time: "8:00"},
  {id:2, title: '점심먹기',date:'2025-02-28', time: "12:00"},
  {id:3, title: '오설록 티 뮤지엄 가기',date:'2025-02-29', time: "15:30"},
];


const ScheduleManager = () => {


  const [schedules, setSchedules] = useState(DUMMY_SCHEDULES);
  const [selectedDay, setSelectedDay] = useState("");



  // 일정 추가 함수
  const addSchedule = (title,date ,time) => {
    const newSchedule = {
      id: Date.now(),
      title,
      date,
      time,
    };
    setSchedules([...schedules, newSchedule]);
  };

  // 일정 삭제 함수
  const removeSchedule = (id) => {
    setSchedules(schedules.filter((schedule) => schedule.id !== id));
  };

  const handleDaySelect = (day) => {
    setSelectedDay(day); // 선택된 날짜 상태 업데이트
    console.log("📅 선택한 날짜:", day);
  };


  return (
    <div>
      <AddSchedule addSchedule={addSchedule} onDaySelect={handleDaySelect}/>
      <ScheduleList schedules={schedules} removeSchedule={removeSchedule} selectedDay={selectedDay}  />

    </div>
  );
};

export default ScheduleManager;