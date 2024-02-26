import express from "express";
import Cart from "../models/cart.model.js";
// import Product from "../models/product.model.js";
import { Product } from "../models/product.model.js";

const router = express.Router();

router.get("/", function (req, res) {
  if (!req.session.cart) {
    return res.send({ products: null });
  }

  const cart = new Cart(req.session.cart);
  return res.send({
    products: cart.generateArray(),
    totalPrice: cart.totalPrice,
  });
});

router.get("/add-to-cart/:id", function (req, res) {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function (err, product) {
    if (err) {
      return res.redirect("/");
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect("/");
  });
});

export default router;
