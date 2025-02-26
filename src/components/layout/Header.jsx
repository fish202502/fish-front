import React, { useEffect, useState } from "react";
import "./Header.css"; // CSS 파일 연결
import {
  NavLink,
  useParams,
} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { usePermission } from "../../pages/MainLayout";

const Header = () => {
  const activeLink = ({ isActive }) => (isActive ? "active" : "");
  const [permission, setPermission] = useState(null);
  const [showModal, setShowModal] = useState(false); // 🔥 모달 상태 추가

  const navigate = useNavigate();
  const { roomCode, url } = useParams();
  const permissionData = usePermission();

  useEffect(() => {
    setPermission(permissionData.permission);
  }, []);

  const handleConfirm = () => {
    navigate("/", { state: { roomCode, url } });
    setShowModal(false);
  };

  return (
    <>
      <nav className="header-nav">
        <div
          style={{
            width: !permission ? 0 : "auto",
            visibility: !permission ? "hidden" : "visible",
          }}
        >
          <button onClick={() => setShowModal(true)} className="room-info-btn">
            방정보 변경
          </button>
        </div>
        <ul className="nav-list">
          {[
            { id: "schedule", name: "일정" },
            { id: "check", name: "체크리스트" },
            { id: "expense", name: "지출" },
            { id: "photo", name: "갤러리" },
            { id: "chat", name: "채팅방" },
            { id: "setting", name: "방설정" },
          ].map((item, index) => (
            <NavLink
              key={index}
              className={`nav-item nav-item-${index} ${activeLink}`}
              to={`/room/${item.id}/${roomCode}/${url}`}
            >
              {item.name}
            </NavLink>
          ))}
        </ul>
      </nav>

      {/* 🔥 모달 컴포넌트 */}
      {showModal && (
  <div className="modal-overlay">
    <div className="modal-content">
      <p>정말로 변경하시겠습니까?</p>
      <p className="warning-text">변경 시 URL을 반드시 새로 공유해주세요</p>
      <div className="modal-buttons">
        <button className="confirm-btn" onClick={handleConfirm}>
          확인
        </button>
        <button className="cancel-btn" onClick={() => setShowModal(false)}>
          취소
        </button>
      </div>
    </div>
  </div>
)}
    </>
  );
};

export default Header;
