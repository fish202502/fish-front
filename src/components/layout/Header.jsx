import React from "react";
import "./Header.css"; // CSS 파일 연결
import { NavLink, useParams } from "react-router-dom";

const Header = () => {

  const activeLink = ({isActive}) => isActive ? "active" : '';

  const {roomCode,url} =useParams();
    const menuItems = [
      { id:"home" ,name: "홈"},   // 빨강
      { id:"schedule" ,name: "일정"}, // 주황
      { id:"check" ,name: "체크리스트" }, // 노랑
      { id:"expense" ,name: "지출" }, // 초록
      { id:"photo" ,name: "갤러리" }, // 파랑
      { id:"chat" ,name: "채팅방"}, // 남색
      { id:"setting" ,name: "설정" }, // 보라
    ];

  return (
    <nav className="header-nav">
      <ul className="nav-list">
        {menuItems.map((item, index) => (
          <NavLink key={index} 
          className={`nav-item nav-item-${index} ${activeLink}`}
          to={`/${item.id}/${roomCode}/${url}`}
          >
            {item.name}
          </NavLink>
        ))}
      </ul>
    </nav>
  );
};

export default Header;