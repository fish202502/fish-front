import React, { useState,useEffect } from "react";

const DdayCounter = ({ startDate, endDate, onDaySelect }) => {

  const [days, setDays] = useState([]);

  useEffect(() => {
    if (startDate && endDate) {
      calculateDdays(startDate, endDate);
    }
  }, [startDate, endDate]);

  // D-Day 리스트 생성
  const calculateDdays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const dayCount = (endDate - startDate) / (1000 * 60 * 60 * 24); // 일 단위 변환
    const ddayList = Array.from({ length: dayCount + 1 }, (_, i) => `Day${i}`);
    setDays(ddayList);
  };

  return (
    <div>
      <label>옵션 선택: </label>
      <select onChange ={(e) => onDaySelect(e.target.value)}>
        <option value="">-- Day 선택 --</option>
        {days.map((day, index) => (
          <option key={index} value={day}>{day}</option>
        ))}
      </select>
    </div>
  );
};

export default DdayCounter;