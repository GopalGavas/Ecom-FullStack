import jwt from "jsonwebtoken";

export const verifyJWT = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Token not found" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decodedToken;
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ success: false, error: "Invalid or expired token" });
  }
};

export const verifySeller = (req, res, next) => {
  if (!req.user || req.user.role !== "seller") {
    return res.status(403).json({
      success: false,
      message: "You must be a seller to access this route",
    });
  }

  next();
};
