import React from 'react';

const FinancialDutch = ({ financials }) => {
  const financialList = financials || [];
  
  // 이름별로 금액을 합산하는 함수
  const groupExpensesByName = (transactions) => {
    return transactions.reduce((acc, curr) => {
      // 현재 이름이 이미 있으면 금액을 더하고, 없으면 새로 추가
      acc[curr.name] = (acc[curr.name] || 0) + Number(curr.expense);
      return acc;
    }, {});
  };

  // 이름별로 그룹화된 지출 내역
  const groupedExpenses = groupExpensesByName(financialList);

  // 총 금액 계산
  const totalAmount = Object.values(groupedExpenses).reduce((sum, expense) => sum + expense, 0);

  return (
    <form>
      <h2>N빵 계산기</h2>
      <div>
        <div>정산 내용</div>
        <ul>
          {financialList.length === 0 ? (
            <p>📌 정산할 내역이 없습니다.</p>
          ) : (
            Object.entries(groupedExpenses).map(([name, totalExpense]) => (
              <li key={name}>
                {name}: {totalExpense.toLocaleString()}원
              </li>
            ))
          )}
        </ul>
        {financialList.length > 0 && (
          <div>
            <p>총 금액: {totalAmount.toLocaleString()}원</p>
          </div>
        )}
      </div>
    </form>
  );
};

export default FinancialDutch;