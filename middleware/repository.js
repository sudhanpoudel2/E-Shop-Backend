import { Cart } from "../models/cart.model.js";

const cart = async () => {
  const carts = await Cart.find().populate({
    path: "items.productId",
    select: "name price total",
  });
  return carts[0];
};

const addItem = async (payload) => {
  const newItem = await Cart.create(payload);
  return newItem;
};

export default {
  cart,
  addItem,
};
