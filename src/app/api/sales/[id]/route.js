
// app/api/sales/[id]/route.js
import connectDB from "../../../../lib/mongodb";
import Sale from "../../../../models/Sale";
import Product from "../../../../models/Product";
import { authMiddleware } from "../../../../lib/auth";

export async function GET(req, { params }) {
  try {
    const authError = authMiddleware(req);
    if (authError) return authError;

    await connectDB();
    const sale = await Sale.findById(params.id).populate("productId");
    if (!sale) {
      return Response.json({ error: "Sale not found" }, { status: 404 });
    }
    return Response.json(sale);
  } catch (error) {
    console.error("Error fetching sale:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req,context) {
  try {
    const authError = authMiddleware(req);
    if (authError) return authError;

    await connectDB();
    const params = await context.params;
    const { id } = params;

    const body = await req.json();

    // Validate input
    if (body.quantity && body.quantity < 1) {
      return Response.json(
        { error: "Quantity must be at least 1" },
        { status: 400 }
      );
    }

    // Find existing sale
    const sale = await Sale.findById(id);
    if (!sale) {
      return Response.json({ error: "Sale not found" }, { status: 404 });
    }

    // Find product
    console.log(sale.productId,"--------------------------------------");
    
    const product = await Product.findById(sale.productId);
    if (!product) {
      return Response.json({ error: "Associated product not found" }, { status: 404 });
    }

    // If updating quantity, adjust stock
    if (body.quantity && body.quantity !== sale.quantity) {
      const stockDifference = sale.quantity - body.quantity; // Positive if reducing quantity
      const newStock = product.stock + stockDifference;
      if (newStock < 0) {
        return Response.json(
          { error: `Insufficient stock: only ${product.stock} available` },
          { status: 400 }
        );
      }
      product.stock = newStock;
      await product.save();
    }

    // Recalculate profit if totalPrice or quantity changes
    if (body.totalPrice || body.quantity) {
      const newQuantity = body.quantity || sale.quantity;
      const newTotalPrice = body.totalPrice || sale.totalPrice;
      body.profit = newTotalPrice - newQuantity * product.costPrice;
    }

    // Update sale
    const updatedSale = await Sale.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).populate("productId");
    if (!updatedSale) {
      return Response.json({ error: "Sale not found" }, { status: 404 });
    }
    return Response.json(updatedSale);
  } catch (error) {
    console.error("Error updating sale:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const authError = authMiddleware(req);
    if (authError) return authError;

    await connectDB();
    const sale = await Sale.findById(params.id);
    if (!sale) {
      return Response.json({ error: "Sale not found" }, { status: 404 });
    }

    // Restore product stock
    const product = await Product.findById(sale.productId);
    if (product) {
      product.stock += sale.quantity;
      await product.save();
    }

    // Delete sale
    await Sale.findByIdAndDelete(params.id);
    return Response.json({ message: "Sale deleted successfully" });
  } catch (error) {
    console.error("Error deleting sale:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}