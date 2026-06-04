import express from 'express'
import { body } from 'express-validator'
import {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from '../controllers/brandController.js'
import { validate } from '../middleware/validationMiddleware.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { uploadCategoryImage } from '../middleware/uploadMiddleware.js'

const router = express.Router()

router.get('/', getBrands)

router.post(
  '/',
  authMiddleware,
  uploadCategoryImage.single('logo'),
  [body('name').notEmpty().withMessage('Name is required')],
  validate,
  createBrand
)

router.put(
  '/:id',
  authMiddleware,
  uploadCategoryImage.single('logo'),
  [body('name').notEmpty().withMessage('Name is required')],
  validate,
  updateBrand
)

router.delete('/:id', authMiddleware, deleteBrand)

export default router