import jwt from 'jsonwebtoken'
import Admin from '../models/Admin.js'

const signToken = (admin) => {
  return jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const admin = await Admin.findOne({ email: email.toLowerCase() })
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    const isMatch = await admin.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    const token = signToken(admin)

    const isSecure = req.secure || req.headers['x-forwarded-proto'] === 'https'
    res.cookie('token', token, {
      httpOnly: true,
      secure: isSecure,
      sameSite: isSecure ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.json({
      success: true,
      admin: admin.toJSON(),
    })
  } catch (error) {
    next(error)
  }
}

export const logout = async (req, res, next) => {
  try {
    const isSecure = req.secure || req.headers['x-forwarded-proto'] === 'https'
    res.cookie('token', '', {
      httpOnly: true,
      secure: isSecure,
      sameSite: isSecure ? 'none' : 'lax',
      expires: new Date(0),
    })
    res.json({ success: true, message: 'Logged out successfully' })
  } catch (error) {
    next(error)
  }
}

export const me = async (req, res, next) => {
  try {
    res.json({ success: true, admin: req.admin.toJSON() })
  } catch (error) {
    next(error)
  }
}
