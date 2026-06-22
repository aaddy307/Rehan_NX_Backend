export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500
  let message = err.message || 'Server Error'

  if (err.code === 11000) {
    statusCode = 400
    const field = Object.keys(err.keyValue)[0]
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
  }

  if (err.name === 'ValidationError') {
    statusCode = 400
    message = Object.values(err.errors).map((e) => e.message).join(', ')
  }

  if (err.name === 'CastError') {
    statusCode = 400
    message = 'Resource not found'
  }

  if (err.name === 'MulterError') {
    statusCode = 400
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File too large. Maximum size is 20MB per image.'
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = 'Too many files. Maximum 10 images allowed.'
    } else {
      message = `Upload error: ${err.message}`
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
  })
}