import React, { useState, useEffect } from 'react';
import './BudgetPlanning.css';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/moneymesh-logo.png';

const categories = ['Investment and Savings', 'Bills', 'General Upkeep', 'Entertainment', 'Others'];
const baseURL = 'http://localhost:3001/budgets';

const BudgetPlanning = () => {
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState([]);
  const [formData, setFormData] = useState({ category: '', limit: '', duration: '' });
  const [message, setMessage] = useState('');
  const [editingBudget, setEditingBudget] = useState(null);

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user')) || {};

  // Redirect to login if no user is found
  useEffect(() => {
    if (!user.firstName) {
      navigate('/login');
      return;
    }

    // Fetch budgets from API
    fetch(baseURL)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then(setBudgets)
      .catch(err => {
        console.error('Error fetching budgets:', err);
        setMessage('Failed to fetch budgets');
        setTimeout(() => setMessage(''), 2000);
      });
  }, [user.firstName, navigate]);

  const handleAddOrUpdateBudget = (e) => {
    e.preventDefault();
    if (!formData.category || !formData.limit || !formData.duration) {
      setMessage('Please fill all required fields');
      setTimeout(() => setMessage(''), 2000);
      return;
    }
    const limit = parseFloat(formData.limit);
    if (isNaN(limit) || limit <= 0) {
      setMessage('Budget limit must be a positive number');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    if (editingBudget) {
      // Editing existing budget
      const updated = { ...editingBudget, ...formData, limit };
      fetch(`${baseURL}/${editingBudget.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      })
        .then(res => {
          if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
          return res.json();
        })
        .then(data => {
          setBudgets(budgets.map(b => b.id === data.id ? data : b));
          setEditingBudget(null);
          setFormData({ category: '', limit: '', duration: '' });
          setMessage('Budget updated successfully!');
          setTimeout(() => setMessage(''), 2000);
        })
        .catch(err => {
          console.error('Error updating budget:', err);
          setMessage('Error updating budget');
          setTimeout(() => setMessage(''), 2000);
        });
    } else {
      // Adding new budget
      const newBudget = {
        ...formData,
        limit,
        spent: 0,
        creationDate: new Date().toISOString(),
        startDate: new Date().toISOString()
      };
      fetch(baseURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBudget)
      })
        .then(res => {
          if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
          return res.json();
        })
        .then(data => {
          setBudgets([...budgets, data]);
          setFormData({ category: '', limit: '', duration: '' });
          setMessage('Budget added successfully!');
          setTimeout(() => setMessage(''), 2000);
        })
        .catch(err => {
          console.error('Error adding budget:', err);
          setMessage('Error adding budget');
          setTimeout(() => setMessage(''), 2000);
        });
    }
  };

  const handleDelete = (id) => {
    fetch(`${baseURL}/${id}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        setBudgets(budgets.filter(b => b.id !== id));
        setMessage('Budget deleted successfully!');
        setTimeout(() => setMessage(''), 2000);
      })
      .catch(err => {
        console.error('Error deleting budget:', err);
        setMessage('Error deleting budget');
        setTimeout(() => setMessage(''), 2000);
      });
  };

  const handleDeposit = (budget) => {
    const amount = prompt('Enter amount to deposit:');
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setMessage('Please enter a valid deposit amount');
      setTimeout(() => setMessage(''), 2000);
      return;
    }
    const depositAmount = parseFloat(amount);
    const updated = { ...budget, spent: budget.spent + depositAmount };

    fetch(`${baseURL}/${budget.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ spent: updated.spent })
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setBudgets(budgets.map(b => b.id === data.id ? data : b));
        setMessage(`Deposited ${depositAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} successfully!`);
        setTimeout(() => setMessage(''), 2000);
      })
      .catch(err => {
        console.error('Error depositing:', err);
        setMessage('Error depositing amount');
        setTimeout(() => setMessage(''), 2000);
      });
  };

  const getStatus = (b) => {
    if (b.spent >= b.limit * 0.9) return 'WARNING';
    if (b.spent >= b.limit * 0.7) return 'Approaching target';
    return 'On track';
  };

  const getProgressColor = (b) => {
    if (b.spent >= b.limit * 0.9) return 'red';
    if (b.spent >= b.limit * 0.7) return 'orange';
    return 'green';
  };

  const getDaysRemaining = (b) => {
    const start = new Date(b.creationDate);
    let days = 0;
    if (b.duration === 'Monthly') days = 30;
    else if (b.duration === 'Weekly') days = 7;
    else if (b.duration === 'Yearly') days = 365;
    const end = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);
    const now = new Date();
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
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
          <NavLink to="/budget-planning" className={({ isActive }) => `nav-tab ${isActive ? 'nav-tab-active' : ''}`}>
            Budget Planning
          </NavLink>
          <button onClick={() => { localStorage.removeItem('user'); navigate('/login'); }} className="btn btn-signout">
            Sign Out
          </button>
        </div>
        <div className="profile-section">
          <img src="https://i.pravatar.cc/40" alt="User" className="profile-pic" />
          <div className="profile-info">
            <span className="welcome">Welcome, {user?.firstName || 'User'}</span>
          </div>
        </div>
      </nav>

      <h2>Budget Planning</h2>
      {message && <p className="message">{message}</p>}

      <form onSubmit={handleAddOrUpdateBudget}>
        <select
          value={formData.category}
          onChange={e => setFormData({ ...formData, category: e.target.value })}
          required
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
          onChange={e => setFormData({ ...formData, limit: e.target.value })}
          required
        />
        <select
          value={formData.duration}
          onChange={e => setFormData({ ...formData, duration: e.target.value })}
          required
        >
          <option value="">Select Duration</option>
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
          <option value="Yearly">Yearly</option>
        </select>
        <button type="submit">{editingBudget ? 'Update' : 'Add Budget'}</button>
        {editingBudget && (
          <button type="button" onClick={() => { setEditingBudget(null); setFormData({ category: '', limit: '', duration: '' }); }}>
            Cancel
          </button>
        )}
      </form>

      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Limit</th>
            <th>Spent</th>
            <th>Left</th>
            <th>Status</th>
            <th>Progress</th>
            <th>Days Remaining</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {budgets.map(b => (
            <tr key={b.id}>
              <td>{b.category}</td>
              <td>{b.limit}</td>
              <td>{b.spent}</td>
              <td>{b.limit - b.spent}</td>
              <td>{getStatus(b)}</td>
              <td>
                <div style={{
                  background: '#ddd',
                  height: '10px',
                  width: '100px',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${Math.min((b.spent / b.limit) * 100, 100)}%`,
                    background: getProgressColor(b),
                    height: '100%'
                  }}></div>
                </div>
              </td>
              <td>{getDaysRemaining(b)}</td>
              <td>
                <button onClick={() => { setEditingBudget(b); setFormData({ category: b.category, limit: b.limit.toString(), duration: b.duration }); }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(b.id)}>Delete</button>
                <button onClick={() => handleDeposit(b)}>Deposit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BudgetPlanning;