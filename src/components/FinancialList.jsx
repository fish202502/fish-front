import React, { useState } from "react";

const FinancialList = ({ financials, removeFinancial, modifyFinancial }) => {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: "", title: "", expense: 0, date: "", time: "" });

  const handleEditClick = (financial) => {
    setEditingId(financial.id);
    setEditData(financial);
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    modifyFinancial(editingId, editData);
    setEditingId(null);
  };

  const totalAmount = financials.reduce((sum, financial) => sum + Number(financial.expense), 0);



  return (
    <React.Fragment>
      <ul>
        {financials.length === 0 ? (
          <p>📌 등록된 일정이 없습니다.</p>
        ) : (
          financials.map((financial) => (
            <li key={financial.id}>
              {editingId === financial.id ? (
                <>
                  <input type="text" name="name" value={editData.name} onChange={handleChange} />
                  <input type="text" name="title" value={editData.title} onChange={handleChange} />
                  <input type="number" name="expense" value={editData.expense} onChange={handleChange} />
                  <input type="date" name="date" value={editData.date} onChange={handleChange} />
                  <input type="time" name="time" value={editData.time} onChange={handleChange} />
                  <button onClick={handleSave}>💾 저장</button>
                  <button onClick={() => setEditingId(null)}>❌ 취소</button>
                </>
              ) : (
                <>
                  📅 {financial.name} {financial.date} {financial.expense}원 {financial.time} - {financial.title}
                  <button onClick={() => handleEditClick(financial)}>✏ 수정</button>
                  <button onClick={() => removeFinancial(financial.id)}>❌ 삭제</button>
                </>
              )}
            </li>
          ))
        )}
      </ul>
      <div>총 금액: {totalAmount} 원</div>
    </React.Fragment>
  );
};

export default FinancialList;
