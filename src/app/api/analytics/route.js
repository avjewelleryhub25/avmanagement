// app/api/analytics/route.js
import connectDB from "../../../lib/mongodb";
import Sale from "../../../models/Sale";
import Product from "../../../models/Product";
import { authMiddleware } from "../../../lib/auth";

export async function GET(req) {
  try {
    const authError = authMiddleware(req);
    if (authError) return authError;

    await connectDB();

    // Total profit from all sales
    const sales = await Sale.find();
    const totalProfit = sales.reduce((sum, sale) => sum + sale.profit, 0);

    // Low stock products (stock < 10)
    const lowStockProducts = await Product.find({ stock: { $lt: 10 } }).select(
      "name sku stock supplier"
    );

    // Sales by platform (total quantity sold per platform)
    const salesByPlatform = await Sale.aggregate([
      { $group: { _id: "$platform", sales: { $sum: "$quantity" } } },
      { $project: { platform: "$_id", sales: 1, _id: 0 } },
      { $sort: { platform: 1 } },
    ]);

    // Profit over time (daily profit)
    const profitOverTime = await Sale.aggregate([
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
      totalProfit,
      lowStockProducts,
      salesByPlatform,
      profitOverTime,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}