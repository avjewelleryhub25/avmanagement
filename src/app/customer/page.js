"use client";
import React, { useState, useEffect } from "react";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import CustomerForm from "@/components/CustomerForm/CustomerForm";
// import CustomerForm from "../../components/CustomerForm";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/customers", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }
      const data = await response.json();
      setCustomers(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSubmit = async (customerData) => {
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
        throw new Error((await response.json()).error || "Failed to add customer");
      }
      const newCustomer = await response.json();
      setCustomers((prev) => [newCustomer, ...prev]);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Loading customers...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-8 bg-gradient-to-r from-amber-50 to-jewelGold/10 min-h-screen">
      <h1 className="text-3xl font-bold text-jewelGold mb-8">Customers</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New Customer</h2>
        <CustomerForm onSubmit={handleSubmit} />
      </div>
      <Table
        columns={[
          { header: "Name", key: "name" },
          { header: "Phone", key: "phone" },
          { header: "Email", key: "email" },
          {
            header: "Actions",
            render: (row) => (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => alert("Edit functionality TBD")}>
                  Edit
                </Button>
                <Button variant="secondary" onClick={() => alert("Delete functionality TBD")}>
                  Delete
                </Button>
              </div>
            ),
          },
        ]}
        data={customers}
      />
    </div>
  );
}