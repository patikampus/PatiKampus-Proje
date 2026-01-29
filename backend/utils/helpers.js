// Pagination helper
const paginate = (page = 1, limit = 20) => {
  const offset = (page - 1) * limit;
  return { offset, limit };
};

// Response helper
const successResponse = (res, data, message = 'Başarılı', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

const errorResponse = (res, message = 'Bir hata oluştu', statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    message
  });
};

// Date helpers
const formatDate = (date) => {
  return new Date(date).toLocaleString('tr-TR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

// String helpers
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[üÜ]/g, 'u')
    .replace(/[öÖ]/g, 'o')
    .replace(/[ıİ]/g, 'i')
    .replace(/[şŞ]/g, 's')
    .replace(/[çÇ]/g, 'c')
    .replace(/[ğĞ]/g, 'g')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

// Number helpers
const roundToDecimal = (num, decimals = 2) => {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

// Validation helpers
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password) => {
  return password && password.length >= 6;
};

module.exports = {
  paginate,
  successResponse,
  errorResponse,
  formatDate,
  isValidDate,
  slugify,
  roundToDecimal,
  isValidEmail,
  isValidPassword
};
