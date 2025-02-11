import React from "react";


const FinancialList = ({ financials, removeFinancial }) => {

  return (
    <ul>
      {financials.length === 0 ? (
        <p>📌 등록된 일정이 없습니다.</p>
      ) : (
        financials.map((financial) => (
          <li key={financial.id}>
            📅 {financial.name} {financial.date} {financial.expense}원 {financial.time} - {financial.title}
            <button onClick={() => removeFinancial(financial.id)}>❌ 삭제</button>
          </li>
        ))
      )}
    </ul>
  );
};

export default FinancialList;