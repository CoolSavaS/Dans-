/* =====================================================================
   UK Driving Theory — Türkçe/English Soru Bankası
   Kaynak: Driving Theory Top 100 + 100 Quick Cards (kişisel çalışma
   notları). Ticari olmayan, kişisel eğitim amaçlı kullanım içindir.
   ===================================================================== */

const CATS = {
  weather:  { tr: "Hava & Yol Koşulları",  en: "Weather & Road",          icon: "🌧️" },
  ped:      { tr: "Yayalar & Geçitler",    en: "Pedestrians & Crossings", icon: "🚸" },
  junction: { tr: "Kavşaklar & Işıklar",   en: "Junctions & Lights",      icon: "🚦" },
  motorway: { tr: "Otoyol",                en: "Motorway",                icon: "🛣️" },
  vehicle:  { tr: "Araç & Bakım",          en: "Vehicle & Maintenance",   icon: "🔧" },
  driver:   { tr: "Sürücü Güvenliği",      en: "Driver Safety",           icon: "🧠" },
  rules:    { tr: "Kurallar & Park",       en: "Rules & Parking",         icon: "📏" },
};

/* Soru tipine göre genel çeldirici havuzları (yanlış şıklar) */
const POOL_DO = [
  { en: "Brake as hard as possible",            tr: "Olabildiğince sert fren yap" },
  { en: "Accelerate to get past quickly",       tr: "Hızlanıp çabucak geç" },
  { en: "Sound your horn and continue",         tr: "Kornaya basıp devam et" },
  { en: "Flash your headlights and keep going", tr: "Selektör yapıp yoluna devam et" },
  { en: "Continue at the same speed",           tr: "Aynı hızda devam et" },
  { en: "Steer sharply to correct it",          tr: "Direksiyonu sert çevir" },
  { en: "Stop suddenly where you are",          tr: "Olduğun yerde aniden dur" },
  { en: "Ignore it and carry on",               tr: "Önemsemeden yola devam et" },
  { en: "Put the gear in neutral and coast",    tr: "Vitesi boşa alıp aracı kaymaya bırak" },
  { en: "Wait for other drivers to react",      tr: "Diğer sürücülerin önlem almasını bekle" },
];

const POOL_WHY = [
  { en: "It saves fuel",                          tr: "Yakıt tasarrufu sağlar" },
  { en: "Your tyres warm up faster",              tr: "Lastikler daha çabuk ısınır" },
  { en: "It keeps the engine cooler",             tr: "Motoru daha serin tutar" },
  { en: "Braking becomes more effective",         tr: "Fren daha etkili hâle gelir" },
  { en: "Visibility improves at higher speeds",   tr: "Hızlıyken görüş artar" },
  { en: "Other drivers expect you to speed up",   tr: "Diğer sürücüler hızlanmanı bekler" },
  { en: "It is only a recommendation",            tr: "Sadece bir tavsiyedir" },
  { en: "The road surface grips better",          tr: "Yol yüzeyi daha iyi tutar" },
];

const POOL_WHEN = [
  { en: "Only at night",                tr: "Sadece geceleri" },
  { en: "Whenever you are in a hurry",  tr: "Acelen olduğunda" },
  { en: "Only on motorways",            tr: "Sadece otoyollarda" },
  { en: "At any time you choose",       tr: "İstediğin herhangi bir zamanda" },
  { en: "Never",                        tr: "Hiçbir zaman" },
  { en: "Only in the daytime",          tr: "Sadece gündüzleri" },
];

/* ---------------------------------------------------------------------
   Q(id, cat, scene, type, ezber,
     soru EN, soru TR, cevap EN, cevap TR, mantık TR, mantık EN, [özel yanlışlar])
   --------------------------------------------------------------------- */
const QUESTIONS = [];
function Q(id, cat, scene, type, ezber, qen, qtr, aen, atr, ltr, len, w) {
  QUESTIONS.push({ id, cat, scene, type, ezber, q: { en: qen, tr: qtr }, a: { en: aen, tr: atr }, logic: { tr: ltr, en: len }, w: w || null });
}

/* ============ HAVA & YOL KOŞULLARI / WEATHER & ROAD ============ */
Q("skid_brake", "weather", "skid", "do", "Skid + brake = brake off",
  "What should you do if your car skids while braking?",
  "Fren yaparken araç kayarsa ne yapmalısın?",
  "Ease off the brakes", "Freni bırak",
  "Kilitli tekerlek yön değiştiremez.", "A locked wheel cannot change direction.");

Q("skid_gas", "weather", "skid", "do", "Skid + gas = gas off",
  "What should you do if your vehicle skids while accelerating?",
  "Hızlanırken araç kayarsa ne yapmalısın?",
  "Ease off the accelerator", "Gazdan ayağını çek",
  "Güç azalınca lastik tutuşu geri gelir.", "When power drops, grip returns.");

Q("skid_steer", "weather", "skid", "do", "Skid = gentle steering",
  "How should you steer if your car skids?",
  "Araç kayarken direksiyon nasıl kullanılmalı?",
  "Steer gently", "Direksiyonu yumuşak kullan",
  "Ani direksiyon kaymayı artırır.", "Sudden steering makes the skid worse.");

Q("wet_road", "weather", "rain", "why", "Wet = long stop",
  "Why should you slow down on wet roads?",
  "Islak yolda neden yavaşlamalısın?",
  "Stopping distances are longer", "Durma mesafesi uzar",
  "Islak yol lastik tutuşunu azaltır.", "A wet road reduces tyre grip.");

Q("ice_grip", "weather", "ice", "why", "Ice = no grip",
  "Why is driving on ice dangerous?",
  "Buzda sürüş neden tehlikelidir?",
  "Tyres lose grip", "Lastikler tutunmayı kaybeder",
  "Buzda yol tutuşu yok denecek kadar azdır.", "On ice there is almost no grip at all.");

Q("fog_slow", "weather", "fog", "why", "Fog = can't see",
  "Why should you slow down in fog?",
  "Sisli havada neden yavaşlamalısın?",
  "Visibility is reduced", "Görüş azalır",
  "Görmediğin yerde hızlı gidilmez.", "You can't drive fast into what you can't see.");

Q("fog_speed", "weather", "fog", "do", "Fog = slow",
  "How should you adjust your speed in fog?",
  "Sisli havada hızını nasıl ayarlamalısın?",
  "Reduce speed", "Hızını düşür",
  "Görüş mesafen durma mesafenden kısa olmamalı.", "Never drive faster than you can see to stop.");

Q("fog_lights", "weather", "fog", "fact", "Fog < 100 m",
  "When should you use rear fog lights?",
  "Arka sis lambaları ne zaman kullanılır?",
  "When visibility is less than 100 metres", "Görüş 100 metreden azsa",
  "100 metre kuralı — daha iyi görüşte kullanmak arkadakini kamaştırır.",
  "The 100-metre rule — using them in better visibility dazzles drivers behind.",
  [{ en: "When visibility is less than 500 metres", tr: "Görüş 500 metreden azsa" },
   { en: "Whenever it is cloudy",                   tr: "Hava bulutlu olduğunda" },
   { en: "Only after sunset",                       tr: "Sadece gün battıktan sonra" }]);

