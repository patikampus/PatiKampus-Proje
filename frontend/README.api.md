# Frontend'de Bağlanan API'ler

Bu projede React frontend ile backend arasında Axios üzerinden bağlanan başlıca API endpointleri ve işlevleri aşağıda listelenmiştir.

## Kullanıcı Yönetimi (UserManagement)
- **GET /api/kullanicilar** : Tüm kullanıcıları getirir (admin yetkisi gerekir)
- **GET /api/kullanicilar/ara?q=...** : Kullanıcı arama (ad/email)
- **POST /api/kullanicilar** : Yeni kullanıcı oluşturur
- **PUT /api/kullanicilar/:id** : Kullanıcı günceller
- **DELETE /api/kullanicilar/:id** : Kullanıcı siler
- **GET /api/roller** : Roller listesini getirir (rol atama için)
- **GET /api/kullanicilar/liderlik** : Liderlik tablosu (isteğe bağlı)

## Cihaz Yönetimi (DevicePanel)
- **GET /api/mama-kaplari** : Tüm mama kaplarını (cihazları) getirir
- **GET /api/sensor-verileri/mama-kabi/:mamaKabiId/son** : Seçili mama kabının en son sensör verisi
- **GET /api/sensor-verileri/mama-kabi/:mamaKabiId** : Seçili mama kabının tüm sensör verileri (log akışı)

## İnceleme & Onay Merkezi (Review)
- **GET /api/mama-eklemeleri** : Bekleyen fotoğraf onay taleplerini getirir
- **PUT /api/mama-eklemeleri/fotograflar/:fotoId/onayla** : Fotoğrafı onaylar
- **PUT /api/mama-eklemeleri/fotograflar/:fotoId/red** : Fotoğrafı reddeder
- **GET /api/anomaliler** : Geri bildirim/anomali akışını getirir

## Genel Notlar
- Tüm istekler Axios ile `/src/api/` klasöründeki fonksiyonlar üzerinden yapılır.
- Admin yetkisi gerektiren endpointlerde JWT access token gereklidir.
- API base URL: `http://localhost:3000/api` (gerekirse değiştirin)

Her sayfa ilgili API fonksiyonlarını kendi içinde import ederek kullanır. Daha fazla detay için ilgili dosyaları inceleyebilirsiniz.
