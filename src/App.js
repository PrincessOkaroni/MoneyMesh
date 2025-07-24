import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './components/LandingPage';
import Overview from './components/Overview';
import Transaction from './components/Transaction';


import BudgetPlanning from './components/BudgetPlanning';
 

const FinancialContext = createContext();
export const useFinancial = () => useContext(FinancialContext);

function App() {
  // ✅ initialize financialData with all needed fields
  const [financialData, setFinancialData] = useState({
    income: 0,
    expense: 0,
    savings: 0,
    balance: 0,
  });
  const [transactions, setTransactions] = useState([]);

  return (
    <FinancialContext.Provider value={{ financialData, setFinancialData, transactions, setTransactions }}>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/transactions" element={<Transaction />} />
          <Route path="/budget-planning" element={<BudgetPlanning />} />
        </Routes>
      </Router>
    </FinancialContext.Provider>
  );
}

export default App;
