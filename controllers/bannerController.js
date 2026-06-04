import Banner from '../models/Banner.js'
import cloudinary from '../config/cloudinary.js'

export const getBanners = async (req, res, next) => {
  try {
    const filter = {}

    if (req.query.active !== 'true') {
      filter.status = true
    }

    const banners = await Banner.find(filter).sort({ createdAt: -1 })

    res.json({
      success: true,
      banners,
    })
  } catch (error) {
    next(error)
  }
}

export const createBanner = async (req, res, next) => {
  try {
    const { title, subtitle, ctaText, ctaLink, status } = req.body

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Banner image is required',
      })
    }

    const banner = await Banner.create({
      title,
      subtitle,
      image: {
        publicId: req.file.filename,
        url: req.file.path,
      },
      ctaText,
      ctaLink,
      status: status === 'true' || status === true,
    })

    res.status(201).json({
      success: true,
      banner,
    })
  } catch (error) {
    next(error)
  }
}

export const updateBanner = async (req, res, next) => {
  try {
    const { title, subtitle, ctaText, ctaLink, status } = req.body

    const banner = await Banner.findById(req.params.id)
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found',
      })
    }

    const updateData = {
      title,
      subtitle,
      ctaText,
      ctaLink,
      status: status === 'true' || status === true,
    }

    if (req.file) {
      if (banner.image && banner.image.publicId) {
        try {
          await cloudinary.uploader.destroy(banner.image.publicId)
        } catch (err) {
          console.error('Error deleting old image:', err)
        }
      }
      updateData.image = {
        publicId: req.file.filename,
        url: req.file.path,
      }
    }

    const updatedBanner = await Banner.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )

    res.json({
      success: true,
      banner: updatedBanner,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id)
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found',
      })
    }

    if (banner.image && banner.image.publicId) {
      try {
        await cloudinary.uploader.destroy(banner.image.publicId)
      } catch (err) {
        console.error('Error deleting image from Cloudinary:', err)
      }
    }

    await Banner.findByIdAndDelete(req.params.id)

    res.json({
      success: true,
      message: 'Banner deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}