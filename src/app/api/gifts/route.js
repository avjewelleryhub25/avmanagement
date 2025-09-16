// app/api/gifts/route.js
import connectDB from "../../../lib/mongodb";
import FreeGift from "../../../models/FreeGift";
import { authMiddleware } from "../../../lib/auth";

export async function GET(req) {
  try {
    const authError = authMiddleware(req);
    if (authError) return authError;

    await connectDB();
    const gifts = await FreeGift.find().sort({ createdAt: -1 });
    return Response.json(gifts);
  } catch (error) {
    console.error("Error fetching gifts:", error);
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

    const gift = new FreeGift(body);
    await gift.save();
    return Response.json(gift, { status: 201 });
  } catch (error) {
    console.error("Error creating gift:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}