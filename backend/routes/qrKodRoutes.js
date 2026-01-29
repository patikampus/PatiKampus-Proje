/**
 * @fileoverview QR Kod Routes - QR kod yönetimi
 * @description QR kod oluşturma, listeleme ve giriş işlemleri
 * @module routes/qrKodRoutes
 */

import express from 'express';
const router = express.Router();
import qrKodController from '../controllers/qrKodController.js';
import { auth, adminAuth } from '../middleware/auth.js';
import { idParamValidation } from '../middleware/validation.js';

// ==================== PUBLIC ROUTES ====================

/**
 * @route   GET /api/qr-kodlari
 * @desc    Tüm QR kodlarını listeler
 * @access  Public
 * @returns {array} QR kodları (mama kabı ve giriş yapan kullanıcı dahil)
 */
router.get('/', qrKodController.getAll);

/**
 * @route   GET /api/qr-kodlari/mama-kabi/:mamaKabiId
 * @desc    Belirli mama kabının QR kodunu getirir
 * @access  Public
 * @param   {number} mamaKabiId - Mama kabı ID
 * @returns {object} QR kod detayı
 */
router.get('/mama-kabi/:mamaKabiId', qrKodController.getByMamaKabiId);

/**
 * @route   GET /api/qr-kodlari/:id
 * @desc    Belirli QR kodu getirir
 * @access  Public
 * @param   {number} id - QR kod ID
 * @returns {object} QR kod detayı
 */
router.get('/:id', idParamValidation, qrKodController.getById);

// ==================== PROTECTED ROUTES ====================

/**
 * @route   POST /api/qr-kodlari/:id/giris
 * @desc    QR kod ile giriş yapar (kullanıcıyı QR koda bağlar)
 * @access  Private
 * @header  Authorization: Bearer <accessToken>
 * @param   {number} id - QR kod ID
 * @returns {object} Güncellenmiş QR kod (giriş yapan kullanıcı dahil)
 */
router.post('/:id/giris', auth, idParamValidation, qrKodController.login);

// ==================== ADMIN ROUTES ====================

/**
 * @route   POST /api/qr-kodlari
 * @desc    Yeni QR kod oluşturur (mama kabı için)
 * @access  Admin
 * @header  Authorization: Bearer <accessToken>
 * @body    {number} MamaKabiId - Mama kabı ID
 * @returns {object} Oluşturulan QR kod
 * @note    Her mama kabı için sadece 1 QR kod olabilir
 */
router.post('/', auth, adminAuth, qrKodController.create);

/**
 * @route   PATCH /api/qr-kodlari/:id/aktif
 * @desc    QR kodu aktif/pasif yapar
 * @access  Admin
 * @header  Authorization: Bearer <accessToken>
 * @param   {number} id - QR kod ID
 * @body    {boolean} aktif - Aktif durumu (true/false)
 * @returns {object} Güncellenmiş QR kod
 */
router.patch('/:id/aktif', auth, adminAuth, idParamValidation, qrKodController.toggleAktif);

/**
 * @route   DELETE /api/qr-kodlari/:id
 * @desc    QR kodu siler
 * @access  Admin
 * @header  Authorization: Bearer <accessToken>
 * @param   {number} id - QR kod ID
 * @returns {object} { success, message }
 */
router.delete('/:id', auth, adminAuth, idParamValidation, qrKodController.delete);

export default router;
