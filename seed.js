import bcrypt from 'bcryptjs'
import 'dotenv/config'
import mongoose from 'mongoose'
import Admin from './models/Admin.js'

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    const existingAdmin = await Admin.findOne({ email: 'admin@rehannxmobiles.com' })
    if (existingAdmin) {
      console.log('Admin already exists')
      process.exit(0)
    }

    const hashedPassword = await bcrypt.hash('rEhan_NX', 10)
    const admin = await Admin.create({
      name: 'Admin',
      email: 'admin@rehannxmobiles.com',
      password: hashedPassword,
      role: 'admin',
    })

    console.log('Admin created:', admin.email)
    console.log('Password: rEhan_NX')
    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

seedAdmin()