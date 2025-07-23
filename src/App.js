import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import Landing from './Components/LandingPage';
import Overview from './Components/Overview';
import logo from './assets/moneymesh-logo.png'; // ✅ Ensure the file exists at src/assets/moneymesh-logo.png

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
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header>
          <Landing />
          <Overview />
        </div>
      </Router>
    </FinancialContext.Provider>
  );
}

export default App;
