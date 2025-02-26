import { createBrowserRouter } from "react-router-dom";
import Chat from "../chat/chat";
import RootLayout from "../../pages/RootLayout";
import CreateRoom from "../room/CreateRoom";
import FinancialManager from "../financial/FinancialManager";
import { BsChatHeart } from "react-icons/bs";
import MainNavigation from "../../pages/MainLayout";
import { permissionCheckLoader, validateRoomParams } from "../../config/permission-config";
import ErrorPage from "../../pages/ErrorPage";
import CheckList from "../checkList/CheckList";
import CheckListManager from "../checkList/CheckListManager";
import ScheduleManager from "../../Schedule/ScheduleManager";
import GalleryManager from "../../Gallery/GalleryManager";
import Setting from "../roomSetting/Setting";

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
        path: "home/:roomCode/:url",
        element: <FinancialManager/>
      },
      {
        path: "expense/:roomCode/:url",
        element: <FinancialManager />,
        loader: validateRoomParams, // ✅ 추가
        errorElement: <ErrorPage />, 
      },
      {
        path: "check/:roomCode/:url",
        loader: validateRoomParams,
        element: <CheckListManager />,
      },
      {
        path: "chat/:roomCode/:url",
        element: <Chat />,
      },
      {
        path: "schedule/:roomCode/:url",
        element: <ScheduleManager/>
      },
      {
        path: "photo/:roomCode/:url",
        element:<GalleryManager/>
      },
      {
        path:"setting/:roomCode/:url",
        element: <Setting/>
      }
    ],
  },
]);

export default router;
