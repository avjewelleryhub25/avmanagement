// app/api/sales/route.js
import connectDB from "../../../lib/mongodb";
import Sale from "../../../models/Sale";
import Product from "../../../models/Product";
import { authMiddleware } from "../../../lib/auth";

export async function GET(req) {
  try {
    const authError = authMiddleware(req);
    if (authError) return authError;

    await connectDB();
    const sales = await Sale.find().populate("productId").sort({ date: -1 });
    return Response.json(sales);
  } catch (error) {
    console.error("Error fetching sales:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const authError = authMiddleware(req);
    if (authError) return authError;

    await connectDB();
    const body = await req.json();

    // Validate input
    if (!body.productId || !body.quantity || !body.totalPrice || !body.platform) {
      return Response.json(
        { error: "Product ID, quantity, total price, and platform are required" },
        { status: 400 }
      );
    }
    if (body.quantity < 1) {
      return Response.json(
        { error: "Quantity must be at least 1" },
        { status: 400 }
      );
    }

    // Verify product exists and has sufficient stock
    const product = await Product.findById(body.productId);
    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }
    if (product.stock < body.quantity) {
      return Response.json(
        { error: `Insufficient stock: only ${product.stock} available` },
        { status: 400 }
      );
    }

    // Calculate profit
    const profit = body.totalPrice - body.quantity * product.costPrice;

    // Create sale
    const sale = new Sale({
      productId: body.productId,
      quantity: body.quantity,
      totalPrice: body.totalPrice,
      platform: body.platform,
      profit,
    });
    await sale.save();

    // Update product stock
    product.stock -= body.quantity;
    await product.save();

    // Populate product details in response
    const populatedSale = await Sale.findById(sale._id).populate("productId");
    return Response.json(populatedSale, { status: 201 });
  } catch (error) {
    console.error("Error creating sale:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
