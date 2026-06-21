import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const signToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      })
    }

    const isMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      })
    }

    const token = signToken(email)

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }

    res.cookie('token', token, cookieOptions)

    res.json({
      success: true,
      admin: {
        id: email,
        name: 'Admin',
        email: process.env.ADMIN_EMAIL,
        role: 'admin',
      },
    })
  } catch (error) {
    next(error)
  }
}

export const logout = async (req, res, next) => {
  try {
    res.cookie('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      expires: new Date(0),
    })
    res.json({
      success: true,
      message: 'Logged out successfully',
    })
  } catch (error) {
    next(error)
  }
}

export const me = async (req, res, next) => {
  try {
    res.json({
      success: true,
      admin: {
        id: req.admin.email,
        name: 'Admin',
        email: req.admin.email,
        role: 'admin',
      },
    })
  } catch (error) {
    next(error)
  }
}