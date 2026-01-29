/**
 * @fileoverview Anomali Routes - Sensör anomalileri yönetimi
 * @description Anomali listeleme, istatistik ve yönetim işlemleri
 * @module routes/anomaliRoutes
 */

import express from 'express';
const router = express.Router();
import anomaliController from '../controllers/anomaliController.js';
import { auth, adminAuth } from '../middleware/auth.js';
import { idParamValidation, paginationValidation } from '../middleware/validation.js';

// ==================== PUBLIC ROUTES ====================

/**
 * @route   GET /api/anomaliler
 * @desc    Tüm anomalileri sayfalı listeler
 * @access  Public
 * @query   {number} [page=1] - Sayfa numarası
 * @query   {number} [limit=20] - Sayfa başına kayıt
 * @query   {number} [mamaKabiId] - Mama kabına göre filtrele
 * @query   {string} [startDate] - Başlangıç tarihi
 * @query   {string} [endDate] - Bitiş tarihi
 * @returns {object} { data, pagination }
 */
router.get('/', paginationValidation, anomaliController.getAll);

/**
 * @route   GET /api/anomaliler/son
 * @desc    En son anomalileri getirir
 * @access  Public
 * @query   {number} [limit=10] - Kaç kayıt getirileceği
 * @returns {array} Son anomaliler (mama kabı bilgisi dahil)
 */
router.get('/son', anomaliController.getRecent);

/**
 * @route   GET /api/anomaliler/istatistik
 * @desc    Anomali istatistiklerini getirir
 * @access  Public
 * @query   {string} [startDate] - Başlangıç tarihi
 * @query   {string} [endDate] - Bitiş tarihi
 * @returns {object} { total, byMamaKabi: [{ MamaKabiId, anomaliSayisi, KapAdi }] }
 */
router.get('/istatistik', anomaliController.getStatistics);

/**
 * @route   GET /api/anomaliler/mama-kabi/:mamaKabiId
 * @desc    Belirli mama kabının anomalilerini getirir
 * @access  Public
 * @param   {number} mamaKabiId - Mama kabı ID
 * @query   {number} [limit=10] - Kaç kayıt getirileceği
 * @returns {array} Mama kabı anomalileri
 */
router.get('/mama-kabi/:mamaKabiId', anomaliController.getByMamaKabiId);

/**
 * @route   GET /api/anomaliler/:id
 * @desc    Belirli anomaliyi getirir
 * @access  Public
 * @param   {number} id - Anomali ID
 * @returns {object} Anomali detayı (sensör verisi dahil)
 */
router.get('/:id', idParamValidation, anomaliController.getById);

// ==================== ADMIN ROUTES ====================

/**
 * @route   POST /api/anomaliler
 * @desc    Manuel anomali kaydı oluşturur
 * @access  Admin
 * @header  Authorization: Bearer <accessToken>
 * @body    {number} MamaKabiId - Mama kabı ID
 * @body    {number} [SensorId] - İlişkili sensör veri ID
 * @body    {number} [Agirlik] - Anomali ağırlık değeri
 * @body    {number} [Yukseklik] - Anomali yükseklik değeri
 * @returns {object} Oluşturulan anomali
 */
router.post('/', auth, adminAuth, anomaliController.create);

/**
 * @route   DELETE /api/anomaliler/:id
 * @desc    Anomali kaydını siler
 * @access  Admin
 * @header  Authorization: Bearer <accessToken>
 * @param   {number} id - Anomali ID
 * @returns {object} { success, message }
 */
router.delete('/:id', auth, adminAuth, idParamValidation, anomaliController.delete);

export default router;
