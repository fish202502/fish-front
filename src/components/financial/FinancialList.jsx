import React, { useRef, useState } from "react";
import './FinancialList.css'

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


  // 지출 금액
  const totalAmount = financials.reduce((sum, financial) => sum + Number(financial.expense), 0);
  

  // const dialogRef = useRef();

  // 잔액을 다 사용했을 때 띄워질 모달

  
  return (
    
    <div className="Frame">
      
      <ul>
        {financials.length === 0 ? (
          <p>📌 등록된 일정이 없습니다.</p>
        ) : (
          financials.map((financial) => (
            <li key={financial.id} className="financial-item">
              {editingId === financial.id ? (
                <div className="edit-mode">
                  <input type="text" name="name" value={editData.name} onChange={handleChange} />
                  <input type="text" name="title" value={editData.title} onChange={handleChange} />
                  <input type="number" name="expense" value={editData.expense} onChange={handleChange} />
                  <input type="date" name="date" value={editData.date} onChange={handleChange} />
                  <input type="time" name="time" value={editData.time} onChange={handleChange} />
                  <div className="button-group">
                    <button onClick={handleSave}>💾 저장</button>
                    <button onClick={() => setEditingId(null)}>❌ 취소</button>
                  </div>
                </div>
              ) : (
                <div className="financial-content">
                  <span className="financial-text">
                    📅 {financial.name} {financial.expense}원 {financial.date} {financial.time} - {financial.title}
                  </span>
                  <div className="button-group">
                    <button onClick={() => handleEditClick(financial)}>✏ 수정</button>
                    <button onClick={() => removeFinancial(financial.id)}>❌ 삭제</button>
                  </div>
                </div>
              )}
            </li>
          ))
        )}
      </ul>
      <div className="Amount">
        <div> 지출 금액: {totalAmount} 원</div>
      </div>
    </div>
  );
};

export default FinancialList;
