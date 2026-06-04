import express from 'express'
import { body } from 'express-validator'
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js'
import { validate } from '../middleware/validationMiddleware.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { uploadProductImage } from '../middleware/uploadMiddleware.js'

const router = express.Router()

router.get('/', getProducts)
router.get('/:slug', getProduct)

router.post(
  '/',
  authMiddleware,
  uploadProductImage.array('images', 10),
  [
    body('name')
      .isLength({ min: 3 })
      .withMessage('Name must be at least 3 characters'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('category').notEmpty().withMessage('Category is required'),
    body('brand').notEmpty().withMessage('Brand is required'),
  ],
  validate,
  createProduct
)

router.put(
  '/:id',
  authMiddleware,
  uploadProductImage.array('images', 10),
  updateProduct
)

router.delete('/:id', authMiddleware, deleteProduct)

export default router