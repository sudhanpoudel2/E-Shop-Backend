import express from "express";
import { Customer } from "../models/customer.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { OrderItem } from "../models/orderItem.model.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const customer = await Customer.find();

  if (!customer) {
    res.status(500).json({ success: false });
  }
  res.send(customer);
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

    return res.status(201).json({ success: true, customer: customerSave });
  } catch (error) {
    console.error("Error saving the customer:", error);
    return res
      .status(500)
      .json({ success: false, error: "Customer cannot be created" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // const customerId = req.body;

  try {
    const customer = await Customer.findOne({ email });

    if (!customer) {
      return res.status(400).send("The user not found");
    }

    const passwordMatch = await bcrypt.compare(password, customer.password);

    if (passwordMatch) {
      const token = jwt.sign(
        {
          customerId: customer._id,
          isAdmin: customer.isAdmin,
        },
        "thedogisbeautiful"
      );
      console.log(customer._id);
      // const accessToken = await generateAccessTOken({ customer: customer });
      return res.status(202).send({
        customer: customer.email,
        token: token,
        // customer: customer,
        // accessToken: accessToken,
      });
    } else {
      return res.status(400).send("Password is wrong");
    }
  } catch (error) {
    console.error("Error logging in:", error);
    return res
      .status(500)
      .json({ success: false, error: "An error occurred while logging in" });
  }
});

export default router;
