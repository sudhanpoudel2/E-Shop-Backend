import { expressjwt } from "express-jwt";

function authJwt() {
  const secret = "thedogisbeautiful";
  return expressjwt({
    secret,
    algorithms: ["HS256"],
  });
}

export default authJwt;
