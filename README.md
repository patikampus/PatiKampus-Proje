## Sistem Mimarisi ve Akış Şeması
Bu proje, geri beslemeli bir porsiyonlama algoritması ve IoT tabanlı anlık veri takibi kullanmaktadır. Sistemin teknik akış diyagramı aşağıdadır:

```mermaid
flowchart TD
    %% Başlangıç Noktası
    Start((Başlangıç)) --> Trigger{"Tetikleyici<br/>Kaynak?"}

    %% Tetikleme Kontrolü
    Trigger -- Zamanlayıcı --> TankCheck
    Trigger -- Gönüllü QR --> Auth[Firebase QR Doğrulama]

    %% Yetkilendirme
    Auth -- Geçersiz --> AccessDenied[Erişim Reddedildi] --> Stop((Bitiş))
    Auth -- Geçerli --> Unlock[Servo Kilit Aç / İzin Ver] --> TankCheck

    %% Ana Depo Kontrolü (Ultrasonik)
    TankCheck[Ultrasonik Sensör:<br/>Ana Depo Kontrolü] --> IsEmpty{Depo Boş mu?}
    IsEmpty -- Evet --> AlertEmpty[HATA: Depo Boş Bildirimi] --> Stop
    IsEmpty -- Hayır --> MotorAction[Step Motor:<br/>180 Derece Dönüş]

    %% Porsiyonlama ve Geri Besleme (Yük Hücresi)
    MotorAction --> SensorRead[Yük Hücresi:<br/>Ağırlık Okuma]
    SensorRead --> CheckFlow{"Akış Var mı?<br/>(Ağırlık Artışı)"}

    %% Blokaj Kontrolü
    CheckFlow -- Hayır --> AlertBlock[HATA: Sıkışma/Blokaj] --> NotifyAdmin[Admin Bildirim] --> Stop

    %% Yabancı Cisim ve Miktar Kontrolü
    CheckFlow -- Evet --> CheckWeight{Ağırlık Analizi}
    
    CheckWeight -- "> 90 gr" --> AlertSabotage[HATA: Yabancı Cisim/Sabotaj] --> NotifyAdmin
    CheckWeight -- "< 70 gr" --> MotorActionLoop[Döngü: Motoru Tekrar Tetikle] --> MotorAction
    CheckWeight -- "~ 70 gr" --> Success[BAŞARILI: Porsiyon Tamam]

    %% Veritabanı İşlemleri (Firebase)
    Success --> LogDB[(Firebase:<br/>IslemGecmisi Tablosu)]
    LogDB --> UpdateStock[(Firebase:<br/>MamaKaplari Stok Güncelle)]
    UpdateStock --> Stop
