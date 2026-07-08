# -*- coding: utf-8 -*-
import json,re,random
random.seed(31)
# Per-block short scenario (EN, TR) + per question (qtr, atr). scen prefix eklenir.
SCEN=[
 ("2hr motorway drive, you have a cold and took cold medicine, feeling drowsy",
  "Otoyolda 2 saatlik yolculuk; soğuk algınlığı ilacı aldın, uykun geliyor"),
 ("Heavy traffic, sun glare on wet road, a car cuts in, roundabout then zebra crossing",
  "Yoğun trafik, ıslak yolda güneş parlaması, önüne araç giriyor, ada kavşağı ve yaya geçidi"),
 ("Driving through city centre outside rush hour, red route lines, camera in car",
  "Şehir merkezinde yoğun saat dışı sürüş, kırmızı güzergâh çizgileri, arabada kamera"),
 ("Short essential journey, icy roads early morning, risk of skidding",
  "Kısa ama zorunlu yolculuk, sabah buzlu yollar, kayma riski"),
 ("Waiting to turn right in town, parked cars block your view, a police officer signals",
  "Kasabada sağa dönmeyi bekliyorsun, park arabalar görüşü kapatıyor, polis işaret veriyor"),
 ("Following a cyclist on a poor road surface, horse rider and school ahead",
  "Bozuk yolda bisikletli takip ediyorsun, ileride at binicisi ve okul var"),
 ("Dry but very windy motorway, a car towing a caravan, a motorcyclist, a long vehicle",
  "Kuru ama çok rüzgârlı otoyol, karavan çeken araba, motosikletli, uzun araç"),
 ("Very thick fog on a damp road, using fog lights, a pumping vehicle ahead",
  "Nemli yolda çok yoğun sis, sis lambaları açık, ileride bir iş aracı"),
 ("Towing a small trailer, joining the motorway from a slip road, roadworks",
  "Küçük römork çekiyorsun, bağlantı yolundan otoyola katılıyorsun, yol çalışması"),
 ("Early evening, street lamps lit, driving home at 30 mph, a salting vehicle",
  "Akşam üstü, sokak lambaları yanık, 30 mph ile eve gidiyorsun, tuzlama aracı"),
 ("Area with many pedestrians, a no-motor-vehicles sign, brown tourist signs, traffic lights",
  "Çok yayalı bölge, motorlu araç giremez işareti, kahverengi turistik tabelalar, ışıklar"),
 ("Just bought a used car that passed its MOT, need to tax it, sorting insurance",
  "MOT'tan geçmiş ikinci el araba aldın, vergisini ve sigortasını hallediyorsun"),
 ("You witness a 3-vehicle road incident and stop to help casualties",
  "Üç araçlı bir trafik kazasına tanık oluyorsun ve yaralılara yardım için duruyorsun"),
 ("Family holiday drive, loading a roof rack, a dog and children in the car",
  "Ailece tatile gidiyorsun, tavan taşıyıcı yüklüyorsun, arabada köpek ve çocuklar var"),
]
# translations: (qtr, atr) keyed by cX_Y
TR={
"c1_1":("İlaçta hangi bilgiyi kontrol etmelisin?","İlacın uyuşukluk yapıp yapmadığı bilgisini"),
"c1_2":("Gündüz neden ışık kullanırsın?","Başkalarına görünürlüğünü en üst düzeye çıkarmak için"),
"c1_3":("Yolculuk seni nasıl etkiler?","Uykun gelir"),
"c1_4":("Durumun hakkında ne yapmalısın?","Dinlenme tesisinde dur, kafeinli bir şey iç ve dinlen"),
"c1_5":("Kısa vadede uyanık kalmak için ne yapabilirsin?","Camı aç"),
"c2_1":("Yol koşullarından etkilenirsen nasıl tepki vermelisin?","Yavaşla, gerekirse dur"),
"c2_2":("Seni sollayan araç hakkında ne yapmalısın?","Sakin ol, yavaşla ve mesafeyi artır"),
"c2_3":("Ada kavşağına yaklaşırken nasıl konumlanmalısın?","Sola sinyal vererek sol şeritte"),
"c2_4":("Büyük araç neden bu pozisyonu alıyor?","Dönmek için daha çok yere ihtiyacı var"),
"c2_5":("Yaya geçidinde ne yapmalısın?","Dur ve yayaların geçmesini bekle"),
"c3_1":("Yolculuk saatini seçmen yolculuğunu nasıl etkiler?","Yolculuk süresi kısalır"),
"c3_2":("Kırmızı çizgiler ne anlama gelir?","Hiçbir zaman durmak yasak"),
"c3_3":("Trafik ışıklarında ne yapmalısın?","İşaretsiz kavşak gibi dikkatle geç"),
"c3_4":("Direksiyonunu ne etkiliyor olabilir?","Havası az lastikler"),
"c3_5":("Kameranı ne yapmalısın?","Görünmeyecek şekilde güvenli yere kilitle"),
"c4_1":("Böyle hava koşullarında ne yapmalısın?","Daha fazla zaman ayır"),
"c4_2":("Bu koşullarda nasıl fren yapmalısın?","Nazikçe ve yavaşça"),
"c4_3":("Lastik sesinin olmaması neyi gösterir?","Yol buzlu olabilir"),
"c4_4":("Anlatılan kaymada ne yapmalısın?","Direksiyonu nazikçe sağa çevir"),
"c4_5":("Bu yavaş araç hangi renk tepe lambası taşır?","Sarı (amber)"),
"c5_1":("Vitrin camları burada sana nasıl yardımcı olabilir?","Görünmeyen yaklaşan araçların yansımasını göstererek"),
"c5_2":("Park etmiş arabalar hangi tehlikeyi oluşturur?","Yaya veya bisikletliler görüşten gizlenebilir"),
"c5_3":("Teslimat aracı hakkında ne yapmalısın?","Dur ve önün açılana kadar bekle"),
"c5_4":("Polis memurunun işaretine ne yapmalısın?","Dur ve geç işareti verilene kadar sabırla bekle"),
"c5_5":("Otobüs şeridini ne zaman kullanabilirsin?","Hiçbir zaman"),
"c6_1":("Bisikletli bu yol yüzeyinde ne yapmak zorunda kalabilir?","Ani manevra (sapma) yapmak"),
"c6_2":("At binicisinin sonra ne yapmasını beklemelisin?","Herhangi bir yöne gitmesini"),
"c6_3":("Bu yanıp sönen sarı sinyal ne anlama gelir?","Çocuklar yolu geçiyor olabilir"),
"c6_4":("Yerleşim bölgesinde hız sınırı kaç olur?","30 mph"),
"c6_5":("Yaya geçidindeki kişi hakkında ne söyleyebilirsin?","Hem sağır hem kör"),
"c7_1":("Araç ve karavan için otoyol ulusal hız sınırı nedir?","60 mph"),
"c7_2":("Bu hava koşullarında motosikletliye ne olabilir?","Rüzgârla rotasından savrulabilir"),
"c7_3":("Uzun aracı takip ederken ne yapmalısın?","Geri çekil ki ilerideki yolu daha çok görebilesin"),
"c7_4":("Bu rayları tıkamamak neden önemli?","Tramvaylar engellerin etrafından dönemez"),
"c7_5":("Otobüs hakkında ne yapmalısın?","Güvenli olduğu sürece yol ver"),
"c8_1":("Yol durumu durma mesafeni nasıl etkileyebilir?","İki katına çıkabilir"),
"c8_2":("Sis lambalarını neden kullanıyor olurdun?","Görüş 100 metrenin altında"),
"c8_3":("Önündeki araçla neden daha büyük boşluk bırakırsın?","Öndeki araç aniden durabilir"),
"c8_4":("İş aracını sollamadan önce ne yapmalısın?","Önündeki yol açılana kadar bekle"),
"c8_5":("Tırtıklı bantlar sana hangi bilgiyi verir?","Hızının farkına varman için bir hatırlatma"),
"c9_1":("Otoyolda önceliği kim taşır?","Sol şeritte zaten ilerleyen araçlar"),
"c9_2":("Bu çivilerin rengi ne olurdu?","Yeşil"),
"c9_3":("Yol çalışmasından sonra hangi şeridi kullanmalısın?","Sol şeridi"),
"c9_4":("Aracın ve römorkun için otoyol ulusal hız sınırı nedir?","60 mph"),
"c9_5":("Otoyoldan çıkmak hakkında ne yapmalısın?","Bir sonraki çıkışa kadar devam et"),
"c10_1":("30 mph hız sınırını nasıl anladın?","Bölgede düzenli aralıklı sokak lambaları var"),
"c10_2":("Bu yolda normal orta beyaz çizgi nasıl olurdu?","Kısa çizgiler ve uzun boşluklar"),
"c10_3":("Tuzlama aracı hangi renk tepe lambası taşır?","Sarı (amber)"),
"c10_4":("Yüksek doluluk şeridini neden kullanmazsın?","İki veya daha fazla yolcusu olan araçlar içindir"),
"c10_5":("Neden evinin tam hizasına park etmiyorsun?","Çünkü oraya park etmek yasak"),
"c11_1":("Yukarıda anlatılan yuvarlak işaret ne demek?","Motorlu araç giremez"),
"c11_2":("Yolun ortasındaki çizgiler sana ne söyler?","Park yok"),
"c11_3":("Şehir dışındaki yolda ulusal hız sınırı nedir?","60 mph"),
"c11_4":("Kahverengi tabelalarda hangi bilgi bulunur?","Turistik bilgi"),
"c11_5":("Işıklar değişirken sonra hangi rengi görürsün?","Tek başına sarı ışık"),
"c12_1":("Bir aracın MOT'tan geçmesi ne demektir?","Araç asgari yasal güvenlik standartlarını karşılar"),
"c12_2":("DVLA ile ne zaman iletişime geçmen gerekir?","Adını veya adresini değiştirirsen"),
"c12_3":("Mevcut en yüksek sigorta teminatı hangisidir?","Kapsamlı (comprehensive)"),
"c12_4":("Geçici sigorta belgesi (cover note) sana ne verir?","Geçici teminat"),
"c12_5":("Arabanı vergilendirmek için postanede hangi belgeyi göstermelisin?","Yeni sahip eki (new keeper supplement)"),
"c13_1":("Diğer trafiği uyarmak için aracını başka nasıl kullanabilirdin?","Dörtlü flaşörleri yakarak"),
"c13_2":("Yaralı bilgisi dışında acil servise hangi bilgiyi vermelisin?","Kazanın yerini (konumunu)"),
"c13_3":("Şok geçiren kişiyle nasıl ilgilenmelisin?","Yanında kal ve güven verici şekilde sakinleştir"),
"c13_4":("Kendi bilgilerini neden verirsin?","Tanık ifadesi vermen gerekebilir"),
"c13_5":("Polis genelde kazaya karışanlardan hangi belgeleri ister?","Ehliyet ve sigorta belgesi"),
"c14_1":("Dolu tavan taşıyıcı aracın yol tutuşunu nasıl etkiler?","Dengeyi azaltır"),
"c14_2":("Köpek güvenlik için nasıl sabitlenmeli?","Özel bir emniyet kemeriyle (harness)"),
"c14_3":("Çocukların uygun emniyet kemeri/koltuğu takmasını kim sağlamalı?","Sürücü"),
"c14_4":("Hangisi station wagon'un yakıt tüketimini azaltabilir?","Kullanılmadığında tavan taşıyıcıyı çıkarmak"),
"c14_5":("Benzin istasyonunda neyi kontrol etmelisin?","Dört lastik ve yedeğin uygun basınçta olduğunu"),
}
cases=json.load(open("cases.json"))
out=[]
allans=[]
for ci,c in enumerate(cases):
    for qi,(q,a) in enumerate(c["qas"]): allans.append(a)
