import jwt from "jsonwebtoken";

export const verifyAdmin = function (req, res, next) {
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
      const usertoken = jwt.verify(token, "thedogisbeautiful");
      req.userInfo = { _id: usertoken.userId }; // Assuming customer ID is stored in the JWT payload
      console.log("USER ID IS:::", req.userInfo);

      // Check if the user is an admin or a customer
      if (!usertoken.isAdmin) {
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
