import React, { useState } from "react";

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