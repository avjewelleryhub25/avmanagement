// app/api/packings/[id]/route.js
import connectDB from "../../../../lib/mongodb";
import PackingMaterial from "../../../../models/PackingMaterial";
import { authMiddleware } from "../../../../lib/auth";

export async function PUT(req, { params }) {
  try {
    const authError = authMiddleware(req);
    if (authError) return authError;

    await connectDB();
    const id = params.id;
    const body = await req.json();

    if (!body.name || body.cost === undefined) {
      return Response.json({ error: "Name and cost are required" }, { status: 400 });
    }
    if (body.cost < 0) {
      return Response.json({ error: "Cost cannot be negative" }, { status: 400 });
    }

    const packing = await PackingMaterial.findByIdAndUpdate(id, body, { new: true });
    if (!packing) {
      return Response.json({ error: "Packing not found" }, { status: 404 });
    }
    return Response.json(packing);
  } catch (error) {
    console.error("Error updating packing:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const authError = authMiddleware(req);
    if (authError) return authError;

    await connectDB();
    const id = params.id;

    const packing = await PackingMaterial.findByIdAndDelete(id);
    if (!packing) {
      return Response.json({ error: "Packing not found" }, { status: 404 });
    }
    return Response.json({ message: "Packing deleted successfully" });
  } catch (error) {
    console.error("Error deleting packing:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}