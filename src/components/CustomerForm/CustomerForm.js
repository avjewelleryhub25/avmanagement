import React, { useState } from "react";
import Button from "../ui/Button";

export default function CustomerForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!formData.name) {
      setError("Customer name is required");
      setIsSubmitting(false);
      return;
    }
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError("Please enter a valid email");
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit(formData);
      setFormData({ name: "", phone: "", email: "" }); // Reset form
    } catch (err) {
      setError(err.message || "Failed to save customer");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="col-span-1">
        <label className="block text-sm font-medium text-gray-700">Customer Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-jewelGold focus:border-jewelGold text-sm"
          placeholder="e.g., Priya Sharma"
          required
          disabled={isSubmitting}
        />
      </div>
      <div className="col-span-1">
        <label className="block text-sm font-medium text-gray-700">Phone</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-jewelGold focus:border-jewelGold text-sm"
          placeholder="e.g., +91 9876543210"
          disabled={isSubmitting}
        />
      </div>
      <div className="col-span-1 sm:col-span-2">
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-jewelGold focus:border-jewelGold text-sm"
          placeholder="e.g., priya@jeweltrendz.com"
          disabled={isSubmitting}
        />
      </div>
      {error && <p className="text-red-500 text-sm col-span-1 sm:col-span-2">{error}</p>}
      <div className="flex justify-end gap-2 col-span-1 sm:col-span-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}