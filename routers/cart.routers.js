import cartRepository from "../middleware/repository.js";
import { Product } from "../models/product.model.js";
import express from "express";
import { Customer } from "../models/customer.model.js";
// import jwt from "jsonwebtoken";
import auth from "../middleware/auth.js";

import Cart from "../models/cart.model.js";
import { token } from "morgan";

const router = express.Router();

router.post("/addToCart/:_id", auth, async (req, res) => {
  // const { customerId } = req.params._id;
  const { productId } = req.body;
  const quantity = Number.parseInt(req.body.quantity);

  try {
    // Find the customer
    const customerId = await Customer.findById(req.params._id);

    if (!customerId) {
      return res.status(404).json({
        type: "Not Found",
        msg: "Customer not found",
      });
    }

    // Check if the customer already has a cart
    let cart = await Cart.findOne({ customerId });

    if (!cart) {
      // If the customer doesn't have a cart, create a new one
      const cartData = {
        customerId: customerId,
        items: [],
        subTotal: 0,
      };
      cart = await Cart.create(cartData);
    }

    // Get product details
    const productDetails = await Product.productById(productId);

    if (!productDetails) {
      return res.status(500).json({
        type: "Not Found",
        msg: "Invalid request",
      });
    }

    // Check if the product already exists in the cart
    const existingProductIndex = cart.items.findIndex(
      (item) => item.productId._id == productId
    );

    if (existingProductIndex !== -1) {
      // If the product already exists, update its quantity
      cart.items[existingProductIndex].quantity = parseInt(quantity);
      cart.items[existingProductIndex].total =
        cart.items[existingProductIndex].quantity * productDetails.price;
    } else {
      // If the product doesn't exist, add it to the cart
      cart.items.push({
        productId: productId,
        quantity: quantity,
        price: productDetails.price,
        total: parseInt(productDetails.price * quantity),
      });
    }

    // Update subtotal
    cart.subTotal = cart.items.reduce((acc, item) => acc + item.total, 0);

    // Save the updated cart
    const data = await cart.save();

    res.status(200).json({
      type: "success",
      msg: "Process successful",
      data: data,
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

// router.post("/addToCart", auth, async (req, res) => {
//   const { customerId } = req.body;
//   const { productId } = req.body;
//   const quantity = Number.parseInt(req.body.quantity);
//   try {
//     // let customerData = await Customer.findOne({ customerId });
//     // customerData.cartData[req.body.productId] += 1;
//     // await Customer.findByIdAndUpdate(
//     //   { customerId },
//     //   { cartData: customerData.cartData }
//     // );
//     // let cart = await cartRepository.cart();
//     const cart = await Cart.findOne({ customerId });
//     let productDetails = await Product.productById(productId);
//     if (!productDetails) {
//       return res.status(500).json({
//         type: "Not Found",
//         msg: "Invalid request",
//       });
//     }
//     //--If Cart Exists ----
//     if (cart) {
//       //---- Check if index exists ----

//       const indexFound = cart.items.findIndex(
//         (item) => item.productId.id == productId
//       );
//       //------This removes an item from the the cart if the quantity is set to zero, We can use this method to remove an item from the list  -------
//       if (indexFound !== -1 && quantity <= 0) {
//         cart.items.splice(indexFound, 1);
//         if (cart.items.length == 0) {
//           cart.subTotal = 0;
//         } else {
//           cart.subTotal = cart.items
//             .map((item) => item.total)
//             .reduce((acc, next) => acc + next);
//         }
//       }

//       //----------Check if product exist, just add the previous quantity with the new quantity and update the total price-------
//       else if (indexFound !== -1) {
//         // cart.items.splice(indexFound, 1);

//         const quantityDifference = quantity - cart.items[indexFound].quantity;
//         cart.items[indexFound].quantity = quantity; //cart.items[indexFound].quantity + quantity;
//         cart.items[indexFound].total =
//           cart.items[indexFound].quantity * productDetails.price;
//         cart.items[indexFound].price = productDetails.price;
//         cart.subTotal += quantityDifference * productDetails.price;
//         // cart.subTotal = cart.items
//         //   .map((item) => item.total)
//         //   .reduce((acc, next) => acc + next);
//       }

//       //----Check if quantity is greater than 0 then add item to items array ----
//       else if (quantity > 0) {
//         // cart.items.splice(indexFound, 1);
//         cart.items.push({
//           // customerId: customerId,
//           productId: productId,
//           quantity: quantity,
//           price: productDetails.price,
//           total: parseInt(productDetails.price * quantity),
//         });

//         // cart.subTotal += quantityDifference * productDetails.price;
//         cart.subTotal = cart.items
//           .map((item) => item.total)
//           .reduce((acc, next) => acc + next);
//       }
//       //----If quantity of price is 0 throw the error -------
//       else {
//         return res.status(400).json({
//           type: "Invalid",
//           msg: "Invalid request",
//         });
//       }
//       let data = await cart.save();
//       res.status(200).json({
//         type: "success",
//         mgs: "Process successful",
//         data: data,
//       });
//     }
//     //------------ This creates a new cart and then adds the item to the cart that has been created------------
//     else {
//       const cartData = {
//         items: [
//           {
//             // customerId: customerId,
//             productId: productId,
//             quantity: quantity,
//             total: parseInt(productDetails.price * quantity),
//             price: productDetails.price,
//           },
//         ],
//         subTotal: parseInt(productDetails.price * quantity),
//       };
//       cart = await cartRepository.addItem(cartData);
//       // let data = await cart.save();
//       res.json(cart);
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(400).json({
//       type: "Invalid",
//       msg: "Something went wrong",
//       err: err,
//     });
//   }
// });

router.get("/", auth, async (req, res) => {
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

router.delete("/emptyCart", auth, async (req, res) => {
  try {
    let cart = await cartRepository.cart();
    cart.items = [];
    cart.subTotal = 0;
    let data = await cart.save();
    res.status(200).json({
      type: "success",
      mgs: "Cart has been emptied",
      data: data,
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
