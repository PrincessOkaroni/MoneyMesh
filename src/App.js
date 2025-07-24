import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './components/LandingPage';
import Overview from './components/Overview';
import Transactions from './components/Transactions';
import BudgetPlanning from './components/BudgetPlanning';

export const FinancialContext = createContext();

export const useFinancial = () => useContext(FinancialContext);

function App() {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);

  return (
    <FinancialContext.Provider value={{ transactions, setTransactions, budgets, setBudgets }}>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/budget-planning" element={<BudgetPlanning />} />
        </Routes>
      </Router>
    </FinancialContext.Provider>
  );
}

export default App;

