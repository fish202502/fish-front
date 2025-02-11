import React, { useState } from "react";
import './FinancialForm.css';

const FinancialForm = ({ name }) => { 
  const [form, setForm] = useState({
    name: "",
    amount: "",
    category: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("입력된 지출:", form);
    setForm({ name: "", amount: "", category: "" });
  };

  return (
   
    <div className="container">
      <div>{name} 회원 </div>  
      <form id="expense-form" onSubmit={handleSubmit}>
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
        <button type="submit">추가</button>
      </form>
    </div>
  
  );
};

export default FinancialForm;