Q("fog_which", "weather", "fog", "fact", "Fog = dipped",
  "Which lights should you use in fog?",
  "Sisli havada hangi ışıklar kullanılmalı?",
  "Dipped headlights (fog lights if very dense)", "Kısa farlar (çok yoğunsa sis lambası)",
  "Uzun far siste ışığı geri yansıtır, daha kötü gösterir.",
  "Full beam reflects back off fog and makes it worse.",
  [{ en: "Full beam headlights", tr: "Uzun farlar" },
   { en: "Hazard warning lights while moving", tr: "Seyir hâlinde dörtlü ikaz lambaları" },
   { en: "No lights, to avoid reflection", tr: "Yansıma olmasın diye hiç ışık yakma" }]);

Q("wet_brake_early", "weather", "rain", "why", "Wet = long stop",
  "Why should you brake earlier on wet roads?",
  "Islak yolda neden daha erken fren yapmalısın?",
  "Stopping distances are longer", "Durma mesafesi uzar",
  "Islakta durma mesafesi en az iki katına çıkar.", "In the wet, stopping distance at least doubles.");

Q("ice_steer", "weather", "ice", "do", "Ice = gentle",
  "How should you steer on icy roads?",
  "Buzlu yollarda direksiyon nasıl kullanılmalı?",
  "Steer gently", "Direksiyonu yumuşak kullan",
  "Buzda her ani hareket kayma başlatır.", "On ice, any sudden movement starts a skid.");

Q("snow_gas", "weather", "ice", "do", "Snow = slow gas",
  "What should you do when accelerating on snow?",
  "Karda hızlanırken ne yapmalısın?",
  "Accelerate gently", "Yavaşça hızlan",
  "Ani gaz tekerleği boşa döndürür.", "Sudden power just spins the wheels.");

Q("wet_leaves", "weather", "country", "why", "Wet leaves = ice",
  "Why are wet leaves dangerous?",
  "Islak yapraklar neden tehlikelidir?",
  "They are very slippery", "Çok kaygandır",
  "Islak yaprak buz gibi kaydırır.", "Wet leaves can be as slippery as ice.");

Q("wet_metal", "weather", "rain", "why", "Wet metal = ice",
  "Why should you avoid braking on wet metal covers?",
  "Islak metal kapaklar üzerinde neden fren yapmamalısın?",
  "They are slippery", "Kaygandır",
  "Islak metal üzerinde lastik tutmaz.", "Tyres barely grip on wet metal.");

Q("aquaplane", "weather", "rain", "do", "No brake — ease off accelerator",
  "What should you do if aquaplaning occurs?",
  "Aquaplaning (su üzerinde kayma) olursa ne yapmalısın?",
  "Ease off the accelerator", "Gazdan ayağını çek",
  "Gaz kesilince lastikler yeniden yol tutmaya başlar.", "As power drops the tyres regain contact with the road.");

Q("rain_limit", "weather", "rain", "do", "Limit ≠ safe",
  "Should you drive at the speed limit in heavy rain?",
  "Şiddetli yağmurda hız sınırında mı gitmelisin?",
  "No, you should slow down", "Hayır, yavaşlamalısın",
  "Hız sınırı güvenli hız demek değildir.", "The limit is not the same as a safe speed.",
  [{ en: "Yes, the limit is always safe",          tr: "Evet, sınır her zaman güvenlidir" },
   { en: "Yes, if your tyres are new",             tr: "Evet, lastiklerin yeniyse" },
   { en: "You should drive faster to pass the rain", tr: "Yağmurdan çıkmak için hızlanmalısın" }]);

Q("weather_limit", "weather", "rain", "fact", "Limit same, speed lower",
  "Does bad weather change speed limits?",
  "Kötü hava hız sınırını değiştirir mi?",
  "No, but you should drive slower", "Hayır ama daha yavaş gitmelisin",
  "Sınır aynı kalır; güvenli hız düşer.", "The limit stays the same; the safe speed drops.",
  [{ en: "Yes, all limits drop by 10 mph",  tr: "Evet, tüm sınırlar 10 mph düşer" },
   { en: "Yes, limits are halved",          tr: "Evet, sınırlar yarıya iner" },
   { en: "No, and your speed shouldn't change either", tr: "Hayır, hızın da değişmemeli" }]);

Q("follow_wet", "weather", "distance", "do", "Wet = double distance",
  "How should you change your following distance in wet weather?",
  "Islak havada takip mesafesini nasıl ayarlamalısın?",
  "Increase it", "Artırmalısın",
  "Islakta durmak daha uzun sürer — en az 4 saniye bırak.", "Stopping takes longer in the wet — leave at least 4 seconds.");

Q("follow_ice", "weather", "distance", "do", "Ice = 10×",
  "How should you change your following distance on ice?",
  "Buzda takip mesafesini nasıl ayarlamalısın?",
  "Increase it significantly", "Çok daha fazla artırmalısın",
  "Buzda durma mesafesi 10 katına çıkabilir.", "On ice, stopping distance can be 10 times longer.");

Q("winds", "weather", "country", "do", "Wind = firm grip",
  "What should you do in strong crosswinds?",
  "Kuvvetli rüzgârda ne yapmalısın?",
  "Keep a firm grip on the steering wheel", "Direksiyonu sıkı tut",
  "Araç aniden savrulabilir.", "The vehicle can be blown off course suddenly.");

Q("high_sided", "weather", "country", "why", "High vehicle = wind",
  "Why should you take extra care in a high-sided vehicle in strong winds?",
  "Kuvvetli rüzgârda yüksek araç kullanırken neden ekstra dikkat etmelisin?",
  "It is more affected by the wind", "Rüzgârdan daha çok etkilenir",
  "Yüksek yan yüzey yelken gibi rüzgâr tutar.", "A tall side catches the wind like a sail.");

Q("glare", "weather", "night", "do", "Glare = slow",
  "What should you do when glare or reflections affect your vision?",
  "Işık yansıması (parlama) görüşünü etkilerse ne yapmalısın?",
  "Slow down", "Yavaşla",
  "Gözler parlamaya geç adapte olur.", "Eyes adapt slowly after glare.");

Q("low_sun", "weather", "night", "do", "Low sun = visor",
  "What should you do when the low sun dazzles you?",
  "Alçak güneş gözünü alırsa ne yapmalısın?",
  "Slow down and use the sun visor", "Yavaşla ve güneşliği kullan",
  "Görüş geçici olarak kaybolur.", "Your vision is temporarily lost.");

/* ============ YAYALAR & GEÇİTLER / PEDESTRIANS & CROSSINGS ============ */
Q("zebra", "ped", "zebra", "do", "Zebra = stop ready",
  "What should you do when people are waiting at a zebra crossing?",
  "Zebra geçidinde bekleyen yayalar varsa ne yapmalısın?",
  "Be prepared to stop", "Durmaya hazır ol",
  "Zebra geçidinde yaya önceliklidir.", "Pedestrians have priority at a zebra crossing.");

Q("pelican_red", "ped", "pelican", "do", "Pelican red = STOP",
  "What must you do at a red light at a pelican crossing?",
  "Pelikan geçidinde kırmızı ışıkta ne yapmalısın?",
  "Stop behind the line", "Çizginin arkasında dur",
  "Kırmızı ışık kesin dur demektir.", "A red light means you must stop.");

