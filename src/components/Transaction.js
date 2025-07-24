import React, { useState } from "react";
import "./Transaction.css";

function Transaction() {
  const [transactions, setTransactions] = useState([]);
  const [type, setType] = useState("Income");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleAdd = () => {
    if (!date || !category || !description || !amount) return;

    const newTransaction = {
      type,
      date,
      category,
      description,
      amount: parseFloat(amount),
    };

    if (editingIndex !== null) {
      const updated = [...transactions];
      updated[editingIndex] = newTransaction;
      setTransactions(updated);
      setEditingIndex(null);
    } else {
      setTransactions([...transactions, newTransaction]);
    }

    setType("Income");
    setDate("");
    setCategory("");
    setDescription("");
    setAmount("");
  };

  const handleEdit = (index) => {
    const t = transactions[index];
    setType(t.type);
    setDate(t.date);
    setCategory(t.category);
    setDescription(t.description);
    setAmount(t.amount);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    const updated = [...transactions];
    updated.splice(index, 1);
    setTransactions(updated);
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && transactionDate < start) return false;
    if (end && transactionDate > end) return false;
    return true;
  });

  const total = filteredTransactions.reduce(
    (acc, transaction) =>
      transaction.type === "Income"
        ? acc + transaction.amount
        : acc - transaction.amount,
    0
  );

  const totalAmount = filteredTransactions.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );

  const downloadCSV = () => {
    const csv = [
      ["Type", "Date", "Category", "Description", "Amount"],
      ...filteredTransactions.map((t) => [
        t.type,
        t.date,
        t.category,
        t.description,
        t.amount.toFixed(2),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h2>Transaction List</h2>
      <div className="transaction-section">
        {/* Transaction Table */}
        <div>
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
                  <td>
                    {new Date(transaction.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td>{transaction.category}</td>
                  <td>{transaction.description}</td>
                  <td>${transaction.amount.toFixed(2)}</td>
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
                <td colSpan="2">
                  <strong>${total.toFixed(2)}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Transaction Form */}
        <div className="form-layout">
          <div className="form-group">
            <label>Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <button onClick={handleAdd}>
            {editingIndex !== null ? "Update" : "Add"}
          </button>

          <button onClick={downloadCSV}>Download CSV</button>

          <div className="form-group">
            <label>From:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>To:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Transaction;
