/**
 * @fileoverview Aktivasyon Routes - Kapı aktivasyon geçmişi
 * @description Mama kabı kapağı açılma kayıtları
 * @module routes/aktivasyonRoutes
 */

import express from 'express';
const router = express.Router();
import aktivasyonController from '../controllers/aktivasyonController.js';
import { auth, adminAuth, optionalAuth } from '../middleware/auth.js';
import { idParamValidation, paginationValidation } from '../middleware/validation.js';

// ==================== PUBLIC ROUTES ====================

/**
 * @route   GET /api/aktivasyonlar/son
 * @desc    En son aktivasyonları getirir
 * @access  Public
 * @query   {number} [limit=10] - Kaç kayıt getirileceği
 * @returns {array} Son aktivasyonlar (mama kabı ve kullanıcı dahil)
 */
router.get('/son', aktivasyonController.getRecent);

/**
 * @route   GET /api/aktivasyonlar/mama-kabi/:mamaKabiId
 * @desc    Belirli mama kabının aktivasyon geçmişini getirir
 * @access  Public
 * @param   {number} mamaKabiId - Mama kabı ID
 * @query   {number} [limit=20] - Kaç kayıt getirileceği
 * @returns {array} Mama kabı aktivasyonları
 */
router.get('/mama-kabi/:mamaKabiId', aktivasyonController.getByMamaKabiId);

// ==================== PROTECTED ROUTES ====================

/**
 * @route   POST /api/aktivasyonlar
 * @desc    Yeni aktivasyon kaydı oluşturur (kapak açıldığında)
 * @access  Public (opsiyonel auth - kullanıcı giriş yapmışsa kaydedilir)
 * @header  [Authorization: Bearer <accessToken>] - Opsiyonel
 * @body    {number} MamaKabiId - Mama kabı ID
 * @returns {object} Oluşturulan aktivasyon kaydı
 * @note    IoT cihazı veya mobil uygulama tarafından çağrılır
 */
router.post('/', optionalAuth, aktivasyonController.create);

// ==================== ADMIN ROUTES ====================

/**
 * @route   GET /api/aktivasyonlar
 * @desc    Tüm aktivasyonları sayfalı listeler
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
router.get('/', auth, adminAuth, paginationValidation, aktivasyonController.getAll);

/**
 * @route   GET /api/aktivasyonlar/kullanici/:kullaniciId
 * @desc    Belirli kullanıcının aktivasyonlarını getirir
 * @access  Admin
 * @header  Authorization: Bearer <accessToken>
 * @param   {number} kullaniciId - Kullanıcı ID
 * @query   {number} [limit=20] - Kaç kayıt getirileceği
 * @returns {array} Kullanıcının aktivasyonları
 */
router.get('/kullanici/:kullaniciId', auth, adminAuth, aktivasyonController.getByKullaniciId);

/**
 * @route   GET /api/aktivasyonlar/:id
 * @desc    Belirli aktivasyonu getirir
 * @access  Admin
 * @header  Authorization: Bearer <accessToken>
 * @param   {number} id - Aktivasyon ID
 * @returns {object} Aktivasyon detayı
 */
router.get('/:id', auth, adminAuth, idParamValidation, aktivasyonController.getById);

export default router;
