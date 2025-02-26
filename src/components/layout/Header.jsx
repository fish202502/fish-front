import React, { useEffect, useState } from "react";
import "./Header.css"; // CSS 파일 연결
import { NavLink, useParams } from "react-router-dom";
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
    updateRoomData();
    setShowModal(false);
  };

  const updateRoomData = async () => {
    if (!roomCode || !url || roomCode === "undefined")
      return redirect("/error");

    try {
      const response = await fetch(
        `http://localhost:8999/api/fish/rooms/${roomCode}/${url}?type=all`,
        {
          method: "PUT",
        }
      );
      const data = await response.json();
      window.location.href
      =`http://localhost:5173/room/setting/${data.roomCode}/${data.writeUrl}`;

      if (!response.ok) {
        throw new Error("서버 요청 실패");
      }
    } catch (error) {
      console.error("에러 발생:", error);
    }
  };

  return (
    <>
      <nav className="header-nav">
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
    </>
  );
};

export default Header;
