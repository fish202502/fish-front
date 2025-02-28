
import React from "react";
import "./ShareModal.css"; // 스타일을 위한 CSS 파일 (따로 추가 필요)
import KakaoShareButton from "./kakao";

const ShareModal = ({ url, onClose, onShare }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>✖</button>
        <button className="share-btn" onClick={onShare}>
          <img src="src\components\img\kakao.png" alt="공유 버튼" />
        </button>
        <input className="url-box" type="text" value={url} readOnly />
        <KakaoShareButton url={url}/>
      </div>
    </div>
  );
};

export default ShareModal;
