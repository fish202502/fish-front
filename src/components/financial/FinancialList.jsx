import React, { useState } from "react";
import "./FinancialList.css";
import FinancialDutch from "./FinancialDutch";
import ErrorModal from "../ui/Modal/ErrorModal";
import ImageModal from "../ui/Modal/ImageModal";

const FinancialList = ({ financials, removeFinancial, modifyFinancial, hasPermission }) => {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    spender: "",
    description: "",
    amount: 0,
    spendAt: "",
    images: [],
  });
  const [previewImg, setPreviewImg] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // 이미지 모달 상태
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // 이미지 클릭 핸들러
  const handleImageClick = (imageUrl) => {
    setSelectedImage("http://localhost:8999" + imageUrl);
    setImageModalOpen(true);
  };

  // 이미지 모달 닫기
  const closeImageModal = () => {
    setImageModalOpen(false);
    setSelectedImage(null);
  };

  // 수정 버튼 클릭 시
  const handleEditClick = (financial) => {
    // 권한이 없으면 수정 불가
    if (!hasPermission) return;
    
    setEditingId(financial.id);
    
    // 날짜 시간 형식 변환 (백엔드 형식에 맞춤)
    const formattedSpendAt = formatDateTimeForInput(financial.spendAt);
    
    setEditData({
      spender: financial.spender,
      description: financial.description,
      amount: financial.amount,
      spendAt: formattedSpendAt,
      images: financial.images || []
    });
    
    // 이미지가 있는 경우 미리보기 설정
    if (financial.images && financial.images.length > 0) {
      // 기존 방식 유지 - 서버 경로만 저장
      const imagePath = financial.images[0];
      setPreviewImg(imagePath);
    } else {
      setPreviewImg(null);
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

  // 이미지 삭제 핸들러
  const handleImageDelete = () => {
    setPreviewImg(null);
    setImageFile(null);
    setEditData({ ...editData, images: [] });
  };

  // 저장 버튼 클릭 시
  const handleSave = () => {
    // 권한이 없으면 저장 불가
    if (!hasPermission) return;
    
    // FormData 객체 생성
    const submitFormData = new FormData();

    // JSON 데이터 생성
    const expenseData = {
      spender: editData.spender,
      description: editData.description,
      amount: Number(editData.amount),
      spendAt: editData.spendAt,
    };

    // FormData에 expense 키로 JSON 문자열 추가
    const jsonBlob = new Blob([JSON.stringify(expenseData)], { type: 'application/json' });
    submitFormData.append('expense', jsonBlob);

    // 이미지 처리 로직 수정
    if (imageFile) {
      // 새 이미지 파일이 있는 경우
      submitFormData.append("images", imageFile);
    } else if (previewImg) {
      // 원래 이미지를 그대로 유지하는 경우 (이미지 URL에서 호스트 부분 제거)
      // 서버에 이미지 경로만 전달하기 위해 URL에서 'http://localhost:8999' 부분 제거
      const originalImagePath = previewImg.includes("http://localhost:8999")
        ? previewImg.replace("http://localhost:8999", "")
        : previewImg;

      submitFormData.append("existingImage", originalImagePath);
      submitFormData.append("removeImage", "false");
    } else {
      // 이미지를 삭제하는 경우
      submitFormData.append("removeImage", "true");
    }

    modifyFinancial(editingId, submitFormData);
    setEditingId(null);
    setImageFile(null);
    setPreviewImg(null);
  };

  // 삭제 버튼 클릭 시 (모달 열기)
  const handleDeleteClick = (id) => {
    // 권한이 없으면 삭제 불가
    if (!hasPermission) return;
    
    setSelectedId(id);
    setModalOpen(true);
  };

  // 삭제 확정
  const confirmDelete = () => {
    if (selectedId !== null && hasPermission) {
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
  const totalAmount = financials
    .reduce((sum, financial) => sum + Number(financial.amount), 0)
    .toLocaleString("ko-KR");

  // 날짜 시간 표시 형식화 함수
  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return "";
    const date = new Date(dateTimeStr);
    console.log("ddd:", date);

    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  return (
    <>
      <div className="listFrame">
        <ul>
          {financials.length === 0 ? (
            <p>📌 등록된 지출이 없습니다.</p>
          ) : (
            financials.map((financial) => (
              <li key={financial.id} className="financial-item">
                {editingId === financial.id ? (
                  <div className="edit-mode">
                    <input
                      className="listInput"
                      type="text"
                      name="spender"
                      value={editData.spender}
                      onChange={handleChange}
                      placeholder="지출자"
                      disabled={!hasPermission}
                    />
                    <input
                      className="listInput"
                      type="text"
                      name="description"
                      value={editData.description}
                      onChange={handleChange}
                      placeholder="설명"
                      disabled={!hasPermission}
                    />
                    <input
                      className="listInput"
                      type="number"
                      name="amount"
                      value={editData.amount}
                      onChange={handleChange}
                      placeholder="금액"
                      disabled={!hasPermission}
                    />
                    <input
                      className="listInput"
                      type="datetime-local"
                      name="spendAt"
                      value={editData.spendAt}
                      onChange={handleChange}
                      disabled={!hasPermission}
                    />
                    
                    {hasPermission && (
                      <input
                        className="modifiImage"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    )}
                 
                    {previewImg && (
                      <div>
                        <img
                          src={
                            previewImg.startsWith("data:")
                              ? previewImg
                              : `http://localhost:8999${previewImg}`
                          }
                          alt="미리보기"
                          className="preview-image"
                          onError={(e) => {
                            console.error("이미지 로딩 실패:", previewImg);
                            e.target.onerror = null; // 무한 루프 방지
                          }}
                        />
                        {hasPermission && (
                          <button
                            type="button"
                            onClick={handleImageDelete}
                            className="deleteButton"
                          >
                            삭제
                          </button>
                        )}
                      </div>
                    )}
                    <div className="button-group">
                      {hasPermission && (
                        <>
                          <button onClick={handleSave} className="financialButton">
                            💾 저장
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="financialButton"
                          >
                            ❌ 취소
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="financial-content">
                    <span className="financial-text">
                      📅 {financial.spender}{" "}
                      {Number(financial.amount).toLocaleString("ko-KR")}원
                      {formatDateTime(financial.spendAt)} -{" "}
                      {financial.description}
                    </span>

                    {financial.images && financial.images.length > 0 && (
                      <img
                        src={"http://localhost:8999" + financial.images[0]}
                        alt="지출 이미지"
                        className="list-image"
                        onClick={() => handleImageClick(financial.images[0])}
                        style={{ cursor: "pointer" }}
                        title="클릭하여 확대"
                      />
                    )}

                    {hasPermission && (
                      <div className="button-group">
                        <button
                          onClick={() => handleEditClick(financial)}
                          className="modifyButton"
                        >수정
                        </button>
                        <button
                          onClick={() => handleDeleteClick(financial.id)}
                          className="deleteButton"
                        >삭제
                        </button>
                      </div>
                    )}
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

      {/* 삭제 확인 모달 */}
      {modalOpen && (
        <ErrorModal
          title="삭제"
          message="정말 삭제하시겠습니까?"
          closeModal={closeModal}
          onConfirm={confirmDelete}
        />
      )}

      {/* 이미지 확대 모달 */}
      {imageModalOpen && selectedImage && (
        <ImageModal imageUrl={selectedImage} closeModal={closeImageModal} />
      )}
    </>
  );
};

export default FinancialList;