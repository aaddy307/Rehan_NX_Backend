import Brand from '../models/Brand.js'
import { generateSlug } from '../utils/generateSlug.js'

export const getBrands = async (req, res, next) => {
  try {
    const brands = await Brand.find().sort({ name: 1 })
    res.json({
      success: true,
      brands,
    })
  } catch (error) {
    next(error)
  }
}

export const createBrand = async (req, res, next) => {
  try {
    const { name, status } = req.body
    const slug = generateSlug(name)

    const image = req.file
      ? {
          publicId: req.file.filename,
          url: req.file.path,
        }
      : {}

    const brand = await Brand.create({
      name,
      slug,
      logo: image,
      status: status === 'true' || status === true,
    })

    res.status(201).json({
      success: true,
      brand,
    })
  } catch (error) {
    next(error)
  }
}

export const updateBrand = async (req, res, next) => {
  try {
    const { name, status } = req.body

    const brand = await Brand.findById(req.params.id)
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found',
      })
    }

    const updateData = {
      name,
      status: status === 'true' || status === true,
    }

    if (req.file) {
      updateData.logo = {
        publicId: req.file.filename,
        url: req.file.path,
      }
    }

    const updatedBrand = await Brand.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )

    res.json({
      success: true,
      brand: updatedBrand,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteBrand = async (req, res, next) => {
  try {
    await Brand.findByIdAndDelete(req.params.id)
    res.json({
      success: true,
      message: 'Brand deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}