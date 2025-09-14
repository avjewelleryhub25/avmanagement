// app/api/products/[id]/route.js
import connectDB from "../../../../lib/mongodb";
import Product from "../../../../models/Product";
import { authMiddleware } from "../../../../lib/auth";

export async function GET(req, { params }) {
  try {
    const authError = authMiddleware(req);
    if (authError) return authError;

    await connectDB();
    const product = await Product.findById(params.id);
    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }
    return Response.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const authError = authMiddleware(req);
    if (authError) return authError;

    await connectDB();
    const body = await req.json();

    // Validate input
    if (body.salePrice && body.costPrice && body.salePrice < body.costPrice) {
      return Response.json(
        { error: "Sale price must be greater than cost price" },
        { status: 400 }
      );
    }
    if (body.stock && body.stock < 0) {
      return Response.json(
        { error: "Stock cannot be negative" },
        { status: 400 }
      );
    }

    const product = await Product.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }
    return Response.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    if (error.code === 11000) {
      return Response.json({ error: "SKU already exists" }, { status: 409 });
    }
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const authError = authMiddleware(req);
    if (authError) return authError;

    await connectDB();
    const product = await Product.findByIdAndDelete(params.id);
    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }
    return Response.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}