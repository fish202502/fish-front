import { NavLink } from "react-router-dom";
import { Outlet } from 'react-router-dom';
import Header from "../components/layout/Header";

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
      {/* router에서 설정한 chidren page들이 Outlet에 렌더링됨 */}
      <Outlet />
    </>
  );
};

export default MainNavigation;
