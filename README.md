### Proje Akış Şeması ve Sistem Mimarisi 

Bu proje, geri beslemeli bir porsiyonlama algoritması ve IoT tabanlı anlık veri takibi kullanmaktadır. Sistemin teknik akış diyagramı aşağıdadır:

```mermaid
flowchart TD
    Start((Başlangıç)) --> Trigger{"Tetikleme<br/>Tipi?"}

    Trigger -- Gönüllü QR --> SQL_Auth[MS SQL: SELECT Query<br/>Gönüllü Doğrulama]
    SQL_Auth --> IsValid{Kayıt Var mı?}
    IsValid -- Hayır --> AccessDenied[Erişim Reddedildi] --> Stop((Bitiş))
    IsValid -- Evet --> Unlock[Servo Kilidi Aç] --> TankCheck

    Trigger -- Zamanlayıcı --> TankCheck[Ultrasonik Sensör:<br/>Depo Seviye Kontrolü]

    TankCheck --> IsEmpty{Depo Boş mu?}
    IsEmpty -- Evet --> SQL_Error[MS SQL: INSERT INTO Logs] --> Stop
    IsEmpty -- Hayır --> MotorAction[Step Motor:<br/>Dönüşü Başlat]

    MotorAction --> SensorRead[Yük Hücresi:<br/>Veri Okuma]
    SensorRead --> CheckFlow{"Ağırlık Artışı<br/>Var mı?"}

    CheckFlow -- Hayır --> SQL_Block[MS SQL: INSERT INTO Errors] --> Stop
    
    CheckFlow -- Evet --> CheckWeight{Ağırlık Analizi}
    CheckWeight -- "> 90 gr" --> SQL_Sabotage[MS SQL: INSERT INTO Errors] --> Stop
    CheckWeight -- "< 70 gr" --> MotorActionLoop[Döngü: Tekrarla] --> MotorAction

    CheckWeight -- "70 - 90 gr" --> Success[Porsiyon Başarılı]
    
    Success --> SQL_Trans[MS SQL: TRANSACTION BAŞLAT]
    SQL_Trans --> SQL_Log[INSERT INTO IslemGecmisi]
    SQL_Log --> SQL_Stock[UPDATE CihazStok]
    SQL_Stock --> SQL_Commit[TRANSACTION COMMIT]
    SQL_Commit --> Stop
