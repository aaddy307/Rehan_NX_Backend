import cloudinaryPkg from 'cloudinary'
import CloudinaryStorage from 'multer-storage-cloudinary'

// v2 instance used for config and direct API calls (e.g. uploader.destroy)
const { v2: cloudinary } = cloudinaryPkg

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// multer-storage-cloudinary@2.2.1 internally does: this.cloudinary.v2.uploader
// so it needs the FULL cloudinary package (with .v2), not just the v2 instance
export const storage = (folder) =>
  new CloudinaryStorage({
    cloudinary: cloudinaryPkg,
    params: {
      folder,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 2000, height: 2000, crop: 'limit' }],
    },
  })

// export v2 instance for direct use (e.g. uploader.destroy in productController)
export default cloudinary

