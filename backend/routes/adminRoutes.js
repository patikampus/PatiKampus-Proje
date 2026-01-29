/**
 * @fileoverview Admin Routes - Admin yönetimi
 * @description Admin ekleme, listeleme ve kaldırma işlemleri
 * @module routes/adminRoutes
 */

import express from 'express';
const router = express.Router();
import adminController from '../controllers/adminController.js';
import { auth, adminAuth } from '../middleware/auth.js';
import { idParamValidation } from '../middleware/validation.js';

// Tüm route'lar admin yetkisi gerektirir
router.use(auth, adminAuth);

// ==================== ADMIN ROUTES ====================

/**
 * @route   GET /api/adminler
 * @desc    Tüm adminleri listeler
 * @access  Admin
 * @header  Authorization: Bearer <accessToken>
 * @returns {array} Admin listesi (kullanıcı bilgileri dahil)
 */
router.get('/', adminController.getAll);

/**
 * @route   GET /api/adminler/:id
 * @desc    Belirli bir admin'i getirir
 * @access  Admin
 * @header  Authorization: Bearer <accessToken>
 * @param   {number} id - Admin ID
 * @returns {object} Admin detayı
 */
router.get('/:id', idParamValidation, adminController.getById);

/**
 * @route   POST /api/adminler
 * @desc    Kullanıcıya admin yetkisi verir
 * @access  Admin
 * @header  Authorization: Bearer <accessToken>
 * @body    {number} KullaniciId - Admin yapılacak kullanıcı ID
 * @returns {object} Oluşturulan admin kaydı
 */
router.post('/', adminController.create);

/**
 * @route   DELETE /api/adminler/:id
 * @desc    Admin yetkisini kaldırır (kullanıcıyı silmez)
 * @access  Admin
 * @header  Authorization: Bearer <accessToken>
 * @param   {number} id - Admin ID
 * @returns {object} { success, message }
 */
router.delete('/:id', idParamValidation, adminController.delete);

export default router;
