import path from "path"

import multer from "multer"


const DEFAULT_MAX_UPLOAD_BYTES = 1024 * 1024 * 1024; // 1 GB
const maxUploadBytes = process.env.MAX_UPLOAD_BYTES ? parseInt(process.env.MAX_UPLOAD_BYTES, 10) : DEFAULT_MAX_UPLOAD_BYTES;

const upload = multer({
  // keep dest for backward compatibility, storage.destination will be used
  dest: "uploads/",
  limits: { fileSize: maxUploadBytes },
  storage: multer.diskStorage({
    destination: "uploads/",
    filename: (_req, file, cb) => {
      const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1e6);
      cb(null, uniquePrefix + '-' + file.originalname);
    }
  }),
  fileFilter: (_req, file, cb) => {
    let ext = path.extname(file.originalname).toLowerCase();
    const allowed = ['.jpg', '.jpeg', '.webp', '.png', '.mp4', '.mov', '.webm', '.mkv'];
    if (!allowed.includes(ext)) {
      cb(new Error(`Unsupported file type! ${ext}`), false);
      return;
    }
    cb(null, true);
  }
})


export default upload