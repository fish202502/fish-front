import { createBrowserRouter } from "react-router-dom";
import Chat from "../chat/chat";
import RootLayout from "../../pages/RootLayout";
import CreateRoom from "../room/CreateRoom";
import FinancialManager from "../financial/FinancialManager";
import { BsChatHeart } from "react-icons/bs";
import MainNavigation from "../../pages/MainLayout";
import CheckList from "../checkList/CheckList";
import CheckListManager from "../checkList/CheckListManager";
import ScheduleManager from "../../Schedule/ScheduleManager";
import GalleryManager from "../../Gallery/GalleryManager";

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
    children: [
      {
        path: "expense/:roomCode/:url",
        element: <FinancialManager />,
      },
      {
        path: "check/:roomCode/:url",
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
      }
    ],
  },
]);

export default router;
