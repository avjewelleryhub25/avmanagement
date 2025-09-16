// models/FreeGift.js
import mongoose from "mongoose";

const freeGiftSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Gift name is required"],
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

export default mongoose.models.FreeGift || mongoose.model("FreeGift", freeGiftSchema);