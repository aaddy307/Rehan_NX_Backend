import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import mongoSanitize from 'express-mongo-sanitize'
import rateLimit from 'express-rate-limit'
import 'dotenv/config'
import { connectDB } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import brandRoutes from './routes/brandRoutes.js'
import inquiryRoutes from './routes/inquiryRoutes.js'
import settingsRoutes from './routes/settingsRoutes.js'
import { errorHandler } from './middleware/errorMiddleware.js'

connectDB()

const app = express()

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  frameguard: { action: 'deny' },
  noSniff: true,
  xssFilter: true,
}))
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://rehan-nx-frontend.vercel.app',
      'https://rehan-nx-frontend.vercel.app/',
      'http://localhost:3000',
    ]
    const normalizedOrigin = origin ? origin.replace(/\/$/, '') : origin
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser())
app.use(mongoSanitize())
app.use(morgan('dev'))
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
  })
)

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/products', productRoutes)
app.use('/api/v1/categories', categoryRoutes)
app.use('/api/v1/brands', brandRoutes)
app.use('/api/v1/inquiries', inquiryRoutes)
app.use('/api/v1/settings', settingsRoutes)

app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})