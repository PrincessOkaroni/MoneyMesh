import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useFinancial } from '../App';
import logo from '../assets/moneymesh-logo.png';
import './BudgetPlanning.css';

// Moved outside to fix ESLint warning
const calculateSpent = (transactions, category) => {
  return transactions
    .filter(t => t.category === category && t.type === 'Expense')
    .reduce((sum, t) => sum + t.amount, 0);
};

const BudgetPlanning = () => {
  const { transactions, budgets, setBudgets } = useFinancial();
  const [modal, setModal] = useState(null);
  const [formData, setFormData] = useState({ category: '', limit: '', duration: '2025-07-01 to 2025-07-31' });
  const [editId, setEditId] = useState(null);

  const categories = ['Investment and Savings', 'Bills', 'General Upkeep', 'Entertainment', 'Others'];

  useEffect(() => {
    budgets.forEach(budget => {
      const spent = calculateSpent(transactions, budget.category);
      const percentage = (spent / budget.limit) * 100;
      if (percentage >= 80 && percentage < 100) {
        toast.warn(`${budget.category} budget is almost exhausted (${percentage.toFixed(1)}%)!`, { toastId: budget.id });
      } else if (percentage >= 100) {
        toast.error(`${budget.category} budget has been exceeded (${percentage.toFixed(1)}%)!`, { toastId: budget.id });
      }
    });
  }, [budgets, transactions]);

  const handleAddEditBudget = async (e) => {
    e.preventDefault();
    const { category, limit, duration } = formData;
    if (!category || !limit || isNaN(limit) || limit <= 0 || !duration) {
      toast.error('Please fill in all fields with valid data');
      return;
    }
    const newBudget = { category, limit: parseFloat(limit), duration };
    try {
      if (editId) {
        await axios.put(`http://localhost:3001/budgets/${editId}`, { ...newBudget, id: editId });
        setBudgets(budgets.map(b => (b.id === editId ? { ...newBudget, id: editId } : b)));
        toast.success('Budget updated successfully');
      } else {
        const response = await axios.post('http://localhost:3001/budgets', { ...newBudget, id: budgets.length + 1 });
        setBudgets([...budgets, response.data]);
        toast.success('Budget added successfully');
      }
      setFormData({ category: '', limit: '', duration: '2025-07-01 to 2025-07-31' });
      setModal(null);
      setEditId(null);
    } catch (err) {
      console.error('Error saving budget:', err);
      toast.error('Failed to save budget');
    }
  };

  const handleEdit = (budget) => {
    setFormData({ category: budget.category, limit: budget.limit, duration: budget.duration });
    setEditId(budget.id);
    setModal('budget');
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/budgets/${id}`);
      setBudgets(budgets.filter(b => b.id !== id));
      toast.success('Budget deleted successfully');
    } catch (err) {
      console.error('Error deleting budget:', err);
      toast.error('Failed to delete budget');
    }
  };

  return (
    <div className="budget-planning-container">
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
          <NavLink to="/BudgetPlanning" className={({ isActive }) => `nav-tab ${isActive ? 'nav-tab-active' : ''}`}>
            Budget Planning
          </NavLink>
        </div>
        <div className="profile-section">
          <img src="https://i.pravatar.cc/40" alt="User" className="profile-pic" />
          <div className="profile-info">
            <span className="welcome">Welcome</span>
            <span className="username">Purity</span>
          </div>
        </div>
      </nav>

      <div className="budget-content">
        <h2>Budget Planning</h2>
        <button className="add-budget-btn" onClick={() => setModal('budget')}>
          Add Budget
        </button>
        <table className="budget-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Budget Limit ($)</th>
              <th>Spent ($)</th>
              <th>Remaining ($)</th>
              <th>Progress</th>
              <th>Duration</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {budgets.map(budget => {
              const spent = calculateSpent(transactions, budget.category);
              const remaining = budget.limit - spent;
              const percentage = Math.min((spent / budget.limit) * 100, 100);
              return (
                <tr key={budget.id}>
                  <td>{budget.category}</td>
                  <td>{budget.limit.toFixed(2)}</td>
                  <td>{spent.toFixed(2)}</td>
                  <td className={remaining < 0 ? 'negative' : ''}>{remaining.toFixed(2)}</td>
                  <td>
                    <div className="progress-bar-container">
                      <div
                        className={`progress-bar ${
                          percentage >= 100
                            ? 'over-budget'
                            : percentage >= 80
                            ? 'near-budget'
                            : ''
                        }`}
                        style={{ width: `${percentage}%` }}
                        title={`${percentage.toFixed(1)}% used`}
                      ></div>
                    </div>
                  </td>
                  <td>{budget.duration}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(budget)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(budget.id)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {modal === 'budget' && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editId ? 'Edit Budget' : 'Add Budget'}</h3>
            <form onSubmit={handleAddEditBudget}>
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
                placeholder="Budget Limit ($)"
                value={formData.limit}
                onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
              />
              <input
                type="text"
                placeholder="Duration (e.g., 2025-07-01 to 2025-07-31)"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              />
              <button type="submit">{editId ? 'Update' : 'Add'}</button>
              <button
                type="button"
                onClick={() => {
                  setModal(null);
                  setEditId(null);
                  setFormData({ category: '', limit: '', duration: '2025-07-01 to 2025-07-31' });
                }}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default BudgetPlanning;
