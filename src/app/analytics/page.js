// app/analytics/page.js
"use client";
import React, { useState, useEffect } from "react";
import Chart from "../../components/ui/Chart";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState({
    totalProfit: 0,
    lowStockProducts: [],
    salesByPlatform: [],
    profitOverTime: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/api/analytics", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch analytics data");
        }
        const data = await response.json();
        setAnalyticsData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Loading analytics...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-8 bg-gradient-to-r from-amber-50 to-jewelGold/10 min-h-screen">
      <h1 className="text-3xl font-bold text-jewelGold mb-8">AV Jewellery Analytics</h1>

      {/* Summary Card */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Total Profit</h2>
        <p className="text-3xl text-jewelGold">₹{analyticsData.totalProfit.toFixed(2)}</p>
      </div>

      {/* Low Stock Alerts */}
      {analyticsData.lowStockProducts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Low Stock Alerts</h2>
          <Table
            columns={[
              { header: "Product", key: "name" },
              { header: "SKU", key: "sku" },
              { header: "Stock", key: "stock" },
              { header: "Supplier", key: "supplier" },
            ]}
            data={analyticsData.lowStockProducts}
            onRowClick={(product) => alert(`Restock ${product.name} from ${product.supplier}`)}
          />
        </div>
      )}

      {/* Sales by Platform Chart */}
      <div className="mb-8">
        <Chart
          title="Sales by Platform"
          data={analyticsData.salesByPlatform}
          dataKey="sales"
          xAxisKey="platform"
        />
      </div>

      {/* Profit Over Time Chart */}
      <div>
        <Chart
          title="Profit Over Time"
          data={analyticsData.profitOverTime}
          dataKey="profit"
          xAxisKey="date"
        />
      </div>
    </div>
  );
}