import connectDB from "../../../lib/mongodb";
import Sale from "../../../models/Sale";
import Product from "../../../models/Product";
import { authMiddleware } from "../../../lib/auth";
import { NextRequest } from "next/server";

export async function GET(request) {
  try {
    const authError = authMiddleware(request);
    if (authError) return authError;

    await connectDB();

    const url = new URL(request.url);
    const period = url.searchParams.get("period") || "monthly";

    const now = new Date();
    let fromDate;
    switch (period) {
      case "weekly":
        fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "monthly":
        fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "yearly":
        fromDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        fromDate = new Date(0); // All time
    }
    const match = { date: { $gte: fromDate } };

    // Compute totals (total revenue, total profit, total orders, avg order value)
    const totalsAgg = await Sale.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
          totalProfit: { $sum: "$profit" },
          totalOrders: { $sum: 1 },
        },
      },
    ]);
    const totals = totalsAgg[0] || {
      totalRevenue: 0,
      totalProfit: 0,
      totalOrders: 0,
    };
    const avgOrderValue = totals.totalOrders > 0 ? totals.totalRevenue / totals.totalOrders : 0;

    // Compute total investment from Product model (costPrice * stock)
    const investmentAgg = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalInvestment: { $sum: { $multiply: ["$costPrice", "$stock"] } },
        },
      },
    ]);
    const totalInvestment = investmentAgg[0]?.totalInvestment || 0;

    // Low stock products (stock < 10) - no period filter
    const lowStockProducts = await Product.find({ stock: { $lt: 10 } }).select(
      "name sku stock supplier"
    );

    // Sales by platform (total quantity sold per platform) - filtered by period
    const salesByPlatform = await Sale.aggregate([
      { $match: match },
      { $group: { _id: "$platform", sales: { $sum: "$quantity" } } },
      { $project: { platform: "$_id", sales: 1, _id: 0 } },
      { $sort: { platform: 1 } },
    ]);

    // Profit over time (daily profit) - filtered by period
    const profitOverTime = await Sale.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          profit: { $sum: "$profit" },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { date: "$_id", profit: 1, _id: 0 } },
    ]);

    return Response.json({
      period,
      totals: {
        totalRevenue: totals.totalRevenue,
        totalInvestment,
        totalProfit: totals.totalProfit,
        totalOrders: totals.totalOrders,
        avgOrderValue,
      },
      lowStockProducts,
      salesByPlatform,
      profitOverTime,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}