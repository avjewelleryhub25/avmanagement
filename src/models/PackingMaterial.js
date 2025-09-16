// models/PackingMaterial.js
import mongoose from "mongoose";

const packingMaterialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Packing name is required"],
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

export default mongoose.models.PackingMaterial || mongoose.model("PackingMaterial", packingMaterialSchema);