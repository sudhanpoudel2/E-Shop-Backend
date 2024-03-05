import express from "express";
import { Customer } from "../models/customer.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { OrderItem } from "../models/orderItem.model.js";
// import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const customer = await Customer.find();

    if (!customer) {
      res.status(404).json({ message: "Customer not found", data: {} });
    }
    res.status(200).json({ message: "customer found", data: customer });
  } catch (error) {
    res
      .status(400)
      .json({ Error: error, message: "an error occur while finding customer" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const customer = new Customer({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      contact: req.body.contact,
      address: req.body.address,
      // cart: req.body.cart,
    });

    const customerSave = await customer.save();

    return res.status(201).json({
      message: "customer created successfully",
      data: customerSave,
    });
  } catch (error) {
    // console.error("Error saving the customer:", error);
    return res
      .status(406)
      .json({ Error: error, message: "Customer cannot be created" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // const customerId = req.body;

  try {
    const customerData = await Customer.findOne({ email });

    if (!customerData) {
      return res
        .status(404)
        .json({ message: "The customer not found", data: {} });
    }

    const passwordMatch = await bcrypt.compare(password, customerData.password);

    if (passwordMatch) {
      const token = jwt.sign(
        {
          customerId: customerData._id,
          isAdmin: customerData.isAdmin,
        },
        "thedogisbeautiful"
      );
      console.log(customerData._id);
      // const accessToken = await generateAccessTOken({ customer: customer });
      return res.status(202).json({
        customer: customerData.email,
        token: token,
        // customer: customer,
        // accessToken: accessToken,
      });
    } else {
      return res.status(406).json({ message: "Password is wrong" });
    }
  } catch (error) {
    // console.error("Error logging in:", error);
    return res
      .status(400)
      .json({ Error: error, message: "An error occurred while logging in" });
  }
});

export default router;
