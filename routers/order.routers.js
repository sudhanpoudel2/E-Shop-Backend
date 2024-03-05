import express from "express";
import { Order } from "../models/order.model.js";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import { verifyCustomer } from "../middleware/auth.js";

const router = express.Router();

router.post("/addOrder", verifyCustomer, async function (req, res) {
  try {
    // Find the customer's cart
    const customerCart = await Cart.findOne({
      customerId: req.customerInfo._id,
    });
    console.log(customerCart);

    // Ensure the customer has a cart
    if (!customerCart) {
      return res
        .status(404)
        .json({ message: "Customer's cart not found", data: {} });
    }

    // Create the order with the customer's cart
    const order = new Order({
      cart: customerCart._id,
      shippingAddress: req.body.shippingAddress,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      contact: req.body.contact,
      status: "Ordered",
      dateOrder: new Date(),
    });

    // Save the order
    const savedOrder = await order.save();

    // Send the response
    res.status(201).json({ message: "order sucessfully", order: savedOrder });
  } catch (error) {
    // console.error({Error:error,message:""});
    res.status(400).json({
      Error: error,
      message: "An error occurred while creating the order",
    });
  }
});

router.get("/orders", verifyCustomer, async function (req, res) {
  try {
    // Find orders belonging to the current customer
    const orders = await Order.find({ customer: req.customerInfo._id });

    // Send the response
    res.status(200).json({ message: "Order found ", data: orders });
  } catch (error) {
    // console.error("Error retrieving orders:", error);
    res.status(400).json({
      Error: error,
      message: "An error occurred while retrieving orders",
    });
  }
});

// router.post("/", verifyCustomer, async (req, res) => {
//   try {
//     // Find the customer's cart
//     const customerCart = await Cart.findOne({
//       customerId: req.customerInfo._id,
//     }).populate("cartItems");
//     console.log(customerCart);

//     if (!customerCart) {
//       return res.status(404).json({ error: "Customer's cart not found" });
//     }

//     // Create order items from the cart items
//     const orderItems = [push.Cart()];
//     for (const cartItem of customerCart.cartItems) {
//       const orderItem = new OrderItem({
//         product: cartItem.product,
//         quantity: cartItem.quantity,
//       });
//       await orderItem.save();
//       orderItems.push(orderItem._id);
//     }

//     // Calculate total price based on order items
//     const totalPrice = orderItems.reduce((total, orderItemId) => {
//       const orderItem = customerCart.cartItems.find((item) =>
//         item._id.equals(orderItemId)
//       );
//       return total + orderItem.product.price * orderItem.quantity;
//     }, 0);

//     // Create the order
//     const order = new Order({
//       cartItems: orderItems,
//       shippingAddress: req.body.shippingAddress,
//       city: req.body.city,
//       zip: req.body.zip,
//       country: req.body.country,
//       contact: req.body.contact,
//       status: "Pending",
//       totalPrice: totalPrice,
//       customer: req.customerInfo._id,
//     });

//     // Save the order
//     const savedOrder = await order.save();

//     // Clear the customer's cart
//     customerCart.cartItems = [];
//     await customerCart.save();

//     res.status(201).json(savedOrder);
//   } catch (error) {
//     console.error("Error ordering items:", error);
//     res.status(500).json({ error: "An error occurred while ordering items" });
//   }
// });

export default router;

// import express from "express";
// import { Order } from "../models/order.model.js";
// import { OrderItem } from "../models/orderItem.model.js";
// import { verifyCustomer } from "../middleware/auth.js";

// const router = express.Router();

// let cart = [];

// // router.get("/cart/:_id", async (req, res) => {
// //   const orderCart = await User.findById(req.params._id);
// // });

// // router.get("/", async (req, res) => {
// //   try {
// //     const cartItems = await OrderItem.find({
// //       customerId: req.customer._id,
// //     }).populate("productId");
// //     res.json(cartItems);
// //   } catch (error) {
// //     console.error("Error fetching cart:", error);
// //     res.status(500).json({ error: "Internal server error" });
// //   }
// //   // const orderList = await Order.find()
// //   //   .populate("user", "name")
// //   //   .sort("dateOrder"); //when i do populate name only i get user name only

// //   // if (!orderList) {
// //   //   return res.status(500).json({ success: false });
// //   // }
// //   // res.send(orderList);
// // });

// // router.post("/", verifyCustomer, async (req, res) => {
// //   console.log("hello", req.body);
// //   const orderItemIds = await Promise.all(
// //     req.body.orderItem.map(async (orderItem) => {
// //       let newOrderItem = new OrderItem({
// //         product: orderItem.product,
// //         quantity: orderItem.quantity,
// //       });
// //       newOrderItem = await newOrderItem.save();

// //       return newOrderItem._id;
// //     })
// //   );
// //   const orderItemIdsResolved = await orderItemIds;

