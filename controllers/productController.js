import Product from '../models/Product.js'
import Category from '../models/Category.js'
import cloudinary from '../config/cloudinary.js'
import { generateSlug } from '../utils/generateSlug.js'

export const getProducts = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 12))
    const skip = (page - 1) * limit

    const filter = {}
    if (req.query.all !== 'true') {
      filter.status = true
    }

    if (req.query.search) {
      filter.name = { $regex: req.query.search, $options: 'i' }
    }

    if (req.query.category) {
      const category = await Category.findOne({ slug: req.query.category })
      if (!category) {
        return res.status(400).json({ success: false, message: 'Category not found' })
      }
      filter.category = category._id
    }

    if (req.query.brand) {
      filter.brand = req.query.brand
    }

    if (req.query.featured === 'true') {
      filter.featured = true
    }

    let sort = { createdAt: -1 }
    if (req.query.sort === 'price_low') {
      sort = { price: 1 }
    } else if (req.query.sort === 'price_high') {
      sort = { price: -1 }
    } else if (req.query.sort === 'name') {
      sort = { name: 1 }
    }

    const total = await Product.countDocuments(filter)
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .populate('brand', 'name')
      .sort(sort)
      .skip(skip)
      .limit(limit)

    res.json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getProduct = async (req, res, next) => {
  try {
    const filter = {}
    if (req.query.all !== 'true') {
      filter.status = true
    }

    let product = await Product.findOne({ ...filter, slug: req.params.slug }).populate('category', 'name slug').populate('brand', 'name')
    if (!product && req.params.slug.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findOne({ ...filter, _id: req.params.slug }).populate('category', 'name slug').populate('brand', 'name')
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    res.json({
      success: true,
      product,
    })
  } catch (error) {
    next(error)
  }
}

export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      brand,
      category,
      price,
      shortDescription,
      description,
      specifications,
      featured,
      status,
    } = req.body

    const slug = await generateSlug(name, Product)

    const images = req.files
      ? req.files.map((file) => ({
          publicId: file.public_id,
          url: file.secure_url,
        }))
      : []

    const product = await Product.create({
      name,
      slug,
      brand,
      category,
      price,
      shortDescription,
      description,
      images,
      specifications: specifications ? JSON.parse(specifications) : [],
      featured: featured === 'true' || featured === true,
      status: status === 'true' || status === true,
    })

    const populatedProduct = await Product.findById(product._id)
      .populate('category', 'name slug')
      .populate('brand', 'name')

    res.status(201).json({
      success: true,
      product: populatedProduct,
    })
  } catch (error) {
    next(error)
  }
}

export const updateProduct = async (req, res, next) => {
  try {
    const {
      name,
      brand,
      category,
      price,
      shortDescription,
      description,
      specifications,
      featured,
      status,
    } = req.body

    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    const updateData = {
      name,
      brand,
      category,
      price,
      shortDescription,
      description,
      specifications: specifications ? JSON.parse(specifications) : [],
      featured: featured === 'true' || featured === true,
      status: status === 'true' || status === true,
    }

    if (name && name !== product.name) {
      updateData.slug = await generateSlug(name, Product)
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => ({
        publicId: file.public_id,
        url: file.secure_url,
      }))
      updateData.images = [...product.images, ...newImages]
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('category', 'name slug').populate('brand', 'name')

    res.json({
      success: true,
      product: updatedProduct,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    if (product.images && product.images.length > 0) {
      for (const image of product.images) {
        try {
          await cloudinary.uploader.destroy(image.publicId)
        } catch (err) {
          console.error('Error deleting image from Cloudinary:', err)
        }
      }
    }

    await Product.findByIdAndDelete(req.params.id)

    res.json({
      success: true,
      message: 'Product deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}