import { Outlet } from 'react-router-dom';
import MainNavigation from './MainLayout';
import CreateRoom from '../components/room/CreateRoom';

const RootLayout = () => {
  return (
    <>       
      {/* router에서 설정한 chidren page들이 Outlet에 렌더링됨 */}
      <Outlet />
    </>
  );
};

export default RootLayout;