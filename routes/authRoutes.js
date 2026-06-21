import express from 'express'
import { body } from 'express-validator'
import { login, logout, me } from '../controllers/authController.js'
import { validate } from '../middleware/validationMiddleware.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  validate,
  login
)

router.post('/logout', authMiddleware, logout)

router.get('/me', authMiddleware, me)

export default router