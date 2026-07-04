# 🚗 Ehliyet Kankam UK

**İngiltere ehliyet teori sınavına (DVSA Theory Test) Türkçe destekli, animasyonlu hazırlık uygulaması.**

Ticari değildir — kişisel çalışma için hazırlanmıştır. ❤️

## Özellikler

- 🎬 **Animasyonlu Dersler** — Çizgi film tarzı SVG animasyonlarla konu anlatımı. Otomatik oynatma ve sesli anlatım (Türkçe + İngilizce, tarayıcının konuşma sentezi ile).
- ❓ **Quiz Modu** — Soruyu yanlış yaptığında animasyon devreye girer: sahne canlanır, doğru cevabı *"İngilizce şöyle diyor → Türkçesi şu"* diye çift dilli açıklar, mantığını ve ezber kodunu gösterir.
- 🃏 **Kart Modu** — 100 hızlı ezber kartı; çevir, bildim/bilemedim diye işaretle.
- 📝 **Deneme Sınavı** — Gerçek DVSA formatı: 50 soru, 57 dakika, geçme notu 43. Sonunda yanlışlarını animasyonla tek tek görebilirsin.
- 🚸 **Trafik Levhaları** — Highway Code işaretleri (SVG çizim) Türkçe + İngilizce isimleriyle, ayrıca levha quizi. Levha soruları ana quiz ve deneme sınavına da karışır.
- 🔁 **Yanlışlarım** — Yanlış yaptığın sorular hatırlanır; bu modda sadece onları animasyonla tekrar çalışırsın.
- 📖 **Sözlük** — ~90 sınav teriminin İngilizce → Türkçe karşılığı; arama kutusu ve sesli telaffuz.
- 📊 Quiz ekranında **konu bazlı başarı yüzdesi** — hangi konuya çalışman gerektiğini gösterir.
- 🗓️ **Sınav Günü Rehberi** — Sınav formatı, hazard perception bölümü ve taktikler; Türkçe + İngilizce, sesli dinlenebilir.
- 🇹🇷/🇬🇧 Arayüz dili tek tuşla değişir; soruları **İngilizce**, **Türkçe** veya **ikisi birden** görebilirsin (gerçek sınav İngilizce olduğu için "ikisi" önerilir).
- 📈 İlerleme telefonda saklanır (localStorage) — hesap gerekmez.
- 📱 **PWA**: iPhone, Android ve bilgisayarda çalışır; internet olmadan da açılır.

## Nasıl kullanılır?

### Telefonda (iPhone / Android)
1. Uygulamanın web adresini tarayıcıda aç (aşağıda GitHub Pages kurulumu var).
2. **iPhone (Safari):** Paylaş düğmesi → **Ana Ekrana Ekle**.
3. **Android (Chrome):** Menü (⋮) → **Ana ekrana ekle / Uygulamayı yükle**.
4. Artık ana ekranda uygulama gibi açılır, çevrimdışı da çalışır.

### Bilgisayarda
`index.html` dosyasını tarayıcıda açman yeterli — kurulum gerekmez.

### GitHub Pages ile yayınlama (ücretsiz adres almak için)
1. GitHub'da repo sayfası → **Settings** → **Pages**.
2. "Source" olarak **Deploy from a branch** seç; branch olarak `main` (veya bu branch) ve `/ (root)` seç, kaydet.
3. Birkaç dakika sonra `https://<kullanıcı-adın>.github.io/<repo-adı>/` adresinde yayında olur. Bu adresi telefonda açıp ana ekrana ekle.

## Sesli anlatım hakkında

Sesli anlatım tarayıcının kendi **speechSynthesis** özelliğini kullanır (ücretsiz, internetsiz).
Telefonda Türkçe/İngilizce ses yoksa: Ayarlar → Erişilebilirlik → Seslendirme bölümünden dil sesi indirebilirsin.

## İçerik kaynağı

Soru bankası; "Driving Theory Top 100", "100 Quick Cards" çalışma notlarından ve
Highway Code trafik işaretleri özetinden derlenmiştir. Gerçek sınav soru havuzu
daha geniştir — resmi DVSA kaynaklarıyla birlikte çalışman önerilir.

## Teknik

Saf HTML + CSS + JavaScript. Derleme yok, bağımlılık yok, sunucu yok.
Animasyonlar SVG + CSS keyframe'leriyle yapılır. Service worker ile çevrimdışı destek.

| Dosya | Görev |
|---|---|
| `index.html` | Uygulama kabuğu |
| `js/questions.js` | 100 soruluk çift dilli soru bankası |
| `js/content.js` | Trafik levhaları (SVG), dersler, arayüz metinleri |
| `js/scenes.js` | Çizgi film animasyon sahneleri |
| `js/app.js` | Uygulama mantığı (quiz, sınav, kartlar, dersler) |
| `css/style.css` | Tasarım + animasyon keyframe'leri |
| `sw.js`, `manifest.webmanifest` | PWA (çevrimdışı + telefona kurulum) |
