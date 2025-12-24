const sql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

async function connectToDB() {
    try {
        let pool = await sql.connect(config);
        console.log("✅ Veritabanı bağlantısı başarılı!");
        return pool;
    } catch (err) {
        console.error("❌ Veritabanı hatası:", err);
    }
}

module.exports = { sql, connectToDB };