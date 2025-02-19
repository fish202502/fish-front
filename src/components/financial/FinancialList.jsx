import React, { useState } from "react";
import "./FinancialList.css";
import FinancialDutch from "./FinancialDutch";
import ErrorModal from "./ErrorModal";

const FinancialList = ({ financials, removeFinancial, modifyFinancial }) => {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ 
    spender: "", 
    description: "", 
    amount: 0, 
    spendAt: "",
    images: []
  });
  const [previewImg, setPreviewImg] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // 수정 버튼 클릭 시
  const handleEditClick = (financial) => {
    setEditingId(financial.id);
    
    // 날짜 시간 형식 변환 (백엔드 형식에 맞춤)
    const formattedSpendAt = formatDateTimeForInput(financial.spendAt);
    
    setEditData({
      spender: financial.spender,
      description: financial.description,
      amount: financial.amount,
      spendAt: formattedSpendAt
    });
    
    // 이미지가 있는 경우 미리보기 설정
    if (financial.images && financial.images.length > 0) {
      setPreviewImg(financial.images[0]); // 첫 번째 이미지를 미리보기로 표시
    }
  };

  // 날짜 시간 형식 변환 함수
  const formatDateTimeForInput = (dateTimeStr) => {
    if (!dateTimeStr) return "";
    const date = new Date(dateTimeStr);
    return date.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM 형식으로 변환
  };

  // 입력 변경 핸들러
  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImg(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // 저장 버튼 클릭 시
  const handleSave = () => {
    // FormData 객체 생성
    const submitFormData = new FormData();
    
    submitFormData.append('spender', editData.spender);
    submitFormData.append('description', editData.description);
    submitFormData.append('amount', editData.amount);
    submitFormData.append('spendAt', editData.spendAt);
    
    if (imageFile) {
      submitFormData.append('images', imageFile);
    }

    modifyFinancial(editingId, submitFormData);
    setEditingId(null);
    setImageFile(null);
    setPreviewImg(null);
  };

  // 삭제 버튼 클릭 시 (모달 열기)
  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setModalOpen(true);
  };

  // 삭제 확정
  const confirmDelete = () => {
    if (selectedId !== null) {
      removeFinancial(selectedId);
      setSelectedId(null);
    }
    setModalOpen(false);
  };

  // 취소 버튼 클릭 시 모달 닫기
  const closeModal = () => {
    setModalOpen(false);
    setSelectedId(null);
  };

  // 총 지출 금액 계산
  const totalAmount = financials.reduce((sum, financial) => 
    sum + Number(financial.amount), 0).toLocaleString('ko-KR');

  // 날짜 시간 표시 형식화 함수
  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return "";
    const date = new Date(dateTimeStr);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
  };

  return (
    <>
      <div className="Frame">
        <ul>
          {financials.length === 0 ? (
            <p>📌 등록된 지출이 없습니다.</p>
          ) : (
            financials.map((financial) => (
              <li key={financial.id} className="financial-item">
                {editingId === financial.id ? (
                  <div className="edit-mode">
                    <input 
                      type="text" 
                      name="spender" 
                      value={editData.spender} 
                      onChange={handleChange} 
                      placeholder="지출자"
                    />
                    <input 
                      type="text" 
                      name="description" 
                      value={editData.description} 
                      onChange={handleChange} 
                      placeholder="설명"
                    />
                    <input 
                      type="number" 
                      name="amount" 
                      value={editData.amount} 
                      onChange={handleChange} 
                      placeholder="금액"
                    />
                    <input 
                      type="datetime-local" 
                      name="spendAt" 
                      value={editData.spendAt} 
                      onChange={handleChange} 
                    />

                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                    />
                    
                    {previewImg && (
                      <div>
                        <img 
                          src={previewImg} 
                          alt="미리보기" 
                          className="preview-image" 
                        />
                        <button 
                          type="button" 
                          onClick={() => { 
                            setPreviewImg(null); 
                            setImageFile(null);
                          }} 
                          className="financialButton"
                        >
                          ❌ 삭제
                        </button>
                      </div>
                    )}

                    <div className="button-group">
                      <button 
                        onClick={handleSave} 
                        className="financialButton"
                      >
                        💾 저장
                      </button>
                      <button 
                        onClick={() => setEditingId(null)} 
                        className="financialButton"
                      >
                        ❌ 취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="financial-content">
                    <span className="financial-text">
                      📅 {financial.spender} {Number(financial.amount).toLocaleString('ko-KR')}원 
                      {formatDateTime(financial.spendAt)} - {financial.description}
                    </span>
                    
                    {financial.images && financial.images.length > 0 && (
                      <img 
                        src={financial.images[0]} 
                        alt="지출 이미지" 
                        className="list-image" 
                      />
                    )}
                    
                    <div className="button-group">
                      <button 
                        onClick={() => handleEditClick(financial)} 
                        className="financialButton"
                      >
                        ✏ 수정
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(financial.id)} 
                        className="financialButton"
                      >
                        ❌ 삭제
                      </button>
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

      {modalOpen && (
        <ErrorModal 
          title="삭제" 
          message="정말 삭제하시겠습니까?" 
          closeModal={closeModal} 
          onConfirm={confirmDelete} 
        />
      )}
    </>
  );
};

export default FinancialList;