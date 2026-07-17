import {Router} from 'express';
import {
     createCourse,
     addLectureToCourseById,
     getAllCourses,
     getLecturesCourseById,
     removeCourse,
     removeLectureFromCourse,
     uploadLectureVideo,
     repairLectureVideo,
    } from '../controllers/course.controller.js';
import { authorizedRoles, authorizedSubscriber, isLoggedIn } from "../middlewares/auth.middleware.js";
import upload from '../middlewares/multer.middleware.js';
import {  updateCourseById } from '../controllers/course.controller.js';

const router = Router();

router.route('/')
    .get(getAllCourses)
    .post(
        isLoggedIn,
        authorizedRoles("ADMIN"),
        upload.single('thumbnail'),
        createCourse
    )
    .delete(
        isLoggedIn,
        authorizedRoles("ADMIN"),
        removeLectureFromCourse
    )
router.route('/:id')
    .get(
        isLoggedIn,
        authorizedSubscriber,
        getLecturesCourseById
    )
    .put(
        isLoggedIn,
        authorizedRoles("ADMIN"),
        updateCourseById
    )
    .post(
        isLoggedIn,
        authorizedRoles("ADMIN"),
        upload.single("lecture"),
        addLectureToCourseById
    )
    .delete(
        isLoggedIn,
        authorizedRoles("ADMIN"),
        removeCourse
    )

// Upload video for an existing lecture
router.post('/:id/lecture/:lectureId/upload', isLoggedIn, authorizedRoles('ADMIN'), upload.single('lecture'), uploadLectureVideo);

// Repair a lecture's video reference. If a file is provided it will be uploaded; otherwise tries to regenerate secure_url from public_id or clears broken reference.
router.post('/:id/lecture/:lectureId/repair', isLoggedIn, authorizedRoles('ADMIN'), upload.single('lecture'), repairLectureVideo);

export default router;