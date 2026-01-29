/**
 * @fileoverview Sensör Veri Routes - IoT sensör verileri yönetimi
 * @description Sensör verilerini kaydetme, listeleme ve istatistik işlemleri
 * @module routes/sensorVeriRoutes
 */

import express from 'express';
const router = express.Router();
import sensorVeriController from '../controllers/sensorVeriController.js';
import { auth, adminAuth } from '../middleware/auth.js';
import { sensorVeriCreateValidation, idParamValidation, paginationValidation } from '../middleware/validation.js';

// ==================== PUBLIC ROUTES ====================

/**
 * @route   GET /api/sensor-verileri
 * @desc    Tüm sensör verilerini sayfalı listeler
 * @access  Public
 * @query   {number} [page=1] - Sayfa numarası
 * @query   {number} [limit=20] - Sayfa başına kayıt
 * @query   {number} [mamaKabiId] - Mama kabına göre filtrele
 * @query   {string} [startDate] - Başlangıç tarihi (ISO format)
 * @query   {string} [endDate] - Bitiş tarihi (ISO format)
 * @returns {object} { data, pagination }
 */
router.get('/', paginationValidation, sensorVeriController.getAll);

/**
 * @route   GET /api/sensor-verileri/mama-kabi/:mamaKabiId
 * @desc    Belirli mama kabının sensör verilerini getirir
 * @access  Public
 * @param   {number} mamaKabiId - Mama kabı ID
 * @query   {number} [limit=100] - Kaç kayıt getirileceği
 * @returns {array} Sensör verileri (son ölçümden başlayarak)
 */
router.get('/mama-kabi/:mamaKabiId', sensorVeriController.getByMamaKabiId);

/**
 * @route   GET /api/sensor-verileri/mama-kabi/:mamaKabiId/son
 * @desc    Mama kabının en son sensör verisini getirir
 * @access  Public
 * @param   {number} mamaKabiId - Mama kabı ID
 * @returns {object} En son sensör verisi { Agirlik, Yukseklik, OlcumZamani }
 */
router.get('/mama-kabi/:mamaKabiId/son', sensorVeriController.getLatest);

/**
 * @route   GET /api/sensor-verileri/mama-kabi/:mamaKabiId/tarih-araligi
 * @desc    Belirli tarih aralığındaki sensör verilerini getirir
 * @access  Public
 * @param   {number} mamaKabiId - Mama kabı ID
 * @query   {string} startDate - Başlangıç tarihi (zorunlu)
 * @query   {string} endDate - Bitiş tarihi (zorunlu)
 * @returns {array} Tarih aralığındaki sensör verileri
 */
router.get('/mama-kabi/:mamaKabiId/tarih-araligi', sensorVeriController.getByDateRange);

/**
 * @route   GET /api/sensor-verileri/mama-kabi/:mamaKabiId/istatistik
 * @desc    Mama kabının sensör istatistiklerini getirir
 * @access  Public
 * @param   {number} mamaKabiId - Mama kabı ID
 * @query   {number} [days=7] - Kaç günlük istatistik
 * @returns {object} { avgAgirlik, minAgirlik, maxAgirlik, avgYukseklik, olcumSayisi }
 */
router.get('/mama-kabi/:mamaKabiId/istatistik', sensorVeriController.getStatistics);

/**
 * @route   GET /api/sensor-verileri/:id
 * @desc    Belirli sensör verisini getirir
 * @access  Public
 * @param   {number} id - Sensör veri ID
 * @returns {object} Sensör verisi detayı
 */
router.get('/:id', idParamValidation, sensorVeriController.getById);

// ==================== IOT DEVICE ROUTES ====================

/**
 * @route   POST /api/sensor-verileri
 * @desc    Yeni sensör verisi kaydeder (IoT cihazından)
 * @access  Public (Production'da API key ile güvence altına alınmalı)
 * @body    {number} MamaKabiId - Mama kabı ID (zorunlu)
 * @body    {number} [Agirlik] - Ağırlık değeri (kg)
 * @body    {number} [Yukseklik] - Yükseklik değeri (cm)
 * @returns {object} Kaydedilen sensör verisi
 * @note    Ani değişikliklerde otomatik anomali kaydı oluşturur
 */
router.post('/', sensorVeriCreateValidation, sensorVeriController.create);

export default router;
