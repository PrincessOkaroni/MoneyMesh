import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import Landing from './Components/LandingPage';
import Overview from './Components/Overview';
import Transaction from './Components/Transaction';


// Context setup
const FinancialContext = createContext();
export const useFinancial = () => useContext(FinancialContext);

function App() {
  const [financialData, setFinancialData] = useState({
    balance: 1000,
    income: 25000,
    expense: 15000,
    savings: 9000,
  });

  const [transactions, setTransactions] = useState([
    { id: 1, date: '07 Jan 2030', category: 'Others', description: 'Went for check-up', amount: 250.0, type: 'Income' },
    { id: 2, date: '10 Jan 2030', category: 'Salary', description: 'Got my salary', amount: 5000.0, type: 'Expense' },
  ]);

  return (
    <FinancialContext.Provider value={{ financialData, setFinancialData, transactions, setTransactions }}>
      <Router>
        <div className="App">
          <Landing />
          <Overview />
          <Transaction />
        </div>
      </Router>
    </FinancialContext.Provider>
  );
}

export default App;
