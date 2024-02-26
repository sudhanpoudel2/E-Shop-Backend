import express from "express";
import { Customer } from "../models/customer.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = express.Router();

router.get("/", async (req, res) => {
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
      fullname: req.body.fullname,
      email: req.body.email,
      password: hashedPassword,
      contact: req.body.contact,
      address: req.body.address,
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

  try {
    const customer = await Customer.findOne({ email });

    if (!customer) {
      return res.status(400).send("The user not found");
    }

    const passwordMatch = await bcrypt.compare(password, customer.password);

    if (passwordMatch) {
      const token = jwt.sign(
        {
          customerID: customer.id,
        },
        "thedogisbeautiful"
      );

      return res.status(202).send({ customer: customer.email, token: token });
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
