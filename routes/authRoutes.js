const express = require('express');
const router = express.Router();
const { sql, connectToDB } = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    try {
        const { adSoyad, email, sifre } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashliSifre = await bcrypt.hash(sifre, salt);

        const pool = await connectToDB();

        await pool.request()
            .input('AdSoyad', sql.NVarChar, adSoyad)
            .input('Email', sql.NVarChar, email)
            .input('SifreHash', sql.NVarChar, hashliSifre)
            .query(`
                INSERT INTO Kullanicilar (AdSoyad, Email, SifreHash)
                VALUES (@AdSoyad, @Email, @SifreHash)
            `);

        res.status(201).json({ message: "Kullanıcı başarıyla oluşturuldu." });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, sifre } = req.body;
        const pool = await connectToDB();

        const result = await pool.request()
            .input('Email', sql.NVarChar, email)
            .query('SELECT * FROM Kullanicilar WHERE Email = @Email');

        const kullanici = result.recordset[0];

        if (!kullanici) {
            return res.status(404).json({ message: "Kullanıcı bulunamadı." });
        }

        const sifreDogruMu = await bcrypt.compare(sifre, kullanici.SifreHash);
        if (!sifreDogruMu) {
            return res.status(401).json({ message: "Hatalı şifre." });
        }

        const token = jwt.sign(
            { id: kullanici.KullaniciId, email: kullanici.Email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        await pool.request()
            .input('Id', sql.Int, kullanici.KullaniciId)
            .query('UPDATE Kullanicilar SET SonGirisZamani = SYSDATETIME() WHERE KullaniciId = @Id');

        res.json({ token, kullaniciId: kullanici.KullaniciId, ad: kullanici.AdSoyad });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;