//server/middleware/uploadMiddleware.js
import multer from 'multer';

const avatarStorage = multer.memoryStorage(); 

export const avatarUpload = multer({
  storage: avatarStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg','image/jpg','image/png','image/gif','image/webp'];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only image files allowed'), false);
  }
});

