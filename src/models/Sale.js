// models/Sale.js
import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Product ID is required"],
  }, // Reference to Product
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [1, "Quantity must be at least 1"],
  }, // e.g., 5 units sold
  totalPrice: {
    type: Number,
    required: [true, "Total price is required"],
    min: [0, "Total price cannot be negative"],
  }, // e.g., 2000 (quantity * salePrice)
  platform: {
    type: String,
    enum: ["Instagram", "Meesho", "Flipkart", "Amazon"],
    required: [true, "Platform is required"],
  }, // e.g., "Instagram"
  date: {
    type: Date,
    default: Date.now,
  },
  profit: {
    type: Number,
    required: [true, "Profit is required"],
    min: [0, "Profit cannot be negative"],
  }, // Calculated: totalPrice - (quantity * product.costPrice)
});

export default mongoose.models.Sale || mongoose.model("Sale", saleSchema);