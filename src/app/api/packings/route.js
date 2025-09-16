// app/api/packings/route.js
import connectDB from "../../../lib/mongodb";
import PackingMaterial from "../../../models/PackingMaterial";
import { authMiddleware } from "../../../lib/auth";

export async function GET(req) {
  try {
    const authError = authMiddleware(req);
    if (authError) return authError;

    await connectDB();
    const packings = await PackingMaterial.find().sort({ createdAt: -1 });
    return Response.json(packings);
  } catch (error) {
    console.error("Error fetching packings:", error);
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

    const packing = new PackingMaterial(body);
    await packing.save();
    return Response.json(packing, { status: 201 });
  } catch (error) {
    console.error("Error creating packing:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}