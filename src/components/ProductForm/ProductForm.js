import React, { useState, useEffect } from "react";
import Button from "../ui/Button";

export default function ProductForm({ initialData = {}, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    sku: initialData.sku || "",
    costPrice: initialData.costPrice || "",
    marginPercent: initialData.marginPercent || "",
    stock: initialData.stock || "",
    supplier: initialData.supplier || "",
    description: initialData.description || "",
    packingId: initialData.packingId?._id || initialData.packingId || "",
    freeGiftId: Array.isArray(initialData.freeGiftId) ? initialData.freeGiftId.map(g => g._id || g) : [],
    deliveryId: initialData.deliveryId?._id || initialData.deliveryId || "",
  });
  const [packings, setPackings] = useState([]);
  const [gifts, setGifts] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    Promise.all([
      fetch("/api/packings", { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()).catch(() => []),
      fetch("/api/gifts", { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()).catch(() => []),
      fetch("/api/deliveries", { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()).catch(() => []),
    ]).then(([p, g, d]) => {
      setPackings([{ _id: "", name: "None" }, ...p]);
      setGifts([{ _id: "", name: "None" }, ...g]);
      setDeliveries([{ _id: "", name: "None" }, ...d]);
    }).catch(() => setError("Failed to load add-ons"));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleGiftChange = (giftId) => {
    setFormData((prev) => {
      const freeGiftId = prev.freeGiftId.includes(giftId)
        ? prev.freeGiftId.filter(id => id !== giftId)
        : [...prev.freeGiftId, giftId];
      return { ...prev, freeGiftId: freeGiftId.filter(id => id !== "") };
    });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.sku || !formData.costPrice || !formData.marginPercent) {
      setError("Please fill in all required fields");
      return;
    }
    const costPrice = parseFloat(formData.costPrice);
    const marginPercent = parseFloat(formData.marginPercent);
    if (isNaN(costPrice) || costPrice < 0 || isNaN(marginPercent) || marginPercent < 0) {
      setError("Cost price and margin % must be valid non-negative numbers");
      return;
    }
    onSubmit(formData);
  };

  if (error) {
    return <p className="text-red-500 text-sm">{error}</p>;
  }

  return (
    <form id="modal-form" onSubmit={handleSubmit} className="space-y-4 grid grid-cols-1 sm:grid-cols-2 gap-x-4">
      <div className="col-span-1">
        <label className="block text-sm font-medium text-gray-700">Product Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-jewelGold focus:border-jewelGold text-sm"
          placeholder="e.g., Gold Statement Necklace"
          required
        />
      </div>
      <div className="col-span-1">
        <label className="block text-sm font-medium text-gray-700">SKU *</label>
        <input
          type="text"
          name="sku"
          value={formData.sku}
          onChange={handleChange}
          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-jewelGold focus:border-jewelGold text-sm"
          placeholder="e.g., JWL-NECK-001"
          required
        />
      </div>
      <div className="col-span-1">
        <label className="block text-sm font-medium text-gray-700">Cost Price (₹) *</label>
        <input
          type="number"
          name="costPrice"
          value={formData.costPrice}
          onChange={handleChange}
          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-jewelGold focus:border-jewelGold text-sm"
          placeholder="e.g., 200"
          step="0.01"
          min="0"
          required
        />
      </div>
      <div className="col-span-1">
        <label className="block text-sm font-medium text-gray-700">Margin % *</label>
        <input
          type="number"
          name="marginPercent"
          value={formData.marginPercent}
          onChange={handleChange}
          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-jewelGold focus:border-jewelGold text-sm"
          placeholder="e.g., 50"
          min="0"
          required
        />
      </div>
      <div className="col-span-1">
        <label className="block text-sm font-medium text-gray-700">Packing Material</label>
        <select
          name="packingId"
          value={formData.packingId}
          onChange={handleChange}
          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-jewelGold focus:border-jewelGold text-sm"
        >
          {packings.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <div className="col-span-1 sm:col-span-2">
        <label className="block text-sm font-medium text-gray-700">Free Gifts</label>
        <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border border-gray-300 rounded-md">
          {gifts.map((gift) => (
            gift._id && (
              <label key={gift._id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.freeGiftId.includes(gift._id)}
                  onChange={() => handleGiftChange(gift._id)}
                  className="h-4 w-4 text-jewelGold focus:ring-jewelGold border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{gift.name}</span>
              </label>
            )
          ))}
        </div>
      </div>
      <div className="col-span-1">
        <label className="block text-sm font-medium text-gray-700">Delivery Charge</label>
        <select
          name="deliveryId"
          value={formData.deliveryId}
          onChange={handleChange}
          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-jewelGold focus:border-jewelGold text-sm"
        >
          {deliveries.map((d) => (
            <option key={d._id} value={d._id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>
      <div className="col-span-1">
        <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-jewelGold focus:border-jewelGold text-sm"
          placeholder="e.g., 50"
          min="0"
        />
      </div>
      <div className="col-span-1 sm:col-span-2">
        <label className="block text-sm font-medium text-gray-700">Supplier</label>
        <input
          type="text"
          name="supplier"
          value={formData.supplier}
          onChange={handleChange}
          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-jewelGold focus:border-jewelGold text-sm"
          placeholder="e.g., Delhi Wholesale Market"
        />
      </div>
      <div className="col-span-1 sm:col-span-2">
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-jewelGold focus:border-jewelGold text-sm"
          placeholder="e.g., Elegant gold-plated necklace with intricate design"
        />
      </div>
      {error && <p className="text-red-500 text-sm col-span-1 sm:col-span-2">{error}</p>}
      <div className="flex justify-end gap-2 col-span-1 sm:col-span-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}