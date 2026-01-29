/**
 * @fileoverview Ana Route Dosyası - Tüm API route'larını birleştirir
 * @description PatiKampus API endpoint'lerinin merkezi yapılandırması
 * @module routes/index
 * 
 * @api {base} /api API Base URL
 * 
 * Route Grupları:
 * - /api/auth          - Kimlik doğrulama işlemleri
 * - /api/roller        - Rol yönetimi
 * - /api/kullanicilar  - Kullanıcı yönetimi
 * - /api/adminler      - Admin yönetimi
 * - /api/mama-kaplari  - Mama kapları yönetimi
 * - /api/anomaliler    - Sensör anomalileri
 * - /api/qr-kodlari    - QR kod yönetimi
 * - /api/sensor-verileri - IoT sensör verileri
 * - /api/mama-eklemeleri - Mama ekleme kayıtları
 * - /api/skorlar       - Kullanıcı skorları
 * - /api/aktivasyonlar - Kapak aktivasyon geçmişi
 */

import express from 'express';
const router = express.Router();

// Route modüllerini import et
import authRoutes from './authRoutes.js';
import rolRoutes from './rolRoutes.js';
import kullaniciRoutes from './kullaniciRoutes.js';
import adminRoutes from './adminRoutes.js';
import mamaKabiRoutes from './mamaKabiRoutes.js';
import anomaliRoutes from './anomaliRoutes.js';
import qrKodRoutes from './qrKodRoutes.js';
import sensorVeriRoutes from './sensorVeriRoutes.js';
import mamaEklemeRoutes from './mamaEklemeRoutes.js';
import skorRoutes from './skorRoutes.js';
import aktivasyonRoutes from './aktivasyonRoutes.js';

// ==================== HEALTH CHECK ====================

/**
 * @route   GET /api/health
 * @desc    API sağlık kontrolü
 * @access  Public
 * @returns {object} { success, message, timestamp }
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'PatiKampus API çalışıyor',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// ==================== ROUTE MOUNTING ====================

// Auth Routes - Kimlik doğrulama
router.use('/auth', authRoutes);

// Rol Routes - Kullanıcı rolleri (Yavru Kedi, Kedi, Aslan vb.)
router.use('/roller', rolRoutes);

// Kullanıcı Routes - Kullanıcı yönetimi ve profil
router.use('/kullanicilar', kullaniciRoutes);

// Admin Routes - Admin yönetimi
router.use('/adminler', adminRoutes);

// Mama Kabı Routes - Mama kapları CRUD ve sensör durumu
router.use('/mama-kaplari', mamaKabiRoutes);

// Anomali Routes - Sensör anomalileri
router.use('/anomaliler', anomaliRoutes);

// QR Kod Routes - QR kod yönetimi
router.use('/qr-kodlari', qrKodRoutes);

// Sensör Veri Routes - IoT sensör verileri
router.use('/sensor-verileri', sensorVeriRoutes);

// Mama Ekleme Routes - Mama ekleme kayıtları
router.use('/mama-eklemeleri', mamaEklemeRoutes);

// Skor Routes - Kullanıcı skorları ve liderlik
router.use('/skorlar', skorRoutes);

// Aktivasyon Routes - Kapak aktivasyon geçmişi
router.use('/aktivasyonlar', aktivasyonRoutes);

export default router;
