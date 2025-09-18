// app/api/deliveries/[id]/route.js
import connectDB from "../../../../lib/mongodb";
import DeliveryCharge from "../../../../models/DeliveryCharge";
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

    const delivery = await DeliveryCharge.findByIdAndUpdate(id, body, { new: true });
    if (!delivery) {
      return Response.json({ error: "Delivery not found" }, { status: 404 });
    }
    return Response.json(delivery);
  } catch (error) {
    console.error("Error updating delivery:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const authError = authMiddleware(req);
    if (authError) return authError;

    await connectDB();
    const id = params.id;

    const delivery = await DeliveryCharge.findByIdAndDelete(id);
    if (!delivery) {
      return Response.json({ error: "Delivery not found" }, { status: 404 });
    }
    return Response.json({ message: "Delivery deleted successfully" });
  } catch (error) {
    console.error("Error deleting delivery:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}