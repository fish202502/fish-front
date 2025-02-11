import React, { useState } from "react";
import './FinancialForm.css';

const FinancialForm = ({ name }) => { 
  const [form, setForm] = useState({
    name: "", // 폼 상태에는 빈 문자열로 초기화
    amount: "",
    category: "",
  });

  const [expenses, setExpenses] = useState([]); // 추가된 상태: 지출 항목들을 저장

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 금액이 1원 이하일 때 알림 표시
    if (parseInt(form.amount) < 1000 || form.amount === "") {
      alert('잔액은 천원~백만원 사이로 기입하세요');
      return; 
    }

    // 새로 입력된 지출 항목을 expenses 배열에 추가
    setExpenses([...expenses, form]);

    console.log("입력된 지출:", form);
    setForm({ name: "", amount: "", category: "" }); // 폼 초기화
  };

  return (
    <div className="container">
      <form id="expense-form" onSubmit={handleSubmit}>
        <input 
          name="name" 
          type="text" 
          placeholder="이름" 
          value={form.name} 
          onChange={handleChange} 
        />
        <input 
          name="amount" 
          type="number" 
          placeholder="금액" 
          value={form.amount} 
          onChange={handleChange} 
        />
        <select name="category" value={form.category} onChange={handleChange}>
          <option value="">카테고리 선택</option>
          <option value="식비">식비</option>
          <option value="교통비">교통비</option>
          <option value="쇼핑">쇼핑</option>
        </select>
        <button type="submit">입력</button>
      </form>

      <div>
        <h3>입력된 지출 목록</h3>
        {/* expenses 배열을 map()으로 렌더링 */}
        <ul>
          {expenses.map((expense, index) => (
            <li key={index}>
              {expense.name} 회원 - {expense.amount} 원 - {expense.category}
            </li>
          ))}
          <div>총 지출금액</div>
        </ul>
      </div>
    </div>
  );
};

export default FinancialForm;
