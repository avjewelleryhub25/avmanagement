// components/ProductForm.js
import React, { useState } from "react";
import Button from "../ui/Button";

export default function ProductForm({ initialData = {}, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    sku: initialData.sku || "",
    costPrice: initialData.costPrice || "",
    salePrice: initialData.salePrice || "",
    stock: initialData.stock || "",
    supplier: initialData.supplier || "",
    description: initialData.description || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!formData.name || !formData.sku || !formData.costPrice || !formData.salePrice) {
      alert("Please fill in all required fields");
      return;
    }
    if (parseFloat(formData.salePrice) < parseFloat(formData.costPrice)) {
      console.log(parseFloat(formData.salePrice) , parseFloat(formData.costPrice),"price")
      alert("Sale price must be greater than cost price");
      return;
    }
    onSubmit(formData);
  };

  return (
    <form id="modal-form" onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Product Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-jewelGold focus:border-jewelGold"
          placeholder="e.g., Gold Statement Necklace"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">SKU *</label>
        <input
          type="text"
          name="sku"
          value={formData.sku}
          onChange={handleChange}
          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-jewelGold focus:border-jewelGold"
          placeholder="e.g., JWL-NECK-001"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Cost Price (₹) *</label>
        <input
          type="number"
          name="costPrice"
          value={formData.costPrice}
          onChange={handleChange}
          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-jewelGold focus:border-jewelGold"
          placeholder="e.g., 200"
          step="0.01"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Sale Price (₹) *</label>
        <input
          type="number"
          name="salePrice"
          value={formData.salePrice}
          onChange={handleChange}
          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-jewelGold focus:border-jewelGold"
          placeholder="e.g., 500"
          step="0.01"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-jewelGold focus:border-jewelGold"
          placeholder="e.g., 50"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Supplier</label>
        <input
          type="text"
          name="supplier"
          value={formData.supplier}
          onChange={handleChange}
          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-jewelGold focus:border-jewelGold"
          placeholder="e.g., Delhi Wholesale Market"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-jewelGold focus:border-jewelGold"
          placeholder="e.g., Elegant gold-plated necklace with intricate design"
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
