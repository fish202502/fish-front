import React, { useEffect, useState } from "react";
import "./Header.css"; // CSS 파일 연결
import {
  NavLink,
  useLoaderData,
  useParams,
  useRouteLoaderData,
} from "react-router-dom";

import { usePermission } from "../../pages/MainLayout"; // 🔥 추가

const Header = () => {
  const activeLink = ({ isActive }) => (isActive ? "active" : "");
  const [permission, setPermission] = useState(null);

  const { roomCode, url } = useParams();

  const menuItems = [
    { id: "home", name: "홈" }, // 빨강
    { id: "schedule", name: "일정" }, // 주황
    { id: "check", name: "체크리스트" }, // 노랑
    { id: "expense", name: "지출" }, // 초록
    { id: "photo", name: "갤러리" }, // 파랑
    { id: "chat", name: "채팅방" }, // 남색
    { id: "setting", name: "설정" }, // 보라
  ];

  const permissionData = usePermission();

  useEffect(() => {
    setPermission(permissionData.permission);
  }, []);
  return (
    <>
      <nav className="header-nav">
        <div
          style={{
            width: !permission ? 0 : "auto",
            visibility: !permission ? "hidden" : "visible",
          }}
        >
          <button className="room-info-btn">방정보 변경</button>
        </div>
        <ul className="nav-list">
          {menuItems.map((item, index) => (
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