Q("pelican_amber", "ped", "pelican", "fact", "Flashing amber = give way",
  "What does a flashing amber light mean at a pelican crossing?",
  "Pelikan geçidinde yanıp sönen sarı ışık ne anlama gelir?",
  "Give way to pedestrians on the crossing", "Geçitteki yayalara yol ver",
  "Geçit boşsa dikkatlice geçebilirsin.", "If the crossing is clear you may proceed with care.",
  [{ en: "Stop and wait for green",        tr: "Dur ve yeşili bekle" },
   { en: "Speed up before it turns red",   tr: "Kırmızıya dönmeden hızlan" },
   { en: "The lights are out of order",    tr: "Işıklar arızalıdır" }]);

Q("patrol", "ped", "patrol", "do", "Lollipop = MUST stop",
  "What should you do when a school crossing patrol shows a STOP sign?",
  "Okul geçidi görevlisi STOP tabelası tuttuğunda ne yapmalısın?",
  "Stop until the sign is lowered", "Tabela inene kadar dur",
  "Yasal zorunluluktur — görevli tabelayı indirene kadar bekle.", "It's a legal requirement — wait until the sign is lowered.");

Q("parked_veh", "ped", "parked", "why", "Parked = someone steps out",
  "Why should you slow down near parked vehicles?",
  "Park etmiş araçların yanında neden yavaşlamalısın?",
  "Pedestrians may step into the road", "Yayalar yola çıkabilir",
  "Kapı açılabilir, biri araçların arasından çıkabilir.", "A door may open, or someone may step out between cars.");

Q("icecream", "ped", "parked", "why", "Ice cream = children",
  "Why should you slow down near an ice cream van?",
  "Dondurma arabasının yanında neden yavaşlamalısın?",
  "Children may run into the road", "Çocuklar yola fırlayabilir",
  "Dondurma arabası = çocuk riski.", "Ice cream van = child risk.");

Q("zebra_school", "ped", "zebra", "why", "School = children",
  "Why should you take extra care at zebra crossings near schools?",
  "Okul yakınındaki zebra geçitlerinde neden ekstra dikkatli olmalısın?",
  "Children may not look properly", "Çocuklar yeterince dikkat etmeyebilir",
  "Çocuklar öngörülemez şekilde hareket eder.", "Children behave unpredictably.");

Q("ped_night", "ped", "night", "why", "Dark clothes",
  "Why are pedestrians harder to see at night?",
  "Yayalar gece neden zor görülür?",
  "They may wear dark clothing", "Koyu renk giysiler giyebilirler",
  "Koyu giysili yaya farların dışında görünmez.", "A pedestrian in dark clothes is invisible outside your beam.");

Q("ped_zone", "ped", "zebra", "fact", "Pedestrian first",
  "Who has priority in pedestrian zones?",
  "Yaya bölgelerinde kim önceliklidir?",
  "Pedestrians", "Yayalar",
  "Yaya bölgesinde araç misafirdir.", "In a pedestrian zone the car is the guest.",
  [{ en: "Cars, because they are faster",   tr: "Arabalar, çünkü daha hızlıdır" },
   { en: "Whoever arrives first",           tr: "Önce gelen" },
   { en: "Delivery vehicles",               tr: "Dağıtım araçları" }]);

Q("elderly", "ped", "zebra", "do", "Elderly = patience",
  "What should you do when elderly pedestrians are crossing slowly?",
  "Yaşlı yayalar yavaş karşıya geçiyorsa ne yapmalısın?",
  "Be patient and give them time", "Sabırlı ol ve zaman tanı",
  "Yavaş hareket ederler; korna ile acele ettirme.", "They move slowly; never hurry them with your horn.");

Q("disabled_ped", "ped", "zebra", "do", "Extra time",
  "What should you do for a disabled pedestrian crossing the road?",
  "Engelli bir yaya karşıya geçerken ne yapmalısın?",
  "Give them extra time", "Ekstra zaman tanı",
  "Hareket kabiliyeti sınırlı olabilir.", "Their mobility may be limited.");

Q("school_bus", "ped", "patrol", "do", "School bus = children",
  "What should you do when a school bus has stopped ahead?",
  "İleride okul otobüsü durmuşsa ne yapmalısın?",
  "Slow down and be ready to stop", "Yavaşla ve durmaya hazır ol",
  "Çocuklar aniden inip yola çıkabilir.", "Children may get off and run across.");

Q("ped_rural", "ped", "country", "why", "No pavement",
  "Why should you watch for pedestrians on rural roads?",
  "Kırsal yollarda neden yayalara dikkat etmelisin?",
  "There may be no pavement", "Kaldırım olmayabilir",
  "Yayalar yolda yürümek zorunda kalabilir.", "Pedestrians may have to walk on the road itself.");

/* ============ KAVŞAKLAR & IŞIKLAR / JUNCTIONS & LIGHTS ============ */
Q("amber", "junction", "lights", "fact", "Amber = prepare to stop",
  "What does a steady amber traffic light mean?",
  "Sabit sarı ışık ne anlama gelir?",
  "Stop, unless it is unsafe to do so", "Güvenliyse dur, durmak tehlikeliyse devam et",
  "Sarıdan sonra kırmızı gelir.", "Amber is followed by red.",
  [{ en: "Speed up before the red light",  tr: "Kırmızıdan önce hızlan" },
   { en: "Go — the lights are changing to green", tr: "Geç — ışık yeşile dönüyor" },
   { en: "Stop only if pedestrians are waiting",  tr: "Sadece yaya bekliyorsa dur" }]);

Q("red_light", "junction", "lights", "do", "Red = stop",
  "What must you do at a red traffic light?",
  "Kırmızı ışıkta ne yapmalısın?",
  "Stop", "Dur",
  "Kırmızı = kesin dur.", "Red means stop. Always.");

Q("green_light", "junction", "lights", "fact", "Green = check",
  "Can you go immediately when the light turns green?",
  "Yeşil yanınca hemen geçebilir misin?",
  "Only if the junction is clear", "Kavşak boşsa",
  "Yeşil 'geç' değil 'kavşak boşsa geç' demektir.", "Green means go only if your exit is clear.",
  [{ en: "Yes, green always means go",     tr: "Evet, yeşil her zaman geç demektir" },
   { en: "No, wait five seconds first",    tr: "Hayır, önce beş saniye bekle" },
   { en: "Only after sounding your horn",  tr: "Sadece korna çaldıktan sonra" }]);

Q("lights_out", "junction", "lights", "do", "No lights = unmarked junction",
  "What should you do if traffic lights are not working?",
  "Trafik ışıkları çalışmıyorsa ne yapmalısın?",
  "Treat it as an unmarked junction", "İşaretsiz kavşak gibi davran",
  "Kimsenin önceliği yoktur; dikkatle ilerle.", "Nobody has priority; proceed with great care.");

