import React, { useState } from 'react';
import './Transaction.css';

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    type: 'Expense',
    date: '',
    category: '',
    description: '',
    amount: ''
  });

  const [editIndex, setEditIndex] = useState(null);
  const [filter, setFilter] = useState({ start: '', end: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    if (!formData.date || !formData.category || !formData.description || !formData.amount) {
      alert("Please fill in all fields.");
      return;
    }

    const newTransaction = {
      ...formData,
      amount: parseFloat(formData.amount)
    };

    if (editIndex !== null) {
      const updated = [...transactions];
      updated[editIndex] = newTransaction;
      setTransactions(updated);
      setEditIndex(null);
    } else {
      setTransactions([...transactions, newTransaction]);
    }

    setFormData({ type: 'Expense', date: '', category: '', description: '', amount: '' });
  };

  const handleEdit = (index) => {
    setFormData(transactions[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updated = transactions.filter((_, i) => i !== index);
    setTransactions(updated);
  };

  const handleDownload = () => {
    const csv = [
      ['Type', 'Date', 'Category', 'Description', 'Amount'],
      ...transactions.map((t) => [
        t.type,
        t.date,
        t.category,
        t.description,
        t.amount
      ])
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'transactions.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredTransactions = transactions.filter((t) => {
    const tDate = new Date(t.date);
    const start = filter.start ? new Date(filter.start) : null;
    const end = filter.end ? new Date(filter.end) : null;
    return (!start || tDate >= start) && (!end || tDate <= end);
  });

  const total = filteredTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
  const remaining = filteredTransactions.reduce(
    (sum, t) => t.type === 'Income' ? sum + Number(t.amount) : sum - Number(t.amount),
    0
  );

  return (
    <div>
      <h2 style={{ textAlign: 'center', color: 'teal' }}>Transaction List</h2>
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
              <td>{new Date(transaction.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
              <td>{transaction.category}</td>
              <td>{transaction.description}</td>
              <td>${Number(transaction.amount).toFixed(2)}</td>
              <td>
                <button onClick={() => handleEdit(index)}>Edit</button>
                <button onClick={() => handleDelete(index)}>Delete</button>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan="4"><strong>Total</strong></td>
            <td><strong>${total.toFixed(2)}</strong></td>
            <td></td>
          </tr>
          <tr>
            <td colSpan="4"><strong>Remaining Balance</strong></td>
            <td><strong>${remaining.toFixed(2)}</strong></td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <h2 style={{ textAlign: 'center', color: 'teal' }}>Transaction Form</h2>
      <form className="form-layout" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label>Type</label>
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="Expense">Expense</option>
            <option value="Income">Income</option>
          </select>
        </div>
        <div className="form-group">
          <label>Date</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Category</label>
          <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Description</label>
          <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Amount</label>
          <input type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={handleChange} />
        </div>
        <button type="button" onClick={handleAdd}>Add</button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <button onClick={handleDownload}>Download CSV</button>
      </div>

      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <label>From: </label>
        <input type="date" value={filter.start} onChange={(e) => setFilter({ ...filter, start: e.target.value })} />
        <label style={{ marginLeft: '10px' }}>To: </label>
        <input type="date" value={filter.end} onChange={(e) => setFilter({ ...filter, end: e.target.value })} />
      </div>
    </div>
  );
};

export default Transaction;
