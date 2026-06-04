import Inquiry from '../models/Inquiry.js'

export const createInquiry = async (req, res, next) => {
  try {
    const { name, phone, city, product, message } = req.body

    const inquiry = await Inquiry.create({
      name,
      phone,
      city,
      product,
      message,
    })

    res.status(201).json({
      success: true,
      inquiry,
    })
  } catch (error) {
    next(error)
  }
}

export const getInquiries = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const total = await Inquiry.countDocuments()
    const inquiries = await Inquiry.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    res.json({
      success: true,
      inquiries,
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

export const deleteInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id)
    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found',
      })
    }

    await Inquiry.findByIdAndDelete(req.params.id)

    res.json({
      success: true,
      message: 'Inquiry deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}