const express = require('express');
const router = express.Router();
const { sql, connectToDB } = require('../db');
const authMiddleware = require('../middleware/authMiddleware'); 

router.get('/list', async (req, res) => {
    try {
        const pool = await connectToDB();
        const result = await pool.request().query('SELECT * FROM MamaKaplari');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/sensor-data', async (req, res) => {
    try {
        const { mamaKabiId, agirlik, yukseklik, konum } = req.body;
        const pool = await connectToDB();

        await pool.request()
            .input('MamaKabiId', sql.Int, mamaKabiId)
            .input('Agirlik', sql.Decimal(6, 2), agirlik)
            .input('Yukseklik', sql.Decimal(6, 2), yukseklik)
            .input('Konum', sql.NVarChar, konum)
            .query(`
                INSERT INTO SensorVerileri (MamaKabiId, Agirlik, Yukseklik, Konum)
                VALUES (@MamaKabiId, @Agirlik, @Yukseklik, @Konum)
            `);

        if (agirlik < 0.5) {
            console.log(`⚠️ UYARI: ${mamaKabiId} numaralı kapta mama çok azaldı! (${agirlik} kg)`);
        }

        res.status(201).json({ message: "Sensör verisi işlendi." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/qr-okut', authMiddleware, async (req, res) => {
    try {
        const { mamaKabiId, eklenenMiktar } = req.body;
        const kullaniciId = req.user.id; 
        const puan = 10; 

        const pool = await connectToDB();
        const transaction = new sql.Transaction(pool);

        await transaction.begin();

        try {
            const request = new sql.Request(transaction);

            await request
                .input('MamaKabiId', sql.Int, mamaKabiId)
                .input('KullaniciId', sql.Int, kullaniciId)
                .input('EklenenMiktarKg', sql.Decimal(6,2), eklenenMiktar)
                .query(`
                    INSERT INTO MamaEklemeKayitlari (MamaKabiId, KullaniciId, EklenenMiktarKg)
                    VALUES (@MamaKabiId, @KullaniciId, @EklenenMiktarKg)
                `);

            const skorKontrol = await request.query(`SELECT * FROM KullaniciSkorlari WHERE KullaniciId = ${kullaniciId}`);

            if (skorKontrol.recordset.length === 0) {
                await request.query(`
                    INSERT INTO KullaniciSkorlari (KullaniciId, ToplamEklemeSayisi, ToplamMama, Skor)
                    VALUES (${kullaniciId}, 1, ${eklenenMiktar}, ${puan})
                `);
            } else {
                await request.query(`
                    UPDATE KullaniciSkorlari
                    SET ToplamEklemeSayisi = ToplamEklemeSayisi + 1,
                        ToplamMama = ToplamMama + ${eklenenMiktar},
                        Skor = Skor + ${puan},
                        SonGuncelleme = SYSDATETIME()
                    WHERE KullaniciId = ${kullaniciId}
                `);
            }

            await transaction.commit();
            res.json({ message: "İşlem başarılı! Puan kazandınız.", kazanilanPuan: puan });

        } catch (err) {
            await transaction.rollback(); 
            throw err;
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "İşlem sırasında hata oluştu." });
    }
});

router.get('/skor-tablosu', async (req, res) => {
    try {
        const pool = await connectToDB();
        const result = await pool.request().query(`
            SELECT TOP 10 k.AdSoyad, s.Skor, s.ToplamMama
            FROM KullaniciSkorlari s
            JOIN Kullanicilar k ON s.KullaniciId = k.KullaniciId
            ORDER BY s.Skor DESC
        `);
        res.json(result.recordset);
    } catch (err) {
        console.error("❌ DETAYLI HATA:", err); 
        res.status(500).json({ 
            error: "Hata Oluştu", 
            detay: err.message, 
            kod: err.code 
        });
    }
});

module.exports = router;