
import ScheduleManager from "./Schedule/ScheduleManager";
import './App.css'
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
    </>
  );
};

export default App;

