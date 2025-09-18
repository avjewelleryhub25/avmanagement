// app/api/gifts/[id]/route.js
import connectDB from "../../../../lib/mongodb";
import FreeGift from "../../../../models/FreeGift";
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

    const gift = await FreeGift.findByIdAndUpdate(id, body, { new: true });
    if (!gift) {
      return Response.json({ error: "Gift not found" }, { status: 404 });
    }
    return Response.json(gift);
  } catch (error) {
    console.error("Error updating gift:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const authError = authMiddleware(req);
    if (authError) return authError;

    await connectDB();
    const id = params.id;

    const gift = await FreeGift.findByIdAndDelete(id);
    if (!gift) {
      return Response.json({ error: "Gift not found" }, { status: 404 });
    }
    return Response.json({ message: "Gift deleted successfully" });
  } catch (error) {
    console.error("Error deleting gift:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}