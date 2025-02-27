import React, { useEffect, useState } from "react";
import "./Header.css"; // CSS 파일 연결
import { NavLink, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { usePermission } from "../../pages/MainLayout";
import logo from "../img/logo.png";
import ErrorModal from "../ui/Modal/ErrorModal"; // 모달 import

const Header = () => {
  const activeLink = ({ isActive }) => (isActive ? "active" : "");
  const [permission, setPermission] = useState(null);
  const [showModal, setShowModal] = useState(false); // 🔥 모달 상태 추가
  const [modalTitle, setModalTitle] = useState(""); // 🔥 모달 타이틀 상태
  const [modalMessage, setModalMessage] = useState(""); // 🔥 모달 메시지 상태

  const navigate = useNavigate();
  const { roomCode, url } = useParams();
  const permissionData = usePermission();

  // ✅ 모달 열기 함수 (타이틀과 메시지도 설정)
  const openModal = () => {
    setModalTitle("홈으로 이동하시겠습니까? "); // 원하는 타이틀 설정
    setModalMessage("(링크를 보관하지 않은 경우 다시 찾을 수 없습니다)"); // 원하는 메시지 설정
    setShowModal(true);
  };

  // ✅ 모달 닫기 함수
  const closeModal = () => {
    setShowModal(false);
  };

  // ✅ "확인" 버튼 클릭 시 실행될 함수
  const handleConfirm = () => {
    navigate("/"); // 홈으로 이동
    closeModal(); // 모달 닫기
  };

  useEffect(() => {
    setPermission(permissionData.permission);
  }, []);

  return (
    <>
      <img src={logo} alt="로고이미지" className="logo-size" onClick={openModal} />
      <nav className="header-nav">
        {/* ✅ 이미지 클릭 시 모달 열기 */}

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

      {/* ✅ showModal이 true일 때만 모달 표시 & 타이틀과 메시지 전달 */}
      {showModal && (
        <ErrorModal
          title={modalTitle}
          message={modalMessage}
          closeModal={closeModal}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
};

export default Header;
