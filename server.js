const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const mamaKabiRoutes = require('./routes/mamaKabiRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);

app.use('/api/mama-kabi', mamaKabiRoutes);

app.listen(PORT, () => {
    console.log(`--------------------------------------------------`);
    console.log(`🚀 Sunucu Başlatıldı!`);
    console.log(`🔌 Port: ${PORT}`);
    console.log(`🌐 Web Arayüzü: http://localhost:${PORT}`);
    console.log(`--------------------------------------------------`);
});