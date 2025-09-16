// Updated app/products/page.js (minor update for populated fields, but mostly same; add populate in GET already done)
"use client";
import React, { useState, useEffect } from "react";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import ProductForm from "../../components/ProductForm/ProductForm";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSubmit = async (data) => {
    try {
      const method = editingProduct ? "PUT" : "POST";
      const url = editingProduct ? `/api/products/${editingProduct._id}` : "/api/products";
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save product");
      }
      const updatedProduct = await response.json();
      setProducts((prev) =>
        editingProduct
          ? prev.map((product) => (product._id === updatedProduct._id ? updatedProduct : product))
          : [updatedProduct, ...prev]
      );
      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete product");
      }
      setProducts((prev) => prev.filter((product) => product._id !== productId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Loading products...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-8 bg-gradient-to-r from-amber-50 to-jewelGold/10 min-h-screen">
      <h1 className="text-3xl font-bold text-jewelGold mb-8">Product Management</h1>
      <Button onClick={() => {
        setEditingProduct(null);
        setIsModalOpen(true);
      }} className="mb-6">
        Add New Product
      </Button>
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        title={editingProduct ? "Edit Product" : "Add New Product"}
      >
        <ProductForm
          initialData={editingProduct || {}}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingProduct(null);
          }}
        />
      </Modal>
      <Table
        columns={[
          { header: "Product", key: "name" },
          { header: "SKU", key: "sku" },
          { header: "Stock", key: "stock" },
          { header: "Cost Price (₹)", key: "costPrice" },
          { header: "Sale Price (₹)", key: "salePrice" },
          {
            header: "Margin %",
            render: (row) => row?.marginPercent?.toFixed(2) + "%",
          },
          {
            header: "Actions",
            render: (row) => (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingProduct(row);
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
        data={products}
      />
    </div>
  );
}