Q("roundabout", "junction", "roundabout", "fact", "Right side priority",
  "Who has priority at a roundabout?",
  "Dönel kavşakta kim önceliklidir?",
  "Traffic coming from the right", "Sağdan gelenler",
  "İngiltere'de dönel kavşakta sağdan gelene yol verilir.", "In the UK you give way to traffic from the right.",
  [{ en: "Traffic coming from the left", tr: "Soldan gelenler" },
   { en: "The fastest vehicle",          tr: "En hızlı araç" },
   { en: "Vehicles entering the roundabout", tr: "Kavşağa giren araçlar" }]);

Q("mini_rb", "junction", "roundabout", "do", "Around, not over",
  "How should you drive at a mini-roundabout?",
  "Mini dönel kavşaktan nasıl geçmelisin?",
  "Drive around it, not over it", "Üzerinden değil, etrafından geç",
  "Üzerinden geçmek sadece fiziksel olarak imkânsızsa kabul edilir.", "Drive over it only if physically impossible to avoid.");

Q("giveway", "junction", "junction", "fact", "Slow + ready stop",
  "What does a Give Way sign mean?",
  "'Give Way' (Yol Ver) levhası ne anlama gelir?",
  "Slow down and give priority", "Yavaşla ve yol ver",
  "Öncelik sende değil; gerekirse dur.", "Priority is not yours; stop if necessary.",
  [{ en: "Stop completely every time",  tr: "Her seferinde tamamen dur" },
   { en: "You have priority",           tr: "Öncelik sende" },
   { en: "No entry ahead",              tr: "İleride giriş yasak" }]);

Q("stopsign", "junction", "junction", "do", "Full stop",
  "What must you do at a STOP sign?",
  "STOP levhasında ne yapmalısın?",
  "Stop completely", "Tamamen dur",
  "Yavaşlamak yetmez — tekerlekler tam durmalı.", "Slowing down is not enough — the wheels must fully stop.");

Q("turn_right", "junction", "junction", "do", "Right turn = wait",
  "What should you do when turning right at a junction?",
  "Kavşakta sağa dönerken ne yapmalısın? (İngiltere'de karşı şeridi kesen dönüş)",
  "Wait for a safe gap", "Güvenli bir boşluk bekle",
  "İngiltere'de sağa dönüş karşı trafiği keser.", "In the UK, a right turn crosses oncoming traffic.");

Q("junction_blind", "junction", "junction", "do", "Can't see = slow",
  "What should you do at a junction with poor visibility?",
  "Görüşü zayıf bir kavşakta ne yapmalısın?",
  "Slow down and be ready to stop", "Yavaşla ve durmaya hazır ol",
  "Göremediğin trafik var sayılır.", "Assume there is traffic you cannot see.");

Q("concealed", "junction", "parked", "do", "Concealed = edge slowly",
  "What should you do when emerging from a concealed entrance?",
  "Görüşü kapalı (gizli) bir çıkıştan çıkarken ne yapmalısın?",
  "Edge forward slowly and check", "Yavaşça ilerle ve kontrol et",
  "Santim santim ilerleyerek görüş alanını aç.", "Creep out inch by inch to open up your view.");

Q("level_lights", "junction", "train", "do", "Red flash = STOP",
  "What should you do at a level crossing with flashing red lights?",
  "Kırmızı ışıkları yanıp sönen hemzemin geçitte ne yapmalısın?",
  "Stop and wait", "Dur ve bekle",
  "Tren duramaz — sen durursun.", "The train cannot stop — you must.");

Q("level_barrier", "junction", "train", "fact", "Never zig-zag",
  "Can you zig-zag around closed level crossing barriers?",
  "Kapalı hemzemin geçit bariyerlerinin etrafından dolaşabilir misin?",
  "No, never", "Hayır, asla",
  "Bariyer kapalıysa tren geliyordur.", "If the barrier is down, a train is coming.",
  [{ en: "Yes, if no train is visible",   tr: "Evet, tren görünmüyorsa" },
   { en: "Yes, if you are in a hurry",    tr: "Evet, acelen varsa" },
   { en: "Only motorcycles may do this",  tr: "Sadece motosikletler geçebilir" }]);

Q("oneway", "junction", "cyclist", "fact", "Wrong-way users",
  "What should you watch for on one-way streets?",
  "Tek yönlü yollarda neye dikkat etmelisin?",
  "Cyclists going the opposite way", "Ters yönden gelen bisikletliler",
  "Bazı tek yönlü yollarda bisiklete çift yön izni vardır.", "Some one-way streets allow contraflow cycling.",
  [{ en: "Vehicles reversing at speed",   tr: "Hızla geri gelen araçlar" },
   { en: "Traffic lights facing away",    tr: "Ters bakan trafik ışıkları" },
   { en: "Nothing — it is always safe",   tr: "Hiçbir şey — her zaman güvenlidir" }]);

Q("emergency_veh", "junction", "siren", "do", "Clear the way",
  "What should you do when you hear an emergency siren?",
  "Siren sesi duyduğunda ne yapmalısın?",
  "Move aside safely and stop if necessary", "Güvenle kenara çekil, gerekirse dur",
  "Yol aç ama trafik kurallarını çiğneme (kırmızıda geçme).", "Make way, but don't break the law (don't run a red light).");

Q("meeting", "junction", "country", "do", "Space shrinks",
  "What should you do when meeting oncoming traffic on a narrow road?",
  "Dar yolda karşıdan araç gelirse ne yapmalısın?",
  "Slow down and be prepared to stop", "Yavaşla ve durmaya hazır ol",
  "İki araç aynı anda sığmayabilir.", "Two vehicles may not fit at once.");

Q("narrow_bridge", "junction", "country", "do", "Give way if needed",
  "What should you do at a narrow bridge?",
  "Dar köprüye yaklaşırken ne yapmalısın?",
  "Give way if necessary", "Gerekirse yol ver",
  "Önce gelen ya da işaretle belirtilen geçer.", "Whoever has priority (or arrived first) crosses.");

/* ============ OTOYOL / MOTORWAY ============ */
Q("mw_breakdown", "motorway", "motorway", "do", "Motorway = get out",
  "What should you do if you break down on a motorway?",
  "Otoyolda arıza yaparsan ne yapmalısın?",
  "Leave the vehicle and stand behind the barrier", "Araçtan çık ve bariyerin arkasında dur",
  "Araçta kalmak, arkadan çarpılma riski yüzünden daha tehlikelidir.", "Staying in the car risks being hit from behind.");

Q("hazard_lights", "motorway", "motorway", "when", "Danger = hazards",
  "When should you use hazard warning lights?",
  "Dörtlü ikaz lambaları ne zaman kullanılır?",
  "When your vehicle is a danger or obstruction", "Aracın tehlike oluşturuyorsa",
  "Ayrıca otoyolda ileride ani yavaşlamayı bildirmek için kısaca kullanılabilir.",
  "Also briefly on motorways to warn of sudden queues ahead.");

Q("triangle", "motorway", "motorway", "fact", "Triangle: not on motorway",
  "When should you use a warning triangle?",
  "Uyarı üçgeni ne zaman kullanılır?",
  "On non-motorway roads, at least 45 m behind", "Otoyol dışı yollarda, aracın en az 45 m arkasında",
  "Otoyolda üçgen koymak yasaktır — çok tehlikelidir.", "Never place a triangle on a motorway — it's too dangerous.",
  [{ en: "On any road including motorways", tr: "Otoyol dâhil her yolda" },
   { en: "Only at night",                   tr: "Sadece geceleri" },
   { en: "Directly behind the bumper",      tr: "Tam tamponun arkasına" }]);

