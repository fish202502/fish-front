import React, { use, useContext, useEffect, useRef, useState } from "react";
import "./ShowUrl.css";
import { SendModal } from "./SendModal";
import { useNavigate } from "react-router-dom";
import UrlContext from "../../context/url-context";
import { usePermission } from "../../pages/MainLayout";

const ShowUrl = ({ data, onBack, after }) => {
  const [readUrl, setReadUrl] = useState("");
  const [writeUrl, setWriteUrl] = useState("");

  const [fromHome, setFromHome] = useState(false);
  const [permission, setPermission] = useState(true);
  const permissionData = usePermission();

  const [roomCode, setRoomCode] = useState("");
  const emailInput = useRef(null);

  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const [confrimModal, setConfirmModal] = useState(false);

  useEffect(() => {
    const roomData = data || permissionData;
    setReadUrl(
      `http://localhost:5173/room/schedule/${roomData.roomCode}/${roomData.readUrl}`
    );

    if(data || permissionData.permission){
      setWriteUrl(
        `http://localhost:5173/room/schedule/${roomData.roomCode}/${roomData.writeUrl}`
      );
    }
    setRoomCode(roomData.roomCode);
    emailInput.current.focus();
    setFromHome(after);
    if(permissionData){
      setPermission(permissionData.permission);
    }
  }, []);

  // 링크 클릭 시 자동 복사
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("클립보드에 복사되었습니다!");
    });
  };

  //링크 이동
  const handleOpenReadLink = () => {
    navigate(`/room/schedule/${data.roomCode}/${data.readUrl}`);
  };

  const handleOpenWriteLink = () => {
    navigate(`/room/schedule/${data.roomCode}/${data.writeUrl}`);
  };

  // 나가기 버튼 기능
  const handleExit = () => {
    onBack();
  };

  const handleSendEmail = async () => {

    const email = emailInput.current.value.trim();

    // 이메일 정규식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("올바른 이메일 주소를 입력하세요.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8999/api/fish/rooms/mail",
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            email: email,
            readUrl: readUrl,
            writeUrl: writeUrl,
            roomCode: roomCode,
          }),
        }
      );
      const result = await response.json();
      if (response.ok) {
        setConfirmModal(true);
        setErrorMessage("");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const closeModal = () => {
    setConfirmModal(false);
  };
  return (
    <>
    {confrimModal && <SendModal onModal={closeModal} />}
<div className="fullContainer">

    <div className="container-Show">
      {fromHome ? <h1 className="showTitle">방 생성 완료!</h1> : ""}
      <p className="copy-info">📌 링크를 클릭하면 복사됩니다.</p>{" "}
      {/* 안내 문구 추가 */}
        <div className="url-group">
          <p>📖 읽기 전용 링크 : </p>
          <input
            className="readUrlInput"
            type="text"
            value={readUrl}
            readOnly
            onClick={(e) => handleCopy(e.target.value)} // 클릭하면 복사
          />
          {fromHome && <button className="go-btn" onClick={handleOpenReadLink}>
            바로가기
          </button>}
        </div>
      {(fromHome || permission) && <div className="url-group">
        <p>✍️ 쓰기 가능 링크 </p>
        <input
            className="writeUrlInput"
          type="text"
          value={writeUrl}
          readOnly
          onClick={(e) => handleCopy(e.target.value)} // 클릭하면 복사
        />
        {fromHome && <button className="go-btn" onClick={handleOpenWriteLink}>
          바로가기
        </button>}
      </div>}
      <div className="email-wrapper">
        <input type="text" className="email-input" ref={emailInput} />
        <button className="button-send" onClick={handleSendEmail}>
          메일로 전송하기
        </button>
      </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      {fromHome && (
        <div className="button-group">
          <button className="exit-btn" onClick={handleExit}>
           새로 방만들기
          </button>
        </div>
      )}
    </div>
  </div>
  </>
  );
};

export default ShowUrl;
