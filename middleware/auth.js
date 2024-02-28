import jwt from "jsonwebtoken";

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

  try {
    const secret = "thedogisbeautiful";
    const decodeData = jwt.verify(bearerToken, secret);
    req.customer = decodeData;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

export default auth;
