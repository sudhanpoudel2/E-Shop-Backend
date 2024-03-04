import cartRepository from "../middleware/repository.js";
import { Product } from "../models/product.model.js";
import express from "express";
import { Cart } from "../models/cart.model.js";
// import verifyCustomer,onlyC from "../middleware/auth.js";
// import { verifyCustomer, onlyCustomer } from "../middleware/auth.js";
// import auth from "../middleware/auth.js";
import { verifyCustomer } from "../middleware/auth.js";
const router = express.Router();

// const cart = Cart.findOne({ customer: req.customerInfo._id })
// router.post(
//   "/addToCart",
//   auth.verifyCustomer,
//   // auth.onlyCustomer,
//   async (req, res) => {
//     console.log("CART ::::", req.customerInfo._id);
//     const cart = Cart.findOne({ customer: req.customerInfo._id });

//     // console.log("CART ::::", cart);

//     // try {
//     //   const { productId } = req.body;
//     //   const quantity = Number.parseInt(req.body.quantity); // Assuming quantity is obtained from the request body

//     //   // You may need to fetch productDetails from your database or another source
//     //   const productDetails = await Product.findById(product);

//     //   if (!productDetails) {
//     //     return res.status(500).json({
//     //       type: "Not Found",
//     //       msg: "Invalid request",
//     //     });
//     //   }

//     //   if (cart) {
//     //     // Check if the product already exists in the cart
//     //     const existingProductIndex = cart.items.findIndex(
//     //       (item) => item.productId._id == productId
//     //     );

//     //     if (existingProductIndex !== -1) {
//     //       // If the product already exists, update its quantity
//     //       cart.items[existingProductIndex].quantity = parseInt(quantity);
//     //       cart.items[existingProductIndex].total =
//     //         cart.items[existingProductIndex].quantity * productDetails.price;
//     //     } else {
//     //       // If the product doesn't exist, add it to the cart
//     //       cart.items.push({
//     //         customerId: customerId,
//     //         productId: productId,
//     //         quantity: quantity,
//     //         price: productDetails.price,
//     //         total: parseInt(productDetails.price * quantity),
//     //       });
//     //     }

//     //     // Update subtotal
//     //     cart.subTotal = cart.items.reduce((acc, item) => acc + item.total, 0);
//     //   } else {
//     //     // Create a new cart if it doesn't exist
//     //     const cartData = {
//     //       customerId: customerId,
//     //       items: [
//     //         {
//     //           productId: productId,
//     //           quantity: quantity,
//     //           total: parseInt(productDetails.price * quantity),
//     //           price: productDetails.price,
//     //         },
//     //       ],
//     //       subTotal: parseInt(productDetails.price * quantity),
//     //     };
//     //     cart = await Cart.create(cartData);
//     //   }

//     //   let data = await cart.save();
//     //   res.status(200).json({
//     //     type: "success",
//     //     mgs: "Process successful",
//     //     data: data,
//     //   });
//     // } catch (err) {
//     //   console.log(err);
//     //   res.status(400).json({
//     //     type: "Invalid",
//     //     msg: "Something went wrong",
//     //     err: err,
//     //   });
//     // }
//   }
// );

router.post(
  "/addToCart",
  verifyCustomer,
  // auth.onlyCustomer,
  async (req, res) => {
    try {
      const { productId, quantity } = req.body;

      // Retrieve the user's cart from the database based on the user's ID
      let cart = await Cart.findOne({ customerId: req.customerInfo._id });

      if (!cart) {
        // If the cart doesn't exist, create a new cart for the user
        cart = new Cart({ customerId: req.customerInfo._id, items: [] });
      }

      // Check if the product already exists in the cart
      const existingItemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (existingItemIndex !== -1) {
        // If the product already exists, update its quantity
        cart.items[existingItemIndex].quantity = parseInt(quantity);
        cart.items[existingItemIndex].total =
          cart.items[existingItemIndex].quantity *
          cart.items[existingItemIndex].price;
      } else {
        // If the product doesn't exist, add it to the cart
        const productDetails = await Product.findById(productId);
        if (!productDetails) {
          return res.status(404).json({ message: "Product not found" });
        }

        const newItem = {
          productId: productDetails._id,
          quantity: parseInt(quantity),
          price: productDetails.price,
          total: parseInt(productDetails.price * quantity),
        };

        cart.items.push(newItem);
      }

      // Update the subtotal of the cart
      cart.subTotal = cart.items.reduce((acc, item) => acc + item.total, 0);

      // Save the updated cart back to the database
      await cart.save();

      res
        .status(200)
        .json({ message: "Product added to cart successfully", cart });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get("/getCart", verifyCustomer, async (req, res) => {
  try {
    // Retrieve the user's cart from the database based on the user's ID
    const cart = await Cart.findOne({ customerId: req.customerInfo._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found for this user" });
    }

    res.status(200).json({ cart });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete(
  "/removeFromCart/:productId",
  verifyCustomer,
  async (req, res) => {
    try {
      const productId = req.params.productId;

      // Retrieve the user's cart from the database based on the user's ID
      let cart = await Cart.findOne({ customerId: req.customerInfo._id });

      if (!cart) {
        return res
          .status(404)
          .json({ message: "Cart not found for this user" });
      }

      // Check if the product exists in the cart
      const existingItemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (existingItemIndex === -1) {
        return res.status(404).json({ message: "Product not found in cart" });
      }

      // Remove the product from the cart
      cart.items.splice(existingItemIndex, 1);

      // Update the subtotal of the cart
      cart.subTotal = cart.items.reduce((acc, item) => acc + item.total, 0);

      // Save the updated cart back to the database
      await cart.save();

      res
        .status(200)
        .json({ message: "Product removed from cart successfully", cart });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
