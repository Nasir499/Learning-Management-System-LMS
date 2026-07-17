import Course from "../models/course.model.js"
import AppError from "../utils/error.util.js";
import cloudinary from "cloudinary";
import fs from "fs";

// Helper to upload a local file to Cloudinary using upload_stream (works for large files)
const uploadFileToCloudinary = (filePath, options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    fs.createReadStream(filePath).pipe(stream);
  });
};

// Map common Cloudinary errors to AppError with friendly messages
const mapCloudinaryError = (err) => {
  // err may contain http_code (Cloudinary), statusCode, or other fields
  const httpCode = err && (err.http_code || err.statusCode || err.status) ? (err.http_code || err.statusCode || err.status) : 500;
  let message = 'File upload failed';
  if (httpCode === 413) message = 'Uploaded file too large';
  else if (httpCode === 401 || httpCode === 403) message = 'Cloudinary authentication/permission error';
  else if (err && err.message) message = err.message;
  return new AppError(message, httpCode);
};




const getAllCourses = async (req, res, next) => {
    try {
        const courses = await Course.find({}).select("-lectures");
        res.status(200).json({
            success: true,
            message: "All courses fetched successfully",
            courses
        });
    } catch (error) {
        return next(new AppError("Failed to fetch courses", 500));
    }

}

const getLecturesCourseById = async (req, res, next) => {

    const { id } = req.params;

    try {
        const course = await Course.findById(id).select("lectures");

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Course lectures fetched successfully",
            lectures: course.lectures
        });
    } catch (error) {
        return next(new AppError("Failed to fetch course lectures", 500));
    }

}

const createCourse = async (req, res, next) => {
    // Implementation for creating a course
    // This function is not defined in the provided code snippet
    // You can add your logic here
    const { title, description, category, createdBy } = req.body;

    if (!title || !description || !category || !createdBy) {
        return next(new AppError("All fields are required", 400));
    }

    const course = await Course.create({
        title,
        description,
        category,
        createdBy,
        thumbnail: {
            public_id: "dummy",
            secure_url: "dummy"
        }
    });
    if (!course) {
        return next(new AppError("Failed to create course, please try again", 500));
    }

    if (req.file) {
        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: "courses",
                width: 800,
                height: 600,
                crop: "fill"
            });
            if (result) {
                course.thumbnail.public_id = result.public_id;
                course.thumbnail.secure_url = result.secure_url;
            }

            fs.rm(`uploads/${req.file.filename}`, (error) => {
                if (error) {
                    console.error("Failed to delete file :", error);
                }
            });
        } catch (error) {
            console.error("Failed to upload image to Cloudinary:", error);
        }
    }

    await course.save();

    res.status(201).json({
        success: true,
        message: "Course created successfully",
        course
    });
}

const updateCourseById = async (req, res, next) => {
    // Implementation for updating a course
    // This function is not defined in the provided code snippet
    // You can add your logic here
    try {
        const { id } = req.params;

        const course = await Course.findByIdAndUpdate(
            id,
            {
                $set: req.body
            },
            {
                runValidators: true
            });

        if (!course) {
            return next(new AppError("Course not found", 404));
        }

        res.status(200).json({
            success: true,
            message: "Course updated successfully",
            course
        });
    } catch (error) {
        return next(new AppError("Failed to update course", 500));
    }
}

const removeCourse = async (req, res, next) => {
    // Implementation for removing a course
    // This function is not defined in the provided code snippet
    // You can add your logic here
    try {
        const { id } = req.params;

        const course = await Course.findByIdAndDelete(id);

        if (!course) {
            return next(new AppError("Course not found", 404));
        }

        res.status(200).json({
            success: true,
            message: "Course removed successfully",
            course
        });
    } catch (error) {
        return next(new AppError("Failed to remove course", 500));
    }
}

