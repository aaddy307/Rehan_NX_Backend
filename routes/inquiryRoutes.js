import express from 'express'
import { body } from 'express-validator'
import {
  createInquiry,
  getInquiries,
  deleteInquiry,
} from '../controllers/inquiryController.js'
import { validate } from '../middleware/validationMiddleware.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('phone')
      .isLength({ min: 10, max: 10 }).withMessage('Phone must be 10 digits')
      .isNumeric().withMessage('Phone must be 10 digits'),
    body('message').notEmpty().withMessage('Message is required'),
  ],
  validate,
  createInquiry
)

router.get('/', authMiddleware, getInquiries)

router.delete('/:id', authMiddleware, deleteInquiry)

export default router