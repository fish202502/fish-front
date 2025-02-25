import GalleryManager from "./Gallery/GalleryManager.jsx";

import ScheduleManager from "./Schedule/ScheduleManager";
// import Chat from "./components/chat/chat.jsx";
import CheckListAdd from "./components/checkList/CheckListAdd.jsx";
import CheckListManager from "./components/checkList/CheckListManager.jsx";
import FinancialManager from "./components/financial/FinancialManager";
import Header from "./components/layout/Header";
import { RouterProvider, useParams } from "react-router-dom";
import router from "./components/routes/router-config";

const App = () => {
  return <RouterProvider router={router} />;
    //   {/* <Header/> 
  //   <CheckListManager/>
  //  <FinancialManager/>
  //   <ScheduleManager />
  //     <GalleryManager /> */}
};

export default App;
