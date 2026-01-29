# PatiKampus Backend

PatiKampus Mama Kabı Yönetim Sistemi için Node.js/Express.js backend uygulaması.

## Teknolojiler

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Sequelize** - ORM
- **MySQL** - Veritabanı
- **JWT** - Authentication
- **bcryptjs** - Şifre hash'leme

## Kurulum

### 1. Bağımlılıkları Yükle

```bash
cd backend
npm install
```

### 2. Environment Değişkenlerini Ayarla

`.env.example` dosyasını `.env` olarak kopyalayın ve değerleri düzenleyin:

```bash
cp .env.example .env
```

`.env` dosyası içeriği:
```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_NAME=patikampus
DB_USER=root
DB_PASSWORD=your_password

JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:3000
```

### 3. Veritabanını Oluştur

MySQL'de veritabanını oluşturun ve SQL dosyasını çalıştırın:

```sql
CREATE DATABASE patikampus CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Ardından `mamakabı.sql` dosyasındaki tabloları oluşturun.

### 4. Sunucuyu Başlat

```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Auth
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | `/api/auth/kayit` | Yeni kullanıcı kaydı |
| POST | `/api/auth/giris` | Kullanıcı girişi |
| POST | `/api/auth/sifre-sifirlama-talebi` | Şifre sıfırlama talebi |
| POST | `/api/auth/sifre-sifirlama` | Şifre sıfırlama |
| GET | `/api/auth/ben` | Mevcut kullanıcı bilgisi |
| GET | `/api/auth/giris-gecmisi` | Giriş geçmişi |

### Kullanıcılar
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/kullanicilar` | Tüm kullanıcılar (Admin) |
| GET | `/api/kullanicilar/:id` | Kullanıcı detayı (Admin) |
| POST | `/api/kullanicilar` | Yeni kullanıcı (Admin) |
| PUT | `/api/kullanicilar/:id` | Kullanıcı güncelle (Admin) |
| DELETE | `/api/kullanicilar/:id` | Kullanıcı sil (Admin) |
| GET | `/api/kullanicilar/profil` | Kendi profilim |
| PUT | `/api/kullanicilar/profil` | Profil güncelle |
| GET | `/api/kullanicilar/liderlik` | Liderlik tablosu |

### Mama Kapları
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/mama-kaplari` | Tüm mama kapları |
| GET | `/api/mama-kaplari/:id` | Mama kabı detayı |
| GET | `/api/mama-kaplari/:id/detay` | Detaylı bilgi |
| POST | `/api/mama-kaplari` | Yeni mama kabı (Admin) |
| PUT | `/api/mama-kaplari/:id` | Güncelle (Admin) |
| DELETE | `/api/mama-kaplari/:id` | Sil (Admin) |
| PATCH | `/api/mama-kaplari/:id/aktif` | Aktif/Pasif (Admin) |
| GET | `/api/mama-kaplari/sensor-durumu` | Son sensor verileri |
| GET | `/api/mama-kaplari/dusuk-seviye` | Düşük seviyeli kaplar |
| GET | `/api/mama-kaplari/ara` | Konum ile ara |

### Sensör Verileri
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/sensor-verileri` | Tüm veriler |
| POST | `/api/sensor-verileri` | Yeni veri (IoT) |
| GET | `/api/sensor-verileri/mama-kabi/:id` | Kaba göre veriler |
| GET | `/api/sensor-verileri/mama-kabi/:id/son` | Son veri |
| GET | `/api/sensor-verileri/mama-kabi/:id/istatistik` | İstatistikler |

### Mama Ekleme
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | `/api/mama-eklemeleri` | Mama ekle |
| GET | `/api/mama-eklemeleri/benim` | Benim eklemelerim |
| GET | `/api/mama-eklemeleri/istatistik` | İstatistikler |
| GET | `/api/mama-eklemeleri/gunluk-istatistik` | Günlük istatistik |

### Skorlar
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/skorlar` | Tüm skorlar |
| GET | `/api/skorlar/liderlik` | Liderlik tablosu |
| GET | `/api/skorlar/benim` | Benim skorum |
| GET | `/api/skorlar/benim-siralama` | Sıralamam |
| GET | `/api/skorlar/istatistik` | İstatistikler |

### Anomaliler
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/anomaliler` | Tüm anomaliler |
| GET | `/api/anomaliler/son` | Son anomaliler |
| GET | `/api/anomaliler/istatistik` | İstatistikler |
| GET | `/api/anomaliler/mama-kabi/:id` | Kaba göre anomaliler |

### QR Kodları
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/qr-kodlari` | Tüm QR kodları |
| GET | `/api/qr-kodlari/:id` | QR kod detayı |
| POST | `/api/qr-kodlari/:id/giris` | QR ile giriş |

### Aktivasyonlar
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/aktivasyonlar/son` | Son aktivasyonlar |
| POST | `/api/aktivasyonlar` | Yeni aktivasyon |

## Proje Yapısı

```
backend/
├── config/
│   ├── database.js      # Veritabanı bağlantısı
│   └── index.js         # Genel konfigürasyon
├── controllers/         # Route handler'lar
├── middleware/
│   ├── auth.js          # JWT doğrulama
│   ├── errorHandler.js  # Hata yakalama
│   └── validation.js    # Input doğrulama
├── models/              # Sequelize modelleri
├── routes/              # API route tanımları
├── services/            # İş mantığı
├── utils/
│   └── helpers.js       # Yardımcı fonksiyonlar
├── app.js               # Express app
├── server.js            # Sunucu başlatma
└── package.json
```

## Authentication

API, JWT (JSON Web Token) tabanlı authentication kullanır.

Token almak için `/api/auth/giris` endpoint'ine POST isteği gönderin:

```json
{
  "Email": "user@example.com",
  "Sifre": "password123"
}
```

Korumalı endpoint'lere istek yaparken `Authorization` header'ı ekleyin:

```
Authorization: Bearer <token>
```

## Hata Kodları

| Kod | Açıklama |
|-----|----------|
| 200 | Başarılı |
| 201 | Oluşturuldu |
| 400 | Geçersiz istek |
| 401 | Yetkilendirme hatası |
| 403 | Erişim engellendi |
| 404 | Bulunamadı |
| 500 | Sunucu hatası |

## Lisans

ISC
