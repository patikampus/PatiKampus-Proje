### Proje Akış Şeması ve Sistem Mimarisi 

Bu proje, geri beslemeli bir porsiyonlama algoritması ve IoT tabanlı anlık veri takibi kullanmaktadır. Sistemin teknik akış diyagramı aşağıdadır:

```mermaid
flowchart TD
    %% Başlangıç Noktası
    Start((Başlangıç)) --> Trigger{"Tetikleyici<br/>Kaynak?"}

    %% Tetikleme Kontrolü
    Trigger -- Zamanlayıcı --> TankCheck
    Trigger -- Gönüllü QR --> Auth[SQL Server:<br/>QR & Yetki Sorgusu]

    %% Yetkilendirme
    Auth -- Kayıt Bulunamadı --> AccessDenied[Erişim Reddedildi] --> Stop((Bitiş))
    Auth -- Yetki Onaylandı --> Unlock[Servo Kilit Aç / İzin Ver] --> TankCheck

    %% Ana Depo Kontrolü (Ultrasonik)
    TankCheck[Ultrasonik Sensör:<br/>Ana Depo Kontrolü] --> IsEmpty{Depo Boş mu?}
    IsEmpty -- Evet --> AlertEmpty[HATA: SQL Log & Bildirim] --> Stop
    IsEmpty -- Hayır --> MotorAction[Step Motor:<br/>180 Derece Dönüş]

    %% Porsiyonlama ve Geri Besleme (Yük Hücresi)
    MotorAction --> SensorRead[Yük Hücresi:<br/>Ağırlık Okuma]
    SensorRead --> CheckFlow{"Akış Var mı?<br/>(Ağırlık Artışı)"}

    %% Blokaj Kontrolü
    CheckFlow -- Hayır --> AlertBlock[HATA: Sıkışma/Blokaj] --> NotifyAdmin[Admin Bildirim & Log] --> Stop

    %% Yabancı Cisim ve Miktar Kontrolü
    CheckFlow -- Evet --> CheckWeight{Ağırlık Analizi}
    
    CheckWeight -- "> 90 gr" --> AlertSabotage[HATA: Yabancı Cisim/Sabotaj] --> NotifyAdmin
    CheckWeight -- "< 70 gr" --> MotorActionLoop[Döngü: Motoru Tekrar Tetikle] --> MotorAction
    CheckWeight -- "~ 70 gr" --> Success[BAŞARILI: Porsiyon Tamam]

    %% Veritabanı İşlemleri (MS SQL)
    Success --> SQL_Insert[(MS SQL:<br/>Insert Into IslemLog)]
    SQL_Insert --> SQL_Update[(MS SQL:<br/>Update Stok_Tablosu)]
    SQL_Update --> Stop
