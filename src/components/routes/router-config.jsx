import { createBrowserRouter } from "react-router-dom";
import Chat from "../chat/chat";
import RootLayout from "../../pages/RootLayout";
import CreateRoom from "../room/CreateRoom";
import FinancialManager from "../financial/FinancialManager";
import { BsChatHeart } from "react-icons/bs";
import MainNavigation from "../../pages/MainLayout";
import { permissionCheckLoader, validateRoomParams } from "../../config/permission-config";
import ErrorPage from "../../pages/ErrorPage";

// 라우터 설정
export const router = createBrowserRouter([
  {
    path: "/",
    element: <CreateRoom />,
    errorElement: <ErrorPage />,
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
        loader: validateRoomParams, // ✅ 추가
        errorElement: <ErrorPage />, 
      },
      {
        path: "chat/:roomCode/:url",
        element: <Chat />,
        loader: validateRoomParams, // ✅ 추가
        errorElement: <ErrorPage />, 
      },
    ],
  },
]);

export default router;
