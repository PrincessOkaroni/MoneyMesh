import React, { useState, useEffect } from "react";
import "./Transaction.css";
import { NavLink } from 'react-router-dom';
import logo from '../assets/moneymesh-logo.png';





const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    type: "Income",
    date: "",
    category: "",
    description: "",
    amount: "",
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  useEffect(() => {
    const storedTransactions = JSON.parse(localStorage.getItem("transactions")) || [];
    setTransactions(storedTransactions);
  }, []);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddTransaction = () => {
    if (editingIndex !== null) {
      const updated = [...transactions];
      updated[editingIndex] = formData;
      setTransactions(updated);
      setEditingIndex(null);
    } else {
      setTransactions([...transactions, formData]);
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
    setFormData(transactions[index]);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    const updated = transactions.filter((_, i) => i !== index);
    setTransactions(updated);
  };

  const filteredTransactions = transactions.filter((txn) => {
    const txnDate = new Date(txn.date);
    const start = filterStartDate ? new Date(filterStartDate) : null;
    const end = filterEndDate ? new Date(filterEndDate) : null;
    return (!start || txnDate >= start) && (!end || txnDate <= end);
  });

  const totalAmount = filteredTransactions.reduce((acc, txn) => acc + parseFloat(txn.amount || 0), 0);
  const balance = filteredTransactions.reduce((acc, txn) => {
    return txn.type === "Income"
      ? acc + parseFloat(txn.amount || 0)
      : acc - parseFloat(txn.amount || 0);
  }, 0);

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
  

  return (
    <div className="transaction-container">
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
            <span className="username">Purity</span>
          </div>
        </div>
      </nav>
      <div className="transaction-section">
        <div className="transaction-table">
          <h2 className="section-title">Transaction List</h2>
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
              {filteredTransactions.map((txn, index) => (
                <tr key={index}>
                  <td>{txn.type}</td>
                  <td>{new Date(txn.date).toLocaleDateString("en-GB")}</td>
                  <td>{txn.category}</td>
                  <td>{txn.description}</td>
                  <td>${parseFloat(txn.amount).toFixed(2)}</td>
                  <td>
                    <button onClick={() => handleEdit(index)}>Edit</button>{" "}
                    <button onClick={() => handleDelete(index)}>Delete</button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="4"><strong>Total</strong></td>
                <td colSpan="2"><strong>${totalAmount.toFixed(2)}</strong></td>
              </tr>
              <tr>
                <td colSpan="4"><strong>Remaining Balance</strong></td>
                <td colSpan="2"><strong>${balance.toFixed(2)}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="transaction-form-table">
          <h2 className="section-title">Transaction Form</h2>
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
                <td>
                  <input type="date" name="date" value={formData.date} onChange={handleChange} />
                </td>
                <td>
                  <input type="text" name="category" value={formData.category} onChange={handleChange} />
                </td>
                <td>
                  <input type="text" name="description" value={formData.description} onChange={handleChange} />
                </td>
                <td>
                  <input type="number" name="amount" value={formData.amount} onChange={handleChange} />
                </td>
                <td>
                  <button onClick={handleAddTransaction}>
                    {editingIndex !== null ? "Update" : "Add"}
                  </button>
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
          <label>From: </label>
          <input type="date" value={filterStartDate} onChange={(e) => setFilterStartDate(e.target.value)} />
          <label>To: </label>
          <input type="date" value={filterEndDate} onChange={(e) => setFilterEndDate(e.target.value)} />
        </div>
      </div>
    </div>
  );
};

export default Transaction;
