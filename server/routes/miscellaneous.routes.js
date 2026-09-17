import { Router } from 'express';
import {
  contactUs,
  userStats,
  signCloudinaryUpload,
  healthCheck,
} from '../controllers/miscellaneous.controller.js';
import { authorizedRoles, isLoggedIn } from '../middlewares/auth.middleware.js';

const router = Router();

// {{URL}}/api/v1/
router.get('/health', healthCheck);
router.get('/ping', healthCheck);
router.route('/contact').post(contactUs);
router
  .route('/admin/stats/users')
  .get(isLoggedIn, authorizedRoles('ADMIN'), userStats);

// Cloudinary signing endpoint for direct client uploads (ADMIN and INSTRUCTOR)
router.post('/cloudinary/sign', isLoggedIn, authorizedRoles('ADMIN', 'INSTRUCTOR'), signCloudinaryUpload);

export default router;
