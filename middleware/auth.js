// import jwt from "jsonwebtoken";
// import { Customer } from "../models/customer.model.js";

// const verifyCustomer = function (req, res, next) {
//   try {
//     if (req.headers.authorization) {
//       const token = req.headers.authorization.split(" ")[1];
//       const customertoken = jwt.verify(token, "thedogisbeautiful");
//       Customer.findOne({ _id: customertoken.customerId }).then(function (
//         customerData
//       ) {
//         req.customerInfo = customerData;
//         next();
//       });
//     } else {
//       return res.status(400).json({ mesg: "Authorization required" });
//     }
//   } catch (e) {
//     res.status(400).json({ error: e });
//   }
// };
// export default verifyCustomer;

import jwt from "jsonwebtoken";
import { Customer } from "../models/customer.model.js";

// const verifyCustomer = function (req, res, next) {
//   try {
//     if (req.headers.authorization) {
//       const authorizationHeader = req.headers.authorization;
//       const tokenIndex = authorizationHeader.indexOf("Bearer ");

//       if (tokenIndex !== -1) {
//         const token = authorizationHeader.substring(tokenIndex + 7);
//         const customertoken = jwt.verify(token, "thedogisbeautiful");

//         Customer.findOne({ _id: customertoken.customerId }).then(function (
//           customerData
//         ) {
//           console.log('CUSTOMER::'+customerData)
//           // req.customerInfo = customerData;
//           next();
//         });
//       } else {
//         return res.status(400).json({ mesg: "Bearer token missing" });
//       }
//     } else {
//       return res.status(400).json({ mesg: "Authorization header missing" });
//     }
//   } catch (e) {
//     res.status(400).json({ error: e });
//   }
// };

export const verifyCustomer = function (req, res, next) {
  try {
    console.log("AUTHENTICATION HEADER:", req.headers.authorization);

    if (req.headers.authorization) {
      const authHeaderParts = req.headers.authorization.split(" ");
      console.log("AUTHENTICATION HEADER PARTS:", authHeaderParts);

      if (authHeaderParts.length !== 2 || authHeaderParts[0] !== "Bearer") {
        console.log("INVALID AUTHORIZATION HEADER FORMAT");
        return res
          .status(400)
          .json({ mesg: "Invalid authorization header format" });
      }

      const token = authHeaderParts[1];
      const customertoken = jwt.verify(token, "thedogisbeautiful");
      req.customerInfo = { _id: customertoken.customerId }; // Assuming customer ID is stored in the JWT payload
      console.log("USER ID IS:::", req.customerInfo);

      // Check if the user is an admin or a customer
      if (customertoken.isAdmin) {
        console.log("User is an admin");
        return res
          .status(403)
          .json({ message: "Access forbidden for admin users" });
      }
      next();
    } else {
      console.log("ELSE PART: Authorization header missing");
      return res.status(400).json({ mesg: "Authorization header missing" });
    }
  } catch (e) {
    console.log("CATCH ERROR:", e);
    return res.status(400).json({ error: e.message });
  }
};

// const onlyCustomer = function (req, res, next) {
//   if (req.isAdmin == false) {
//     return res.status(400).json({ message: "User access denied" });
//   }
//   next();
// };

// export default verifyCustomer;
