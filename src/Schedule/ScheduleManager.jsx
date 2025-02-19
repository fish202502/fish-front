import { useState } from "react";
import AddSchedule from "./AddSchedule";
import ScheduleList from "./ScheduleList";
import ScheduleDate from "./ScheduleDate.jsx";
import ErrorModal from "../ui/Modal/ErrorModal.jsx";
import styles from "./ScheduleManager.module.css";

const DUMMY_SCHEDULES =[

];


const ScheduleManager = () => {


  const [schedules, setSchedules] = useState(DUMMY_SCHEDULES);
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
      handleError("입력 오류", "일정 제목을 입력해야 합니다.");
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


    let dayLabel = "";
    if (startDate) {
      const start = new Date(startDate);
      const selected = new Date(date);
      const dayDifference = Math.floor((selected - start) / (1000 * 60 * 60 * 24));
      dayLabel = `Day${dayDifference + 1}`;
    }



    const newSchedule = {
      id: Date.now(),
      title,
      date,
      time,
      dayLabel
    }
    setSchedules((prevSchedules) => sortSchedules([...prevSchedules, newSchedule]));
  };

  // 일정 삭제 함수
  const removeSchedule = (id) => {
    setSchedules((prevSchedules) => prevSchedules.filter((schedule) => schedule.id !== id));
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
    <div className={styles.container}>
      {error && <ErrorModal title ={error.title} message={error.message} onClose={() => setError(null)} />}
      <ScheduleDate  onDateRangeChange={handleDateRange} />
      {startDate && endDate && <AddSchedule addSchedule={addSchedule}  startDate={startDate} endDate={endDate} onError = {handleError}/>}
      <ScheduleList schedules={schedules} removeSchedule={removeSchedule}  modifySchedule ={modifySchedule} startDate={startDate} endDate={endDate}/>

    </div>
  );
};

export default ScheduleManager;