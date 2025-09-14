// components/SalesForm.js
import React, { useState, useEffect } from "react";
import Button from "../ui/Button";

export default function SalesForm({ initialData = {}, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    productId: initialData.productId || "",
    quantity: initialData.quantity || "",
    totalPrice: initialData.totalPrice || "",
    platform: initialData.platform || "Instagram",
  });
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/products", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then(setProducts)
      .catch(() => setError("Failed to load products"));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.productId || !formData.quantity || !formData.totalPrice || !formData.platform) {
      setError("All fields are required");
      return;
    }
    if (parseInt(formData.quantity) < 1) {
      setError("Quantity must be at least 1");
      return;
    }
    onSubmit(formData);
  };

  return (
    <form id="modal-form" onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Product *</label>
        <select
          name="productId"
          value={formData.productId.name}
          onChange={handleChange}
          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-jewelGold focus:border-jewelGold"
          required
        >
          <option value="">Select a product</option>
          {products.map((product) => (
            <option key={product._id} value={product._id}>
              {product.name} (Stock: {product.stock})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Quantity *</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-jewelGold focus:border-jewelGold"
          placeholder="e.g., 5"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Total Price (₹) *</label>
        <input
          type="number"
          name="totalPrice"
          value={formData.totalPrice}
          onChange={handleChange}
          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-jewelGold focus:border-jewelGold"
          placeholder="e.g., 2000"
          step="0.01"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Platform *</label>
        <select
          name="platform"
          value={formData.platform}
          onChange={handleChange}
          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-jewelGold focus:border-jewelGold"
          required
        >
          <option value="Instagram">Instagram</option>
          <option value="Meesho">Meesho</option>
          <option value="Flipkart">Flipkart</option>
          <option value="Amazon">Amazon</option>
        </select>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
