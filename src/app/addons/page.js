// app/addons/page.js
"use client";
import React, { useState, useEffect } from "react";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import AddonForm from "../../components/AddonForm/AddonForm";

export default function AddonsPage() {
  // Packings
  const [packings, setPackings] = useState([]);
  const [packingModalOpen, setPackingModalOpen] = useState(false);
  const [editingPacking, setEditingPacking] = useState(null);
  // Gifts
  const [gifts, setGifts] = useState([]);
  const [giftModalOpen, setGiftModalOpen] = useState(false);
  const [editingGift, setEditingGift] = useState(null);
  // Deliveries
  const [deliveries, setDeliveries] = useState([]);
  const [deliveryModalOpen, setDeliveryModalOpen] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    Promise.all([
      fetch("/api/packings", { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()).catch(() => []),
      fetch("/api/gifts", { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()).catch(() => []),
      fetch("/api/deliveries", { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()).catch(() => []),
    ]).then(([p, g, d]) => {
      setPackings(p);
      setGifts(g);
      setDeliveries(d);
      setLoading(false);
    }).catch((err) => {
      setError(err.message);
      setLoading(false);
    });
  }, []);

  const handleAddonSubmit = async (data, type, setList) => {
    try {
      const method = editingPacking || editingGift || editingDelivery ? "PUT" : "POST";
      let url;
      let setEditing;
      if (type === "packing") {
        url = editingPacking ? `/api/packings/${editingPacking._id}` : "/api/packings";
        setEditing = setEditingPacking;
      } else if (type === "gift") {
        url = editingGift ? `/api/gifts/${editingGift._id}` : "/api/gifts";
        setEditing = setEditingGift;
      } else {
        url = editingDelivery ? `/api/deliveries/${editingDelivery._id}` : "/api/deliveries";
        setEditing = setEditingDelivery;
      }
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
        throw new Error(errorData.error || "Failed to save");
      }
      const updated = await response.json();
      setList((prev) =>
        method === "PUT" ? prev.map((item) => (item._id === updated._id ? updated : item)) : [updated, ...prev]
      );
      closeModals(type);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddonDelete = async (id, type, setList) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      const response = await fetch(`/api/${type}s/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete");
      }
      setList((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const closeModals = (type) => {
    if (type === "packing") {
      setPackingModalOpen(false);
      setEditingPacking(null);
    } else if (type === "gift") {
      setGiftModalOpen(false);
      setEditingGift(null);
    } else {
      setDeliveryModalOpen(false);
      setEditingDelivery(null);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-600">Loading add-ons...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  const getEdit = (type, item) => {
    if (type === "packing") {
      setEditingPacking(item);
      setPackingModalOpen(true);
    } else if (type === "gift") {
      setEditingGift(item);
      setGiftModalOpen(true);
    } else {
      setEditingDelivery(item);
      setDeliveryModalOpen(true);
    }
  };

  return (
    <div className="p-8 bg-gradient-to-r from-amber-50 to-jewelGold/10 min-h-screen">
      <h1 className="text-3xl font-bold text-jewelGold mb-8">Add-ons Management</h1>
      
      {/* Packings Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-jewelGold mb-4">Packing Materials</h2>
        <Button onClick={() => { setEditingPacking(null); setPackingModalOpen(true); }} className="mb-4">
          Add New Packing
        </Button>
        <Modal isOpen={packingModalOpen} onClose={() => closeModals("packing")} title={editingPacking ? "Edit Packing" : "Add New Packing"}>
          <AddonForm
            initialData={editingPacking || {}}
            onSubmit={(data) => handleAddonSubmit(data, "packing", setPackings)}
            onCancel={() => closeModals("packing")}
            type="packing"
          />
        </Modal>
        <Table
          columns={[
            { header: "Name", key: "name" },
            { header: "Cost (₹)", key: "cost" },
            {
              header: "Actions",
              render: (row) => (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => getEdit("packing", row)}>
                    Edit
                  </Button>
                  <Button variant="secondary" onClick={() => handleAddonDelete(row._id, "packing", setPackings)}>
                    Delete
                  </Button>
                </div>
              ),
            },
          ]}
          data={packings}
        />
      </section>

      {/* Gifts Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-jewelGold mb-4">Free Gifts</h2>
        <Button onClick={() => { setEditingGift(null); setGiftModalOpen(true); }} className="mb-4">
          Add New Gift
        </Button>
        <Modal isOpen={giftModalOpen} onClose={() => closeModals("gift")} title={editingGift ? "Edit Gift" : "Add New Gift"}>
          <AddonForm
            initialData={editingGift || {}}
            onSubmit={(data) => handleAddonSubmit(data, "gift", setGifts)}
            onCancel={() => closeModals("gift")}
            type="gift"
          />
        </Modal>
        <Table
          columns={[
            { header: "Name", key: "name" },
            { header: "Cost (₹)", key: "cost" },
            {
              header: "Actions",
              render: (row) => (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => getEdit("gift", row)}>
                    Edit
                  </Button>
                  <Button variant="secondary" onClick={() => handleAddonDelete(row._id, "gift", setGifts)}>
                    Delete
                  </Button>
                </div>
              ),
            },
          ]}
          data={gifts}
        />
      </section>

      {/* Deliveries Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-jewelGold mb-4">Delivery Charges</h2>
        <Button onClick={() => { setEditingDelivery(null); setDeliveryModalOpen(true); }} className="mb-4">
          Add New Delivery
        </Button>
        <Modal isOpen={deliveryModalOpen} onClose={() => closeModals("delivery")} title={editingDelivery ? "Edit Delivery" : "Add New Delivery"}>
          <AddonForm
            initialData={editingDelivery || {}}
            onSubmit={(data) => handleAddonSubmit(data, "delivery", setDeliveries)}
            onCancel={() => closeModals("delivery")}
            type="delivery"
          />
        </Modal>
        <Table
          columns={[
            { header: "Name", key: "name" },
            { header: "Cost (₹)", key: "cost" },
            {
              header: "Actions",
              render: (row) => (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => getEdit("delivery", row)}>
                    Edit
                  </Button>
                  <Button variant="secondary" onClick={() => handleAddonDelete(row._id, "delivery", setDeliveries)}>
                    Delete
                  </Button>
                </div>
              ),
            },
          ]}
          data={deliveries}
        />
      </section>
    </div>
  );
}