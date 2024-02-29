// import { expressjwt } from "express-jwt";
// import { Customer } from "../models/customer.model";
// // import isRevoked from "./jwt.js";
// // import { isRevoked } from "./jwt.js";

// function authJwt() {
//   const secret = "thedogisbeautiful";
//   return expressjwt({
//     secret,
//     algorithms: ["HS256"],
//     isRevoked: isRevoked,
//   }).unless({
//     path: [
//       { url: /\/api\/v1\/product(.*)/, methods: ["GET", "OPTIONS"] },
//       { url: /\/api\/v1\/category(.*)/, methods: ["GET", "OPTIONS"] },
//       { url: /\/api\/v1\/order(.*)/, methods: ["GET", "OPTIONS", "POST"] },
//       `/api/v1/customer/login`,
//       `/api/v1/customer/register`,
//     ],
//   });
//   // Customer.findOne({ _id: customertoken.customerID }).then(function (custData) {
//   //   req.customerInfo = custData;
//   //   next();
//   // });
// }

// async function isRevoked(req, payload, done) {
//   if (!payload.isAdmin) {
//     return done();
//   }
//   return done(null, true);
// }

// export default authJwt;