Q("hard_shoulder", "motorway", "motorway", "when", "Hard shoulder = emergency",
  "When should you use the hard shoulder?",
  "Emniyet şeridi ne zaman kullanılır?",
  "Only in an emergency", "Sadece acil durumlarda",
  "Normal seyirde veya sıkışıklıkta kullanmak yasaktır.", "Never for normal driving or beating queues.");

Q("red_x", "motorway", "motorway", "fact", "Red X = closed",
  "What does a red X above a motorway lane mean?",
  "Otoyolda şeridin üzerindeki kırmızı X ne anlama gelir?",
  "The lane is closed — do not use it", "Şerit kapalıdır — kullanma",
  "İleride kaza veya araç olabilir; cezası da vardır.", "There may be an incident ahead; it's also an offence.",
  [{ en: "The lane is for overtaking only",  tr: "Şerit sadece sollama içindir" },
   { en: "Lane closing soon, pass quickly",  tr: "Şerit birazdan kapanacak, hızlı geç" },
   { en: "Emergency vehicles only",          tr: "Sadece acil durum araçları için" }]);

Q("smart_shoulder", "motorway", "motorway", "fact", "Only when told",
  "Can you use the hard shoulder on a smart motorway?",
  "Akıllı otoyolda emniyet şeridi kullanılabilir mi?",
  "Only if signs show it is open", "Sadece işaretler açık olduğunu gösteriyorsa",
  "Üstteki panolar şerit durumunu gösterir.", "Overhead gantries show whether it's a running lane.",
  [{ en: "Yes, at any time",                 tr: "Evet, her zaman" },
   { en: "No, never under any circumstances", tr: "Hayır, hiçbir koşulda" },
   { en: "Only for lorries",                 tr: "Sadece kamyonlar için" }]);

Q("variable_limit", "motorway", "motorway", "fact", "Red circle = MUST",
  "When must you obey variable speed limit signs?",
  "Değişken hız sınırlarına ne zaman uymak zorundasın?",
  "When shown inside a red circle", "Kırmızı çember içinde gösteriliyorsa",
  "Kırmızı çember = yasal zorunluluk.", "A red circle means it is mandatory.",
  [{ en: "Only during rush hour",  tr: "Sadece yoğun saatlerde" },
   { en: "They are only advisory", tr: "Onlar sadece tavsiyedir" },
   { en: "Only when it is raining", tr: "Sadece yağmur yağarken" }]);

Q("mw_speed", "motorway", "motorway", "fact", "UK standard 70",
  "What is the national speed limit on a motorway for cars?",
  "Otoyolda otomobiller için ulusal hız sınırı nedir?",
  "70 mph (unless signs show otherwise)", "70 mph (aksi belirtilmedikçe)",
  "İngiltere standardı: otoyol 70 mph.", "UK standard: motorway 70 mph.",
  [{ en: "60 mph", tr: "60 mph" },
   { en: "80 mph", tr: "80 mph" },
   { en: "50 mph", tr: "50 mph" }]);

/* ============ ARAÇ & BAKIM / VEHICLE & MAINTENANCE ============ */
Q("engine_light", "vehicle", "dash", "do", "Engine light = check",
  "What should you do if the engine warning light comes on?",
  "Motor uyarı ışığı yanarsa ne yapmalısın?",
  "Have the vehicle checked", "Aracı kontrol ettir",
  "Işığı görmezden gelmek büyük arızaya yol açar.", "Ignoring it can lead to serious damage.");

Q("oil_light", "vehicle", "dash", "do", "Oil light = STOP",
  "What should you do if the oil warning light comes on?",
  "Yağ uyarı ışığı yanarsa ne yapmalısın?",
  "Stop and check the oil level", "Dur ve yağ seviyesini kontrol et",
  "Yağsız motor dakikalar içinde hasar görür.", "An engine without oil is damaged within minutes.");

Q("brake_fail", "vehicle", "dash", "do", "Brake fail = slow + safe",
  "What should you do if your brakes fail?",
  "Frenler çalışmazsa ne yapmalısın?",
  "Slow down gradually and stop safely", "Yavaşla ve güvenli şekilde dur",
  "Motor freni ve el frenini kademeli kullan.", "Use engine braking and the handbrake gradually.");

Q("spongy", "vehicle", "rain", "do", "Water + brake = test gently",
  "What should you do if brakes feel spongy after driving through water?",
  "Sudan geçtikten sonra frenler yumuşak hissettiriyorsa ne yapmalısın?",
  "Test the brakes gently", "Frenleri yavaşça dene",
  "Hafif fren, balataları kurutur.", "Light braking dries the pads out.");

Q("headlight_fail", "vehicle", "night", "do", "No lights = STOP",
  "What should you do if your headlights fail at night?",
  "Gece farlar bozulursa ne yapmalısın?",
  "Stop safely", "Güvenli şekilde dur",
  "Görmeden ve görünmeden gitmek ölümcüldür.", "Driving unseen and unseeing is lethal.");

Q("worn_tyres", "vehicle", "distance", "why", "Worn tyres = long stop",
  "Why are worn tyres dangerous?",
  "Aşınmış lastikler neden tehlikelidir?",
  "They increase stopping distance", "Durma mesafesini uzatır",
  "Diş derinliği azaldıkça su tahliyesi ve tutuş azalır.", "Less tread = less water clearance and grip.");

Q("tyre_pressure", "vehicle", "dash", "why", "Pressure = control",
  "Why is correct tyre pressure important?",
  "Doğru lastik basıncı neden önemlidir?",
  "It affects handling and stopping distance", "Kontrolü ve durma mesafesini etkiler",
  "Yanlış basınç direksiyon hâkimiyetini bozar.", "Wrong pressure upsets steering and braking.");

Q("tyre_tread", "vehicle", "dash", "fact", "Legal: 1.6 mm",
  "What is the minimum legal tyre tread depth for cars?",
  "Otomobillerde yasal minimum lastik diş derinliği nedir?",
  "At least 1.6 mm", "En az 1.6 mm",
  "Yasal sınır: orta 3/4'te 1.6 mm.", "Legal limit: 1.6 mm across the central ¾.",
  [{ en: "At least 1.0 mm", tr: "En az 1.0 mm" },
   { en: "At least 2.6 mm", tr: "En az 2.6 mm" },
   { en: "At least 4.0 mm", tr: "En az 4.0 mm" }]);

Q("overheat", "vehicle", "dash", "do", "Overheat = stop",
  "What should you do if your engine overheats?",
  "Motor aşırı ısınırsa (hararet yaparsa) ne yapmalısın?",
  "Stop safely and let it cool", "Güvenli şekilde dur ve soğumasını bekle",
  "Sıcakken kaputu/kapağı açma!", "Never open the cap while it's hot!");

