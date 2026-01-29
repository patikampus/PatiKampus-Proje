/**
 * @fileoverview Rol Routes - Kullanıcı rolleri yönetimi
 * @description Roller CRUD işlemleri (Yavru Kedi, Kedi, Aslan vb.)
 * @module routes/rolRoutes
 */

import express from 'express';
const router = express.Router();
import rolController from '../controllers/rolController.js';
import { auth, adminAuth } from '../middleware/auth.js';
import { rolCreateValidation, idParamValidation } from '../middleware/validation.js';

// ==================== PUBLIC ROUTES ====================

/**
 * @route   GET /api/roller
 * @desc    Tüm rolleri listeler (skor sırasına göre)
 * @access  Public
 * @returns {array} Rol listesi [{ RolId, RolAdi, MinSkor, MaxSkor }]
 */
router.get('/', rolController.getAll);

/**
 * @route   GET /api/roller/:id
 * @desc    Belirli bir rolü getirir
 * @access  Public
 * @param   {number} id - Rol ID
 * @returns {object} Rol detayı
 */
router.get('/:id', idParamValidation, rolController.getById);

// ==================== ADMIN ROUTES ====================

/**
 * @route   POST /api/roller
 * @desc    Yeni rol oluşturur
 * @access  Admin
 * @header  Authorization: Bearer <accessToken>
 * @body    {string} RolAdi - Rol adı (örn: "Aslan")
 * @body    {number} MinSkor - Minimum skor
 * @body    {number} MaxSkor - Maksimum skor
 * @returns {object} Oluşturulan rol
 */
router.post('/', auth, adminAuth, rolCreateValidation, rolController.create);

/**
 * @route   PUT /api/roller/:id
 * @desc    Rol bilgilerini günceller
 * @access  Admin
 * @header  Authorization: Bearer <accessToken>
 * @param   {number} id - Rol ID
 * @body    {string} [RolAdi] - Yeni rol adı
 * @body    {number} [MinSkor] - Yeni minimum skor
 * @body    {number} [MaxSkor] - Yeni maksimum skor
 * @returns {object} Güncellenmiş rol
 */
router.put('/:id', auth, adminAuth, idParamValidation, rolController.update);

/**
 * @route   DELETE /api/roller/:id
 * @desc    Rolü siler
 * @access  Admin
 * @header  Authorization: Bearer <accessToken>
 * @param   {number} id - Rol ID
 * @returns {object} { success, message }
 */
router.delete('/:id', auth, adminAuth, idParamValidation, rolController.delete);

export default router;
