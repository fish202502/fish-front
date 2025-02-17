import React, { useState } from "react";
import "./FinancialList.css";
import FinancialDutch from "./FinancialDutch";
import ErrorModal from "./ErrorModal";

const FinancialList = ({ financials, removeFinancial, modifyFinancial }) => {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: "", title: "", expense: 0, date: "", time: "", img: null });
  const [previewImg, setPreviewImg] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null); // 삭제할 아이템 저장

  // 수정 버튼 클릭 시
  const handleEditClick = (financial) => {
    setEditingId(financial.id);
    setEditData(financial);
    setPreviewImg(financial.img || null); // 기존 이미지 미리보기
  };

  // 입력 변경 핸들러
  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setEditData({ ...editData, img: reader.result }); // Base64 이미지 저장
      setPreviewImg(reader.result); // 미리보기용 이미지 저장
    };
    reader.readAsDataURL(file);
  };

  // 저장 버튼 클릭 시
  const handleSave = () => {
    modifyFinancial(editingId, editData);
    setEditingId(null);
  };

  // 삭제 버튼 클릭 시 (모달 열기)
  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setModalOpen(true); // 모달 열기
  };

  // 삭제 확정
  const confirmDelete = () => {
    if (selectedId !== null) {
      removeFinancial(selectedId); // 삭제 실행
      setSelectedId(null);
    }
    setModalOpen(false); // 모달 닫기
  };

  // 취소 버튼 클릭 시 모달 닫기
  const closeModal = () => {
    setModalOpen(false);
    setSelectedId(null);
  };

  // 총 지출 금액 계산
  const totalAmount = financials.reduce((sum, financial) => sum + Number(financial.expense), 0);

  return (
    <>
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

                    {/* 이미지 업로드 */}
                    <input type="file" accept="image/*" onChange={handleImageUpload} />
                    {previewImg && (
                      <div>
                        <img src={previewImg} alt="미리보기" className="preview-image" />
                        <button type="button" onClick={() => { setEditData({ ...editData, img: null }); setPreviewImg(null); }}>❌ 삭제</button>
                      </div>
                    )}

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
                    {financial.img && <img src={financial.img} alt="이미지" className="list-image" />} {/* 저장된 이미지 표시 */}
  
                    <div className="button-group">
                      <button onClick={() => handleEditClick(financial)}>✏ 수정</button>
                      <button onClick={() => handleDeleteClick(financial.id)}>❌ 삭제</button>
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

      <FinancialDutch financials={financials} />

      {modalOpen && <ErrorModal title="삭제" message="정말 삭제하시겠습니까?" closeModal={closeModal} onConfirm={confirmDelete} />}
    </>
  );
};

export default FinancialList;
