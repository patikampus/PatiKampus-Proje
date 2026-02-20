
/* 1) Roller */
CREATE TABLE Roller (
  RolId   INT AUTO_INCREMENT PRIMARY KEY,
  RolAdi  VARCHAR(50) NOT NULL UNIQUE,
  MinSkor INT NOT NULL,
  MaxSkor INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/* 2) Kullanicilar */
CREATE TABLE Kullanicilar (
  KullaniciId    INT AUTO_INCREMENT PRIMARY KEY,
  AdSoyad        VARCHAR(100) NOT NULL,
  Email          VARCHAR(255) NOT NULL UNIQUE,
  SifreHash      VARCHAR(255) NOT NULL,
  KayitTarihi    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  SonGirisZamani DATETIME NULL,
  AktifMi        TINYINT(1) NOT NULL DEFAULT 1,
  RolId          INT NULL,

  CONSTRAINT FK_Kullanici_Rol
    FOREIGN KEY (RolId)
    REFERENCES Roller(RolId)
    ON DELETE SET NULL
    ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*  3) Adminler */
CREATE TABLE Adminler (
  AdminId         INT AUTO_INCREMENT PRIMARY KEY,
  KullaniciId     INT NOT NULL UNIQUE,
  OlusturmaTarihi DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT FK_Admin_Kullanici
    FOREIGN KEY (KullaniciId)
    REFERENCES Kullanicilar(KullaniciId)
    ON DELETE CASCADE
    ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*  4) MamaKaplari*/
CREATE TABLE MamaKaplari (
  MamaKabiId        INT AUTO_INCREMENT PRIMARY KEY,
  KapAdi            VARCHAR(100) NULL,
  KonumAciklama     VARCHAR(255) NULL,
  Konum             VARCHAR(255) NULL,
  AktifMi           TINYINT(1) NOT NULL DEFAULT 1,
  AktifEdilmeZamani DATETIME NULL,
  OlusturmaTarihi   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*  5) QRKodlari */
CREATE TABLE QRKodlari (
  QRId                  INT AUTO_INCREMENT PRIMARY KEY,
  MamaKabiId            INT NOT NULL,
  GirisyapanKullaniciId INT NULL,
  OlusturmaTarihi       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  AktifMi               TINYINT(1) NOT NULL DEFAULT 1,

  UNIQUE KEY UQ_QR_MamaKabi (MamaKabiId),
  INDEX IX_QR_GirenKullanici (GirisyapanKullaniciId),

  CONSTRAINT FK_QR_MamaKabi
    FOREIGN KEY (MamaKabiId)
    REFERENCES MamaKaplari(MamaKabiId)
    ON DELETE CASCADE
    ON UPDATE RESTRICT,

  CONSTRAINT FK_QR_Kullanici
    FOREIGN KEY (GirisyapanKullaniciId)
    REFERENCES Kullanicilar(KullaniciId)
    ON DELETE CASCADE
    ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*  6) SensorVerileri */
CREATE TABLE SensorVerileri (
  SensorId            BIGINT AUTO_INCREMENT PRIMARY KEY,
  MamaKabiId          INT NOT NULL,
  OlcumZamani         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Agirlik             DECIMAL(6,2) NULL,
  Yukseklik           DECIMAL(6,2) NULL,
  SonMamaEklemeZamani DATETIME NULL,
  KapAktifMi          TINYINT(1) NULL,
  Konum               VARCHAR(255) NULL,

  INDEX IX_Sensor_MamaKabi (MamaKabiId),
  INDEX IX_Sensor_OlcumZamani (OlcumZamani),

  CONSTRAINT FK_Sensor_MamaKabi
    FOREIGN KEY (MamaKabiId)
    REFERENCES MamaKaplari(MamaKabiId)
    ON DELETE CASCADE
    ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*  7) Anomaliler */
CREATE TABLE Anomaliler (
  AnomaliId     BIGINT AUTO_INCREMENT PRIMARY KEY,
  MamaKabiId    INT NOT NULL,
  SensorId      BIGINT NULL,
  AnomaliZamani DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Agirlik       DECIMAL(6,2) NULL,
  Yukseklik     DECIMAL(6,2) NULL,

  INDEX IX_Anomali_MamaKabi (MamaKabiId),
  INDEX IX_Anomali_Sensor (SensorId),
  INDEX IX_Anomali_Zaman (AnomaliZamani),

  CONSTRAINT FK_Anomali_MamaKabi
    FOREIGN KEY (MamaKabiId)
    REFERENCES MamaKaplari(MamaKabiId)
    ON DELETE CASCADE
    ON UPDATE RESTRICT,

  CONSTRAINT FK_Anomali_Sensor
    FOREIGN KEY (SensorId)
    REFERENCES SensorVerileri(SensorId)
    ON DELETE SET NULL
    ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*  8) MamaEklemeKayitlari*/
CREATE TABLE MamaEklemeKayitlari (
  KayitId         BIGINT AUTO_INCREMENT PRIMARY KEY,
  MamaKabiId      INT NOT NULL,
  KullaniciId     INT NOT NULL,
  EklenenMiktarKg DECIMAL(6,2) NULL,
  EklemeZamani    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  INDEX IX_MamaEkleme_MamaKabi (MamaKabiId),
  INDEX IX_MamaEkleme_Kullanici (KullaniciId),

  CONSTRAINT FK_MamaEkleme_MamaKabi
    FOREIGN KEY (MamaKabiId)
    REFERENCES MamaKaplari(MamaKabiId)
    ON DELETE CASCADE
    ON UPDATE RESTRICT,

  CONSTRAINT FK_MamaEkleme_Kullanici
    FOREIGN KEY (KullaniciId)
    REFERENCES Kullanicilar(KullaniciId)
    ON DELETE CASCADE
    ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*  9) MamaEklemeFotograflari */
CREATE TABLE MamaEklemeFotograflari (
  FotoId              BIGINT AUTO_INCREMENT PRIMARY KEY,
  KayitId             BIGINT NOT NULL,
  YukleyenKullaniciId INT NOT NULL,
  FotoUrl             VARCHAR(1000) NOT NULL,
  Durum               ENUM('BEKLEMEDE','ONAYLI','RED') NOT NULL DEFAULT 'BEKLEMEDE',
  YuklemeZamani       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  OnaylayanAdminId    INT NULL,
  OnayZamani          DATETIME NULL,
  RedNedeni           VARCHAR(255) NULL,

  INDEX IX_MEF_Kayit (KayitId),
  INDEX IX_MEF_Durum (Durum),
  INDEX IX_MEF_Yukleyen (YukleyenKullaniciId),
  INDEX IX_MEF_Onaylayan (OnaylayanAdminId),

  CONSTRAINT FK_MEF_Kayit
    FOREIGN KEY (KayitId)
    REFERENCES MamaEklemeKayitlari(KayitId)
    ON DELETE CASCADE
    ON UPDATE RESTRICT,

  CONSTRAINT FK_MEF_Yukleyen
    FOREIGN KEY (YukleyenKullaniciId)
    REFERENCES Kullanicilar(KullaniciId)
    ON DELETE CASCADE
    ON UPDATE RESTRICT,

  CONSTRAINT FK_MEF_Onaylayan
    FOREIGN KEY (OnaylayanAdminId)
    REFERENCES Adminler(AdminId)
    ON DELETE SET NULL
    ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*  10) KullaniciSkorlari */
CREATE TABLE KullaniciSkorlari (
  KullaniciId        INT PRIMARY KEY,
  ToplamEklemeSayisi INT NOT NULL DEFAULT 0,
  ToplamMama         DECIMAL(10,2) NOT NULL DEFAULT 0,
  Skor               INT NOT NULL DEFAULT 0,
  SonGuncelleme      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT FK_Skor_Kullanici
    FOREIGN KEY (KullaniciId)
    REFERENCES Kullanicilar(KullaniciId)
    ON DELETE CASCADE
    ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/* 11) SifreSifirlama */
CREATE TABLE SifreSifirlama (
  SifirlamaId      CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  KullaniciId      INT NOT NULL,
  Token            VARCHAR(255) NOT NULL UNIQUE,
  GecerlilikZamani DATETIME NOT NULL,
  KullanildiMi     TINYINT(1) NOT NULL DEFAULT 0,
  OlusturmaZamani  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  INDEX IX_SifreSifirlama_Kullanici (KullaniciId),

  CONSTRAINT FK_SifreSifirlama_Kullanici
    FOREIGN KEY (KullaniciId)
    REFERENCES Kullanicilar(KullaniciId)
    ON DELETE CASCADE
    ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/* 12) GirisGecmisi */
CREATE TABLE GirisGecmisi (
  GirisId      BIGINT AUTO_INCREMENT PRIMARY KEY,
  KullaniciId  INT NOT NULL,
  GirisZamani  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CihazBilgisi VARCHAR(200) NULL,

  INDEX IX_Giris_Kullanici (KullaniciId),
  INDEX IX_Giris_Zaman (GirisZamani),

  CONSTRAINT FK_GirisGecmisi_Kullanici
    FOREIGN KEY (KullaniciId)
    REFERENCES Kullanicilar(KullaniciId)
    ON DELETE CASCADE
    ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/* 13) KapiAktivasyonGecmisi */
CREATE TABLE KapiAktivasyonGecmisi (
  AktivasyonId     BIGINT AUTO_INCREMENT PRIMARY KEY,
  MamaKabiId       INT NOT NULL,
  KullaniciId      INT NULL,
  AktivasyonZamani DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  INDEX IX_Aktivasyon_MamaKabi (MamaKabiId),
  INDEX IX_Aktivasyon_Kullanici (KullaniciId),
  INDEX IX_Aktivasyon_Zaman (AktivasyonZamani),

  CONSTRAINT FK_Aktivasyon_MamaKabi
    FOREIGN KEY (MamaKabiId)
    REFERENCES MamaKaplari(MamaKabiId)
    ON DELETE CASCADE
    ON UPDATE RESTRICT,

  CONSTRAINT FK_Aktivasyon_Kullanici
    FOREIGN KEY (KullaniciId)
    REFERENCES Kullanicilar(KullaniciId)
    ON DELETE CASCADE
    ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
