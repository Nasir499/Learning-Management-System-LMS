import jwt from "jsonwebtoken";
import AppError from "../utils/error.util.js";
import User from "../models/user.model.js";

const isLoggedIn = async (req, res, next) => {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return next(new AppError("Unauthenticated, Please login again", 401));
    }

    try {
        const userDetails = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(userDetails.id);
        if (!user) {
            return next(new AppError("Unauthenticated, Please login again", 401));
        }
        req.user = user;
        next();
    } catch (error) {
        return next(new AppError("Invalid or expired authentication token", 401));
    }
}

const authorizedRoles = (...roles) => async (req, res, next) => {
    const currentUserRole = req.user.role;
    if(!roles.includes(currentUserRole)){
        return next(new AppError("Unauthorized, You are not allowed to access this resource", 403));
    }
    next();
}

const authorizedSubscriber = async (req, res, next) => {
    const subscriptionStatus = req.user.subscription?.status;
    const currentUserRole = req.user.role;

    if (currentUserRole !== 'ADMIN' && subscriptionStatus !== 'active') {
        return next(new AppError("Unauthorized, You don't have permission to access this resource", 403));
    }
    next();
}

export {
    isLoggedIn,
    authorizedRoles,
    authorizedSubscriber
}