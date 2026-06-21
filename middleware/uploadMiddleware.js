import multer from 'multer'
import { storage } from '../config/cloudinary.js'

export const uploadProductImage = multer({
  storage: storage('rehan-nx/products'),
  limits: { fileSize: 5 * 1024 * 1024 },
})

export const uploadCategoryImage = multer({
  storage: storage('rehan-nx/categories'),
  limits: { fileSize: 5 * 1024 * 1024 },
})