import React, { useState } from "react";
import AddSchedule from "./AddSchedule";
import ScheduleList from "./ScheduleList";

const DUMMY_SCHEDULES =[
  {id:1, title: '금오름 가기', date: "2024-01-01", time: "8:00" },
  {id:2, title: '점심먹기', date: "2024-01-01",time: "12:00"},
  {id:3, title: '오설록 티 뮤지엄 가기', date: "2024-01-02", time: "15:30" },
];

const ScheduleManager = () => {
  const [schedules, setSchedules] = useState(DUMMY_SCHEDULES);

  // 일정 추가 함수
  const addSchedule = (title, date, time) => {
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


  return (
    <div>
      <h2>📅 여행 일정 관리</h2>
      <AddSchedule addSchedule={addSchedule}/>
      <ScheduleList  schedules={schedules} removeSchedule={removeSchedule} />
    </div>
  );
};

export default ScheduleManager;