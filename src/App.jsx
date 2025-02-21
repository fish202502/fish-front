
import './App.css'
import CheckListAdd from './components/CheckListAdd'
import CheckListManager from './components/CheckListManager'
import FinancialManager from './components/financial/FinancialManager'
import Header from './components/layout/Header'

function App() {

 

  return (
    <>
    <Header/> 
    <CheckListManager/>
   <FinancialManager/>
    </>
  )
}

export default App
