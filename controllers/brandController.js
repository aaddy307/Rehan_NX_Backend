import Brand from '../models/Brand.js'
import Product from '../models/Product.js'
import { generateSlug } from '../utils/generateSlug.js'

export const getBrands = async (req, res, next) => {
  try {
    const filter = {}
    if (req.query.status !== undefined) {
      filter.status = req.query.status === 'true'
    }
    const brands = await Brand.find(filter).sort({ name: 1 })
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
    const slug = await generateSlug(name, Brand)

    const brand = await Brand.create({
      name,
      slug,
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

    if (name && name !== brand.name) {
      updateData.slug = await generateSlug(name, Brand)
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
    const brand = await Brand.findById(req.params.id)
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found',
      })
    }

    const productCount = await Product.countDocuments({ brand: brand._id })
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete brand. ${productCount} product(s) are linked to this brand.`,
      })
    }

    await Brand.findByIdAndDelete(req.params.id)
    res.json({
      success: true,
      message: 'Brand deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}
