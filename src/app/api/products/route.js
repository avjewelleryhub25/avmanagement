// app/api/products/route.js
import connectDB from "../../../lib/mongodb";
import Product from "../../../models/Product";
import { authMiddleware } from "../../../lib/auth";

export async function GET(req) {
  try {
    const authError = authMiddleware(req);
    if (authError) return authError;

    await connectDB();
    const products = await Product.find().sort({ createdAt: -1 });
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

    // Convert string values to appropriate number types
    try {
      if (body.costPrice !== undefined) {
        body.costPrice = parseFloat(body.costPrice);
        if (isNaN(body.costPrice)) {
          return Response.json({ error: "Cost price must be a valid number" }, { status: 400 });
        }
      }
      if (body.salePrice !== undefined) {
        body.salePrice = parseFloat(body.salePrice);
        if (isNaN(body.salePrice)) {
          return Response.json({ error: "Sale price must be a valid number" }, { status: 400 });
        }
      }
      if (body.stock !== undefined) {
        body.stock = parseInt(body.stock, 10);
        if (isNaN(body.stock)) {
          return Response.json({ error: "Stock must be a valid integer" }, { status: 400 });
        }
      }
    } catch (conversionError) {
      console.error("Error converting fields:", conversionError);
      return Response.json({ error: "Invalid data format for numeric fields" }, { status: 400 });
    }

    // Validate input (now with proper types)
    if (!body.name || !body.sku || body.costPrice === undefined || body.salePrice === undefined) {
      return Response.json(
        { error: "Name, SKU, cost price, and sale price are required" },
        { status: 400 }
      );
    }
    if (body.salePrice < body.costPrice) {
      return Response.json(
        { error: "Sale price must be greater than cost price" },
        { status: 400 }
      );
    }
    if (body.stock !== undefined && body.stock < 0) {
      return Response.json(
        { error: "Stock cannot be negative" },
        { status: 400 }
      );
    }

    const product = new Product(body);
    await product.save();
    return Response.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    if (error.code === 11000) {
      return Response.json({ error: "SKU already exists" }, { status: 409 });
    }
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}