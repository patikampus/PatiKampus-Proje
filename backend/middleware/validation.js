import { body, param, query, validationResult } from 'express-validator';

// Validation sonuçlarını kontrol et
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Doğrulama hatası',
      errors: errors.array().map(e => ({
        field: e.path,
        message: e.msg
      }))
    });
  }
  next();
};

// Auth validations
const loginValidation = [
  body('Email')
    .isEmail()
    .withMessage('Geçerli bir email adresi giriniz')
    .normalizeEmail(),
  body('Sifre')
    .notEmpty()
    .withMessage('Şifre gerekli'),
  validate
];

const registerValidation = [
  body('AdSoyad')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Ad soyad 2-100 karakter arasında olmalı'),
  body('Email')
    .isEmail()
    .withMessage('Geçerli bir email adresi giriniz')
    .normalizeEmail(),
  body('Sifre')
    .isLength({ min: 6 })
    .withMessage('Şifre en az 6 karakter olmalı'),
  validate
];

// Kullanici validations
const kullaniciCreateValidation = [
  body('AdSoyad')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Ad soyad 2-100 karakter arasında olmalı'),
  body('Email')
    .isEmail()
    .withMessage('Geçerli bir email adresi giriniz')
    .normalizeEmail(),
  body('Sifre')
    .isLength({ min: 6 })
    .withMessage('Şifre en az 6 karakter olmalı'),
  body('RolId')
    .optional()
    .isInt()
    .withMessage('RolId sayı olmalı'),
  validate
];

// MamaKabi validations
const mamaKabiCreateValidation = [
  body('KapAdi')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Kap adı en fazla 100 karakter olabilir'),
  body('KonumAciklama')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Konum açıklaması en fazla 255 karakter olabilir'),
  body('Konum')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Konum en fazla 255 karakter olabilir'),
  validate
];

// Sensor veri validations
const sensorVeriCreateValidation = [
  body('MamaKabiId')
    .isInt()
    .withMessage('MamaKabiId gerekli ve sayı olmalı'),
  body('Agirlik')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Ağırlık 0 veya pozitif bir sayı olmalı'),
  body('Yukseklik')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Yükseklik 0 veya pozitif bir sayı olmalı'),
  validate
];

// Mama ekleme validations
const mamaEklemeCreateValidation = [
  body('MamaKabiId')
    .isInt()
    .withMessage('MamaKabiId gerekli ve sayı olmalı'),
  body('EklenenMiktarKg')
    .isFloat({ min: 0.01 })
    .withMessage('Eklenen miktar pozitif bir sayı olmalı'),
  validate
];

// Rol validations
const rolCreateValidation = [
  body('RolAdi')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Rol adı 2-50 karakter arasında olmalı'),
  body('MinSkor')
    .isInt({ min: 0 })
    .withMessage('MinSkor 0 veya pozitif bir sayı olmalı'),
  body('MaxSkor')
    .isInt({ min: 0 })
    .withMessage('MaxSkor 0 veya pozitif bir sayı olmalı'),
  validate
];

// ID param validation
const idParamValidation = [
  param('id')
    .isInt()
    .withMessage('ID sayı olmalı'),
  validate
];

// Pagination query validation
const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Sayfa numarası 1 veya daha büyük olmalı'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit 1-100 arasında olmalı'),
  validate
];

export {
  validate,
  loginValidation,
  registerValidation,
  kullaniciCreateValidation,
  mamaKabiCreateValidation,
  sensorVeriCreateValidation,
  mamaEklemeCreateValidation,
  rolCreateValidation,
  idParamValidation,
  paginationValidation
};
