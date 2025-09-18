"use client";
import React, { useState, useEffect } from "react";
import Table from "../../components/ui/Table";
import Chart from "../../components/ui/Chart";
import Button from "../../components/ui/Button";

export default function DashboardPage() {
  const [analyticsData, setAnalyticsData] = useState({
    period: "monthly",
    totals: {
      totalRevenue: 0,
      totalInvestment: 0,
      totalProfit: 0,
      totalOrders: 0,
      avgOrderValue: 0,
    },
    lowStockProducts: [],
    salesByPlatform: [],
    profitOverTime: [],
    recentSales: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState("monthly");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, salesRes] = await Promise.all([
          fetch(`/api/analytics?period=${period}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }),
          fetch("/api/sales", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }),
        ]);
        if (!analyticsRes.ok || !salesRes.ok) {
          throw new Error(`API error: ${analyticsRes.status} ${salesRes.status}`);
        }
        const analytics = await analyticsRes.json();
        const sales = await salesRes.json();
        setAnalyticsData({
          period: analytics.period || "monthly",
          totals: {
            totalRevenue: analytics.totals?.totalRevenue || 0,
            totalInvestment: analytics.totals?.totalInvestment || 0,
            totalProfit: analytics.totals?.totalProfit || 0,
            totalOrders: analytics.totals?.totalOrders || 0,
            avgOrderValue: analytics.totals?.avgOrderValue || 0,
          },
          lowStockProducts: analytics.lowStockProducts || [],
          salesByPlatform: analytics.salesByPlatform || [],
          profitOverTime: analytics.profitOverTime || [],
          recentSales: sales.slice(0, 5) || [],
        });
        setLoading(false);
      } catch (err) {
        setError(`Failed to load dashboard: ${err.message}`);
        setLoading(false);
      }
    };
    fetchData();
  }, [period]);

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-8 bg-gradient-to-r from-amber-50 to-jewelGold/10 min-h-screen">
      <h1 className="text-3xl font-bold text-jewelGold mb-8">JewelTrendz Dashboard</h1>

      {/* Period Filter */}
      <div className="mb-8 flex justify-end space-x-2">
        {["weekly", "monthly", "yearly"].map((p) => (
          <Button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-lg ${
              period === p
                ? "bg-jewelGold text-white"
                : "bg-white text-gray-700 border border-gray-300"
            }`}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </Button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {[
          { title: "Total Revenue", value: analyticsData.totals.totalRevenue, prefix: "₹" },
          { title: "Total Inventory Investment", value: analyticsData.totals.totalInvestment, prefix: "₹" },
          { title: "Total Profit", value: analyticsData.totals.totalProfit, prefix: "₹" },
          { title: "Total Orders", value: analyticsData.totals.totalOrders },
          { title: "Avg Order Value", value: analyticsData.totals.avgOrderValue, prefix: "₹" },
        ].map((item) => (
          <div key={item.title} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">{item.title}</h2>
            <p className="text-3xl text-jewelGold">
              {item.prefix || ""}{item.value.toFixed(2)}
            </p>
          </div>
        ))}
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
            { header: "Revenue (₹)", key: "totalPrice" },
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
      <div className="mb-8">
        <Chart
          title={`Sales by Platform (${period.charAt(0).toUpperCase() + period.slice(1)})`}
          data={analyticsData.salesByPlatform}
          dataKey="sales"
          xAxisKey="platform"
        />
      </div>

      {/* Profit Over Time Chart */}
      <div className="mb-8">
        <Chart
          title={`Profit Over Time (${period.charAt(0).toUpperCase() + period.slice(1)})`}
          data={analyticsData.profitOverTime}
          dataKey="profit"
          xAxisKey="date"
        />
      </div>
    </div>
  );
}