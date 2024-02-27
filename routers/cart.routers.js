import cartRepository from "../middleware/repository.js";
import { Product } from "../models/product.model.js";
import express from "express";
import { Customer } from "../models/customer.model.js";
import jwt from "jsonwebtoken";

import Cart from "../models/cart.model.js";

const router = express.Router();

// import authJwt from "../helper/jwt.js";
// router.use(authJwt());

const fetchCustomer = async (req, res, next) => {
  const token = req.header("authorization");
  // const token = jwt.sign(
  //   {
  //     customerId: req.body.costomerId,
  //   },
  //   "thedogisbeautiful"
  // );
  if (!token) {
    res.status(401).send({ error: " Unvalid token" });
  } else {
    try {
      const data = jwt.verify(token);
      req.customer = data.customer;
      next();
    } catch (error) {
      res.status(401).send({ error: "Please authenticate using valid token" });
    }
  }
};

router.post("/addToCart", fetchCustomer, async (req, res) => {
  const { customerId } = req.body;
  const { productId } = req.body;
  const quantity = Number.parseInt(req.body.quantity);
  try {
    let customerData = await Customer.findOne({ _id: req.customer.id });
    customerData.cartData[req.body.itemId] += 1;
    await Customer.findByIdAndUpdate(
      { _id: req.customer.id },
      { cartData: customerData.cartData }
    );
    let cart = await cartRepository.cart();
    let productDetails = await Product.productById(productId);
    if (!productDetails) {
      return res.status(500).json({
        type: "Not Found",
        msg: "Invalid request",
      });
    }
    //--If Cart Exists ----
    if (cart) {
      //---- Check if index exists ----
      const indexFound = cart.items.findIndex(
        (item) => item.productId.id == productId
      );
      //------This removes an item from the the cart if the quantity is set to zero, We can use this method to remove an item from the list  -------
      if (indexFound !== -1 && quantity <= 0) {
        cart.items.splice(indexFound, 1);
        if (cart.items.length == 0) {
          cart.subTotal = 0;
        } else {
          cart.subTotal = cart.items
            .map((item) => item.total)
            .reduce((acc, next) => acc + next);
        }
      }
      //----------Check if product exist, just add the previous quantity with the new quantity and update the total price-------
      else if (indexFound !== -1) {
        cart.items[indexFound].quantity = quantity; //cart.items[indexFound].quantity + quantity;
        cart.items[indexFound].total =
          cart.items[indexFound].quantity * productDetails.price;
        cart.items[indexFound].price = productDetails.price;
        cart.subTotal = cart.items
          .map((item) => item.total)
          .reduce((acc, next) => acc + next);
      }
      //----Check if quantity is greater than 0 then add item to items array ----
      else if (quantity > 0) {
        cart.items.push({
          productId: productId,
          quantity: quantity,
          price: productDetails.price,
          total: parseInt(productDetails.price * quantity),
        });
        cart.subTotal = cart.items
          .map((item) => item.total)
          .reduce((acc, next) => acc + next);
      }
      //----If quantity of price is 0 throw the error -------
      else {
        return res.status(400).json({
          type: "Invalid",
          msg: "Invalid request",
        });
      }
      let data = await cart.save();
      res.status(200).json({
        type: "success",
        mgs: "Process successful",
        data: data,
      });
    }
    //------------ This creates a new cart and then adds the item to the cart that has been created------------
    else {
      const cartData = {
        items: [
          {
            productId: productId,
            quantity: quantity,
            total: parseInt(productDetails.price * quantity),
            price: productDetails.price,
          },
        ],
        subTotal: parseInt(productDetails.price * quantity),
      };
      cart = await cartRepository.addItem(cartData);
      // let data = await cart.save();
      res.json(cart);
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      type: "Invalid",
      msg: "Something went wrong",
      err: err,
    });
  }
});

router.get("/", fetchCustomer, async (req, res) => {
  try {
    const cart = await cartRepository.cart();
    if (!cart) {
      res.status(400).json({
        type: "Invalid",
        msg: "Cart not Found",
      });
    }
    res.status(200).json({
      status: true,
      data: cart,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      type: "Invalid",
      msg: "Something went wrong",
      err: err,
    });
  }
});

export default router;
