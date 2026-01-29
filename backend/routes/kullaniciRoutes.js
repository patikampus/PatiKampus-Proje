/**
 * @fileoverview Kullanıcı Routes - Kullanıcı yönetimi
 * @description Kullanıcı CRUD, profil ve liderlik tablosu işlemleri
 * @module routes/kullaniciRoutes
 */

import express from 'express';
const router = express.Router();
import kullaniciController from '../controllers/kullaniciController.js';
import { auth, adminAuth } from '../middleware/auth.js';
import { kullaniciCreateValidation, idParamValidation, paginationValidation } from '../middleware/validation.js';

// ==================== PUBLIC ROUTES ====================

/**
 * @route   GET /api/kullanicilar/liderlik
 * @desc    En yüksek skorlu kullanıcıları listeler
 * @access  Public
 * @query   {number} [limit=10] - Kaç kullanıcı getirileceği
 * @returns {array} Liderlik tablosu
 */
router.get('/liderlik', kullaniciController.getLeaderboard);

// ==================== PROTECTED ROUTES ====================

/**
 * @route   GET /api/kullanicilar/profil
 * @desc    Giriş yapan kullanıcının profil bilgilerini getirir
 * @access  Private
 * @header  Authorization: Bearer <accessToken>
 * @returns {object} Kullanıcı profili (şifre hariç)
 */
router.get('/profil', auth, kullaniciController.getProfile);

/**
 * @route   PUT /api/kullanicilar/profil
 * @desc    Kullanıcının kendi profilini güncellemesi
 * @access  Private
 * @header  Authorization: Bearer <accessToken>
 * @body    {string} [AdSoyad] - Yeni ad soyad
 * @body    {string} [Email] - Yeni email
 * @body    {string} [Sifre] - Yeni şifre
 * @returns {object} Güncellenmiş profil
 */
router.put('/profil', auth, kullaniciController.updateProfile);

// ==================== ADMIN ROUTES ====================

/**
 * @route   GET /api/kullanicilar
 * @desc    Tüm kullanıcıları sayfalı listeler
 * @access  Admin
 * @header  Authorization: Bearer <accessToken>
 * @query   {number} [page=1] - Sayfa numarası
 * @query   {number} [limit=20] - Sayfa başına kayıt
 * @query   {number} [aktif] - Aktif duruma göre filtrele (0/1)
 * @returns {object} { data, pagination }
 */
router.get('/', auth, adminAuth, paginationValidation, kullaniciController.getAll);

/**
 * @route   GET /api/kullanicilar/ara
 * @desc    Kullanıcı arar (ad veya email ile)
 * @access  Admin
 * @header  Authorization: Bearer <accessToken>
 * @query   {string} q - Arama terimi
 * @returns {array} Eşleşen kullanıcılar
 */
router.get('/ara', auth, adminAuth, kullaniciController.search);

/**
 * @route   GET /api/kullanicilar/:id
 * @desc    Belirli kullanıcının detaylarını getirir
 * @access  Admin
 * @header  Authorization: Bearer <accessToken>
 * @param   {number} id - Kullanıcı ID
 * @returns {object} Kullanıcı detayı (rol ve skor dahil)
 */
router.get('/:id', auth, adminAuth, idParamValidation, kullaniciController.getById);

/**
 * @route   POST /api/kullanicilar
 * @desc    Yeni kullanıcı oluşturur
 * @access  Admin
 * @header  Authorization: Bearer <accessToken>
 * @body    {string} AdSoyad - Ad soyad
 * @body    {string} Email - Email adresi
 * @body    {string} Sifre - Şifre
 * @body    {number} [RolId] - Rol ID
 * @returns {object} Oluşturulan kullanıcı
 */
router.post('/', auth, adminAuth, kullaniciCreateValidation, kullaniciController.create);

/**
 * @route   PUT /api/kullanicilar/:id
 * @desc    Kullanıcı bilgilerini günceller
 * @access  Admin
 * @header  Authorization: Bearer <accessToken>
 * @param   {number} id - Kullanıcı ID
 * @body    {string} [AdSoyad] - Yeni ad soyad
 * @body    {string} [Email] - Yeni email
 * @body    {number} [AktifMi] - Aktif durumu (0/1)
 * @returns {object} Güncellenmiş kullanıcı
 */
router.put('/:id', auth, adminAuth, idParamValidation, kullaniciController.update);

/**
 * @route   DELETE /api/kullanicilar/:id
 * @desc    Kullanıcıyı siler
 * @access  Admin
 * @header  Authorization: Bearer <accessToken>
 * @param   {number} id - Kullanıcı ID
 * @returns {object} { success, message }
 */
router.delete('/:id', auth, adminAuth, idParamValidation, kullaniciController.delete);

export default router;
