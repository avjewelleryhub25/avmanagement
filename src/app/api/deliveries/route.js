// app/api/deliveries/route.js
import connectDB from "../../../lib/mongodb";
import DeliveryCharge from "../../../models/DeliveryCharge";
import { authMiddleware } from "../../../lib/auth";

export async function GET(req) {
  try {
    const authError = authMiddleware(req);
    if (authError) return authError;

    await connectDB();
    const deliveries = await DeliveryCharge.find().sort({ createdAt: -1 });
    return Response.json(deliveries);
  } catch (error) {
    console.error("Error fetching deliveries:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const authError = authMiddleware(req);
    if (authError) return authError;

    await connectDB();
    const body = await req.json();

    if (!body.name || body.cost === undefined) {
      return Response.json({ error: "Name and cost are required" }, { status: 400 });
    }
    if (body.cost < 0) {
      return Response.json({ error: "Cost cannot be negative" }, { status: 400 });
    }

    const delivery = new DeliveryCharge(body);
    await delivery.save();
    return Response.json(delivery, { status: 201 });
  } catch (error) {
    console.error("Error creating delivery:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}