// Updated app/api/products/route.js
import connectDB from "../../../lib/mongodb";
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
    const products = await Product.find()
      .populate("packingId freeGiftId deliveryId")
      .sort({ createdAt: -1 });
    return Response.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const authError = authMiddleware(req);
    if (authError) return authError;

    await connectDB();
    const body = await req.json();

    // Convert string values
    try {
      if (body.costPrice !== undefined) body.costPrice = parseFloat(body.costPrice);
      if (body.marginPercent !== undefined) body.marginPercent = parseFloat(body.marginPercent);
      if (body.stock !== undefined) body.stock = parseInt(body.stock, 10);
    } catch (conversionError) {
      return Response.json({ error: "Invalid data format for numeric fields" }, { status: 400 });
    }

    // Validate
    if (!body.name || !body.sku || body.costPrice === undefined || body.marginPercent === undefined) {
      return Response.json({ error: "Name, SKU, cost price, and margin % are required" }, { status: 400 });
    }
    if (body.costPrice < 0 || body.marginPercent < 0) {
      return Response.json({ error: "Cost price and margin % cannot be negative" }, { status: 400 });
    }
    if (body.stock !== undefined && body.stock < 0) {
      return Response.json({ error: "Stock cannot be negative" }, { status: 400 });
    }

    // Calculate additional costs
    let additionalCost = 0;
    if (body.packingId) {
      const packing = await PackingMaterial.findById(body.packingId);
      if (packing) additionalCost += packing.cost;
    }
    if (Array.isArray(body.freeGiftId) && body.freeGiftId.length > 0) {
      const gifts = await FreeGift.find({ _id: { $in: body.freeGiftId } });
      additionalCost += gifts.reduce((sum, gift) => sum + gift.cost, 0);
    }
    if (body.deliveryId) {
      const delivery = await DeliveryCharge.findById(body.deliveryId);
      if (delivery) additionalCost += delivery.cost;
    }

    // Calculate salePrice based on costPrice + margin% only
    body.salePrice = body.costPrice * (1 + body.marginPercent / 100) + additionalCost;

    const product = new Product(body);
    await product.save();
    const populatedProduct = await Product.findById(product._id).populate("packingId freeGiftId deliveryId");
    return Response.json(populatedProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    if (error.code === 11000) {
      return Response.json({ error: "SKU already exists" }, { status: 409 });
    }
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}