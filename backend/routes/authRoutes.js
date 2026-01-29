/**
 * @fileoverview Auth Routes - Kimlik doğrulama işlemleri
 * @description Kullanıcı giriş, kayıt, token yönetimi ve şifre işlemleri
 * @module routes/authRoutes
 */

import express from 'express';
const router = express.Router();
import authController from '../controllers/authController.js';
import { auth, refreshAuth, checkLoginAttempts } from '../middleware/auth.js';
import { loginValidation, registerValidation } from '../middleware/validation.js';

// ==================== PUBLIC ROUTES ====================

/**
 * @route   POST /api/auth/giris
 * @desc    Kullanıcı girişi yapar, access ve refresh token döner
 * @access  Public
 * @body    {string} Email - Kullanıcı email adresi
 * @body    {string} Sifre - Kullanıcı şifresi
 * @returns {object} { accessToken, refreshToken, expiresIn, kullanici }
 */
router.post('/giris', checkLoginAttempts, loginValidation, authController.login);

/**
 * @route   POST /api/auth/kayit
 * @desc    Yeni kullanıcı kaydı oluşturur
 * @access  Public
 * @body    {string} AdSoyad - Kullanıcı adı soyadı
 * @body    {string} Email - Kullanıcı email adresi
 * @body    {string} Sifre - Kullanıcı şifresi (min 6 karakter)
 * @returns {object} { accessToken, refreshToken, kullanici }
 */
router.post('/kayit', registerValidation, authController.register);

/**
 * @route   POST /api/auth/sifre-sifirlama-talebi
 * @desc    Şifre sıfırlama emaili gönderir
 * @access  Public
 * @body    {string} Email - Şifre sıfırlanacak email adresi
 * @returns {object} { success, message }
 */
router.post('/sifre-sifirlama-talebi', authController.requestPasswordReset);

/**
 * @route   POST /api/auth/sifre-sifirlama
 * @desc    Şifreyi sıfırlama token'ı ile günceller
 * @access  Public
 * @body    {string} Token - Şifre sıfırlama token'ı
 * @body    {string} YeniSifre - Yeni şifre
 * @returns {object} { success, message }
 */
router.post('/sifre-sifirlama', authController.resetPassword);

// ==================== TOKEN YÖNETİMİ ====================

/**
 * @route   POST /api/auth/token-yenile
 * @desc    Refresh token ile yeni access token alır
 * @access  Private (Refresh Token gerekli)
 * @header  Authorization: Bearer <refreshToken>
 * @returns {object} { accessToken, refreshToken, expiresIn }
 */
router.post('/token-yenile', refreshAuth, authController.refreshToken);

// ==================== PROTECTED ROUTES ====================

/**
 * @route   GET /api/auth/ben
 * @desc    Mevcut kullanıcı bilgilerini getirir
 * @access  Private (Access Token gerekli)
 * @header  Authorization: Bearer <accessToken>
 * @returns {object} { KullaniciId, Email, AdSoyad, RolId, isAdmin }
 */
router.get('/ben', auth, authController.getMe);

/**
 * @route   GET /api/auth/giris-gecmisi
 * @desc    Kullanıcının giriş geçmişini listeler
 * @access  Private
 * @header  Authorization: Bearer <accessToken>
 * @query   {number} [limit=10] - Kaç kayıt getirileceği
 * @returns {array} Giriş geçmişi listesi
 */
router.get('/giris-gecmisi', auth, authController.getLoginHistory);

/**
 * @route   POST /api/auth/cikis
 * @desc    Kullanıcı çıkışı yapar, token'ları blacklist'e ekler
 * @access  Private
 * @header  Authorization: Bearer <accessToken>
 * @body    {string} [refreshToken] - Geçersiz kılınacak refresh token
 * @returns {object} { success, message }
 */
router.post('/cikis', auth, authController.logout);

/**
 * @route   POST /api/auth/token-dogrula
 * @desc    Token'ın geçerliliğini kontrol eder
 * @access  Private
 * @header  Authorization: Bearer <accessToken>
 * @returns {object} { success, kullanici }
 */
router.post('/token-dogrula', auth, authController.validateToken);

export default router;
