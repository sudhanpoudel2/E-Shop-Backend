import express from "express";
import { Order } from "../models/order.model.js";
import { OrderItem } from "../models/orderItem.model.js";

const router = express.Router();

let cart = [];

// router.get("/cart/:_id", async (req, res) => {
//   const orderCart = await User.findById(req.params._id);
// });

// router.get("/", async (req, res) => {
//   try {
//     const cartItems = await OrderItem.find({
//       customerId: req.customer._id,
//     }).populate("productId");
//     res.json(cartItems);
//   } catch (error) {
//     console.error("Error fetching cart:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
//   // const orderList = await Order.find()
//   //   .populate("user", "name")
//   //   .sort("dateOrder"); //when i do populate name only i get user name only

//   // if (!orderList) {
//   //   return res.status(500).json({ success: false });
//   // }
//   // res.send(orderList);
// });

router.post("/", async (req, res) => {
  console.log("hello", req.body);
  const orderItemIds = await Promise.all(
    req.body.orderItem.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        product: orderItem.product,
        quantity: orderItem.quantity,
      });
      newOrderItem = await newOrderItem.save();

      return newOrderItem._id;
    })
  );
  const orderItemIdsResolved = await orderItemIds;

  const totalPrices = await Promise.all(
    orderItemIdsResolved.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate(
        "product",
        "price"
      );
      const totalPrice = orderItem.product.price * orderItem.quantity;
      return totalPrice;
    })
  );

  console.log(totalPrices);

  const order = new Order({
    orderItem: orderItemIds,
    shippingAdderss: req.body.shippingAdderss,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: totalPrices.reduce((acc, price) => acc + price, 0),
    customer: req.body.customer,
    contact: req.body.contact,
  });

  const orderSave = await order.save();

  if (!orderSave) {
    return res.status(400).send("The order cannot be created");
  }

  res.send(orderSave);
});

router.put("/:_id", async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params._id, {
    status: req.body.status,
  });

  if (!order) return res.status(400).send("the order can not be created!");

  res.send(order);
});

router.delete("/:_id", async (req, res) => {
  Order.findByIdAndDelete(req.params._id)
    .then(async (order) => {
      if (order) {
        await order.orderItem.map(async (orderItem) => {
          await OrderItem.findByIdAndDelete(orderItem);
        });
        return res
          .status(200)
          .json({ success: true, message: "the orderItem was deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "order is not deleted" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});
// console.log("Received delete request for ID:", req.params._id);

router.get("/get/total", async (req, res) => {
  const totalSales = await Order.aggregate([
    { $group: { _id: null, totalSales: { $sum: "totalPrices" } } },
  ]);
  if (!totalSales) {
    return res.status(400).send("the total order sale cannot be grneate");
  }

  res.send(totalSales);
});

router.get("/get/count", async (req, res) => {
  console.log("hello am i working?");
  try {
    const orderCount = await Order.countDocuments();
    res.send({ orderCount });
  } catch (error) {
    console.error("Error getting order count:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

router.get("/get/userorder/:userid", async (req, res) => {
  const customerOrderList = await Order.find({
    customer: req.params.customerid,
  })
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    })
    .sort("dateOrder"); //when i do populate name only i get user name only

  if (!customerOrderList) {
    return res.status(500).json({ success: false });
  }
  res.send(customerOrderList);
});

export default router;
