import jwt from "jsonwebtoken";
import User from "../models/user.js";
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token)
      return res
        .status(401)
        .json({ messgae: "Unauthorized - No tokens provided " });

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded)
      return res.status(401).json({ messgae: "Unauthorized - Invalid Token" });
    const user = await User.findById(decoded.userId).select("-password");
    if (!user)
      return res.status(401).json({ messgae: "Unauthorized - User Not Found" });
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in Protect route middleware", error);
    return res.status(500).json({ messgae: "Internal server error" });
  }
};
