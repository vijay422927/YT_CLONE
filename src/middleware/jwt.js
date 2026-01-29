import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { Apierror } from "../utils/Apierror.js";

const verifyJwt = async (req, res, next) => {
  try {
    // ✅ Get token from cookie OR Authorization header
    const token =
      req.cookies?.accessToken ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new Apierror(401, "Token is required");
    }

    // ✅ Verify token
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    // ✅ Find user
    const user = await User.findById(decoded._id)
      .select("-password -refreshToken");

    if (!user) {
      throw new Apierror(401, "Invalid access token");
    }

    // ✅ Attach user
    req.user = user;
    next();

  } catch (error) {
    console.log("Token problem:", error);

    // ⭐ THIS IS THE MOST IMPORTANT LINE
    next(error);
  }
};

export { verifyJwt };
