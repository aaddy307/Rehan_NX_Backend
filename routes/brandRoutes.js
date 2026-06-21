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

const router = express.Router()

router.get('/', getBrands)

router.post(
  '/',
  authMiddleware,
  [body('name').notEmpty().withMessage('Name is required')],
  validate,
  createBrand
)

router.put(
  '/:id',
  authMiddleware,
  [body('name').notEmpty().withMessage('Name is required')],
  validate,
  updateBrand
)

router.delete('/:id', authMiddleware, deleteBrand)

export default router