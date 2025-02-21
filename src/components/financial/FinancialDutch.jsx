import React from "react";
import "./FinancialDutch.css"

const FinancialDutch = ({ financials }) => {
  const financialList = financials || [];

  // 이름별로 금액을 합산하는 함수 (spender 필드 사용)
  const groupExpensesByName = (transactions) => {
    return transactions.reduce((acc, curr) => {
      acc[curr.spender] = (acc[curr.spender] || 0) + Number(curr.amount);
      return acc;
    }, {});
  };

  // 이름별로 그룹화된 지출 내역
  const groupedExpenses = groupExpensesByName(financialList);

  // 총 금액 및 1인당 부담 금액 계산
  const totalAmount = Object.values(groupedExpenses).reduce(
    (sum, expense) => sum + expense,
    0
  );
  const numPeople = Object.keys(groupedExpenses).length;
  const equalShare = numPeople > 0 ? totalAmount / numPeople : 0; // 1인당 부담 금액

  // 각 사람이 얼마를 더 내야 하는지 or 받아야 하는지 계산
  const balance = Object.entries(groupedExpenses).map(([name, totalExpense]) => ({
    name,
    amount: totalExpense - equalShare, // +면 받아야 하고, -면 내야 함
  }));

  // 돈을 내야 하는 사람(negative)과 받아야 하는 사람(positive) 분리
  const payers = balance.filter((person) => person.amount < 0).sort((a, b) => a.amount - b.amount);
  const receivers = balance.filter((person) => person.amount > 0).sort((a, b) => b.amount - a.amount);

  // 돈을 내야 하는 사람과 받아야 하는 사람 매칭
  const transactions = [];
  let payerIndex = 0;
  let receiverIndex = 0;

  while (payerIndex < payers.length && receiverIndex < receivers.length) {
    const payer = payers[payerIndex];
    const receiver = receivers[receiverIndex];

    const transferAmount = Math.min(-payer.amount, receiver.amount); // 송금할 금액 결정
    const roundedAmount = Math.round(transferAmount); // 정수로 반올림
    
    if (roundedAmount > 0) {
      transactions.push(`${payer.name} ➡ ${receiver.name}: ${roundedAmount.toLocaleString()}원`);
    }

    // 금액 조정
    payer.amount += transferAmount;
    receiver.amount -= transferAmount;

    // 금액이 0이면 다음 사람으로 이동
    if (Math.abs(payer.amount) < 1) payerIndex++;
    if (Math.abs(receiver.amount) < 1) receiverIndex++;
  }

  return (
    <form className="dutchForm">
      <h2>💰 더치페이 계산기</h2>
      <div>
        <h3>정산 내용</h3>
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
            <p>1인당 부담 금액: {Math.round(equalShare).toLocaleString()}원</p>
          </div>
        )}
      </div>

      {/* 정산 결과 표시 */}
      {transactions.length > 0 && (
        <div>
          <h3>💳 정산해야 할 금액</h3>
          <ul>
            {transactions.map((t, index) => (
              <li key={index}>{t}</li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
};

export default FinancialDutch;