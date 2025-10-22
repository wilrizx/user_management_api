const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Multer error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'Ukuran file terlalu besar. Maksimal 5MB'
    });
  }

  // Custom error
  if (err.message) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message
    });
  }

  // Default error
  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan pada server'
  });
};

export default errorHandler;
