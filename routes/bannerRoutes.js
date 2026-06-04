import express from 'express'
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from '../controllers/bannerController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { uploadBannerImage } from '../middleware/uploadMiddleware.js'

const router = express.Router()

router.get('/', getBanners)

router.post(
  '/',
  authMiddleware,
  uploadBannerImage.single('image'),
  createBanner
)

router.put(
  '/:id',
  authMiddleware,
  uploadBannerImage.single('image'),
  updateBanner
)

router.delete('/:id', authMiddleware, deleteBanner)

export default router