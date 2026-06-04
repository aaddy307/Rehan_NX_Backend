import mongoose from 'mongoose'

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    image: {
      publicId: { type: String },
      url: { type: String },
    },
    ctaText: {
      type: String,
      trim: true,
    },
    ctaLink: {
      type: String,
      trim: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

export default mongoose.model('Banner', bannerSchema)