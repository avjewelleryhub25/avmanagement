// Updated models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  sku: {
    type: String,
    required: [true, "SKU is required"],
    unique: true,
    trim: true,
  },
  variants: [String],
  costPrice: {
    type: Number,
    required: [true, "Cost price is required"],
    min: [0, "Cost price cannot be negative"],
  },
  salePrice: {
    type: Number,
    required: [true, "Sale price is required"],
    min: [0, "Sale price cannot be negative"],
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, "Stock cannot be negative"],
  },
  supplier: {
    type: String,
    trim: true,
  },
  images: [String],
  packingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PackingMaterial",
  },
  freeGiftId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "FreeGift",
  }],
  deliveryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DeliveryCharge",
  },
  marginPercent: {
    type: Number,
    required: [true, "Margin percentage is required"],
    min: [0, "Margin cannot be negative"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Product || mongoose.model("Product", productSchema);