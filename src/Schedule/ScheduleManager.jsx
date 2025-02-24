import React, { useState, useEffect } from "react";
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
  const [scheduleId, setScheduleId] = useState(null);
  const [mainScheduleId, setMainScheduleId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 에러의 데이터를 관리하는 상태변수
  const [error,setError] = useState('');

  const ROOM_CODE = 'd8df09f5';
  const URL_ID = '1739944073733eb7c6';
  const API_BASE_URL = 'http://localhost:8999/api/fish/schedule';

  // 전체 일정 정보를 불러오는 함수
  const fetchScheduleData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('`${API_BASE_URL}/${ROOM_CODE}/${URL_ID}`'); // 실제 엔드포인트로 수정 필요
      const data = await response.json();

      if (response.ok) {
        // 여행 기간 정보 설정
        setMainScheduleId(data.scheduleId);

        // ISO 문자열에서 날짜 부분만 추출
        const startDate = data.startTime.split('T')[0];
        const endDate = data.endTime.split('T')[0];
        setTripStartDate(startDate);
        setTripEndDate(endDate);

        // 일정 목록을 변환하여 상태에 저장
        const formattedSchedules = data.scheduleItemList.map(item => {
          // Day 레이블 계산
          const start = new Date(startDate);
          const itemDate = new Date(item.startTime.split('T')[0]);
          const dayDifference = Math.floor((itemDate - start) / (1000 * 60 * 60 * 24));

          return {
            id: item.scheduleItemId,
            title: item.title,
            content: item.content,
            startDateTime: item.startTime,
            endDateTime: item.endTime,
            dayLabel: `Day${dayDifference + 1}`
          };
        });

        setSchedules(sortSchedules(formattedSchedules));
      } else {
        handleError("API 오류", "일정을 불러오는데 실패했습니다.");
      }
    } catch (error) {
      handleError("서버 오류", "서버와 통신 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 불러오기
  useEffect(() => {
    fetchScheduleData();
  }, []);

  //여행기간을 저장하는 API 호출을 처리하는 함수
  const handleDateRange = async (start, end) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${ROOM_CODE}/${URL_ID}`, {  // 실제 엔드포인트로 수정 필요
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startTime: `${start}T00:00:00`,
          endTime: `${end}T23:59:59`
        })
      });

      const data = await response.json();

      if (response.ok) {
        setTripStartDate(start);
        setTripEndDate(end);
        setScheduleId(data.scheduleId);  // 응답으로 받은 ID 저장
      } else {
        handleError("API 오류", data.message);
      }
    } catch (error) {
      handleError("서버 오류", "여행 기간을 저장하는 중 오류가 발생했습니다.");
    }
  };



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
  const addSchedule = async (title,startDate,startTime,endDate,endTime) => {

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


    try {
      const response = await fetch(`${API_BASE_URL}/${ROOM_CODE}/${URL_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content: "", // 필요한 경우 추가
          startTime: startDateTime,
          endTime: endDateTime
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Day 레이블 계산
        const start = new Date(tripStartDate);
        const selected = new Date(startDate);
        const dayDifference = Math.floor((selected - start) / (1000 * 60 * 60 * 24));
        const dayLabel = `Day${dayDifference + 1}`;

        // 새 일정을 로컬 상태에 추가
        const newSchedule = {
          id: data.scheduleId, // API에서 받은 ID 사용
          title,
          startDateTime,
          endDateTime,
          dayLabel
        };

        setSchedules(prevSchedules => sortSchedules([...prevSchedules, newSchedule]));
        return true;
      } else {
        handleError("API 오류", data.message);
        return false;
      }
    } catch (error) {
      handleError("서버 오류", "일정을 저장하는 중 오류가 발생했습니다.");
      return false;
    }
  };

  const removeSchedule = async (scheduleItemId) => {
      try {
        // DELETE 요청을 보냅니다. API 엔드포인트는 실제 주소로 수정해야 합니다.
        const response = await fetch(`${API_BASE_URL}/${ROOM_CODE}/${URL_ID}/${scheduleItemId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (response.ok && data.successes) {
          // API 호출이 성공하면 로컬 상태도 업데이트합니다
          setSchedules(prevSchedules =>
              prevSchedules.filter(schedule => schedule.id !== scheduleItemId)
          );
          return true;
        } else {
          // API 호출은 성공했지만 삭제가 실패한 경우
          handleError("삭제 실패", "일정을 삭제하는데 실패했습니다.");
          return false;
        }
      } catch (error) {
        // 네트워크 오류 등 예외가 발생한 경우
        handleError("서버 오류", "서버와 통신 중 오류가 발생했습니다.");
        return false;
      }
    };



  const modifySchedule = async (id, updatedData) => {
    // 먼저 시작 시간이 종료 시간보다 늦지 않은지 확인
    const startDateTime = `${updatedData.startDate}T${updatedData.startTime}`;
    const endDateTime = `${updatedData.endDate}T${updatedData.endTime}`;

    if (endDateTime < startDateTime) {
      handleError("입력 오류", "일정 종료시간은 시작시간보다 나중이어야 합니다.");
      return false;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${ROOM_CODE}/${URL_ID}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scheduleId: id,
          title: updatedData.title,
          content: updatedData.content || "", // content가 없는 경우 빈 문자열 처리
          startTime: startDateTime,
          endTime: endDateTime
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Day 레이블 다시 계산
        const start = new Date(tripStartDate);
        const selected = new Date(updatedData.startDate);
        const dayDifference = Math.floor((selected - start) / (1000 * 60 * 60 * 24));
        const dayLabel = `Day${dayDifference + 1}`;

        // 로컬 상태 업데이트
        setSchedules(prevSchedules =>
            sortSchedules(
                prevSchedules.map(schedule => {
                  if (schedule.id === id) {
                    return {
                      ...schedule,
                      id: data.scheduleItemId, // API 응답의 ID 사용
                      title: updatedData.title,
                      startDateTime,
                      endDateTime,
                      dayLabel
                    };
                  }
                  return schedule;
                })
            )
        );

        return true;
      } else {
        handleError("API 오류", "일정 수정에 실패했습니다.");
        return false;
      }
    } catch (error) {
      handleError("서버 오류", "일정을 수정하는 중 오류가 발생했습니다.");
      return false;
    }
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

          {isLoading ? (
              <p>일정을 불러오는 중...</p>
          ) : (
              <>
                <ScheduleDate
                    onDateRangeChange={handleDateRange}
                    onResetSchedules={resetSchedules}
                    initialStartDate={tripStartDate}
                    initialEndDate={tripEndDate}
                />
                {tripStartDate && tripEndDate && (
                    <AddSchedule
                        addSchedule={addSchedule}
                        tripStartDate={tripStartDate}
                        tripEndDate={tripEndDate}
                    />
                )}
                <ScheduleList
                    schedules={schedules}
                    removeSchedule={removeSchedule}
                    modifySchedule={modifySchedule}
                    tripStartDate={tripStartDate}
                    tripEndDate={tripEndDate}
                />
              </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleManager;