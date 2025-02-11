import React, { useState } from "react";
import AddFinancial from "./AddFinancial";
import FinancialList from "./FinancialList";

const DUMMY_Financials =[
  {id:1, name:'김철수' ,title: '금오름 가기',expense: 50000, date: "2024-01-01", time: "8:00" },
  {id:2, name:'이장군',title: '점심먹기',expense: 65000, date: "2024-01-01",time: "12:00"},
  {id:3, name:'박혁거',title: '오설록 티 뮤지엄 가기',expense: 44000, date: "2024-01-02", time: "15:30" },
];

const FinancialManager = () => {
  const [financials, setFinancials] = useState(DUMMY_Financials);

  // 일정 추가 함수
  const addFinancial = (name, title,expense, date, time) => {
    const newFinancial = {
      id: Date.now(),
      name,
      title,
      expense,
      date,
      time,
    };
    setFinancials([...financials, newFinancial]);
  };

  // 일정 삭제 함수
  const removeFinancial = (id) => {
    setFinancials(financials.filter((financial) => financial.id !== id));
  };


  return (
    <div>
      <h2>📅 여행 일정 관리</h2>
      <AddFinancial addFinancial={addFinancial}/>
      <FinancialList  financials={financials} removeFinancial={removeFinancial} />
    </div>
  );
};

export default FinancialManager;