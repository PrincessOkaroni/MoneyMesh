import React, { useState } from "react";
import "./Transaction.css";

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    type: "Expense",
    date: "",
    category: "",
    description: "",
    amount: "",
  });

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Handle input changes
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

    setTransactions((prev) => [
      ...prev,
      { ...formData, id: Date.now() },
    ]);

    setFormData({
      type: "Expense",
      date: "",
      category: "",
      description: "",
      amount: "",
    });
  };

  // Delete transaction
  const handleDelete = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // Edit transaction
  const handleEdit = (t) => {
    setFormData(t);
    setTransactions((prev) => prev.filter((item) => item.id !== t.id));
  };

  // Filter transactions by date
  const filteredTransactions = transactions.filter((t) => {
    const tDate = new Date(t.date);
    const from = startDate ? new Date(startDate) : null;
    const to = endDate ? new Date(endDate) : null;
    return (!from || tDate >= from) && (!to || tDate <= to);
  });

  // Download filtered CSV
  const handleDownload = () => {
    const headers = "Type,Date,Category,Description,Amount\n";
    const rows = filteredTransactions
      .map((t) =>
        [t.type, t.date, t.category, t.description, t.amount].join(",")
      )
      .join("\n");
    const csv = headers + rows;

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Totals
  const totalIncome = filteredTransactions
    .filter((t) => t.type === "Income")
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  const remainingBalance = totalIncome - totalExpense;

  return (
    <div className="transaction-container">
      <div className="transaction-sections">
        {/* Transaction List Table */}
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((t) => (
                <tr key={t.id}>
                  <td>{t.type}</td>
                  <td>{t.date}</td>
                  <td>{t.category}</td>
                  <td>{t.description}</td>
                  <td>${parseFloat(t.amount).toFixed(2)}</td>
                  <td>
                    <button onClick={() => handleEdit(t)}>Edit</button>{" "}
                    <button onClick={() => handleDelete(t.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="4"><strong>Total Income</strong></td>
                <td colSpan="2"><strong>${totalIncome.toFixed(2)}</strong></td>
              </tr>
              <tr>
                <td colSpan="4"><strong>Total Expense</strong></td>
                <td colSpan="2"><strong>${totalExpense.toFixed(2)}</strong></td>
              </tr>
              <tr>
                <td colSpan="4"><strong>Remaining Balance</strong></td>
                <td colSpan="2"><strong>${remainingBalance.toFixed(2)}</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Transaction Form Table */}
        <div className="transaction-form">
          <h2>Transaction Form</h2>
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
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option value="Expense">Expense</option>
                    <option value="Income">Income</option>
                  </select>
                </td>
                <td>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={formData.category}
                    onChange={handleChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    value={formData.amount}
                    onChange={handleChange}
                  />
                </td>
                <td>
                  <button onClick={handleAdd}>Add</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Download CSV */}
      <button className="download-button" onClick={handleDownload}>
        Download CSV
      </button>

      {/* Date Filter UI */}
      <div className="date-filter" style={{ marginTop: "10px" }}>
        <label>
          From:{" "}
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label style={{ marginLeft: "10px" }}>
          To:{" "}
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
      </div>
    </div>
  );
};

export default Transaction;
