/**
 * @fileoverview Skor Routes - Kullanıcı skorları ve liderlik
 * @description Skor listeleme, liderlik tablosu ve sıralama işlemleri
 * @module routes/skorRoutes
 */

import express from 'express';
const router = express.Router();
import skorController from '../controllers/skorController.js';
import { auth } from '../middleware/auth.js';
import { paginationValidation } from '../middleware/validation.js';

// ==================== PUBLIC ROUTES ====================

/**
 * @route   GET /api/skorlar
 * @desc    Tüm skorları sayfalı listeler (yüksekten düşüğe)
 * @access  Public
 * @query   {number} [page=1] - Sayfa numarası
 * @query   {number} [limit=20] - Sayfa başına kayıt
 * @returns {object} { data, pagination }
 */
router.get('/', paginationValidation, skorController.getAll);

/**
 * @route   GET /api/skorlar/liderlik
 * @desc    En yüksek skorlu kullanıcıları getirir (liderlik tablosu)
 * @access  Public
 * @query   {number} [limit=10] - Kaç kullanıcı getirileceği
 * @returns {array} Liderlik tablosu [{ kullanici, Skor, ToplamMama, RolAdi }]
 */
router.get('/liderlik', skorController.getLeaderboard);

/**
 * @route   GET /api/skorlar/istatistik
 * @desc    Genel skor istatistiklerini getirir
 * @access  Public
 * @returns {object} { toplamMama, toplamEkleme, ortalamaSkor, enYuksekSkor, aktifKullaniciSayisi }
 */
router.get('/istatistik', skorController.getStatistics);

/**
 * @route   GET /api/skorlar/kullanici/:kullaniciId
 * @desc    Belirli kullanıcının skorunu getirir
 * @access  Public
 * @param   {number} kullaniciId - Kullanıcı ID
 * @returns {object} { KullaniciId, Skor, ToplamMama, ToplamEklemeSayisi, kullanici, rol }
 */
router.get('/kullanici/:kullaniciId', skorController.getByKullaniciId);

/**
 * @route   GET /api/skorlar/siralama/:kullaniciId
 * @desc    Belirli kullanıcının genel sıralamasını getirir
 * @access  Public
 * @param   {number} kullaniciId - Kullanıcı ID
 * @returns {object} { kullaniciId, skor, siralama }
 */
router.get('/siralama/:kullaniciId', skorController.getRank);

// ==================== PROTECTED ROUTES ====================

/**
 * @route   GET /api/skorlar/benim
 * @desc    Giriş yapan kullanıcının skorunu getirir
 * @access  Private
 * @header  Authorization: Bearer <accessToken>
 * @returns {object} { KullaniciId, Skor, ToplamMama, ToplamEklemeSayisi }
 */
router.get('/benim', auth, skorController.getMySkor);

/**
 * @route   GET /api/skorlar/benim-siralama
 * @desc    Giriş yapan kullanıcının sıralamasını getirir
 * @access  Private
 * @header  Authorization: Bearer <accessToken>
 * @returns {object} { kullaniciId, skor, siralama }
 */
router.get('/benim-siralama', auth, skorController.getMyRank);

export default router;
