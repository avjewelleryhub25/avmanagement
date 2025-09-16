// app/dashboard/page.js
"use client";
import React, { useState, useEffect } from "react";
import Table from "../../components/ui/Table";
import Chart from "../../components/ui/Chart";
import Button from "../../components/ui/Button";

export default function DashboardPage() {
  const [analyticsData, setAnalyticsData] = useState({
    totalProfit: 0,
    lowStockProducts: [],
    salesByPlatform: [],
    recentSales: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, salesRes] = await Promise.all([
          fetch("/api/analytics", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }),
          fetch("/api/sales", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }),
        ]);
        if (!analyticsRes.ok || !salesRes.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        const analytics = await analyticsRes.json();
        const sales = await salesRes.json();
        setAnalyticsData({
          ...analytics,
          recentSales: sales.slice(0, 5), // Show 5 most recent sales
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-8 bg-gradient-to-r from-amber-50 to-jewelGold/10 min-h-screen">
      <h1 className="text-3xl font-bold text-jewelGold mb-8">AV Jewellery Dashboard</h1>

      {/* Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Total Profit</h2>
          <p className="text-3xl text-jewelGold">₹{analyticsData.totalProfit.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Low Stock Alerts</h2>
          <p className="text-3xl text-jewelGold">{analyticsData.lowStockProducts.length}</p>
        </div>
      </div>

      {/* Low Stock Table */}
      {analyticsData.lowStockProducts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Low Stock Products</h2>
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

      {/* Recent Sales */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Sales</h2>
        <Table
          columns={[
            { header: "Product", key: "productId.name" },
            { header: "Quantity", key: "quantity" },
            { header: "Platform", key: "platform" },
            { header: "Profit (₹)", key: "profit" },
            {
              header: "Date",
              render: (row) => new Date(row.date).toLocaleDateString(),
            },
          ]}
          data={analyticsData.recentSales}
        />
      </div>

      {/* Sales by Platform Chart */}
      <Chart
        title="Sales by Platform"
        data={analyticsData.salesByPlatform}
        dataKey="sales"
        xAxisKey="platform"
      />
    </div>
  );
}