for ci,c in enumerate(cases):
    scen_en,scen_tr=SCEN[ci]
    for qi,(q,a) in enumerate(c["qas"]):
        key=f"c{ci+1}_{qi+1}"
        tr=TR.get(key)
        qtr = (scen_tr+". "+tr[0]) if tr else q
        atr = tr[1] if tr else a
        qen = scen_en+". "+q.strip()
        # distractors: other case answers, prefer similar length
        pool=[x for x in allans if x.strip().lower()!=a.strip().lower()]
        random.shuffle(pool)
        pool.sort(key=lambda x:abs(len(x.split())-len(a.split())))
        seen=set([a.lower()]);ds=[]
        for x in pool:
            if x.lower() not in seen: seen.add(x.lower());ds.append({"en":x,"tr":x})
            if len(ds)==3:break
        out.append({"id":"case_"+key,"cat":"case","scene":"classroom","type":"do","ezber":"",
            "q":{"en":qen,"tr":qtr},"a":{"en":a,"tr":atr},"logic":{"en":"","tr":""},"w":ds,"ext":True})
# fix distractor TR from answer map
amap={o["a"]["en"].strip():o["a"]["tr"] for o in out}
for o in out:
    for w in o["w"]:
        w["tr"]=amap.get(w["en"].strip(),w["en"])
cats={"case":{"tr":"Vaka Çalışması (Senaryo)","en":"Case Study","icon":"🧩"}}
js="/* AUTO — docx Case Study senaryo soruları (70). Çift dilli. */\n"
js+="const CATS_EXT3="+json.dumps(cats,ensure_ascii=False)+";\n const EXTQ3=[];\n"
for o in out: js+="EXTQ3.push("+json.dumps(o,ensure_ascii=False)+");\n"
js+="(function(){try{if(typeof CATS!=='undefined')Object.assign(CATS,CATS_EXT3);}catch(e){}try{if(typeof QUESTIONS!=='undefined')for(var i=0;i<EXTQ3.length;i++)QUESTIONS.push(EXTQ3[i]);}catch(e){}})();\n"
open("questions_ext3.js","w",encoding="utf-8").write(js)
print("questions_ext3.js:",len(out),"vaka sorusu | çevrili:",sum(1 for o in out if o['q']['tr']!=o['q']['en']))
