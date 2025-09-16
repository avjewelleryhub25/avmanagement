import React, { useState, useEffect } from "react";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import CustomerForm from "../CustomerForm/CustomerForm";

export default function SalesForm({ initialData = {}, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    productId: initialData.productId?._id || initialData.productId || "",
    customerId: initialData.customerId?._id || initialData.customerId || "",
    quantity: initialData.quantity || "",
    platform: initialData.platform || "Instagram",
  });
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState("");
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    Promise.all([
      fetch("/api/products", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => res.json())
        .catch(() => []),
      fetch("/api/customers", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => res.json())
        .catch(() => []),
    ]).then(([p, c]) => {
      setProducts(p);
      setCustomers(c);
    }).catch(() => setError("Failed to load data"));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleCustomerSubmit = async (customerData) => {
    try {
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(customerData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add customer");
      }
      const newCustomer = await response.json();
      setCustomers((prev) => [newCustomer, ...prev]);
      setFormData((prev) => ({ ...prev, customerId: newCustomer._id }));
      setIsCustomerModalOpen(false);
    } catch (err) {
      throw new Error(err.message || "Failed to add customer");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.productId || !formData.customerId || !formData.quantity || !formData.platform) {
      setError("All fields are required");
      return;
    }
    if (parseInt(formData.quantity) < 1) {
      setError("Quantity must be at least 1");
      return;
    }
    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.message || "Failed to save sale");
    }
  };

  return (
    <form id="modal-form" onSubmit={handleSubmit} className="space-y-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="col-span-1">
        <label className="block text-sm font-medium text-gray-700">Product *</label>
        <select
          name="productId"
          value={formData.productId}
          onChange={handleChange}
          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-jewelGold focus:border-jewelGold text-sm"
          required
        >
          <option value="">Select a product</option>
          {products.map((product) => (
            <option key={product._id} value={product._id}>
              {product.name} (Stock: {product.stock}, Price: ₹{product.salePrice})
            </option>
          ))}
        </select>
      </div>
      <div className="col-span-1">
        <label className="block text-sm font-medium text-gray-700">Customer *</label>
        <div className="flex items-center gap-2">
          <select
            name="customerId"
            value={formData.customerId}
            onChange={handleChange}
            className="mt-1 flex-1 p-2 border border-gray-300 rounded-md focus:ring-jewelGold focus:border-jewelGold text-sm"
            required
          >
            <option value="">Select a customer</option>
            {customers.map((customer) => (
              <option key={customer._id} value={customer._id}>
                {customer.name}
              </option>
            ))}
          </select>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsCustomerModalOpen(true)}
            className="mt-1 p-2 text-sm"
          >
            Add
          </Button>
        </div>
      </div>
      <div className="col-span-1">
        <label className="block text-sm font-medium text-gray-700">Quantity *</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-jewelGold focus:border-jewelGold text-sm"
          placeholder="e.g., 5"
          min="1"
          required
        />
      </div>
      <div className="col-span-1">
        <label className="block text-sm font-medium text-gray-700">Platform *</label>
        <select
          name="platform"
          value={formData.platform}
          onChange={handleChange}
          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-jewelGold focus:border-jewelGold text-sm"
          required
        >
          <option value="Instagram">Instagram</option>
          <option value="Meesho">Meesho</option>
          <option value="Flipkart">Flipkart</option>
          <option value="Amazon">Amazon</option>
        </select>
      </div>
      {error && <p className="text-red-500 text-sm col-span-1 sm:col-span-2">{error}</p>}
      <div className="flex justify-end gap-2 col-span-1 sm:col-span-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
      <Modal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        title="Add New Customer"
      >
        <CustomerForm
          onSubmit={handleCustomerSubmit}
          onCancel={() => setIsCustomerModalOpen(false)}
        />
      </Modal>
    </form>
  );
}