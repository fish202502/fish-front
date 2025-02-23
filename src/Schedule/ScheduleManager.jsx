import React, { useState } from "react";
import AddSchedule from "./AddSchedule";
import ScheduleList from "./ScheduleList";
import ScheduleDate from "./ScheduleDate.jsx";
import ErrorModal from "../ui/Modal/ErrorModal.jsx";
import styles from "./ScheduleManager.module.css";

const DUMMY_SCHEDULES =[

];


const ScheduleManager = () => {


  const [schedules, setSchedules] = useState(DUMMY_SCHEDULES);
  const [tripStartDate,setTripStartDate] = useState('');
  const [tripEndDate,setTripEndDate] = useState('');

  // 에러의 데이터를 관리하는 상태변수
  const [error,setError] = useState('');



  const handleError = (title, message) => {
    setError({title,message});

  }


  //  일정 목록을 정렬하는 함수 (날짜 + 시간 기준 정렬)
  const sortSchedules = (schedules) => {
    return [...schedules].sort((a, b) => {
      return new Date(a.startDateTime) - new Date(b.startDateTime);
    });
  };



  // 일정 추가 함수
  const addSchedule = (title,startDate,startTime,endDate,endTime) => {

    if (!title.trim()) {
      handleError("입력 오류", "일정 제목을 입력해야 합니다.");
      return false;
    }
    if (!startDate || !startTime) {
      handleError("입력 오류", "일정 시작날짜와 시간은 필수입니다.");
      return false;
    }

    // 날짜와 시간을 합쳐 ISO 형식 (YYYY-MM-DDTHH:MM)으로 변환
    const startDateTime = `${startDate}T${startTime}`;
    const endDateTime = `${endDate}T${endTime}`;

    if(endDateTime < startDateTime) {
      handleError("입력오류", "일정종료시간은 시작시간보다 나중이어야 합니다.")
      return false;
    }


    let dayLabel = "";

    if (tripStartDate) {
      const start = new Date(tripStartDate);
      const selected = new Date(startDate);
      const dayDifference = Math.floor((selected - start) / (1000 * 60 * 60 * 24));
      dayLabel = `Day${dayDifference + 1}`;
    }



    const newSchedule = {
      id: Date.now(),
      title,
      startDateTime,
      endDateTime,
      dayLabel
    }
    console.log(newSchedule);
    setSchedules((prevSchedules) => sortSchedules([...prevSchedules, newSchedule]));

    return true;
  };

  // 일정 삭제 함수
  const removeSchedule = (id) => {
    setSchedules((prevSchedules) => prevSchedules.filter((schedule) => schedule.id !== id));
  };



  const handleDateRange = (start,end) => {
    setTripStartDate(start);
    setTripEndDate(end);
  }

  const modifySchedule = (id, updatedData) => {
    setSchedules((prevSchedules) =>
        sortSchedules(
            prevSchedules.map((schedule) => {
              if (schedule.id === id) {
                const startDateTime = `${updatedData.startDate}T${updatedData.startTime}`;
                const endDateTime = `${updatedData.endDate}T${updatedData.endTime}`;
                let dayLabel = "";
                if (tripStartDate) {
                  const start = new Date(tripStartDate);
                  const selected = new Date(updatedData.startDate);
                  const dayDifference = Math.floor((selected - start) / (1000 * 60 * 60 * 24));
                  dayLabel = `Day${dayDifference + 1}`;
                }
                return { ...schedule, ...updatedData, startDateTime, endDateTime, dayLabel };
              }
              return schedule;
            })
        )
    );
  };

  const resetSchedules = () => {
    setSchedules([]);
  };


  return (
    <div className={styles.container}>
      {error && <ErrorModal title ={error.title} message={error.message} onClose={() => setError(null)} />}
      <div className={styles.diaryContainer}>
        <h2 className={styles.title}> Travel Planner </h2>
        <div className={styles.whiteContainer}>

        <ScheduleDate  onDateRangeChange={handleDateRange} onResetSchedules={resetSchedules} />

      {tripStartDate && tripEndDate && <AddSchedule addSchedule={addSchedule} tripStartDate={tripStartDate} tripEndDate={tripEndDate}  />}
      <ScheduleList schedules={schedules} removeSchedule={removeSchedule}  modifySchedule ={modifySchedule} tripStartDate={tripStartDate} tripEndDate={tripEndDate} />


      <button>일정 저장</button>
        </div>

      </div>


    </div>
  );
};

export default ScheduleManager;