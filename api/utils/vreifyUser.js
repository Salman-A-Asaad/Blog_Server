import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";
export const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return next(errorHandler(401, "Unauthorized"));
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return next(errorHandler(401, "Unautherized"));
    }
    req.user = user;
    next();
  });
};
