import React, { useState, useEffect } from "react";
import "./Transaction.css";
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/moneymesh-logo.png';
import { useFinancial } from '../App';

const apiUrl = "http://localhost:3001/transactions";
const categories = ["Bills", "Entertainment", "Investment and Savings", "General Upkeep", "Others"];

const Transaction = () => {
  // eslint-disable-next-line no-unused-vars
  const { transactions, setTransactions, financialData, setFinancialData } = useFinancial();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: "Income",
    date: "",
    category: "",
    description: "",
    amount: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [message, setMessage] = useState("");


  const user = { firstName: "Purity" };

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user')) 

  // Redirect to login if no user is found
  useEffect(() => {

    fetch(apiUrl)
      .then(res => res.json())
      .then(data => setTransactions(data))
      .catch(err => console.error("Error fetching:", err));
  }, []);


    if (!user.firstName) {
      navigate('/login');
    }
  }, [user.firstName, navigate]);

  useEffect(() => {
    // Sync transactions with localStorage for persistence
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddTransaction = () => {

    if (!formData.date || !formData.category || !formData.amount) {
      alert("Please fill all fields");
      return;
    }
    if (parseFloat(formData.amount) <= 0) {
      alert("Amount must be greater than zero");
      return;
    }

    if (editingId !== null) {
      // Update existing transaction
      fetch(`${apiUrl}/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
        .then(res => res.json())
        .then(updated => {
          setTransactions(transactions.map(t => t.id === editingId ? updated : t));
          setMessage("Transaction updated!");
          setEditingId(null);
          setFormData({ type: "Income", date: "", category: "", description: "", amount: "" });
        });
    } else {
      // Add new transaction
      fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
        .then(res => res.json())
        .then(newTxn => {
          setTransactions([...transactions, newTxn]);
          setMessage("Transaction added!");
          setFormData({ type: "Income", date: "", category: "", description: "", amount: "" });
        });
    }
    setTimeout(() => setMessage(""), 2000);
  };

  const handleEdit = (id) => {
    const txn = transactions.find(t => t.id === id);
    if (txn) {
      setFormData(txn);
      setEditingId(id);
    }
  };

  const handleDelete = (id) => {
    fetch(`${apiUrl}/${id}`, { method: "DELETE" })
      .then(() => {
        setTransactions(transactions.filter(t => t.id !== id));
        setMessage("Transaction deleted!");
        setTimeout(() => setMessage(""), 2000);
      });

    if (!formData.date || !formData.category || !formData.description || !formData.amount || isNaN(formData.amount) || formData.amount <= 0) {
      alert('Please fill in all fields with valid data');
      return;
    }

    const amount = parseFloat(formData.amount);
    const newTransaction = {
      ...formData,
      amount,
      id: editingIndex !== null ? transactions[editingIndex].id : transactions.length + 1,
    };

    if (editingIndex !== null) {
      const oldTransaction = transactions[editingIndex];
      const oldAmount = parseFloat(oldTransaction.amount);
      const updated = [...transactions];
      updated[editingIndex] = newTransaction;

      setFinancialData((prev) => {
        const typeKey = newTransaction.type.toLowerCase();
        const oldTypeKey = oldTransaction.type.toLowerCase();
        const newFinancialData = { ...prev };

        // Revert old transaction effect
        if (oldTypeKey === 'income') {
          newFinancialData.income -= oldAmount;
          newFinancialData.balance -= oldAmount;
        } else if (oldTypeKey === 'expense') {
          newFinancialData.expense -= oldAmount;
          newFinancialData.balance += oldAmount;
        } else if (oldTypeKey === 'savings') {
          newFinancialData.savings -= oldAmount;
          newFinancialData.balance += oldAmount;
        }

        // Apply new transaction effect
        if (typeKey === 'income') {
          newFinancialData.income += amount;
          newFinancialData.balance += amount;
        } else if (typeKey === 'expense') {
          newFinancialData.expense += amount;
          newFinancialData.balance -= amount;
        } else if (typeKey === 'savings') {
          newFinancialData.savings += amount;
          newFinancialData.balance -= amount;
        }

        return newFinancialData;
      });

      setTransactions(updated);
      setEditingIndex(null);
    } else {
      setTransactions([...transactions, newTransaction]);
      setFinancialData((prev) => {
        const typeKey = newTransaction.type.toLowerCase();
        return {
          ...prev,
          [typeKey]: prev[typeKey] + amount,
          balance: typeKey === 'income' ? prev.balance + amount : prev.balance - amount,
        };
      });
    }

    setFormData({
      type: "Income",
      date: "",
      category: "",
      description: "",
      amount: "",
    });
  };

  const handleEdit = (index) => {
    setFormData({
      ...transactions[index],
      amount: transactions[index].amount.toString(),
    });
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    const transaction = transactions[index];
    const amount = parseFloat(transaction.amount);
    const typeKey = transaction.type.toLowerCase();

    setFinancialData((prev) => ({
      ...prev,
      [typeKey]: prev[typeKey] - amount,
      balance: typeKey === 'income' ? prev.balance - amount : prev.balance + amount,
    }));

    const updated = transactions.filter((_, i) => i !== index);
    setTransactions(updated);

  };

  const handleClearForm = () => {
    setFormData({ type: "Income", date: "", category: "", description: "", amount: "" });
    setEditingId(null);
  };

  const handleDownloadCSV = () => {
    const headers = ["Type", "Date", "Category", "Description", "Amount"];
    const rows = filteredTransactions.map((txn) =>
      [txn.type, txn.date, txn.category, txn.description, txn.amount]
    );
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = "transactions.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredTransactions = transactions
    .filter(txn => {
      const txnDate = new Date(txn.date);
      const start = filterStartDate ? new Date(filterStartDate) : null;
      const end = filterEndDate ? new Date(filterEndDate) : null;
      return (!start || txnDate >= start) && (!end || txnDate <= end);
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalAmount = filteredTransactions.reduce((acc, txn) => acc + parseFloat(txn.amount || 0), 0);

  return (
    <div className="transaction-container">
      <nav className="navbar">
        <div className="logo-container">
          <img src={logo} alt="MoneyMesh Logo" className="logo" />
          <span className="brand">MoneyMesh</span>
        </div>
        <div className="nav-tabs">

          <NavLink to="/overview">Overview</NavLink>
          <NavLink to="/transactions">Transactions</NavLink>
          <NavLink to="/budget-planning">Budget Planning</NavLink>

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

            <span className="welcome">Welcome</span>
            <span className="username">{user.firstName}</span>

            <span className="welcome">Welcome, {user?.firstName || 'User'}</span>

          </div>
        </div>
      </nav>

      {message && <p className="message">{message}</p>}

      <div className="transaction-section">
        <div className="transaction-table">
          <h2>Transaction List</h2>
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>

              {filteredTransactions.map((txn) => (
                <tr key={txn.id}>

              {filteredTransactions.map((txn, index) => (
                <tr key={txn.id || index}>

                  <td>{txn.type}</td>
                  <td>{new Date(txn.date).toLocaleDateString()}</td>
                  <td>{txn.category}</td>
                  <td>{txn.description}</td>
                  <td>{Number(txn.amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                  <td>
                    <button onClick={() => handleEdit(txn.id)}>Edit</button>
                    <button onClick={() => handleDelete(txn.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="4"><strong>Total</strong></td>
                <td colSpan="2"><strong>{totalAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="transaction-form-table">
          <h2>Add / Edit Transaction</h2>
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <select name="type" value={formData.type} onChange={handleChange}>
                    <option value="Income">Income</option>
                    <option value="Expense">Expense</option>
                    <option value="Savings">Savings</option>
                  </select>
                </td>
                <td><input type="date" name="date" value={formData.date} onChange={handleChange} /></td>
                <td>
                  <select name="category" value={formData.category} onChange={handleChange}>
                    <option value="">Select</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </td>
                <td><input type="text" name="description" value={formData.description} onChange={handleChange} /></td>
                <td><input type="number" name="amount" value={formData.amount} onChange={handleChange} /></td>
                <td>
                  <button onClick={handleAddTransaction}>{editingId !== null ? "Update" : "Add"}</button>
                  <button onClick={handleClearForm}>Clear</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="transaction-controls">
        <button className="download-btn" onClick={handleDownloadCSV}>
          Download CSV
        </button>
        <div className="date-filter">
          <label>From:</label>
          <input type="date" value={filterStartDate} onChange={(e) => setFilterStartDate(e.target.value)} />
          <label>To:</label>
          <input type="date" value={filterEndDate} onChange={(e) => setFilterEndDate(e.target.value)} />
        </div>
      </div>
    </div>
  );
};

export default Transaction;