Q("brake_light", "vehicle", "dash", "fact", "Brake light = danger",
  "What does the brake system warning light mean?",
  "Fren uyarı ışığı ne anlama gelir?",
  "There is a fault in the braking system", "Fren sisteminde arıza var",
  "Hemen kontrol ettir — fren hayatidir.", "Have it checked immediately — brakes are vital.",
  [{ en: "The handbrake is worn out",     tr: "El freni aşınmış" },
   { en: "The brakes are too cold",       tr: "Frenler çok soğuk" },
   { en: "You are braking too gently",    tr: "Çok yumuşak fren yapıyorsun" }]);

Q("oil_check", "vehicle", "dash", "do", "Oil = engine life",
  "How often should you check the engine oil level?",
  "Motor yağ seviyesi ne sıklıkla kontrol edilmeli?",
  "Regularly", "Düzenli olarak",
  "Yağ motoru korur; uzun yolculuk öncesi mutlaka bak.", "Oil protects the engine; always check before long trips.");

Q("hill_start", "vehicle", "hill", "do", "Handbrake",
  "What should you do when starting uphill?",
  "Yokuşta kalkış yaparken ne yapmalısın?",
  "Use the handbrake", "El frenini kullan",
  "Geri kaçmayı önler.", "It stops you rolling back.");

Q("downhill", "vehicle", "hill", "do", "Low gear = control",
  "How should you control your speed going downhill?",
  "Yokuş aşağı hız nasıl kontrol edilir?",
  "Use a lower gear", "Düşük vites kullan",
  "Freni zorlamadan motor freniyle hız kontrolü sağlanır.", "Engine braking controls speed without overheating the brakes.");

Q("end_journey", "vehicle", "park", "do", "Secure vehicle",
  "What should you do at the end of a journey?",
  "Yolculuk sonunda ne yapmalısın?",
  "Secure the vehicle properly", "Aracı güvenli şekilde kilitle",
  "El freni + vites + kilit.", "Handbrake + gear + lock.");

/* ============ SÜRÜCÜ GÜVENLİĞİ / DRIVER SAFETY ============ */
Q("mobile", "driver", "phone", "when", "Handheld = illegal",
  "When is it illegal to use a mobile phone while driving?",
  "Araç kullanırken telefon ne zaman yasaktır?",
  "Whenever it is handheld", "Elde tutuluyorsa her zaman",
  "Elde telefon = ağır ceza + 6 puan.", "Handheld phone = heavy fine + 6 points.");

Q("handsfree", "driver", "phone", "fact", "Still distracts",
  "Is hands-free phone use always safe?",
  "Hands-free (eller serbest) telefon kullanımı her zaman güvenli midir?",
  "No, it can still distract you", "Hayır, yine de dikkat dağıtır",
  "Dikkatin yolda değil konuşmada olur.", "Your mind is on the call, not the road.",
  [{ en: "Yes, it is completely safe",       tr: "Evet, tamamen güvenlidir" },
   { en: "Yes, if the call is short",        tr: "Evet, görüşme kısaysa" },
   { en: "It is illegal in all cases",       tr: "Her durumda yasaktır" }]);

Q("drink", "driver", "impaired", "why", "Alcohol = slow brain",
  "Why is drink-driving dangerous?",
  "Alkollü araç kullanmak neden tehlikelidir?",
  "It reduces reaction time and judgement", "Tepki süresini ve muhakemeyi azaltır",
  "Alkol beyni yavaşlatır; en güvenlisi hiç içmemek.", "Alcohol slows the brain; safest amount is zero.");

Q("drugs", "driver", "impaired", "why", "Drugs = poor control",
  "Why is driving under the influence of drugs dangerous?",
  "Uyuşturucu/ilaç etkisinde araç kullanmak neden tehlikelidir?",
  "It affects judgement and control", "Karar vermeyi ve kontrolü bozar",
  "Bazı reçeteli ilaçlar da etki eder — prospektüse bak.", "Some prescription medicines also impair — check the label.");

Q("tired", "driver", "impaired", "do", "Tired = STOP",
  "What should you do if you feel tired while driving?",
  "Sürüş sırasında yorgun/uykulu hissedersen ne yapmalısın?",
  "Stop somewhere safe and rest", "Güvenli bir yerde dur ve dinlen",
  "Otoyolda emniyet şeridinde değil; servis alanında dur. Kafein + kısa şekerleme yardımcı olur.",
  "Not on the hard shoulder — use a service area. Caffeine + a short nap helps.");

Q("seatbelt", "driver", "belt", "why", "Seat belt = life",
  "Why must seat belts be worn?",
  "Emniyet kemeri neden takılmalıdır?",
  "To reduce injury in a collision", "Çarpışmada yaralanmayı azaltmak için",
  "Kemersiz çarpışma, betona düşmek gibidir.", "Unbelted, a crash is like hitting concrete.");

Q("child_seat", "driver", "belt", "do", "Child seat",
  "How should children travel in cars?",
  "Çocuklar araçta nasıl seyahat etmelidir?",
  "In a correct child seat for their size", "Boyuna uygun çocuk koltuğunda",
  "12 yaş veya 135 cm'e kadar zorunludur.", "Required until age 12 or 135 cm tall.");

Q("mirrors_slow", "driver", "mirrors", "why", "Mirrors = behind",
  "Why should you check your mirrors before slowing down?",
  "Yavaşlamadan önce aynalara neden bakmalısın?",
  "To check traffic behind you", "Arkadaki trafiği kontrol etmek için",
  "Arkadaki araç çok yakınsa kademeli yavaşla.", "If someone is close behind, brake gently and early.");

Q("mirrors_when", "driver", "mirrors", "when", "Before anything",
  "When should you check your mirrors?",
  "Aynalar ne zaman kontrol edilmelidir?",
  "Before changing speed or direction", "Hız veya yön değiştirmeden önce",
  "Ayna–Sinyal–Manevra (Mirror–Signal–Manoeuvre) rutini.", "The Mirror–Signal–Manoeuvre routine.");

Q("blindspot", "driver", "mirrors", "do", "Mirror + shoulder",
  "What should you do before changing lanes?",
  "Şerit değiştirmeden önce ne yapmalısın?",
  "Check mirrors and blind spots", "Aynaları ve kör noktayı kontrol et",
  "Aynada görünmeyen bölge için omzunun üzerinden bak.", "Glance over your shoulder for what mirrors miss.");

Q("signals", "driver", "mirrors", "why", "Tell early",
  "Why should signals be given in good time?",
  "Sinyaller neden zamanında verilmelidir?",
  "To warn other road users of your intentions", "Diğer yol kullanıcılarını niyetinden haberdar etmek için",
  "Geç sinyal, sinyal vermemek kadar tehlikelidir.", "A late signal is as bad as no signal.");

Q("horn", "driver", "mirrors", "when", "Warning only",
  "When should you use the horn?",
  "Korna ne zaman kullanılmalıdır?",
  "Only to warn others of danger", "Sadece tehlikeye karşı uyarmak için",
  "Sinirlenince değil! Gece 23:30–07:00 arası meskûn mahalde yasak.",
  "Not in anger! Banned 11:30pm–7am in built-up areas.");

Q("tailgate", "driver", "distance", "why", "Close = no time",
  "Why is driving too close to the vehicle in front dangerous?",
  "Öndeki araca çok yakın gitmek neden tehlikelidir?",
  "You have less time to react", "Tepki süren azalır",
  "2 saniye kuralı: kuru havada en az 2 saniye bırak.", "The 2-second rule: leave at least 2 seconds in the dry.");

