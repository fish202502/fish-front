import GalleryManager from "./Gallery/GalleryManager.jsx";

import ScheduleManager from "./Schedule/ScheduleManager";
import CheckListAdd from './components/CheckListAdd'
import CheckListManager from './components/CheckListManager'
import FinancialManager from './components/financial/FinancialManager'
import Header from './components/layout/Header'

const App = () => {
  return (
    <>
    <Header/> 
    <CheckListManager/>
   <FinancialManager/>
    <ScheduleManager />
      <GalleryManager />
    </>
  );
};

export default App;

