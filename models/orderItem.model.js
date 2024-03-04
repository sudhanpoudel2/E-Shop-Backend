import mongoose, { Schema } from "mongoose";

const orderItemSchema = new Schema(
  {
    quantity: {
      type: Number,
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  { timestamps: true }
);

export const OrderItem = mongoose.model("OtderItem", orderItemSchema);
