/**
 * @fileoverview Mama Ekleme Routes - Mama ekleme kayıtları
 * @description Kullanıcıların mama ekleme işlemleri ve istatistikleri
 * @module routes/mamaEklemeRoutes
 */

import express from 'express';
const router = express.Router();
import mamaEklemeController from '../controllers/mamaEklemeController.js';
import { auth, adminAuth } from '../middleware/auth.js';
import { mamaEklemeCreateValidation, idParamValidation, paginationValidation } from '../middleware/validation.js';

// ==================== PUBLIC ROUTES ====================

/**
 * @route   GET /api/mama-eklemeleri/istatistik
 * @desc    Mama ekleme istatistiklerini getirir
 * @access  Public
 * @query   {string} [startDate] - Başlangıç tarihi
 * @query   {string} [endDate] - Bitiş tarihi
 * @query   {number} [mamaKabiId] - Mama kabına göre filtrele
 * @returns {object} { summary: { toplamEkleme, toplamMama, ortalamaEkleme }, topContributors }
 */
router.get('/istatistik', mamaEklemeController.getStatistics);

/**
 * @route   GET /api/mama-eklemeleri/gunluk-istatistik
 * @desc    Günlük mama ekleme istatistiklerini getirir
 * @access  Public
 * @query   {number} [days=30] - Kaç günlük veri
 * @returns {array} Günlük istatistikler [{ tarih, eklemeSayisi, toplamMama }]
 */
router.get('/gunluk-istatistik', mamaEklemeController.getDailyStats);

// ==================== PROTECTED ROUTES ====================

/**
 * @route   GET /api/mama-eklemeleri/benim
 * @desc    Giriş yapan kullanıcının kendi ekleme kayıtlarını getirir
 * @access  Private
 * @header  Authorization: Bearer <accessToken>
 * @query   {number} [limit=20] - Kaç kayıt getirileceği
 * @returns {array} Kullanıcının mama ekleme kayıtları
 */
router.get('/benim', auth, mamaEklemeController.getMyRecords);

/**
 * @route   POST /api/mama-eklemeleri
 * @desc    Yeni mama ekleme kaydı oluşturur (skor otomatik güncellenir)
 * @access  Private
 * @header  Authorization: Bearer <accessToken>
 * @body    {number} MamaKabiId - Mama kabı ID (zorunlu)
 * @body    {number} EklenenMiktarKg - Eklenen mama miktarı kg (zorunlu)
 * @returns {object} Oluşturulan mama ekleme kaydı
 * @note    Her kg için 10 puan kazanılır, rol otomatik güncellenir
 */
router.post('/', auth, mamaEklemeCreateValidation, mamaEklemeController.create);

// ==================== ADMIN ROUTES ====================

/**
 * @route   GET /api/mama-eklemeleri
 * @desc    Tüm mama ekleme kayıtlarını sayfalı listeler
 * @access  Admin
 * @header  Authorization: Bearer <accessToken>
 * @query   {number} [page=1] - Sayfa numarası
 * @query   {number} [limit=20] - Sayfa başına kayıt
 * @query   {number} [mamaKabiId] - Mama kabına göre filtrele
 * @query   {number} [kullaniciId] - Kullanıcıya göre filtrele
 * @query   {string} [startDate] - Başlangıç tarihi
 * @query   {string} [endDate] - Bitiş tarihi
 * @returns {object} { data, pagination }
 */
router.get('/', auth, adminAuth, paginationValidation, mamaEklemeController.getAll);

/**
 * @route   GET /api/mama-eklemeleri/kullanici/:kullaniciId
 * @desc    Belirli kullanıcının mama ekleme kayıtlarını getirir
 * @access  Admin
 * @header  Authorization: Bearer <accessToken>
 * @param   {number} kullaniciId - Kullanıcı ID
 * @query   {number} [limit=20] - Kaç kayıt getirileceği
 * @returns {array} Kullanıcının mama ekleme kayıtları
 */
router.get('/kullanici/:kullaniciId', auth, adminAuth, mamaEklemeController.getByKullaniciId);

/**
 * @route   GET /api/mama-eklemeleri/mama-kabi/:mamaKabiId
 * @desc    Belirli mama kabına yapılan eklemeleri getirir
 * @access  Admin
 * @header  Authorization: Bearer <accessToken>
 * @param   {number} mamaKabiId - Mama kabı ID
 * @query   {number} [limit=20] - Kaç kayıt getirileceği
 * @returns {array} Mama kabına yapılan eklemeler
 */
router.get('/mama-kabi/:mamaKabiId', auth, adminAuth, mamaEklemeController.getByMamaKabiId);

/**
 * @route   GET /api/mama-eklemeleri/:id
 * @desc    Belirli mama ekleme kaydını getirir
 * @access  Admin
 * @header  Authorization: Bearer <accessToken>
 * @param   {number} id - Kayıt ID
 * @returns {object} Mama ekleme kaydı detayı
 */
router.get('/:id', auth, adminAuth, idParamValidation, mamaEklemeController.getById);

export default router;