const addLectureToCourseById = async (req, res, next) => {
  const { title, description } = req.body;
  const { id } = req.params;

  let lectureData = {};

  if (!title || !description) {
    return next(new AppError('Title and Description are required', 400));
  }

  const course = await Course.findById(id);

  if (!course) {
    return next(new AppError('Invalid course id or course not found.', 400));
  }

  // Run only if user sends a file
  if (req.file) {
    try {
      console.log('Received file for lecture upload:', { path: req.file.path, filename: req.file.filename })
      // choose resource_type based on file mimetype (fallback to video)
      const resourceType = (req.file && req.file.mimetype && req.file.mimetype.startsWith('image')) ? 'image' : 'video';
      const rawResult = await uploadFileToCloudinary(req.file.path, { folder: 'lms', resource_type: resourceType });

      console.log('Cloudinary upload result (raw):', rawResult)

      // Normalize possible result shapes from Cloudinary
      const normalize = (r) => {
        if (!r) return {};
        if (r.public_id || r.secure_url) return r;
        if (Array.isArray(r) && r[0]) return r[0];
        if (r.result) return r.result;
        return r;
      };

      const result = normalize(rawResult);
      const publicId = result.public_id;

      if (!publicId) {
        console.error('Normalized Cloudinary result missing public_id:', result);
        throw new Error('Cloudinary did not return a public_id');
      }

      lectureData.public_id = publicId;

      // Attempt to obtain a canonical secure_url. Prefer result.secure_url if present.
      if (result.secure_url) {
        lectureData.secure_url = result.secure_url;
      } else {
        try {
          const resource = await cloudinary.v2.api.resource(publicId, { resource_type: 'video' });
          lectureData.secure_url = resource && resource.secure_url ? resource.secure_url : cloudinary.v2.url(publicId, { resource_type: 'video', secure: true });
        } catch (err) {
          console.warn('Could not fetch resource metadata from Cloudinary:', err && err.message);
          lectureData.secure_url = cloudinary.v2.url(publicId, { resource_type: 'video', secure: true });
        }
      }

      // remove local file
      fs.rm(`uploads/${req.file.filename}`, (error) => {
        if (error) {
          console.error('Failed to delete file :', error)
        }
      })
    } catch (error) {
      console.error('Lecture upload failed:', error)
      return next(mapCloudinaryError(error));
    }
  }

  course.lectures.push({
    title,
    description,
    video: lectureData,
  });

  course.numberoflectures = course.lectures.length;

  // Save the course object
  await course.save();

  res.status(200).json({
    success: true,
    message: 'Course lecture added successfully',
    course,
  });
}

 const removeLectureFromCourse = async (req, res, next) => {
  // Grabbing the courseId and lectureId from req.query
  const { courseId, lectureId } = req.query;

//   console.log(courseId);

  // Checking if both courseId and lectureId are present
  if (!courseId) {
    return next(new AppError('Course ID is required', 400));
  }

  if (!lectureId) {
    return next(new AppError('Lecture ID is required', 400));
  }

  // Find the course using the courseId
  const course = await Course.findById(courseId);

  // If no course send custom message
  if (!course) {
    return next(new AppError('Invalid ID or Course does not exist.', 404));
  }

  // Find the index of the lecture using the lectureId
  const lectureIndex = course.lectures.findIndex(
    (video) => video._id.toString() === lectureId.toString()
  );

  // If returned index is -1 then send error as mentioned below
  if (lectureIndex === -1) {
    return next(new AppError('Lecture does not exist.', 404));
  }

  // Delete the lecture from cloudinary if it exists
  const lecturePublicId = course.lectures[lectureIndex].video?.public_id;
  if (lecturePublicId) {
    await cloudinary.v2.uploader.destroy(lecturePublicId, {
      resource_type: 'video',
    });
  }

  // Remove the lecture from the array
  course.lectures.splice(lectureIndex, 1);

  // update the number of lectures based on lectres array length
  course.numberoflectures = course.lectures.length;

  // Save the course object
  await course.save();

  // Return response
  res.status(200).json({
    success: true,
    message: 'Course lecture removed successfully',
  });
};

const uploadLectureVideo = async (req, res, next) => {
  try {
    const { id, lectureId } = req.params;

    if (!req.file) {
      return next(new AppError('No file provided', 400));
    }

    const course = await Course.findById(id);
    if (!course) return next(new AppError('Invalid course id or course not found.', 400));

    const lectureIndex = course.lectures.findIndex((l) => l._id.toString() === lectureId.toString());
    if (lectureIndex === -1) return next(new AppError('Lecture not found', 404));

    // upload to cloudinary using upload_large for chunked uploads
    try {
      console.log('Received file for lecture video upload:', { path: req.file.path, filename: req.file.filename })
      // choose resource_type based on file mimetype (fallback to video)
      const resourceType = (req.file && req.file.mimetype && req.file.mimetype.startsWith('image')) ? 'image' : 'video';
      const rawResult = await uploadFileToCloudinary(req.file.path, { folder: 'lms', resource_type: resourceType });

      console.log('Cloudinary upload result (raw):', rawResult)

      const normalize = (r) => {
        if (!r) return {};
        if (r.public_id || r.secure_url) return r;
        if (Array.isArray(r) && r[0]) return r[0];
        if (r.result) return r.result;
        return r;
      };

      const result = normalize(rawResult);
      const publicId = result.public_id;

      if (!publicId) {
        console.error('Normalized Cloudinary result missing public_id:', result);
        throw new Error('Cloudinary did not return a public_id')
      }

      // Try to fetch resource metadata to get a canonical secure_url where possible
      let secureUrl = result.secure_url;
      if (!secureUrl) {
        try {
          const resource = await cloudinary.v2.api.resource(publicId, { resource_type: resourceType });
          secureUrl = resource && resource.secure_url ? resource.secure_url : cloudinary.v2.url(publicId, { resource_type: resourceType, secure: true });
        } catch (err) {
          console.warn('Could not fetch resource metadata from Cloudinary for public_id', publicId, ':', err && err.message)
          secureUrl = cloudinary.v2.url(publicId, { resource_type: resourceType, secure: true })
        }
      }

      course.lectures[lectureIndex].video = {
        public_id: publicId,
        secure_url: secureUrl,
      };

      // remove local file
      fs.rm(`uploads/${req.file.filename}`, (error) => {
        if (error) console.error('Failed to delete file :', error);
      });

      course.numberoflectures = course.lectures.length;
      await course.save();

      return res.status(200).json({ success: true, message: 'Lecture video uploaded', lecture: course.lectures[lectureIndex] });
    } catch (err) {
      console.error('uploadLectureVideo failed:', err)
      return next(mapCloudinaryError(err));
    }
  } catch (error) {
    return next(new AppError('Failed to upload lecture video', 500));
  }
};


