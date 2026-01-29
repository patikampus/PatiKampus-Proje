/**
 * @fileoverview Mama Kabı Routes - Mama kapları yönetimi
 * @description Mama kapları CRUD, sensör durumu ve konum arama işlemleri
 * @module routes/mamaKabiRoutes
 */

import express from 'express';
const router = express.Router();
import mamaKabiController from '../controllers/mamaKabiController.js';
import { auth, adminAuth, optionalAuth } from '../middleware/auth.js';
import { mamaKabiCreateValidation, idParamValidation, paginationValidation } from '../middleware/validation.js';

// ==================== PUBLIC ROUTES ====================

/**
 * @route   GET /api/mama-kaplari
 * @desc    Tüm mama kaplarını sayfalı listeler
 * @access  Public
 * @query   {number} [page=1] - Sayfa numarası
 * @query   {number} [limit=20] - Sayfa başına kayıt
 * @query   {number} [aktif] - Aktif duruma göre filtrele (0/1)
 * @returns {object} { data, pagination }
 */
router.get('/', paginationValidation, mamaKabiController.getAll);

/**
 * @route   GET /api/mama-kaplari/sensor-durumu
 * @desc    Tüm aktif kapları son sensör verileriyle getirir
 * @access  Public
 * @returns {array} Mama kapları (son ağırlık/yükseklik dahil)
 */
router.get('/sensor-durumu', mamaKabiController.getAllWithLatestSensorData);

/**
 * @route   GET /api/mama-kaplari/ara
 * @desc    Konum veya açıklamaya göre mama kabı arar
 * @access  Public
 * @query   {string} konum - Aranacak konum/açıklama
 * @returns {array} Eşleşen mama kapları
 */
router.get('/ara', mamaKabiController.searchByLocation);

/**
 * @route   GET /api/mama-kaplari/dusuk-seviye
 * @desc    Mama seviyesi düşük kapları listeler
 * @access  Public
 * @query   {number} [threshold=20] - Düşük seviye eşik değeri (kg)
 * @returns {array} Düşük seviyeli mama kapları
 */
router.get('/dusuk-seviye', mamaKabiController.getLowFoodContainers);

/**
 * @route   GET /api/mama-kaplari/:id
 * @desc    Belirli mama kabını getirir
 * @access  Public
 * @param   {number} id - Mama kabı ID
 * @returns {object} Mama kabı detayı (QR kod dahil)
 */
router.get('/:id', idParamValidation, mamaKabiController.getById);

/**
 * @route   GET /api/mama-kaplari/:id/detay
 * @desc    Mama kabını tüm detaylarıyla getirir
 * @access  Public
 * @param   {number} id - Mama kabı ID
 * @returns {object} Mama kabı (son sensör verileri ve anomaliler dahil)
 */
router.get('/:id/detay', idParamValidation, mamaKabiController.getByIdWithDetails);

// ==================== ADMIN ROUTES ====================

/**
 * @route   POST /api/mama-kaplari
 * @desc    Yeni mama kabı oluşturur (otomatik QR kod oluşturur)
 * @access  Admin
 * @header  Authorization: Bearer <accessToken>
 * @body    {string} [KapAdi] - Kap adı
 * @body    {string} [KonumAciklama] - Konum açıklaması
 * @body    {string} [Konum] - Konum koordinatları
 * @returns {object} Oluşturulan mama kabı
 */
router.post('/', auth, adminAuth, mamaKabiCreateValidation, mamaKabiController.create);

/**
 * @route   PUT /api/mama-kaplari/:id
 * @desc    Mama kabı bilgilerini günceller
 * @access  Admin
 * @header  Authorization: Bearer <accessToken>
 * @param   {number} id - Mama kabı ID
 * @body    {string} [KapAdi] - Yeni kap adı
 * @body    {string} [KonumAciklama] - Yeni konum açıklaması
 * @body    {string} [Konum] - Yeni konum
 * @returns {object} Güncellenmiş mama kabı
 */
router.put('/:id', auth, adminAuth, idParamValidation, mamaKabiController.update);

/**
 * @route   PATCH /api/mama-kaplari/:id/aktif
 * @desc    Mama kabını aktif/pasif yapar
 * @access  Admin
 * @header  Authorization: Bearer <accessToken>
 * @param   {number} id - Mama kabı ID
 * @body    {boolean} aktif - Aktif durumu (true/false)
 * @returns {object} Güncellenmiş mama kabı
 */
router.patch('/:id/aktif', auth, adminAuth, idParamValidation, mamaKabiController.toggleAktif);

/**
 * @route   DELETE /api/mama-kaplari/:id
 * @desc    Mama kabını siler (ilişkili veriler de silinir)
 * @access  Admin
 * @header  Authorization: Bearer <accessToken>
 * @param   {number} id - Mama kabı ID
 * @returns {object} { success, message }
 */
router.delete('/:id', auth, adminAuth, idParamValidation, mamaKabiController.delete);

export default router;
