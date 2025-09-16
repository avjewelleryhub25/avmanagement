// models/DeliveryCharge.js
import mongoose from "mongoose";

const deliveryChargeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Delivery name is required"],
    trim: true,
  },
  cost: {
    type: Number,
    required: [true, "Cost is required"],
    min: [0, "Cost cannot be negative"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.DeliveryCharge || mongoose.model("DeliveryCharge", deliveryChargeSchema);