import React, {useState} from 'react';
import ErrorModal from "../ui/Modal/ErrorModal.jsx";
import DdayCounter from "./DdayCounter.jsx";

const ScheduleDate = ({addDate ,onAddDay, onDaySelect}) => {

  const [startDate,setStartDate] = useState(null);
  const [endDate,setEndDate] = useState(null);


  // 에러의 데이터를 관리하는 상태변수
  const [error,setError] = useState(null);

  const handleSubmit = e =>{
    e.preventDefault();

    if (!startDate.trim()){
      setError({
        title: '유효하지 않은 입력값',
        message: '시작일을 입력해주세요'
      });
      return;
    }

    if (!endDate.trim()){
      setError({
        title: '유효하지 않은 입력값',
        message: '종료일을 입력해주세요'
      });
      return;
    }
    addDate(startDate,endDate)

    setStartDate('');
    setEndDate('');
  }

  // 에러모달을 닫아주는 함수
  const closeModal = () =>{
    setError(null)
  };

  return (
    <>
      {error && <ErrorModal title = {error.title} message= {error.message} onClose = {closeModal}/>}
      <h2>📅 여행 일정 관리</h2>
      <label>시작일:</label>
      <input type="date"
             value={startDate}
             onChange={(e) => setStartDate(e.target.value)}/>
      <label>종료일:</label>
      <input type="date"
             value={endDate}
             onChange={(e) => setEndDate(e.target.value)}
             min={startDate}/>
      {startDate && endDate && <p>✈️여행 기간: {startDate} ~ {endDate}</p>}
      {startDate && endDate && <DdayCounter startDate={startDate} endDate={endDate} onDaySelect={onDaySelect} />}


    </>
  );
};

export default ScheduleDate;