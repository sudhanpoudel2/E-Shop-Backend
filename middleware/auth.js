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

const verifyCustomer = function (req, res, next) {
  try {
    if (req.headers.authorization) {
      const authorizationHeader = req.headers.authorization;
      const tokenIndex = authorizationHeader.indexOf("Bearer ");

      if (tokenIndex !== -1) {
        const token = authorizationHeader.substring(tokenIndex + 7);
        const customertoken = jwt.verify(token, "thedogisbeautiful");

        Customer.findOne({ _id: customertoken.customerId }).then(function (
          customerData
        ) {
          req.customerInfo = customerData;
          next();
        });
      } else {
        return res.status(400).json({ mesg: "Bearer token missing" });
      }
    } else {
      return res.status(400).json({ mesg: "Authorization header missing" });
    }
  } catch (e) {
    res.status(400).json({ error: e });
  }
};

export default verifyCustomer;