// //   const totalPrices = await Promise.all(
// //     orderItemIdsResolved.map(async (orderItemId) => {
// //       const orderItem = await OrderItem.findById(orderItemId).populate(
// //         "product",
// //         "price"
// //       );
// //       const totalPrice = orderItem.product.price * orderItem.quantity;
// //       return totalPrice;
// //     })
// //   );

// //   console.log(totalPrices);

// //   const order = new Order({
// //     orderItem: orderItemIds,
// //     shippingAdderss: req.body.shippingAdderss,
// //     city: req.body.city,
// //     zip: req.body.zip,
// //     country: req.body.country,
// //     phone: req.body.phone,
// //     status: req.body.status,
// //     totalPrice: totalPrices.reduce((acc, price) => acc + price, 0),
// //     // customer: req.body.customer,
// //     customerId: req.customerInfo._id,
// //     contact: req.body.contact,
// //   });

// //   const orderSave = await order.save();

// //   if (!orderSave) {
// //     return res.status(400).send("The order cannot be created");
// //   }

// //   res.send(orderSave);
// // });

// router.put("/:_id", async (req, res) => {
//   const order = await Order.findByIdAndUpdate(req.params._id, {
//     status: req.body.status,
//   });

//   if (!order) return res.status(400).send("the order can not be created!");

//   res.send(order);
// });

// router.delete("/:_id", async (req, res) => {
//   Order.findByIdAndDelete(req.params._id)
//     .then(async (order) => {
//       if (order) {
//         await order.orderItem.map(async (orderItem) => {
//           await OrderItem.findByIdAndDelete(orderItem);
//         });
//         return res
//           .status(200)
//           .json({ success: true, message: "the orderItem was deleted!" });
//       } else {
//         return res
//           .status(404)
//           .json({ success: false, message: "order is not deleted" });
//       }
//     })
//     .catch((err) => {
//       return res.status(500).json({ success: false, error: err });
//     });
// });
// // console.log("Received delete request for ID:", req.params._id);

// router.get("/get/total", async (req, res) => {
//   console.log("hello");
//   const totalSales = await Order.aggregate([
//     { $group: { _id: null, totalSales: { $sum: "totalPrices" } } },
//   ]);
//   if (!totalSales) {
//     return res.status(400).send("the total order sale cannot be grneate");
//   }

//   res.send(totalSales);
// });

// router.get("/get/count", async (req, res) => {
//   console.log("hello am i working?");
//   try {
//     const orderCount = await Order.countDocuments();
//     res.send({ orderCount });
//   } catch (error) {
//     console.error("Error getting order count:", error);
//     res.status(500).json({ success: false, error: "Internal Server Error" });
//   }
// });

// router.get("/get/userorder/:userid", async (req, res) => {
//   const customerOrderList = await Order.find({
//     customer: req.params.customerid,
//   })
//     .populate({
//       path: "orderItems",
//       populate: {
//         path: "product",
//         populate: "category",
//       },
//     })
//     .sort("dateOrder"); //when i do populate name only i get user name only

//   if (!customerOrderList) {
//     return res.status(500).json({ success: false });
//   }
//   res.send(customerOrderList);
// });

// router.post("/", verifyCustomer, async (req, res) => {
//   console.log("hello i am working");
//   try {
//     // Retrieve cart items from the request body
//     const cartItems = req.body.cartItems; // Assuming cartItems is an array of items in the cart

//     // Create an array to store order item IDs
//     const orderItemIds = [];

//     // Iterate over each cart item and create order items
//     for (const cartItem of cartItems) {
//       let newOrderItem = new OrderItem({
//         product: cartItem.product,
//         quantity: cartItem.quantity,
//       });
//       newOrderItem = await newOrderItem.save();
//       orderItemIds.push(newOrderItem._id);
//     }

//     // Calculate total prices for order items
//     const totalPrices = await Promise.all(
//       orderItemIds.map(async (orderItemId) => {
//         const orderItem = await OrderItem.findById(orderItemId).populate(
//           "product",
//           "price"
//         );
//         const totalPrice = orderItem.product.price * orderItem.quantity;
//         return totalPrice;
//       })
//     );

//     // Create the order
//     const order = new Order({
//       orderItem: orderItemIds,
//       shippingAdderss: req.body.shippingAdderss,
//       city: req.body.city,
//       zip: req.body.zip,
//       country: req.body.country,
//       phone: req.body.phone,
//       status: req.body.status,
//       totalPrice: totalPrices.reduce((acc, price) => acc + price, 0),
//       customerId: req.customerInfo._id,
//       contact: req.body.contact,
//     });

//     // Save the order
//     const orderSave = await order.save();

//     if (!orderSave) {
//       return res.status(400).send("The order cannot be created");
//     }

//     // Clear the customer's cart after creating the order
//     // You should implement this based on how your cart is managed

//     res.send(orderSave);
//   } catch (error) {
//     console.error("Error creating order:", error);
//     res.status(500).send("An error occurred while creating the order");
//   }
// });

// export default router;
