import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/moneymesh-logo.png';
import './BudgetPlanning.css';

const categories = ['Investment and Savings', 'Bills', 'General Upkeep', 'Entertainment', 'Others'];

const BudgetPlanning = () => {
  const [budgets, setBudgets] = useState([]);
  const [formData, setFormData] = useState({ category: '', limit: '', duration: '' });
  const [message, setMessage] = useState('');

  const handleAddBudget = (e) => {
    e.preventDefault();
    if (!formData.category || !formData.limit || !formData.duration) {
      setMessage('Please fill all fields!');
      return;
    }
    setBudgets([...budgets, { ...formData, limit: parseFloat(formData.limit), id: budgets.length + 1 }]);
    setMessage('Budget added successfully!');
    setFormData({ category: '', limit: '', duration: '' });
  };

  const handleDelete = (id) => {
    setBudgets(budgets.filter(b => b.id !== id));
    setMessage('Budget deleted successfully!');
  };

  return (
    <div className="budget-planning-container">
      <nav className="navbar">
        <div className="logo-container">
          <img src={logo} alt="MoneyMesh Logo" className="logo" />
          <span className="brand">MoneyMesh</span>
        </div>
        <div className="nav-tabs">
          <NavLink to="/overview">Overview</NavLink>
          <NavLink to="/transactions">Transactions</NavLink>
          <NavLink to="/BudgetPlanning">Budget Planning</NavLink>
        </div>
      </nav>

      <h2>Budget Planning</h2>

      {message && <p className="message">{message}</p>}

      <form onSubmit={handleAddBudget}>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Budget Limit"
          value={formData.limit}
          onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
        />
        <input
          type="text"
          placeholder="Duration"
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
        />
        <button type="submit">Add Budget</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Limit</th>
            <th>Duration</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {budgets.map(b => (
            <tr key={b.id}>
              <td>{b.category}</td>
              <td>{b.limit}</td>
              <td>{b.duration}</td>
              <td><button onClick={() => handleDelete(b.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BudgetPlanning;
