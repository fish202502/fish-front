import { NavLink } from "react-router-dom";
import Header from "../components/layout/Header";
import Chat from "../components/chat/chat";

const MainNavigation = () => {
  // NavLink에 className에 바인딩하는 콜백함수
  // 현재 위치한 메뉴 정보를 알려줌
  const activeFn = ({ isActive }) => {
    // 클래스 이름을 반환
    return isActive ? styles.active : "";
  };

  return (
    <>
      <Header />
    </>
  );
};

export default MainNavigation;