const repairLectureVideo = async (req, res, next) => {
  try {
    const { id, lectureId } = req.params;
    const course = await Course.findById(id);
    if (!course) return next(new AppError('Invalid course id or course not found.', 400));

    const lectureIndex = course.lectures.findIndex((l) => l._id.toString() === lectureId.toString());
    if (lectureIndex === -1) return next(new AppError('Lecture not found', 404));

    const video = course.lectures[lectureIndex].video;

    // If client provides a file, prefer uploading it
    if (req.file) {
      try {
        const resourceType = (req.file && req.file.mimetype && req.file.mimetype.startsWith('image')) ? 'image' : 'video';
        const rawResult = await uploadFileToCloudinary(req.file.path, { folder: 'lms', resource_type: resourceType });

        const normalize = (r) => {
          if (!r) return {};
          if (r.public_id || r.secure_url) return r;
          if (Array.isArray(r) && r[0]) return r[0];
          if (r.result) return r.result;
          return r;
        };

        const result = normalize(rawResult);
        const publicId = result.public_id;
        if (!publicId) {
          console.error('Normalized Cloudinary result missing public_id during repair:', result);
          throw new Error('Cloudinary did not return a public_id');
        }

        let secureUrl = result.secure_url;
        if (!secureUrl) {
          try {
            const resource = await cloudinary.v2.api.resource(publicId, { resource_type: resourceType });
            secureUrl = resource && resource.secure_url ? resource.secure_url : cloudinary.v2.url(publicId, { resource_type: resourceType, secure: true });
          } catch (err) {
            console.warn('Could not fetch resource metadata from Cloudinary during repair:', err && err.message);
            secureUrl = cloudinary.v2.url(publicId, { resource_type: resourceType, secure: true });
          }
        }

        course.lectures[lectureIndex].video = {
          public_id: publicId,
          secure_url: secureUrl,
        };

        fs.rm(`uploads/${req.file.filename}`, (error) => {
          if (error) console.error('Failed to delete file :', error);
        });

        await course.save();
        return res.status(200).json({ success: true, message: 'Lecture video repaired by uploading new file', lecture: course.lectures[lectureIndex] });
      } catch (err) {
        return next(mapCloudinaryError(err));
      }
    }

    // Otherwise try to regenerate secure URL from existing public_id
    if (video && video.public_id) {
      try {
        const resource = await cloudinary.v2.api.resource(video.public_id, { resource_type: 'video' });
        const secure = cloudinary.v2.url(video.public_id, { resource_type: 'video', secure: true });
        course.lectures[lectureIndex].video.secure_url = secure;
        await course.save();
        return res.status(200).json({ success: true, message: 'Lecture video secure_url regenerated', secure_url: secure });
      } catch (err) {
        if (err && err.http_code === 404) {
          course.lectures[lectureIndex].video = undefined;
          await course.save();
          return res.status(200).json({ success: true, message: 'Cloudinary resource missing; video reference cleared' });
        }
        return next(new AppError(err.message || 'Failed to repair video reference', 500));
      }
    }

    return res.status(400).json({ success: false, message: 'No video public_id to repair and no file provided' });
  } catch (error) {
    return next(new AppError('Failed to repair lecture video', 500));
  }
};

export {
    getAllCourses,
    getLecturesCourseById,
    createCourse,
    updateCourseById,
    removeCourse,
    addLectureToCourseById,
    removeLectureFromCourse,
    uploadLectureVideo,
    repairLectureVideo
}