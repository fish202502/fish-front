import { createBrowserRouter } from "react-router-dom";
import Chat from "../chat/chat";
import RootLayout from "../../pages/RootLayout";
import CreateRoom from "../room/CreateRoom";
import FinancialManager from "../financial/FinancialManager";
import { BsChatHeart } from "react-icons/bs";
import MainNavigation from "../../pages/MainLayout";
import { permissionCheckLoader } from "../../config/permission-config";

// 라우터 설정
export const router = createBrowserRouter([
  {
    path: "/",
    element: <CreateRoom />,
    // errorElement: <ErrorPage />,
  },
  {
    path: "/room",
    element: <MainNavigation />,
    loader: permissionCheckLoader,
    id:"room",
    children: [
      {
        path: "expense/:roomCode/:url",
        element: <FinancialManager />,
      },
      {
        path: "chat/:roomCode/:url",
        element: <Chat />,
      },
    ],
  },
]);

export default router;
