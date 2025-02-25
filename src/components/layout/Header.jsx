import React from "react";
import "./Header.css"; // CSS 파일 연결

const Header = () => {
  const menuItems = [
    { name: "홈", color: "#ff0000" },   // 빨강
    { name: "일정", color: "#F6D6D6" }, // 주황
    { name: "체크리스트", color: "#7BD3EA" }, // 노랑
    { name: "지출", color: "#A1EEBD" }, // 초록
    { name: "갤러리", color: "#F6F7C4" }, // 파랑
    { name: "메모", color: "#4b0082" }, // 남색
    { name: "설정", color: "#9400d3" }, // 보라
  ];

  return (
    <nav className="header-nav">
      <ul className="nav-list">
        {menuItems.map((item, index) => (
          <li key={index} className="nav-item" style={{ backgroundColor: item.color }}>
            {item.name}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Header;
