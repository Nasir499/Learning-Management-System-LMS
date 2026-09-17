import User from '../models/user.model.js';
import AppError from '../utils/error.util.js';
import sendEmail from '../utils/sendEmail.js';
import cloudinary from 'cloudinary';
import mongoose from 'mongoose';

/**
 * @HEALTH_CHECK
 * @ROUTE @GET {{URL}}/api/v1/health
 * @ACCESS Public
 */
export const healthCheck = async (req, res, next) => {
  try {
    const dbState = mongoose.connection.readyState;
    const dbStatus = dbState === 1 ? 'CONNECTED' : dbState === 2 ? 'CONNECTING' : 'DISCONNECTED';

    const healthInfo = {
      status: dbState === 1 ? 'OK' : 'DEGRADED',
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(process.uptime())}s`,
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: dbStatus,
        name: mongoose.connection.name || 'N/A'
      }
    };

    if (dbState !== 1) {
      return res.status(500).json({ success: false, ...healthInfo });
    }

    return res.status(200).json({ success: true, ...healthInfo });
  } catch (error) {
    return next(new AppError('Health check failed: ' + error.message, 500));
  }
};

/**
 * @CONTACT_US
 * @ROUTE @POST {{URL}}/api/v1/contact
 * @ACCESS Public
 */
export const contactUs = async (req, res, next) => {
  // Destructuring the required data from req.body
  const { name, email, message } = req.body;

  // Checking if values are valid
  if (!name || !email || !message) {
    return next(new AppError('Name, Email, Message are required', 400));
  }

  try {
    const subject = 'Contact Us Form';
    const textMessage = `${name} - ${email} <br /> ${message}`;

    // Await the send email
    await sendEmail(process.env.CONTACT_US_EMAIL, subject, textMessage);
  } catch (error) {
    console.log(error);
    return next(new AppError(error.message, 400));
  }

  res.status(200).json({
    success: true,
    message: 'Your request has been submitted successfully',
  });
};

/**
 * @USER_STATS_ADMIN
 * @ROUTE @GET {{URL}}/api/v1/admin/stats/users
 * @ACCESS Private(ADMIN ONLY)
 */
export const userStats = async (req, res, next) => {
  const allUsersCount = await User.countDocuments({ role: 'USER' });
  const instructorsCount = await User.countDocuments({ role: 'INSTRUCTOR' });

  const subscribedUsersCount = await User.countDocuments({
    role: 'USER',
    'subscription.status': 'active',
  });

  res.status(200).json({
    success: true,
    message: 'All registered users count',
    allUsersCount,
    instructorsCount,
    subscribedUsersCount,
  });
};

// Provide signed parameters for direct client-to-Cloudinary uploads
export const signCloudinaryUpload = async (req, res, next) => {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    // Allow optional folder or other params from client to be included in signature
    const paramsToSign = { timestamp };
    if (req.body && req.body.folder) paramsToSign.folder = req.body.folder;

    const signature = cloudinary.v2.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET);

    return res.status(200).json({
      success: true,
      signature,
      timestamp,
      api_key: process.env.CLOUDINARY_API_KEY,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    });
  } catch (err) {
    console.error('signCloudinaryUpload error:', err);
    return next(err);
  }
};
