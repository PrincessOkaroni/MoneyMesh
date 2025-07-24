import React, { useState } from "react";
import "./Transaction.css";
import { useFinancial } from "../App"; // Adjust if needed

const Transaction = () => {
  const { transactions, setTransactions } = useFinancial();

  const [formData, setFormData] = useState({
    type: "Expense",
    date: "",
    category: "",
    description: "",
    amount: "",
  });

  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add transaction
  const handleAdd = () => {
    if (!formData.date || !formData.amount) return;

    const newTransaction = {
      ...formData,
      amount: parseFloat(formData.amount),
    };

    setTransactions((prev) => [...prev, newTransaction]);

    setFormData({
      type: "Expense",
      date: "",
      category: "",
      description: "",
      amount: "",
    });
  };

  // Edit transaction
  const handleEdit = (index) => {
    const transaction = transactions[index];
    setFormData(transaction);
    handleDelete(index);
  };

  // Delete transaction
  const handleDelete = (index) => {
    const updated = [...transactions];
    updated.splice(index, 1);
    setTransactions(updated);
  };

  // Filter by date
  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    const start = filterStartDate ? new Date(filterStartDate) : null;
    const end = filterEndDate ? new Date(filterEndDate) : null;

    return (
      (!start || transactionDate >= start) &&
      (!end || transactionDate <= end)
    );
  });

  // Calculate totals
  const totalIncome = filteredTransactions
    .filter((t) => t.type === "Income")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === "Expense")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const balance = totalIncome - totalExpense;

  // Export CSV
  const handleDownloadCSV = () => {
    const csvContent = [
      ["Type", "Date", "Category", "Description", "Amount"],
      ...transactions.map((t) => [
        t.type,
        t.date,
        t.category,
        t.description,
        Number(t.amount).toFixed(2),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "transactions.csv";
    link.click();
  };

  return (
    <div className="transaction-container">
      <div className="transaction-columns">
        <div className="transaction-list">
          <h2>Transaction List</h2>
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
              {filteredTransactions.map((transaction, index) => (
                <tr key={index}>
                  <td>{transaction.type}</td>
                  <td>{transaction.date}</td>
                  <td>{transaction.category}</td>
                  <td>{transaction.description}</td>
                  <td>${Number(transaction.amount).toFixed(2)}</td>
                  <td>
                    <button onClick={() => handleEdit(index)}>Edit</button>
                    <button onClick={() => handleDelete(index)}>Delete</button>
                  </td>
                </tr>
              ))}
              <tr className="total-row">
                <td colSpan="4"><strong>Total</strong></td>
                <td colSpan="2"><strong>${(totalIncome + totalExpense).toFixed(2)}</strong></td>
              </tr>
              <tr className="balance-row">
                <td colSpan="4"><strong>Remaining Balance</strong></td>
                <td colSpan="2"><strong>${balance.toFixed(2)}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="transaction-form">
          <h2>Transaction Form</h2>
          <form>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="Expense">Expense</option>
              <option value="Income">Income</option>
            </select>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
            />
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={formData.amount}
              onChange={handleChange}
            />
            <button type="button" onClick={handleAdd}>Add</button>
          </form>
        </div>
      </div>

      <div className="transaction-download">
        <button onClick={handleDownloadCSV}>Download CSV</button>
        <div className="date-filter">
          <label>From: </label>
          <input
            type="date"
            value={filterStartDate}
            onChange={(e) => setFilterStartDate(e.target.value)}
          />
          <label>To: </label>
          <input
            type="date"
            value={filterEndDate}
            onChange={(e) => setFilterEndDate(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default Transaction;
