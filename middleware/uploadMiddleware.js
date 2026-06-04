import multer from 'multer'
import { storage } from '../config/cloudinary.js'

export const uploadProductImage = multer({
  storage: storage('rehan-nx/products'),
})

export const uploadCategoryImage = multer({
  storage: storage('rehan-nx/categories'),
})