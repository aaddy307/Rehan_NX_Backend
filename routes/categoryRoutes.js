import express from 'express'
import { body } from 'express-validator'
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js'
import { validate } from '../middleware/validationMiddleware.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { uploadCategoryImage } from '../middleware/uploadMiddleware.js'

const router = express.Router()

router.get('/', getCategories)

router.post(
  '/',
  authMiddleware,
  uploadCategoryImage.single('image'),
  [body('name').notEmpty().withMessage('Name is required')],
  validate,
  createCategory
)

router.put(
  '/:id',
  authMiddleware,
  uploadCategoryImage.single('image'),
  [body('name').notEmpty().withMessage('Name is required')],
  validate,
  updateCategory
)

router.delete('/:id', authMiddleware, deleteCategory)

export default router