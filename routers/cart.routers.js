import cartRepository from "../middleware/repository.js";
import { Product } from "../models/product.model.js";
import express from "express";
import Cart from "../models/cart.model.js";
import verifyCustomer from "../middleware/auth.js";

const router = express.Router();

// const cart = Cart.findOne({ customer: req.customerInfo._id })
router.post("/addToCart", async (req, res) => {
  const cart = Cart.findOne({ customer: req.customerInfo._id });
  try {
    const { productId } = req.body;
    const quantity = Number.parseInt(req.body.quantity); // Assuming quantity is obtained from the request body

    // You may need to fetch productDetails from your database or another source
    const productDetails = await Product.findById(product);

    if (!productDetails) {
      return res.status(500).json({
        type: "Not Found",
        msg: "Invalid request",
      });
    }

    if (cart) {
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
          customerId: customerId,
          productId: productId,
          quantity: quantity,
          price: productDetails.price,
          total: parseInt(productDetails.price * quantity),
        });
      }

      // Update subtotal
      cart.subTotal = cart.items.reduce((acc, item) => acc + item.total, 0);
    } else {
      // Create a new cart if it doesn't exist
      const cartData = {
        customerId: customerId,
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
      cart = await Cart.create(cartData);
    }

    let data = await cart.save();
    res.status(200).json({
      type: "success",
      mgs: "Process successful",
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
