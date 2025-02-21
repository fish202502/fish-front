import React from "react";
import "./ShowUrl.css";

const ShowUrl = ({ data, handlecreateBtn }) => {
  
  // 링크 클릭 시 자동 복사
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("클립보드에 복사되었습니다!");
    });
  };

  // 새 창에서 링크 열기
  const handleOpenLink = (url) => {
    window.open(url, "_blank");
  };

  // 나가기 버튼 기능
  const handleExit = () => {
    handlecreateBtn();
  };

  return (
    <div className="container">
      <h1 className="title">방 생성 완료!</h1>
      <p>방 코드: <strong>{data.roomCode}</strong></p>

      <p className="copy-info">📌 링크를 클릭하면 복사됩니다.</p>  {/* 안내 문구 추가 */}

      <div className="url-group">
        <p>📖 읽기 전용 링크:</p>
        <input 
          type="text" 
          value={`http://localhost:5173/${data.roomCode}/${data.readUrl}`} 
          readOnly 
          onClick={(e) => handleCopy(e.target.value)}  // 클릭하면 복사
        />
        <button className="go-btn" onClick={() => handleOpenLink(`http://localhost:5173/${data.roomCode}/${data.readUrl}`)}>
          바로가기
        </button>
      </div>

      <div className="url-group">
        <p>✍️ 쓰기 전용 링크:</p>
        <input 
          type="text" 
          value={`http://localhost:5173/${data.roomCode}/${data.writeUrl}`} 
          readOnly 
          onClick={(e) => handleCopy(e.target.value)}  // 클릭하면 복사
        />
        <button className="go-btn" onClick={() => handleOpenLink(`http://localhost:5173/${data.roomCode}/${data.writeUrl}`)}>
          입장하기
        </button>
      </div>

      <div className="button-group">
        <button className="exit-btn" onClick={handleExit}>
          나가기
        </button>
      </div>
    </div>
  );
};

export default ShowUrl;
