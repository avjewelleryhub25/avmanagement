// components/AddonForm.js
import React, { useState } from "react";
import Button from "../ui/Button";

export default function AddonForm({ initialData = {}, onSubmit, onCancel, type }) {
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    cost: initialData.cost || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.cost || parseFloat(formData.cost) < 0) {
      alert(`Please fill in all required fields for ${type}. Cost must be non-negative.`);
      return;
    }
    onSubmit({ ...formData, cost: parseFloat(formData.cost) });
  };

  const title = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <form id="modal-form" onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">{title} Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-jewelGold focus:border-jewelGold"
          placeholder={`e.g., Bubble Wrap Packing`}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Cost (₹) *</label>
        <input
          type="number"
          name="cost"
          value={formData.cost}
          onChange={handleChange}
          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-jewelGold focus:border-jewelGold"
          placeholder="e.g., 10"
          step="0.01"
          min="0"
          required
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