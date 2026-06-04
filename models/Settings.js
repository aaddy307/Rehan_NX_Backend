import mongoose from 'mongoose'

const settingsSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    phone1: {
      type: String,
      trim: true,
    },
    phone2: {
      type: String,
      trim: true,
    },
    whatsapp: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    mapUrl: {
      type: String,
      trim: true,
    },
    facebook: {
      type: String,
      trim: true,
    },
    instagram: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
)

export default mongoose.model('Settings', settingsSchema)