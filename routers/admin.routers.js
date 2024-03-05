import express from "express";
import { User } from "../models/admin.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({
  path: "",
});

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const userList = await User.find({}); //.select('-passwordHash');//password na dekhauna

    if (!userList) {
      res.status(400).json({ message: "userlist not found", data: {} });
    }
    res.status(200).json({ message: "user found", data: userList });
  } catch (error) {
    res
      .status(400)
      .json({ message: error, message: "error occur while finding userList" });
  }
});

router.get("/:_id", async (req, res) => {
  const user = await User.findById(req.params._id).select("-passwordHash");
  try {
    res.status(200).json({ message: "user find", data: user });
  } catch (error) {
    return res
      .status(404)
      .json({ Error: error, message: "user is not created" });
  }
});

router.post("/", async (req, res) => {
  console.log("user created");
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    color: req.body.color,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });
  try {
    const userSave = await user.save();
    return res.status(201).json({ success: true, user: userSave });
  } catch (error) {
    // console.error("Error saving the product:", error);
    return res
      .status(406)
      .json({ Error: error, message: "User cannot be created" });
  }
});

router.post("/register", async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    color: req.body.color,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });
  try {
    const userSave = await user.save();
    return res.status(201).json({ message: "User created", user: userSave });
  } catch (error) {
    console.error("Error saving the product:", error);
    return res
      .status(406)
      .json({ Error: error, message: "User cannot be created" });
  }
});
router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  const secret = "thedogisbeautiful";

  if (!user) {
    return res.status(404).json({ message: "The user not found", data: {} });
  }

  // Compare the plain text password from the request with the hashed password from the database
  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user._id,
        isAdmin: true,
      },
      secret // Passing the secret directly as a string
      // { expiresIn: "1d" }
    );
    console.log(user._id);

    res.status(202).json({ user: user.email, token: token });
  } else {
    res.status(400).json({ message: "Password is wrong" });
  }
});

export default router;
