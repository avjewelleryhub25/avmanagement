// Updated app/history/page.js
"use client";
import React, { useState, useEffect } from "react";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import SalesForm from "../../components/SalesForm/SalesForm";

export default function HistoryPage() {
  const [sales, setSales] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await fetch("/api/sales", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch sales");
        }
        const data = await response.json();
        setSales(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  const handleSubmit = async (data) => {
    try {
      const method = editingSale ? "PUT" : "POST";
      const url = editingSale ? `/api/sales/${editingSale._id}` : "/api/sales";
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to save sale");
      }
      const updatedSale = await response.json();
      setSales((prev) =>
        editingSale
          ? prev.map((sale) => (sale._id === updatedSale._id ? updatedSale : sale))
          : [updatedSale, ...prev]
      );
      setIsModalOpen(false);
      setEditingSale(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (saleId) => {
    if (!confirm("Are you sure you want to delete this sale?")) return;
    try {
      const response = await fetch(`/api/sales/${saleId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!response.ok) {
        throw new Error("Failed to delete sale");
      }
      setSales((prev) => prev.filter((sale) => sale._id !== saleId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Loading sales history...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-8 bg-gradient-to-r from-amber-50 to-jewelGold/10 min-h-screen">
      <h1 className="text-3xl font-bold text-jewelGold mb-8">Sales History</h1>
      <Button onClick={() => { setEditingSale(null); setIsModalOpen(true); }} className="mb-6">
        Record New Sale
      </Button>
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSale(null);
        }}
        title={editingSale ? "Edit Sale" : "Record New Sale"}
      >
        <SalesForm
          initialData={editingSale || {}}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingSale(null);
          }}
        />
      </Modal>
      <Table
        columns={[
          { header: "Product", key: "productId.name" },
          { header: "Customer", key: "customerId.name" },
          { header: "Quantity", key: "quantity" },
          { header: "Total Price (₹)", key: "totalPrice" },
          { header: "Platform", key: "platform" },
          { header: "Profit (₹)", key: "profit" },
          {
            header: "Date",
            render: (row) => new Date(row.date).toLocaleDateString(),
          },
          {
            header: "Actions",
            render: (row) => (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingSale(row);
                    setIsModalOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button variant="secondary" onClick={() => handleDelete(row._id)}>
                  Delete
                </Button>
              </div>
            ),
          },
        ]}
        data={sales}
      />
    </div>
  );
}