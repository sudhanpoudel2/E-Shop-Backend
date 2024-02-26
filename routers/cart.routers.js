import express from "express";
// import Cart from "../models/cart.model.js";
// import Product from "../models/product.model.js";
import { Product } from "../models/product.model.js";

const router = express.Router();

router.get("/add/:_product", function (req, res) {
  const cartFind = req.params._product;

  Product.findOne({ cartFind: cartFind }, function (err, product) {
    if (err) {
      res.send(err);
    }
    if (typeof req.session.cart == "undefined") {
      req.session.cart = [];
      req.session.cart.push({
        title: cartFind,
        quantity: 1,
        price: parseFloat(product.price).toFixed(2),
        image: "/product/image/" + product._id + "/" + product.image,
      });
    } else {
      let cart = req.session.cart;
      let newItem = true;

      for (let i = 0; i < cart.length; i++) {
        if (cart[i].title == cartFind) {
          cart[i].quantity++;
          newItem = false;
          break;
        }
      }
      if (newItem) {
        cart.push({
          title: cartFind,
          quantity: 1,
          price: parseFloat(product.price).toFixed(2),
          image: "/product/image/" + product._id + "/" + product.image,
        });
      }
    }
    console.log(req.session.cart);
    req.flash("success", "Product added");
    res.redirect("back");
  });
});

export default router;
