/*  1) ROLLER  */
CREATE TABLE Roller (
    RolId          INT IDENTITY(1,1) PRIMARY KEY,
    RolAdi         NVARCHAR(50)   NOT NULL UNIQUE,   
    MinSkor        INT            NOT NULL,
    MaxSkor        INT            NOT NULL
);


/* 2) KULLANICILAR */
CREATE TABLE Kullanicilar (
    KullaniciId        INT IDENTITY(1,1) PRIMARY KEY,
    AdSoyad            NVARCHAR(100)   NOT NULL,
    Email              NVARCHAR(255)   NOT NULL UNIQUE,
    SifreHash          NVARCHAR(255)   NOT NULL,
    KayitTarihi        DATETIME2(0)    NOT NULL DEFAULT SYSDATETIME(),
    SonGirisZamani     DATETIME2(0)    NULL,
    AktifMi            BIT             NOT NULL DEFAULT 1,
    RolId              INT             NULL,
    CONSTRAINT FK_Kullanici_Rol FOREIGN KEY (RolId)
        REFERENCES Roller(RolId)
);

/* 3) ADMİNLER  */
CREATE TABLE Adminler (
    AdminId            INT IDENTITY(1,1) PRIMARY KEY,
    KullaniciId        INT NOT NULL UNIQUE,
    OlusturmaTarihi    DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_Admin_Kullanici FOREIGN KEY (KullaniciId)
        REFERENCES Kullanicilar(KullaniciId)
);

/* 4) mamakapları  */

CREATE TABLE MamaKaplari (
    MamaKabiId          INT IDENTITY(1,1) PRIMARY KEY,
    KapAdi              NVARCHAR(100)  NULL,
    KonumAciklama       NVARCHAR(255)  NULL,     
    Konum               NVARCHAR(255)   NULL,     
    AktifMi             BIT            NOT NULL DEFAULT 1,
    AktifEdilmeZamani   DATETIME2(0)   NULL,     
    OlusturmaTarihi     DATETIME2(0)   NOT NULL DEFAULT SYSDATETIME()
);



/*  5) QR KODLARI */
CREATE TABLE QRKodlari (
    QRId               INT IDENTITY(1,1) PRIMARY KEY,
    MamaKabiId         INT             NOT NULL,
    GirisyapanKullaniciId        INT           NULL,
    OlusturmaTarihi    DATETIME2(0)    NOT NULL DEFAULT SYSDATETIME(),
    AktifMi            BIT             NOT NULL DEFAULT 1,
    CONSTRAINT FK_QR_MamaKabi FOREIGN KEY (MamaKabiId)
        REFERENCES MamaKaplari(MamaKabiId),
    CONSTRAINT FK_QR_Kullanici FOREIGN KEY (GirisyapanKullaniciId)
        REFERENCES Kullanicilar(KullaniciId)
);


/*  6) SENSÖR VERİLERİ  */
CREATE TABLE SensorVerileri (
    SensorId             BIGINT IDENTITY(1,1) PRIMARY KEY,
    MamaKabiId           INT             NOT NULL,
    OlcumZamani          DATETIME2(0)    NOT NULL DEFAULT SYSDATETIME(),
    Agirlik              DECIMAL(6,2)    NULL,
    Yukseklik          DECIMAL(6,2)    NULL,
    SonMamaEklemeZamani  DATETIME2(0)    NULL,
    KapAktifMi           BIT             NULL,
    Konum                NVARCHAR(255)   NULL,      
    CONSTRAINT FK_Sensor_MamaKabi FOREIGN KEY (MamaKabiId)
        REFERENCES MamaKaplari(MamaKabiId)
);


/*  7) MAMA EKLEME KAYITLARI */
CREATE TABLE MamaEklemeKayitlari (
    KayitId             BIGINT IDENTITY(1,1) PRIMARY KEY,
    MamaKabiId          INT             NOT NULL,
    KullaniciId         INT             NULL,  
    EklenenMiktarKg     DECIMAL(6,2)    NULL,
    EklemeZamani        DATETIME2(0)    NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_MamaEkleme_MamaKabi FOREIGN KEY (MamaKabiId)
        REFERENCES MamaKaplari(MamaKabiId),
    CONSTRAINT FK_MamaEkleme_Kullanici FOREIGN KEY (KullaniciId)
        REFERENCES Kullanicilar(KullaniciId)
);

/* 8) KULLANICI SKORLARI */
CREATE TABLE KullaniciSkorlari (
    KullaniciId         INT PRIMARY KEY,
    ToplamEklemeSayisi  INT           NOT NULL DEFAULT 0,
    ToplamMama        DECIMAL(10,2) NOT NULL DEFAULT 0,
    Skor                INT           NOT NULL DEFAULT 0,
    SonGuncelleme       DATETIME2(0)  NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_Skor_Kullanici FOREIGN KEY (KullaniciId)
        REFERENCES Kullanicilar(KullaniciId)
);


/*  9) ŞİFRE SIFIRLAMA (Zorunlu Değil Size kalmış) */
CREATE TABLE SifreSifirlama (
    SifirlamaId         UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    KullaniciId         INT             NOT NULL,
    Token               NVARCHAR(255)   NOT NULL UNIQUE,
    GecerlilikZamani    DATETIME2(0)    NOT NULL,
    KullanildiMi        BIT             NOT NULL DEFAULT 0,
    OlusturmaZamani     DATETIME2(0)    NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_SifreSifirlama_Kullanici FOREIGN KEY (KullaniciId)
        REFERENCES Kullanicilar(KullaniciId)
);


/* 10) GİRİŞ GEÇMİŞİ */
CREATE TABLE GirisGecmisi (
    GirisId             BIGINT IDENTITY(1,1) PRIMARY KEY,
    KullaniciId         INT             NOT NULL,
    GirisZamani         DATETIME2(0)    NOT NULL DEFAULT SYSDATETIME(),
    CihazBilgisi        NVARCHAR(200)   NULL,
    CONSTRAINT FK_GirisGecmisi_Kullanici FOREIGN KEY (KullaniciId)
        REFERENCES Kullanicilar(KullaniciId)
);


/* 11) KAP AKTİVASYON GEÇMİŞİ */
CREATE TABLE KapiAktivasyonGecmisi (
    AktivasyonId        BIGINT IDENTITY(1,1) PRIMARY KEY,
    MamaKabiId          INT             NOT NULL,
    KullaniciId         INT             NULL,
    AktivasyonZamani    DATETIME2(0)    NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_Aktivasyon_MamaKabi FOREIGN KEY (MamaKabiId)
        REFERENCES MamaKaplari(MamaKabiId),
    CONSTRAINT FK_Aktivasyon_Kullanici FOREIGN KEY (KullaniciId)
        REFERENCES Kullanicilar(KullaniciId)
);
