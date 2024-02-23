import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    orderItem: [{ type: mongoose.Schema.Types.ObjectId, ref: "OrderItem" }],
    shippingAdderss: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    zip: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "",
    },
    totalPrice: {
      type: Number,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    dateOrder: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

orderSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

orderSchema.set("toJSON", {
  virtuals: true,
});

export const Order = mongoose.model("Order", orderSchema);
