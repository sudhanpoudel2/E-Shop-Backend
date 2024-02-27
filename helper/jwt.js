import { expressjwt } from "express-jwt";

function authJwt() {
  const secret = "thedogisbeautiful";
  return expressjwt({
    secret,
    algorithms: ["HS256"],
  }).unless({
    path: [`/api/v1/customer/login`, `/api/v1/customer/register`],
  });
}

export default authJwt;
