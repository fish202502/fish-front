import { createBrowserRouter } from "react-router-dom";
// import Chat from "../chat/chat";
import RootLayout from "../../pages/RootLayout";
import CreateRoom from "../room/CreateRoom";

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
      // {
      //   path: "chat/:roomCode",
      //   element: <Chat />,
      // },
    ],
  },
]);

export default router;
