import { createBrowserRouter } from "react-router-dom";
import Chat from "../chat/chat";
import RootLayout from "../../pages/RootLayout";
import CreateRoom from "../room/CreateRoom";
import FinancialManager from "../financial/FinancialManager";
import { BsChatHeart } from "react-icons/bs";
import MainNavigation from "../../pages/MainLayout";
import { permissionCheckLoader } from "../../config/permission-config";
import ErrorPage from "../../pages/ErrorPage";
import CheckList from "../checkList/CheckList";
import CheckListManager from "../checkList/CheckListManager";
import ScheduleManager from "../../Schedule/ScheduleManager";
import GalleryManager from "../../Gallery/GalleryManager";
import ChatNameProvider from "../../context/ChatNameProvider";
import ShowUrl from "../room/ShowUrl";
import UrlContext from "../../context/url-context";
import UrlProvider from "../../context/UrlProvider";
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
        errorElement: <ErrorPage />, 
      },
      {
        path: "check/:roomCode/:url",
        element: <CheckListManager />,
      },
      {
        path: "chat/:roomCode/:url",
        element: 
        <Chat />
        ,
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
        path: "setting/:roomCode/:url",
        element:<>
        <Setting/>
        <ShowUrl />
        </>
      },
    ],
  },
]);

export default router;
