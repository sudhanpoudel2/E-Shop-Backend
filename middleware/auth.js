import jwt from "jsonwebtoken";
import { Customer } from "../models/customer.model.js";

const auth = async (req, res, next) => {
  // Verify Token
  const token =
    req.body.token || req.query.token || req.headers["authorization"];

  if (!token) {
    return res.status(403).json({
      success: false,
      message: "A token is required for auth",
    });
  }

  // Check if the token starts with "Bearer "
  if (!token.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Invalid token format",
    });
  }

  // Extract the token without using split
  const bearerToken = token.substring(7);
  // console.log(bearerToken);

  try {
    const secret = "thedogisbeautiful";
    const decodeData = jwt.verify(bearerToken, secret);
    console.log(decodeData);
    // console.log(decodeData);
    // const customerData = await Customer.findOne({ email: customer.email }); //: isVerified.email
    // console.log(customerData);
    req.customer = decodeData;
    req.token = token;
    console.log(decodeData);
    // req.customerId = customerData._id;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

export default auth;
