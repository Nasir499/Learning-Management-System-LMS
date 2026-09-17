import jwt from "jsonwebtoken";
import AppError from "../utils/error.util.js";
import User from "../models/user.model.js";
import Course from "../models/course.model.js";

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

        if (userDetails.sessionId) {
            const isSessionActive = user.activeSessions?.some(session => session.sessionId === userDetails.sessionId);
            if (!isSessionActive) {
                return next(new AppError("Session expired or logged in from another device. (Max 2 devices allowed)", 401));
            }
        }

        req.user = user;
        req.user.sessionId = userDetails.sessionId;
        next();
    } catch (error) {
        return next(new AppError(error.message || "Invalid or expired authentication token", 401));
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

    if (currentUserRole === 'ADMIN') {
        return next();
    }

    const courseId = req.params.id || req.body.courseId;
    if (currentUserRole === 'INSTRUCTOR' && courseId) {
        try {
            const course = await Course.findById(courseId);
            if (course) {
                const userFullName = req.user.fullName?.trim().toLowerCase();
                const userEmail = req.user.email?.trim().toLowerCase();
                const courseCreator = course.createdBy?.trim().toLowerCase();

                const isCreator = (
                    courseCreator === userFullName ||
                    courseCreator === userEmail ||
                    courseCreator === req.user._id.toString()
                );

                if (isCreator) {
                    return next();
                }
            }
        } catch (e) {
            // Fallback to subscription status
        }
    }

    if (courseId && req.user.enrolledCourses?.some(c => c.courseId.toString() === courseId.toString())) {
        return next();
    }

    if (subscriptionStatus !== 'active') {
        return next(new AppError("Unauthorized, Please purchase or subscribe to access this course lectures", 403));
    }
    next();
}

const isCourseCreatorOrAdmin = async (req, res, next) => {
    const currentUserRole = req.user.role;
    if (currentUserRole === 'ADMIN') {
        return next();
    }

    if (currentUserRole !== 'INSTRUCTOR') {
        return next(new AppError("Unauthorized, Only instructors and admins can perform this action", 403));
    }

    const courseId = req.params.id || req.body.courseId;
    if (courseId) {
        try {
            const course = await Course.findById(courseId);
            if (!course) {
                return next(new AppError("Course not found", 404));
            }

            const userFullName = req.user.fullName?.trim().toLowerCase();
            const userEmail = req.user.email?.trim().toLowerCase();
            const courseCreator = course.createdBy?.trim().toLowerCase();

            const isCreator = (
                courseCreator === userFullName ||
                courseCreator === userEmail ||
                courseCreator === req.user._id.toString()
            );

            if (!isCreator) {
                return next(new AppError("Unauthorized, You can only manage courses created by you", 403));
            }
        } catch (error) {
            return next(new AppError("Course validation failed", 500));
        }
    }

    next();
};

export {
    isLoggedIn,
    authorizedRoles,
    authorizedSubscriber,
    isCourseCreatorOrAdmin
}