import React, { useState, useEffect } from "react";
import "./Transaction.css";
import { NavLink } from 'react-router-dom';
import logo from '../assets/moneymesh-logo.png';

const apiUrl = "http://localhost:3001/transactions";
const categories = ["Bills", "Entertainment", "Investment and Savings", "General Upkeep", "Others"];

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
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

  useEffect(() => {
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => setTransactions(data))
      .catch(err => console.error("Error fetching:", err));
  }, []);

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
        </div>
        <div className="profile-section">
          <img src="https://i.pravatar.cc/40" alt="User" className="profile-pic" />
          <div className="profile-info">
            <span className="welcome">Welcome</span>
            <span className="username">{user.firstName}</span>
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