Q("stopping_dist", "driver", "distance", "fact", "Speed + wet",
  "What increases your overall stopping distance?",
  "Durma mesafesini ne artırır?",
  "Higher speed or poor conditions", "Yüksek hız veya kötü yol koşulları",
  "Durma = düşünme mesafesi + fren mesafesi.", "Stopping = thinking distance + braking distance.",
  [{ en: "A heavier right foot on the clutch", tr: "Debriyaja daha sert basmak" },
   { en: "Newer brake pads",                   tr: "Yeni fren balataları" },
   { en: "Driving downhill slowly",            tr: "Yokuş aşağı yavaş gitmek" }]);

Q("speeding", "driver", "distance", "fact", "Speed = less time",
  "What can driving too fast lead to?",
  "Aşırı hız neye yol açabilir?",
  "Less time to react and stop", "Tepki ve durma süresinin azalmasına",
  "Hız arttıkça durma mesafesi karesel büyür.", "Stopping distance grows with the square of speed.",
  [{ en: "Better fuel economy",     tr: "Daha iyi yakıt ekonomisi" },
   { en: "Improved concentration",  tr: "Gelişmiş konsantrasyon" },
   { en: "Shorter stopping distances", tr: "Daha kısa durma mesafesi" }]);

Q("night_speed", "driver", "night", "why", "Night = poor depth",
  "Why is it harder to judge speed and distance at night?",
  "Gece hız ve mesafe tahmini neden zordur?",
  "Depth perception is reduced", "Derinlik algısı azalır",
  "Gözler karanlıkta referans noktası bulamaz.", "Eyes lack reference points in the dark.");

Q("dazzle", "driver", "night", "do", "Dazzle = slow",
  "What should you do if dazzled by oncoming headlights?",
  "Karşıdan gelen farlar gözünü alırsa ne yapmalısın?",
  "Slow down or stop if necessary", "Yavaşla, gerekirse dur",
  "Kör noktada sürmeye devam etme.", "Don't keep driving blind.");

Q("headlights_day", "driver", "night", "when", "Poor visibility",
  "When should you use headlights during the day?",
  "Gündüz farlar ne zaman kullanılmalıdır?",
  "When visibility is seriously reduced", "Görüş ciddi şekilde azaldığında",
  "Görünmek, görmek kadar önemlidir.", "Being seen matters as much as seeing.");

Q("dip_lights", "driver", "night", "when", "Meeting others",
  "When must you dip your headlights?",
  "Farları ne zaman kısa hüzmeye almalısın?",
  "When meeting oncoming traffic", "Karşıdan araç gelirken",
  "Ayrıca öndeki aracı takip ederken de kıs.", "Also when following another vehicle.");

Q("emergency_stop", "driver", "distance", "when", "Sudden danger",
  "When should you perform an emergency stop?",
  "Acil fren (ani duruş) ne zaman yapılır?",
  "Only when there is sudden danger", "Sadece ani bir tehlike varsa",
  "Önce aynaya bakacak zaman olmayabilir — sıkı ve kontrollü fren yap.",
  "There may be no time for mirrors — brake firmly and keep control.");

Q("safest", "driver", "generic", "do", "Choose the safest",
  "In the theory test, if you're unsure between two answers, what should you do?",
  "Teori sınavında iki cevap arasında kaldıysan ne yapmalısın?",
  "Choose the safest option", "En güvenli seçeneği seç",
  "Theory test mantığı: her zaman en güvenli davranış doğrudur.",
  "Theory test logic: the safest behaviour is always the right answer.");

/* ============ KURALLAR & PARK / RULES & PARKING ============ */
Q("cyclists", "rules", "cyclist", "why", "Cyclist = unstable",
  "Why should you give cyclists extra space?",
  "Bisikletlilere neden ekstra mesafe bırakmalısın?",
  "They may wobble or swerve", "Dengesiz hareket edebilir, aniden yön değiştirebilirler",
  "Rüzgâr, çukur veya rögar kapağı bisikletliyi savurabilir.", "Wind, potholes or drains can push them sideways.");

Q("cyclist_pass", "rules", "cyclist", "fact", "Cyclist = 1.5 m",
  "How much space should you leave when overtaking a cyclist?",
  "Bisikletliyi sollarken ne kadar mesafe bırakmalısın?",
  "At least 1.5 metres", "En az 1,5 metre",
  "30 mph üzerindeyse daha da fazla bırak.", "Leave even more above 30 mph.",
  [{ en: "At least 0.5 metres", tr: "En az 0,5 metre" },
   { en: "At least 3 metres",   tr: "En az 3 metre" },
   { en: "One car door width",  tr: "Bir kapı genişliği" }]);

Q("motorcyclists", "rules", "cyclist", "why", "Motorbike = small",
  "Why are motorcyclists hard to see?",
  "Motosikletliler neden zor görülür?",
  "They are smaller than other vehicles", "Diğer araçlardan daha küçüktürler",
  "Kavşaklarda iki kez bak: 'Think Bike!'", "Look twice at junctions: 'Think Bike!'");

Q("buses", "rules", "parked", "why", "Bus = passengers",
  "Why should you slow down near buses at bus stops?",
  "Duraktaki otobüslerin yanında neden yavaşlamalısın?",
  "Passengers may cross the road", "Yolcular yoldan geçebilir",
  "Otobüsün önünden/arkasından aniden yaya çıkabilir.", "People can step out from in front of or behind the bus.");

Q("parked_lorry", "rules", "parked", "why", "Lorry = blind spot",
  "Why are parked lorries dangerous to pass?",
  "Park etmiş kamyonların yanından geçmek neden tehlikelidir?",
  "They block your view", "Görüşü kapatırlar",
  "Arkasından ne çıkacağını göremezsin.", "You can't see what will emerge from behind them.");

Q("roadworks", "rules", "works", "why", "Road works = workers",
  "Why should you slow down near road works?",
  "Yol çalışması olan yerde neden yavaşlamalısın?",
  "People may be working near the road", "Yol kenarında çalışanlar olabilir",
  "Şerit daralması ve geçici sınırlar da olabilir.", "Expect narrow lanes and temporary limits too.");

Q("roadworks_signs", "rules", "works", "why", "Signs = safety",
  "Why must you obey road works signs?",
  "Yol çalışması işaretlerine neden uymalısın?",
  "To protect workers and drivers", "Çalışanları ve sürücüleri korumak için",
  "Geçici hız sınırları da yasal olarak bağlayıcıdır.", "Temporary limits are legally binding too.");

Q("bus_lane", "rules", "park", "when", "Check signs",
  "When can you drive in a bus lane?",
  "Otobüs şeridi ne zaman kullanılabilir?",
  "When signs show it is permitted", "İşaretler izin veriyorsa",
  "Levhada saat aralığı yazar; dışındaysa serbesttir.", "The sign shows operating hours; outside them it's allowed.");

