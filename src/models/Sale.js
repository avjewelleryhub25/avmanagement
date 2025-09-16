// Updated models/Sale.js
import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Product ID is required"],
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: [true, "Customer ID is required"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [1, "Quantity must be at least 1"],
  },
  totalPrice: {
    type: Number,
    required: [true, "Total price is required"],
    min: [0, "Total price cannot be negative"],
  },
  platform: {
    type: String,
    enum: ["Instagram", "Meesho", "Flipkart", "Amazon"],
    required: [true, "Platform is required"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  profit: {
    type: Number,
    required: [true, "Profit is required"],
    min: [0, "Profit cannot be negative"],
  },
});
export default mongoose.models.Sale || mongoose.model("Sale", saleSchema);