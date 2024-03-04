import mongoose, { Schema } from "mongoose";
let cartItemSchema = new Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity can not be less then 1."],
    },
    price: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const cartSchema = new Schema(
  {
    cartItems: [cartItemSchema],
    subTotal: {
      default: 0,
      type: Number,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
  },
  {
    timestamps: true,
  }
);
export const Cart = mongoose.model("Cart", cartSchema);
// export default Cart;