Q("speed_camera", "rules", "generic", "why", "Camera = ticket",
  "Why should you keep to the speed limit near speed cameras?",
  "Hız kameralarının olduğu yerde neden hız sınırına uymalısın?",
  "To stay safe and avoid penalties", "Güvenlik için ve ceza almamak için",
  "Kameralar kaza kara noktalarına kurulur.", "Cameras are placed at accident blackspots.");

Q("dbl_yellow", "rules", "park", "fact", "No parking, ever",
  "Can you park on double yellow lines?",
  "Çift sarı çizgide park edilebilir mi?",
  "No, at any time", "Hayır, hiçbir zaman",
  "Çift sarı = her zaman park yasağı.", "Double yellow = no waiting at any time.",
  [{ en: "Yes, on Sundays",            tr: "Evet, pazar günleri" },
   { en: "Yes, for up to 10 minutes",  tr: "Evet, 10 dakikaya kadar" },
   { en: "Yes, at night",              tr: "Evet, geceleri" }]);

Q("sgl_yellow", "rules", "park", "when", "Check sign",
  "When can you park on single yellow lines?",
  "Tek sarı çizgide ne zaman park edebilirsin?",
  "When signs show it is allowed", "Levhalar izin veriyorsa",
  "Tek sarı = saat sınırlı yasak; levhayı oku.", "Single yellow = time-limited; read the plate.");

Q("zigzag", "rules", "park", "fact", "Never",
  "Can you stop or park on zigzag lines near a crossing?",
  "Geçit yakınındaki zigzag çizgilerde durabilir veya park edebilir misin?",
  "No, never", "Hayır, asla",
  "Zigzagda duran araç, yayayı ve sürücüyü kör eder.", "A car on zigzags hides pedestrians from drivers.",
  [{ en: "Yes, to drop off passengers",  tr: "Evet, yolcu indirmek için" },
   { en: "Yes, with hazard lights on",   tr: "Evet, dörtlüler yanıkken" },
   { en: "Only delivery vehicles may",   tr: "Sadece dağıtım araçları durabilir" }]);

Q("overtake_clear", "rules", "junction", "do", "Road clear?",
  "What must you make sure of before overtaking?",
  "Sollama yapmadan önce neyden emin olmalısın?",
  "The road ahead is clear", "İleride yolun açık olduğundan",
  "Karşıdan gelen olabilir; emin değilsen sollama.", "There may be oncoming traffic; if unsure, don't.");

Q("overtake_weather", "rules", "fog", "why", "Poor view",
  "Why is overtaking dangerous in poor weather?",
  "Kötü havada sollama neden tehlikelidir?",
  "Visibility is reduced", "Görüş azalır",
  "Görüş ve tutuş azken risk katlanır.", "Low visibility and low grip multiply the risk.");

Q("reversing", "rules", "mirrors", "do", "Look all around",
  "What should you do before and while reversing?",
  "Geri manevradan önce ve sırasında ne yapmalısın?",
  "Look all around", "Her yeri kontrol et",
  "Kör noktalar geride büyür; gerekirse in ve bak.", "Blind spots grow behind you; get out and check if needed.");

Q("animals", "rules", "country", "do", "Slow + stop",
  "What should you do if animals are on the road?",
  "Yolda hayvan varsa ne yapmalısın?",
  "Slow down and be prepared to stop", "Yavaşla ve durmaya hazır ol",
  "Korna çalma, motoru öfkelendirme — sakin geç.", "Don't sound the horn or rev — pass calmly.");

Q("double_parked", "rules", "parked", "do", "Double parked = careful",
  "What should you do when passing double-parked vehicles?",
  "Çift sıra park etmiş araçların yanından geçerken ne yapmalısın?",
  "Slow down and be cautious", "Yavaşla ve dikkatli ol",
  "Görüş çok azalır; aradan yaya çıkabilir.", "Your view shrinks; pedestrians can appear between cars.");

Q("concealed_bend", "rules", "country", "do", "Blind bend = slow",
  "What should you do at a concealed (blind) bend?",
  "Görüşsüz (kör) virajda ne yapmalısın?",
  "Slow down", "Yavaşla",
  "Virajın arkasında ne olduğunu göremezsin.", "You can't see what's beyond the bend.");

Q("narrow_road", "rules", "country", "do", "Narrow = ready to stop",
  "What should you do on a narrow road?",
  "Dar yolda ne yapmalısın?",
  "Be prepared to stop", "Durmaya hazır ol",
  "Karşıdan araç gelebilir, ikiniz sığmayabilirsiniz.", "Oncoming traffic may appear and you may not both fit.");

Q("country_road", "rules", "country", "why", "Hidden hazards",
  "Why are country roads dangerous?",
  "Kırsal yollar neden tehlikelidir?",
  "Hazards can appear suddenly", "Tehlikeler aniden ortaya çıkabilir",
  "Viraj, hayvan, traktör, çamur — hepsi köşede bekler.", "Bends, animals, tractors, mud — all wait around the corner.");

Q("sharp_bend", "rules", "country", "do", "Brake before, not in",
  "What should you do before a sharp bend?",
  "Keskin virajdan önce ne yapmalısın?",
  "Reduce speed before the bend", "Virajdan önce yavaşla",
  "Viraj içinde fren yapmak kaydırır.", "Braking inside the bend causes skids.");

Q("speed_humps", "rules", "works", "do", "Humps = slow",
  "What should you do at speed humps?",
  "Kasislerde ne yapmalısın?",
  "Reduce speed", "Hızını düşür",
  "Kasisler zaten yavaşlatmak için konur.", "They exist precisely to slow you down.");

Q("single_cw", "rules", "generic", "fact", "Single carriageway 60",
  "What is the national speed limit for cars on a single carriageway?",
  "Tek şeritli (bölünmemiş) yolda otomobiller için ulusal hız sınırı nedir?",
  "60 mph", "60 mph",
  "Ulusal sınırlar: şehir içi 30, tek yol 60, bölünmüş yol ve otoyol 70.",
  "National limits: built-up 30, single 60, dual & motorway 70.",
  [{ en: "50 mph", tr: "50 mph" },
   { en: "70 mph", tr: "70 mph" },
   { en: "40 mph", tr: "40 mph" }]);

Q("dual_cw", "rules", "generic", "fact", "Dual carriageway 70",
  "What is the national speed limit for cars on a dual carriageway?",
  "Bölünmüş yolda otomobiller için ulusal hız sınırı nedir?",
  "70 mph", "70 mph",
  "Ortada refüj olan yol = bölünmüş yol.", "A central reservation makes it a dual carriageway.",
  [{ en: "60 mph", tr: "60 mph" },
   { en: "80 mph", tr: "80 mph" },
   { en: "50 mph", tr: "50 mph" }]);

Q("night_limit", "rules", "night", "fact", "Same limits at night",
  "Do speed limits change at night?",
  "Gece hız sınırları değişir mi?",
  "No, the same limits apply", "Hayır, aynı sınırlar geçerlidir",
  "Ama gece görüş azdır — daha yavaş sürmek akıllıcadır.", "But visibility is lower — driving slower is wise.",
  [{ en: "Yes, they drop by 10 mph",   tr: "Evet, 10 mph düşer" },
   { en: "Yes, they increase",         tr: "Evet, artar" },
   { en: "Only on motorways they change", tr: "Sadece otoyolda değişir" }]);
