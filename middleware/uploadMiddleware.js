import multer from 'multer'
import { storage } from '../config/cloudinary.js'

const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIMES.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error(`Invalid file type "${file.mimetype}". Only JPEG, PNG, WebP, and AVIF images are allowed.`))
  }
}

const MAX_SIZE = 20 * 1024 * 1024 // 20 MB

export const uploadProductImage = multer({
  storage: storage('rehan-nx/products'),
  limits: { fileSize: MAX_SIZE },
  fileFilter,
})

export const uploadCategoryImage = multer({
  storage: storage('rehan-nx/categories'),
  limits: { fileSize: MAX_SIZE },
  fileFilter,
})