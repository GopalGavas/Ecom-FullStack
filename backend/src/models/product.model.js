import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },

  imageUrl: {
    type: String,
  },

  brandName: {
    type: String,
    required: true,
    trim: true,
  },

  quantity: {
    type: Number,
  },

  category: {
    type: String,
    required: true,
    trim: true,
  },

  isDeleted: {
    type: Boolean,
    default: false,
  },

  seller: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Product = mongoose.model("Product", productSchema);
