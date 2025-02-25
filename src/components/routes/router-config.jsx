import { createBrowserRouter } from "react-router-dom";
import Chat from "../chat/chat";
import RootLayout from "../../pages/RootLayout";
import CreateRoom from "../room/CreateRoom";
import FinancialManager from "../financial/FinancialManager";

// 라우터 설정
export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    // errorElement: <ErrorPage />,
    children: [
      {
        path: "new",
        element: <CreateRoom />,
      },
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
