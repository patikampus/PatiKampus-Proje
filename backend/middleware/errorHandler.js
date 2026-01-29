import config from '../config/index.js';

// Global error handler middleware
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Doğrulama hatası',
      errors: messages
    });
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors[0]?.path || 'alan';
    return res.status(400).json({
      success: false,
      message: `Bu ${field} zaten kullanılıyor`
    });
  }

  // Sequelize foreign key constraint error
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      success: false,
      message: 'İlişkili kayıt bulunamadı'
    });
  }

  // JWT errors are handled in auth middleware
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Yetkilendirme hatası'
    });
  }

  // Custom application errors
  if (err.message) {
    const statusCode = err.statusCode || 400;
    return res.status(statusCode).json({
      success: false,
      message: err.message
    });
  }

  // Default server error
  res.status(500).json({
    success: false,
    message: config.nodeEnv === 'production' 
      ? 'Sunucu hatası' 
      : err.message || 'Bilinmeyen hata'
  });
};

// 404 handler
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'İstenen kaynak bulunamadı'
  });
};
