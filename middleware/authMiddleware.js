import jwt from 'jsonwebtoken'
import createError from 'http-errors'

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token

    if (!token) {
      return next(createError.Unauthorized('Not authorized, no token'))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return next(createError.Unauthorized('Invalid token'))
    }

    req.admin = { email: decoded.email }
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