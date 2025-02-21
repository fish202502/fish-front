import { createBrowserRouter } from "react-router-dom";
import Chat from "../chat/chat";
import RootLayout from "../../pages/RootLayout";

// 라우터 설정
export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    // errorElement: <ErrorPage />,
    children: [
      {
        path: "chat/:roomCode",
        element: <Chat />,
      },
    ],
  },
]);

export default router;
