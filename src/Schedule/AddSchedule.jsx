import { useState } from "react";
import './AddSchedule.css'
import ErrorModal from "../ui/Modal/ErrorModal.jsx";
import DdayCounter from "./DdayCounter.jsx";
import ScheduleDate from "./ScheduleDate.jsx";

const AddSchedule = ({addSchedule, onDaySelect}) => {


  const [enteredTitle,setEnteredTitle] = useState("");
  const [enteredTime,setEnteredTime] =useState("");


  // 에러의 데이터를 관리하는 상태변수
  const [error,setError] = useState(null);

  const handleTitleInput = e =>{
    setEnteredTitle(e.target.value);
  };
  const handleTimeInput = e => {
    setEnteredTime(e.target.value);
  }


  const handleSubmit = e => {
    e.preventDefault();

    if(!enteredTitle.trim()){
      setError({
        title: '유효하지 않은 입력값',
      message: '제목을 입력해주세요.'
      });
      return;
    }


    if(!enteredTime.trim()){
      setError({
        title: '유효하지 않은 시간',
        message: '시간을 입력해주세요.'
      });
      return;
    }


    addSchedule(enteredTitle,enteredTime);

    setEnteredTitle('');
    setEnteredTime('');

  }

  // 에러모달을 닫아주는 함수
  const closeModal = () =>{
    setError(null)
  };

  return (
    <>
      {error && <ErrorModal title = {error.title} message= {error.message} onClose = {closeModal}/>}
      <form>
        <ScheduleDate onDaySelect={onDaySelect} />
        <input type="text" placeholder="일정 제목" onInput={handleTitleInput} value={enteredTitle}/>
        <input type="time" onInput={handleTimeInput} value={enteredTime}/>
        <button type="submit" onClick={handleSubmit}>➕ 추가</button>
      </form>
    </>
  );
};

export default AddSchedule;