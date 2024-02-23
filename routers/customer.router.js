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
  const customer = new Customer({
    fullname: req.body.fullname,
    email: req.body.email,
    password: req.body.password,
    contact: req.body.contact,
    address: req.body.address,
  });
  try {
    const customerSave = await customer.save();
    return res.status(201).json({ success: true, customer: customerSave });
  } catch (error) {
    console.error("Error saving the product:", error);
    return res
      .status(500)
      .json({ success: false, error: "customer cannot be created" });
  }
});

router.post("/login", async (req, res) => {
  const customer = await Customer.findOne({ email: req.body.email });

  const secret = "thedogisbeautiful";

  if (!customer) {
    return res.status(400).send("The user not found");
  }

  if (customer && req.body.password === customer.password) {
    const token = jwt.sign(
      {
        customerID: customer.id,
      },
      secret // Passing the secret directly as a string
      // { expiresIn: "1d" }
    );

    res.status(202).send({ customer: customer.email, token: token });
  } else {
    res.status(400).send("Password is wrong");
  }
});

// const authenticateCustomer = async (email, password) => {
//   const customer = await Customer.findOne({ email });
//   if (!customer) {
//     return { authenticated: false, customer: null };
//   }

//   const passwordMatch = bcrypt.compareSync(password, customer.passwordHash);
//   return { authenticated: passwordMatch, customer };
// };

// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   const { authenticated, customer } = await authenticateCustomer(
//     email,
//     password
//   );

//   const secret = "thedogisbeautiful";

//   if (!authenticated) {
//     return res.status(400).send("Invalid email or password");
//   }

//   const token = jwt.sign(
//     {
//       customerID: customer.id,
//     },
//     secret
//     // { expiresIn: "1d" }
//   );

//   res.status(202).send({ customer: customer.email, token: token });
// });

export default router;
