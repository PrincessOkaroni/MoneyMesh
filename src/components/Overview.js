import React, { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import './Overview.css';
import logo from '../assets/moneymesh-logo.png';
import { NavLink } from 'react-router-dom';
import { useFinancial } from '../App';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Overview = () => {
  const {
    financialData,
    setFinancialData,
    transactions,
    setTransactions,
    user, // <-- Make sure user is provided in your context
  } = useFinancial();

  const [modal, setModal] = useState(null); // null, 'income', 'expense', 'savings'
  const [formData, setFormData] = useState({ amount: '', description: '', category: '' });
  const [filter, setFilter] = useState('This Month');

  // Filter transactions based on date
  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === 'This Month') {
      return transaction.date.includes('Jul 2025');
    } else if (filter === 'Last Month') {
      return transaction.date.includes('Jun 2025');
    }
    return true;
  });

  // Pie chart data
  const income = financialData.income || 0;
  const chartData = {
    labels: ['Investment and Savings', 'Bills', 'General Upkeep', 'Entertainment', 'Others'],
    datasets: [
      {
        data: [
          (income * 0.3).toFixed(2),
          (income * 0.25).toFixed(2),
          (income * 0.2).toFixed(2),
          (income * 0.1).toFixed(2),
          (income * 0.15).toFixed(2),
        ],
        backgroundColor: ['#34C759', '#FF3B30', '#007AFF', '#FF9500', '#8E8E93'],
        hoverOffset: 20,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: $${value} (${((value / income) * 100).toFixed(0)}%)`;
          },
        },
      },
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const label = chartData.labels[index];
        const value = chartData.datasets[0].data[index];
        alert(`${label}: $${value} (${((value / income) * 100).toFixed(0)}%)`);
      }
    },
  };

  const handleAddTransaction = (e) => {
    e.preventDefault();
    const { amount, description, category } = formData;
    if (!amount || isNaN(amount) || amount <= 0 || !description || !category) {
      alert('Please fill in all fields with valid data');
      return;
    }

    const newTransaction = {
      id: transactions.length + 1,
      date: '23 Jul 2025',
      category,
      description,
      amount: parseFloat(amount),
      type: modal.charAt(0).toUpperCase() + modal.slice(1),
    };

    setTransactions([...transactions, newTransaction]);
    setFinancialData((prev) => ({
      ...prev,
      [modal]: prev[modal] + parseFloat(amount),
      balance:
        modal === 'income'
          ? prev.balance + parseFloat(amount)
          : prev.balance - parseFloat(amount),
    }));
    setFormData({ amount: '', description: '', category: '' });
    setModal(null);
  };

  const Modal = ({ type }) => (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Add {type}</h2>
        <form onSubmit={handleAddTransaction}>
          <div className="form-group">
            <label className="form-label">Amount</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="form-input"
              placeholder="Enter amount"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="form-input"
              placeholder="Enter category"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-input"
              placeholder="Enter description"
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={() => setModal(null)} className="btn btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn btn-submit">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="overview-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo-container">
          <img src={logo} alt="MoneyMesh Logo" className="logo" />
          <span className="brand">MoneyMesh</span>
        </div>
        <div className="nav-tabs">
          <NavLink to="/overview" className={({ isActive }) => `nav-tab ${isActive ? 'nav-tab-active' : ''}`}>
            Overview
          </NavLink>
          <NavLink to="/transactions" className={({ isActive }) => `nav-tab ${isActive ? 'nav-tab-active' : ''}`}>
            Transactions
          </NavLink>
          <NavLink to="/budget-planning" className={({ isActive }) => `nav-tab ${isActive ? 'nav-tab-active' : ''}`}>
            Budget Planning
          </NavLink>
        </div>
        <div className="profile-section">
          <img
            src="https://i.pravatar.cc/40"
            alt="User"
            className="profile-pic"
          />
          <div className="profile-info">
            <span className="welcome">Welcome</span>
            <span className="username">{user?.firstName || 'User'}</span>
          </div>
        </div>
      </nav>

      {/* Financial Cards */}
      <div className="cards-container">
        {[
          { title: 'Balance', value: financialData.balance },
          { title: 'Total Income', value: financialData.income },
          { title: 'Total Expense', value: financialData.expense },
          { title: 'Total Savings', value: financialData.savings },
        ].map((item) => (
          <div key={item.title} className="card">
            <h2 className="card-title">{item.title}</h2>
            <p className="card-value">${item.value.toFixed(2)}</p>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="actions-container">
        <button onClick={() => setModal('income')} className="btn btn-income">
          Add Income
        </button>
        <button onClick={() => setModal('expense')} className="btn btn-expense">
          Add Expense
        </button>
        <button onClick={() => setModal('savings')} className="btn btn-savings">
          Add Savings
        </button>
      </div>

      {/* Filter Dropdown */}
      <div className="filter-container">
        <label htmlFor="filter" className="filter-label">Filter:</label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option>This Month</option>
          <option>Last Month</option>
          <option>Select Period</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="table-container">
        <h2 className="table-title">Latest Transactions</h2>
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.type}</td>
                <td>{transaction.date}</td>
                <td>{transaction.category}</td>
                <td>{transaction.description}</td>
                <td>${transaction.amount.toFixed(2)}</td>
              </tr>
            ))}
            <tr className="total-row">
              <td colSpan="4">TOTAL</td>
              <td>${filteredTransactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Pie Chart */}
      <div className="chart-container">
        <h2 className="chart-title">Expense Statistics</h2>
        <div className="pie-chart">
          <Pie data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Modal */}
      {modal && <Modal type={modal} />}
    </div>
  );
};

export default Overview;
