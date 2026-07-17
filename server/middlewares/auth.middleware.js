import jwt from "jsonwebtoken";
import AppError from "../utils/error.util.js";

const isLoggedIn = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new AppError("Unauthenticated, Please login again", 401));
    }

    try {
        const userDetails = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = userDetails;
        next();
    } catch (error) {
        return next(new AppError("Invalid or expired authentication token", 401));
    }
}
const authorizedRoles = (...roles)=>async (req, res, next) => {
    const currentUserRoles = req.user.role;
    if(!roles.includes(currentUserRoles)){
    return next(new AppError("Unauthorized, You are not allowed to access this resource", 403));
      }
    next();

}
const authorizedSubscriber = async (req, res, next) => {
  const subscriptionStatus = req.user.subscription?.status;
  const currUser = req.user.role;

  if (currUser !== 'ADMIN' && subscriptionStatus !== 'active') {
      return next(new AppError("Unauthorized, You don't have permission to access this resource", 403));
  }
  next();
}
export {
    isLoggedIn,
    authorizedRoles,
    authorizedSubscriber
}