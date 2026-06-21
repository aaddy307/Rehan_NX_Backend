import Category from '../models/Category.js'
import Product from '../models/Product.js'
import { generateSlug } from '../utils/generateSlug.js'

export const getCategories = async (req, res, next) => {
  try {
    const filter = {}
    if (req.query.all !== 'true') {
      filter.status = true
    }

    const categories = await Category.find(filter).sort({
      name: 1,
    })

    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const countFilter = { category: cat._id }
        if (req.query.all !== 'true') {
          countFilter.status = true
        }
        const count = await Product.countDocuments(countFilter)
        return {
          ...cat.toObject(),
          productCount: count,
        }
      })
    )

    res.json({
      success: true,
      categories: categoriesWithCount,
    })
  } catch (error) {
    next(error)
  }
}

export const createCategory = async (req, res, next) => {
  try {
    const { name, status } = req.body

    const slug = await generateSlug(name, Category)

    const category = await Category.create({
      name,
      slug,
      status: status === 'true' || status === true,
    })

    res.status(201).json({
      success: true,
      category,
    })
  } catch (error) {
    next(error)
  }
}

export const updateCategory = async (req, res, next) => {
  try {
    const { name, status } = req.body

    const category = await Category.findById(req.params.id)
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      })
    }

    const updateData = {
      name,
      status: status === 'true' || status === true,
    }

    if (name && name !== category.name) {
      updateData.slug = await generateSlug(name, Category)
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )

    res.json({
      success: true,
      category: updatedCategory,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id)
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      })
    }

    const productCount = await Product.countDocuments({
      category: category._id,
    })

    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. ${productCount} product(s) linked to this category.`,
      })
    }

    await Category.findByIdAndDelete(req.params.id)

    res.json({
      success: true,
      message: 'Category deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}