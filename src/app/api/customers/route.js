import connectDB from "../../../lib/mongodb";
import Customer from "../../../models/Customer";
import { authMiddleware } from "../../../lib/auth";

export async function GET(req) {
  try {
    const authError = authMiddleware(req);
    if (authError) return authError;

    await connectDB();
    const customers = await Customer.find().sort({ createdAt: -1 });
    return Response.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const authError = authMiddleware(req);
    if (authError) return authError;

    await connectDB();
    const body = await req.json();

    if (!body.name) {
      return Response.json({ error: "Name is required" }, { status: 400 });
    }

    const customer = new Customer(body);
    await customer.save();
    return Response.json(customer, { status: 201 });
  } catch (error) {
    console.error("Error creating customer:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}