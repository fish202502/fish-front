import React, { useState, useEffect } from "react";
import AddSchedule from "./AddSchedule";
import ScheduleList from "./ScheduleList";
import ScheduleDate from "./ScheduleDate.jsx";
import ErrorModal from "../ui/Modal/ErrorModal.jsx";
import styles from "./ScheduleManager.module.css";

const DUMMY_SCHEDULES = [];

const ScheduleManager = () => {
  const [schedules, setSchedules] = useState(DUMMY_SCHEDULES);
  const [tripStartDate, setTripStartDate] = useState('');
  const [tripEndDate, setTripEndDate] = useState('');
  const [scheduleId, setScheduleId] = useState(null);
  const [mainScheduleId, setMainScheduleId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPeriod, setHasPeriod] = useState(false);  // 여행 기간 존재 여부
  const [isEditingPeriod, setIsEditingPeriod] = useState(false); // 여행 기간 수정 여부
  const [invalidSchedules, setInvalidSchedules] = useState([]); // 유효하지 않은 일정 목록

  // 에러의 데이터를 관리하는 상태변수
  const [error, setError] = useState('');

  const ROOM_CODE = '0becd19e';
  const URL_ID = '174046472453e2c764';
  const API_BASE_URL = 'http://localhost:8999/api/fish/schedule';

  // 전체 일정 정보를 불러오는 함수
  const fetchScheduleData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/${ROOM_CODE}/${URL_ID}`); // 실제 엔드포인트로 수정 필요
      const data = await response.json();

      if (response.ok) {
        if (data.scheduleId) {  // 여행 기간이 이미 존재하는 경우
          setMainScheduleId(data.scheduleId);
          setScheduleId(data.scheduleId);

          const startDate = data.startTime.split('T')[0];
          const endDate = data.endTime.split('T')[0];
          setTripStartDate(startDate);
          setTripEndDate(endDate);
          setHasPeriod(true);  // 여행 기간 존재 표시

          // 일정 목록 처리 - 주석이 아닌 실제 코드로 수정
          if (data.scheduleItemList && data.scheduleItemList.length > 0) {
            const formattedSchedules = data.scheduleItemList.map(item => {
              const start = new Date(startDate);
              const itemDate = new Date(item.startTime.split('T')[0]);
              const dayDifference = Math.floor((itemDate - start) / (1000 * 60 * 60 * 24));

              return {
                id: item.scheduleItemId,
                title: item.title,
                content: item.content || "",
                startDateTime: item.startTime,
                endDateTime: item.endTime,
                dayLabel: `Day${dayDifference + 1}`
              };
            });

            setSchedules(sortSchedules(formattedSchedules));
          } else {
            // 일정이 없는 경우 빈 배열로 설정
            setSchedules([]);
          }
        }
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

  // 새 여행 기간에 맞지 않는 일정 찾기
  const findInvalidSchedules = (start, end, currentSchedules) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59); // 종료일 마지막 시간으로 설정

    return currentSchedules.filter(schedule => {
      const scheduleStartDate = new Date(schedule.startDateTime);
      const scheduleEndDate = new Date(schedule.endDateTime);

      // 일정이 새 여행 기간을 벗어나는 경우
      return (scheduleStartDate < startDate || scheduleEndDate > endDate);
    });
  };

  // handleDateRange 함수만 수정합니다
// ScheduleManager.jsx 파일에서 이 함수를 찾아 대체해주세요

// 여행기간을 저장하는 API 호출을 처리하는 함수
  const handleDateRange = async (start, end) => {
    try {
      // 새로운 여행 기간이 없는 경우 무시
      if (!start || !end) {
        setIsEditingPeriod(false);
        return;
      }

      // 일단 일정과 기간 불일치 여부 확인 (표시용)
      let hasInvalidSchedules = false;

      // 현재 일정 중 새 여행 기간에 맞지 않는 일정 확인
      if (schedules.length > 0) {
        const invalid = findInvalidSchedules(start, end, schedules);

        if (invalid.length > 0) {
          // 유효하지 않은 일정 목록 저장
          setInvalidSchedules(invalid);
          hasInvalidSchedules = true;
        }
      }

      // 여행 기간은 항상 저장 시도
      const response = await fetch(`${API_BASE_URL}/trip/${ROOM_CODE}/${URL_ID}`, {
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
        // 여행 기간 상태 업데이트
        setTripStartDate(start);
        setTripEndDate(end);
        setScheduleId(data.scheduleId);  // 응답으로 받은 ID 저장
        setHasPeriod(true);
        setIsEditingPeriod(false); // 편집 모드 종료

        // 기존 일정의 dayLabel 업데이트
        updateScheduleDayLabels(start);

        // 유효하지 않은 일정이 있는 경우, 저장 성공 후 경고 표시
        if (hasInvalidSchedules) {
          handleError(
            "일정 확인 필요",
            "여행 기간에 맞지 않은 일정이 있습니다. 수정해주세요."
          );
        }
      } else {
        handleError("API 오류", data.message);
      }
    } catch (error) {
      handleError("서버 오류", "여행 기간을 저장하는 중 오류가 발생했습니다.");
    }
  };

  // 일정의 dayLabel 업데이트
  const updateScheduleDayLabels = (newStartDate) => {
    if (schedules.length === 0) return;

    const start = new Date(newStartDate);

    const updatedSchedules = schedules.map(schedule => {
      const itemDate = new Date(schedule.startDateTime.split('T')[0]);
      const dayDifference = Math.floor((itemDate - start) / (1000 * 60 * 60 * 24));

      return {
        ...schedule,
        dayLabel: `Day${dayDifference + 1}`
      };
    });

    setSchedules(sortSchedules(updatedSchedules));
  };

  const handleError = (title, message) => {
    setError({title, message});
  }

  //  일정 목록을 정렬하는 함수 (날짜 + 시간 기준 정렬)
  const sortSchedules = (schedules) => {
    return [...schedules].sort((a, b) => {
      return new Date(a.startDateTime) - new Date(b.startDateTime);
    });
  };

  // 일정 추가 함수
  const addSchedule = async (title, startDate, startTime, endDate, endTime) => {
    if (!title.trim()) {
      handleError("입력 오류", "일정 제목을 입력해야 합니다.");
      return false;
    }
    if (!startDate || !startTime) {
      handleError("입력 오류", "일정 시작날짜와 시간은 필수입니다.");
      return false;
    }

    // 종료 날짜를 선택하지 않으면 시작 날짜로 자동 입력
    const finalEndDate = endDate || startDate;
    // 종료 시간을 입력하지 않으면 시작 시간으로 자동 입력
    const finalEndTime = endTime || startTime;

    // 날짜와 시간을 합쳐 ISO 형식으로 변환
    const startDateTime = `${startDate}T${startTime}:00`;
    const endDateTime = `${finalEndDate}T${finalEndTime}:00`;

    if(endDateTime < startDateTime) {
      handleError("입력오류", "일정종료시간은 시작시간보다 나중이어야 합니다.")
      return false;
    }

    // 요청 데이터 로깅
    const requestBody = {
      scheduleId: scheduleId,
      title:title,
      content:"",
      startTime: startDateTime,
      endTime: endDateTime
    };

    console.log('요청 본문:', requestBody); // 디버깅용

    try {
      const response = await fetch(`${API_BASE_URL}/${ROOM_CODE}/${URL_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      console.log('일정추가 응답', data)

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
        // 삭제 후 새로운 배열 생성 방식으로 변경
        const updatedSchedules = schedules.filter(schedule => schedule.id !== scheduleItemId);
        setSchedules(updatedSchedules);

        // 삭제 후 invalidSchedules 목록 업데이트
        if (invalidSchedules.some(s => s.id === scheduleItemId)) {
          const updatedInvalidSchedules = invalidSchedules.filter(s => s.id !== scheduleItemId);
          setInvalidSchedules(updatedInvalidSchedules);

          // 모든 유효하지 않은 일정이 삭제되었는지 확인
          if (updatedInvalidSchedules.length === 0) {
            setError(null); // 에러 메시지 제거
          }
        }

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
    // 시간 문자열 정규화 함수
    const normalizeTimeString = (timeStr) => {
      // 입력이 없는 경우 처리
      if (!timeStr) return '00:00:00';

      // 콜론(:) 개수로 형식 확인
      const colonCount = (timeStr.match(/:/g) || []).length;

      if (colonCount === 0) {
        // 형식이 없는 경우 (예: "1430")
        return `${timeStr.substring(0, 2)}:${timeStr.substring(2, 4)}:00`;
      } else if (colonCount === 1) {
        // HH:MM 형식
        return `${timeStr}:00`;
      } else {
        // 이미 초가 있는 경우 (HH:MM:SS)
        return timeStr;
      }
    };

    // 날짜와 시간을 합쳐 ISO 형식으로 변환 (정규화 적용)
    const startDateTime = `${updatedData.startDate}T${normalizeTimeString(updatedData.startTime)}`;
    const endDateTime = `${updatedData.endDate}T${normalizeTimeString(updatedData.endTime)}`;

    if (endDateTime < startDateTime) {
      handleError("입력 오류", "일정 종료시간은 시작시간보다 나중이어야 합니다.");
      return false;
    }

    // 여행 기간 범위 검사
    const startDate = new Date(tripStartDate);
    const endDate = new Date(tripEndDate);
    endDate.setHours(23, 59, 59);

    const scheduleStart = new Date(startDateTime);
    const scheduleEnd = new Date(endDateTime);

    if (scheduleStart < startDate || scheduleEnd > endDate) {
      handleError("입력 오류", `일정은 여행 기간(${tripStartDate} ~ ${tripEndDate}) 내에 있어야 합니다.`);
      return false;
    }

    // 요청 본문
    const requestBody = {
      scheduleId: id,
      title: updatedData.title,
      content: "",
      startTime: startDateTime,
      endTime: endDateTime
    };

    console.log('수정 요청 본문:', requestBody);

    try {
      const response = await fetch(`${API_BASE_URL}/${ROOM_CODE}/${URL_ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      console.log('수정 응답:', data);

      if (response.ok) {
        // 유효하지 않은 일정 목록 업데이트
        if (invalidSchedules.some(s => s.id === id)) {
          // 수정 후 다시 유효성 검사
          const isStillInvalid = (scheduleStart < startDate || scheduleEnd > endDate);

          if (!isStillInvalid) {
            // 일정이 이제 유효하므로 invalidSchedules에서 제거
            const updatedInvalidSchedules = invalidSchedules.filter(s => s.id !== id);
            setInvalidSchedules(updatedInvalidSchedules);

            // 모든 유효하지 않은 일정이 수정되었는지 확인
            if (updatedInvalidSchedules.length === 0) {
              setError(null); // 에러 메시지 제거
            }
          }
        }

        // 일정 목록 다시 불러오기
        await fetchScheduleData();
        return true;
      } else {
        handleError("API 오류", data.message || "일정 수정에 실패했습니다.");
        return false;
      }
    } catch (error) {
      console.error('수정 중 오류:', error);
      handleError("서버 오류", "일정을 수정하는 중 오류가 발생했습니다.");
      return false;
    }
  };

  // 여행 기간 수정 취소 시 호출되는 함수
  const cancelEditingPeriod = () => {
    setIsEditingPeriod(false);
    setInvalidSchedules([]); // 무효한 일정 목록 초기화
  };

  // 여행 기간 수정 모드 토글
  const toggleEditingPeriod = () => {
    setIsEditingPeriod(!isEditingPeriod);

    // 편집 모드를 종료할 때 무효한 일정 목록 초기화
    if (isEditingPeriod) {
      setInvalidSchedules([]);
    }
  };

  // 모달 닫기 함수
  const closeErrorModal = () => {
    // 무조건 에러 상태 초기화
    setError(null);

  };

  return (
    <div className={styles.container}>
      {error && <ErrorModal title={error.title} message={error.message} onClose={closeErrorModal} />}
      <div className={styles.diaryContainer}>
        <h2 className={styles.title}> Travel Planner </h2>
        <div className={styles.whiteContainer}>
          {isLoading ? (
            <p>일정을 불러오는 중...</p>
          ) : (
            <>
              {!hasPeriod ? (
                // 여행 기간이 없는 경우에만 ScheduleDate 표시
                <ScheduleDate
                  onDateRangeChange={handleDateRange}
                  initialStartDate={tripStartDate}
                  initialEndDate={tripEndDate}
                  noModalNeeded={true} // 모달 표시하지 않음
                />
              ) : (
                // 여행 기간이 있는 경우, 기간 표시와 편집 모드에 따른 컴포넌트 표시
                <>
                  {isEditingPeriod ? (
                    // 편집 모드일 때 ScheduleDate 컴포넌트 표시
                    <ScheduleDate
                      onDateRangeChange={handleDateRange}
                      initialStartDate={tripStartDate}
                      initialEndDate={tripEndDate}
                      noModalNeeded={true} // 모달 표시하지 않음
                      onCancel={cancelEditingPeriod} // 취소 기능 추가
                    />
                  ) : (
                    // 편집 모드가 아닐 때 기간 표시
                    <div className={styles.fixContainer}>
                      <p className={styles.beforeComment}>
                        ✈ 여행기간: {tripStartDate} ~ {tripEndDate}
                      </p>
                      <button
                        onClick={toggleEditingPeriod}
                        className={styles.fixBtn}
                      >
                        수정
                      </button>
                    </div>
                  )}

                  {/* 여행 기간 수정 중에도 AddSchedule과 ScheduleList 계속 표시 */}
                  <AddSchedule
                    addSchedule={addSchedule}
                    tripStartDate={tripStartDate}
                    tripEndDate={tripEndDate}
                  />
                  <ScheduleList
                    schedules={schedules}
                    removeSchedule={removeSchedule}
                    modifySchedule={modifySchedule}
                    tripStartDate={tripStartDate}
                    tripEndDate={tripEndDate}
                    invalidSchedules={invalidSchedules} // 유효하지 않은 일정 목록 전달
                  />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleManager;