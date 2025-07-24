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

  // Edit transaction (just load into form)
  const handleEdit = (t) => {
    setFormData(t);
    setTransactions((prev) => prev.filter((item) => item.id !== t.id));
  };
   // Download CSV
  const handleDownload = () => {
    const headers = "Type,Date,Category,Description,Amount\n";
    const rows = transactions
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

  // Calculate total
  const totalAmount = transactions.reduce(
    (sum, t) => sum + parseFloat(t.amount || 0),
    0
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>Transaction List</h2>
      <table border="1" cellPadding="6" cellSpacing="0">
        <thead>
             <tr>
            <th>Type</th>
            <th>Date</th>
            <th>Category</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Actionn</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
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
            <td colSpan="4"><strong>Total</strong></td>
            <td colSpan="2"><strong>${totalAmount.toFixed(2)}</strong></td>
          </tr>
        </tfoot>
      </table>

      <br />

      <h2>Transaction Form</h2>
      <table border="1" cellPadding="6" cellSpacing="0">
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

      <br />
      <button onClick={handleDownload}>Download CSV</button>
    </div>
  );
};

export default Transaction;