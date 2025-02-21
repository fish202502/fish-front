import { Outlet } from 'react-router-dom';
import MainNavigation from './MainLayout';

const RootLayout = () => {
  return (
    <>
      <MainNavigation />
      <main>
        {/* router에서 설정한 chidren page들이 Outlet에 렌더링됨 */}
        <Outlet />
      </main>
    </>
  );
};

export default RootLayout;