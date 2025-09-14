// app/api/auth/login/route.js
import connectDB from "../../../../lib/mongodb";
import User from "../../../../models/User";
import { generateToken } from "../../../../lib/auth";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return Response.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return Response.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Generate JWT
    const token = generateToken(user._id);
    return Response.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
