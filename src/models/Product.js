// models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
  }, // e.g., "Crystal Pendant Necklace"
  description: {
    type: String,
    trim: true,
  }, // e.g., "Elegant gold-plated necklace with crystal accents"
  sku: {
    type: String,
    required: [true, "SKU is required"],
    unique: true,
    trim: true,
  }, // e.g., "JWL-NECK-002"
  variants: [String], // e.g., ["Gold", "Silver"]
  costPrice: {
    type: Number,
    required: [true, "Cost price is required"],
    min: [0, "Cost price cannot be negative"],
  }, // Wholesale cost, e.g., 150
  salePrice: {
    type: Number,
    required: [true, "Sale price is required"],
    min: [0, "Sale price cannot be negative"],
  }, // Retail price, e.g., 400
  stock: {
    type: Number,
    default: 0,
    min: [0, "Stock cannot be negative"],
  }, // Current inventory, e.g., 50
  supplier: {
    type: String,
    trim: true,
  }, // e.g., "Delhi Wholesale Market"
  images: [String], // URLs for product photos, e.g., from Instagram or Cloudinary
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Product || mongoose.model("Product", productSchema);