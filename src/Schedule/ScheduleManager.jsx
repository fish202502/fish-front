import { useState } from "react";
import AddSchedule from "./AddSchedule";
import ScheduleList from "./ScheduleList";
import ScheduleDate from "./ScheduleDate.jsx";
import ErrorModal from "../ui/Modal/ErrorModal.jsx";



const DUMMY_SCHEDULES =[
  {id:1, title: '금오름 가기',date:'2025-02-27', time: "08:00"},
  {id:2, title: '점심먹기',date:'2025-02-28', time: "12:00"},
  {id:3, title: '오설록 티 뮤지엄 가기',date:'2025-02-28', time: "15:30"},
];


const ScheduleManager = ({onDaySelect}) => {


  const [schedules, setSchedules] = useState(DUMMY_SCHEDULES);
  const [selectedDay, setSelectedDay] = useState("");
  const [startDate,setStartDate] = useState(null);
  const [endDate,setEndDate] = useState(null);

  // 에러의 데이터를 관리하는 상태변수
  const [error,setError] = useState(null);

  const handleError = (title, message) => {
    setError({title,message});

  }
  //  일정 목록을 정렬하는 함수 (날짜 + 시간 기준 정렬)
  const sortSchedules = (schedules) => {
    return [...schedules].sort((a, b) => {
      const dateTimeA = new Date(`${a.date}T${a.time}`);
      const dateTimeB = new Date(`${b.date}T${b.time}`);
      return dateTimeA - dateTimeB;
    });
  };



  // 일정 추가 함수
  const addSchedule = (title,date,time) => {

    if (!title.trim()) {
      handleError("입력 오류", "스케줄 제목을 입력해야 합니다.");
      return;
    }
    if (!date) {
      handleError("입력 오류", "날짜를 선택해야 합니다.");
      return;
    }
    if(!time.trim()){
      handleError("입력 오류", "시간을 선택해야 합니다.");
      return;
    }



    const newSchedule = {
      id: Date.now(),
      title,
      date,
      time,
    }
    setSchedules((prevSchedules) => sortSchedules([...prevSchedules, newSchedule]));
  };

  // 일정 삭제 함수
  const removeSchedule = (id) => {
    setSchedules((prevSchedules) => prevSchedules.filter((schedule) => schedule.id !== id));
  };


  const handleDaySelect = (day) => {
    setSelectedDay(day); // 선택된 날짜 상태 업데이트
    console.log("📅 선택한 날짜:", day);

  };
  const handleDateRange = (start,end) => {
    setStartDate(start);
    setEndDate(end);
  }

  const modifySchedule = (id, updatedData) => {
    setSchedules((prevSchedules) =>
      sortSchedules(
        prevSchedules.map((schedule) => (schedule.id === id ? { ...schedule, ...updatedData } : schedule))
      )
    );
  };





  return (
    <div>
      {error && <ErrorModal title ={error.title} message={error.message} onClose={() => setError(null)} />}
      <ScheduleDate onDaySelect={onDaySelect} onDateRangeChange={handleDateRange} />
      {startDate && endDate && <AddSchedule addSchedule={addSchedule} onDaySelect={handleDaySelect} startDate={startDate} endDate={endDate} onError = {handleError}/>}
      <ScheduleList schedules={schedules} removeSchedule={removeSchedule} selectedDay={selectedDay} modifySchedule ={modifySchedule} startDate={startDate} endDate={endDate}/>

    </div>
  );
};

export default ScheduleManager;