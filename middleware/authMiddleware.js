import jwt from 'jsonwebtoken'
import createError from 'http-errors'
import Admin from '../models/Admin.js'

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token
    if (!token) {
      return next(createError.Unauthorized('Not authorized, no token'))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const admin = await Admin.findOne({ email: decoded.email })
    if (!admin) {
      return next(createError.Unauthorized('Invalid token'))
    }

    req.admin = admin
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(createError.Unauthorized('Invalid token'))
    }
    if (error.name === 'TokenExpiredError') {
      return next(createError.Unauthorized('Token expired'))
    }
    next(createError.InternalServerError())
  }
}
