import { useState } from "react";
import AddSchedule from "./AddSchedule";
import ScheduleList from "./ScheduleList";



const DUMMY_SCHEDULES =[
  {id:1, title: '금오름 가기', time: "8:00" },
  {id:2,  title: '점심먹기', time: "12:00"},
  {id:3,  title: '오설록 티 뮤지엄 가기', time: "15:30" },
];


const ScheduleManager = () => {

  const [selectedDay, setSelectedDay] = useState("");

  const [schedules, setSchedules] = useState(DUMMY_SCHEDULES);

  const handleDaySelect = (day) => {
    console.log("선택한 Day:", day);
    setSelectedDay(day); // 상태 업데이트
  };



  // 일정 추가 함수
  const addSchedule = (title, time) => {
    const newSchedule = {
      id: Date.now(),
      title,
      time,
    };
    setSchedules([...schedules, newSchedule]);
  };

  // 일정 삭제 함수
  const removeSchedule = (id) => {
    setSchedules(schedules.filter((schedule) => schedule.id !== id));
  };

  return (
    <div>
      <AddSchedule addSchedule={addSchedule} onDaySelect={handleDaySelect}/>
      <ScheduleList  schedules={schedules} removeSchedule={removeSchedule} onDaySelect={handleDaySelect}  />

    </div>
  );
};

export default ScheduleManager;