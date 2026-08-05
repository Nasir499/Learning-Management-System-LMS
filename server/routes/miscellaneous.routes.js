import { Router } from 'express';
import {
  contactUs,
  userStats,
  signCloudinaryUpload,
} from '../controllers/miscellaneous.controller.js';
import { authorizedRoles, isLoggedIn } from '../middlewares/auth.middleware.js';

const router = Router();

// {{URL}}/api/v1/
router.route('/contact').post(contactUs);
router
  .route('/admin/stats/users')
  .get(isLoggedIn, authorizedRoles('ADMIN'), userStats);

// Cloudinary signing endpoint for direct client uploads (ADMIN only)
router.post('/cloudinary/sign', isLoggedIn, authorizedRoles('ADMIN'), signCloudinaryUpload);

export default router;
