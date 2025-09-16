// Updated app/api/sales/route.js
import connectDB from "../../../lib/mongodb";
import Sale from "../../../models/Sale";
import Product from "../../../models/Product";
import PackingMaterial from "../../../models/PackingMaterial";
import FreeGift from "../../../models/FreeGift";
import DeliveryCharge from "../../../models/DeliveryCharge";
import { authMiddleware } from "../../../lib/auth";

export async function GET(req) {
  try {
    const authError = authMiddleware(req);
    if (authError) return authError;

    await connectDB();
    const sales = await Sale.find()
      .populate("productId customerId")
      .sort({ date: -1 });
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

    // Validate
    if (!body.productId || !body.customerId || !body.quantity || !body.platform) {
      return Response.json({ error: "Product ID, customer ID, quantity, and platform are required" }, { status: 400 });
    }
    if (body.quantity < 1) {
      return Response.json({ error: "Quantity must be at least 1" }, { status: 400 });
    }

    // Fetch product populated
    const product = await Product.findById(body.productId)
      .populate("packingId freeGiftId deliveryId");
    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }
    if (product.stock < body.quantity) {
      return Response.json({ error: `Insufficient stock: only ${product.stock} available` }, { status: 400 });
    }

    // Calculate totalPrice and profit
    const totalPrice = body.quantity * product.salePrice;
    let additionalCost = 0;
    if (product.packingId) additionalCost += product.packingId.cost;
    if (product.freeGiftId && product.freeGiftId.length > 0) {
      additionalCost += product.freeGiftId.reduce((sum, gift) => sum + gift.cost, 0);
    }
    if (product.deliveryId) additionalCost += product.deliveryId.cost;
    const totalUnitCost = product.costPrice + additionalCost;
    const profit = totalPrice - (body.quantity * totalUnitCost);

    // Create sale
    const sale = new Sale({
      productId: body.productId,
      customerId: body?.customerId,
      quantity: body.quantity,
      totalPrice,
      platform: body.platform,
      profit,
    });
    await sale.save();

    // Update stock
    product.stock -= body.quantity;
    await product.save();

    const populatedSale = await Sale.findById(sale._id).populate("productId customerId");
    return Response.json(populatedSale, { status: 201 });
  } catch (error) {
    console.error("Error creating sale:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}