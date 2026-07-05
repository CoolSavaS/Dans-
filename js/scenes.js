/* =====================================================================
   Animasyon Sahneleri — her konu için çizgi film tarzı SVG animasyon.
   Sahneler CSS keyframe'leriyle (style.css) hareket eder.
   ===================================================================== */

/* ---- ortak parçalar ---- */
const SKY_DAY = `<rect width="400" height="240" fill="#aee3f7"/><circle cx="345" cy="42" r="22" fill="#ffd54d" class="an-sun"/><g class="an-cloud1"><ellipse cx="80" cy="45" rx="30" ry="13" fill="#fff"/><ellipse cx="105" cy="38" rx="22" ry="11" fill="#fff"/></g><g class="an-cloud2"><ellipse cx="240" cy="60" rx="26" ry="11" fill="#fff" opacity=".9"/></g>`;
const SKY_NIGHT = `<rect width="400" height="240" fill="#1a2447"/><circle cx="340" cy="45" r="18" fill="#f5f0d8"/><circle cx="332" cy="40" r="16" fill="#1a2447"/><g fill="#fff"><circle cx="60" cy="40" r="2" class="an-blink"/><circle cx="140" cy="25" r="1.6"/><circle cx="210" cy="55" r="2" class="an-blink2"/><circle cx="280" cy="30" r="1.5"/><circle cx="100" cy="70" r="1.5" class="an-blink"/></g>`;
const GRASS = `<rect y="150" width="400" height="90" fill="#8fd06c"/>`;
const ROAD = `<rect y="168" width="400" height="58" fill="#5b6270"/><g stroke="#fff" stroke-width="4" stroke-dasharray="22 18"><line x1="0" y1="197" x2="400" y2="197"/></g>`;

/* Sevimli çizgi film arabası (yüzlü) */
function toonCar(cls = "", color = "#ff6b6b", extra = "") {
  return `<g class="${cls}">
    <ellipse cx="60" cy="52" rx="52" ry="6" fill="rgba(0,0,0,.15)"/>
    <rect x="8" y="18" width="104" height="28" rx="12" fill="${color}"/>
    <path d="M28 20 Q34 2 56 2 H76 Q94 2 100 20 Z" fill="${color}"/>
    <path d="M36 18 Q40 7 55 7 H63 V18 Z" fill="#dff3fb"/>
    <path d="M67 7 H75 Q88 7 93 18 H67 Z" fill="#dff3fb"/>
    <circle cx="50" cy="13" r="2.6" fill="#333"/><circle cx="72" cy="13" r="2.6" fill="#333"/>
    <path d="M56 16 q5 4 10 0" stroke="#333" stroke-width="1.8" fill="none"/>
    <rect x="106" y="26" width="8" height="9" rx="2" fill="#ffe08a"/>
    <rect x="6" y="26" width="7" height="9" rx="2" fill="#e74c3c" class="an-brakelight"/>
    <g class="an-wheel"><circle cx="32" cy="48" r="12" fill="#2f3640"/><circle cx="32" cy="48" r="5.5" fill="#b0b7c3"/><rect x="30.8" y="38" width="2.4" height="8" fill="#b0b7c3"/></g>
    <g class="an-wheel"><circle cx="88" cy="48" r="12" fill="#2f3640"/><circle cx="88" cy="48" r="5.5" fill="#b0b7c3"/><rect x="86.8" y="38" width="2.4" height="8" fill="#b0b7c3"/></g>
    ${extra}</g>`;
}

/* Çöp adam yaya */
function walker(cls = "", color = "#3867d6", scale = 1) {
  return `<g class="${cls}" transform="scale(${scale})">
    <circle cx="0" cy="-34" r="7" fill="#f3c188"/>
    <path d="M0 -27 V-6" stroke="${color}" stroke-width="6" stroke-linecap="round"/>
    <path class="an-leg1" d="M0 -6 L-7 12" stroke="#34495e" stroke-width="5" stroke-linecap="round"/>
    <path class="an-leg2" d="M0 -6 L7 12"  stroke="#34495e" stroke-width="5" stroke-linecap="round"/>
    <path class="an-arm1" d="M0 -22 L-8 -10" stroke="${color}" stroke-width="4.4" stroke-linecap="round"/>
    <path class="an-arm2" d="M0 -22 L8 -10"  stroke="${color}" stroke-width="4.4" stroke-linecap="round"/></g>`;
}


/* Okunaklı başlık şeridi — yazı asla şekillerle karışmaz */
function cap(text, x = 12, y = 12, color = "#2d3436", dark = false) {
  const w = Math.round(text.length * 7.7 + 24);
  return `<g><rect x="${x}" y="${y}" width="${w}" height="27" rx="13.5" fill="${dark ? "rgba(18,23,40,.82)" : "rgba(255,255,255,.94)"}"/><text x="${x + 12}" y="${y + 19}" font-size="13.5" font-weight="800" fill="${dark ? "#fff" : color}">${text}</text></g>`;
}

function bubble(x, y, text, cls = "") {
  return `<g class="${cls}"><rect x="${x - 8}" y="${y - 20}" rx="9" width="${text.length * 8.2 + 18}" height="26" fill="#fff" stroke="#333" stroke-width="2"/><text x="${x + 1}" y="${y - 2}" font-size="14" font-weight="700" fill="#333">${text}</text></g>`;
}

const trafficLightSVG = (cls) => `<g class="${cls}"><rect x="0" y="0" width="34" height="86" rx="8" fill="#2f3640"/><circle class="tl-red" cx="17" cy="17" r="10" fill="#e74c3c"/><circle class="tl-amber" cx="17" cy="43" r="10" fill="#f6b93b"/><circle class="tl-green" cx="17" cy="69" r="10" fill="#2ecc71"/><rect x="13" y="86" width="8" height="46" fill="#2f3640"/></g>`;

/* ---- SAHNELER ---- */
const SCENES = {

  skid: () => `<svg viewBox="0 0 400 240">${SKY_DAY}${GRASS}${ROAD}
    <path d="M40 210 q28 -7 52 0 q-22 6 -46 3" fill="none" stroke="#39424e" stroke-width="5" class="an-fadein"/>
    <path d="M60 220 q30 -8 55 -1" fill="none" stroke="#39424e" stroke-width="5" class="an-fadein"/>
    <g transform="translate(140,158)">${toonCar("an-skid", "#ff6b6b")}</g>
    ${bubble(160, 130, "Whoa!", "an-pop")}
    ${cap("⚠️ KAYIYOR / SKIDDING!", 12, 12, "#c0392b")}</svg>`,

  rain: () => `<svg viewBox="0 0 400 240"><rect width="400" height="240" fill="#7f9bb3"/>
    <g class="an-cloud1"><ellipse cx="90" cy="40" rx="42" ry="17" fill="#57708a"/><ellipse cx="130" cy="32" rx="30" ry="14" fill="#57708a"/></g>
    <g class="an-cloud2"><ellipse cx="290" cy="48" rx="38" ry="15" fill="#4d6377"/></g>
    <g class="an-rain" stroke="#cfe8ff" stroke-width="2.4" stroke-linecap="round">
      ${Array.from({ length: 16 }, (_, i) => `<line x1="${16 + i * 25}" y1="60" x2="${11 + i * 25}" y2="76"/>`).join("")}</g>
    ${GRASS.replace("#8fd06c", "#6fae55")}${ROAD}
    <g transform="translate(30,158)">${toonCar("an-drive-slow", "#4b7bec")}</g>
    <g class="an-fadein">
      ${cap("Durma mesafesi / Stopping distance", 26, 88)}
      <rect x="30" y="122" width="120" height="15" rx="7.5" fill="#2ecc71"/><text x="37" y="133.5" font-size="10.5" font-weight="800" fill="#fff">KURU / DRY</text>
      <rect x="30" y="142" width="240" height="15" rx="7.5" fill="#e74c3c" class="an-growbar"/></g>
      <text x="37" y="153.5" font-size="10.5" font-weight="800" fill="#fff" class="an-fadein">ISLAK / WET = 2×</text></svg>`,

  ice: () => `<svg viewBox="0 0 400 240"><rect width="400" height="240" fill="#dfefff"/>
    <g class="an-snow" fill="#fff" stroke="#bcd9f0" stroke-width=".6">
      ${Array.from({ length: 14 }, (_, i) => `<circle cx="${20 + i * 28}" cy="${(i % 4) * 22 + 12}" r="${3 + (i % 3)}"/>`).join("")}</g>
    <rect y="150" width="400" height="90" fill="#eef7ff"/>
    <rect y="168" width="400" height="58" fill="#9db3c8"/>
    <g stroke="#fff" stroke-width="4" stroke-dasharray="22 18"><line x1="0" y1="197" x2="400" y2="197"/></g>
    <g transform="translate(120,158)">${toonCar("an-slide", "#a55eea")}</g>
    <text x="255" y="120" font-size="34" class="an-pop">🥶</text>
    ${cap("🧊 BUZ: Tutuş yok! / ICE: No grip!", 12, 12, "#3867d6")}</svg>`,

  fog: () => `<svg viewBox="0 0 400 240">${SKY_DAY}${GRASS}${ROAD}
    <g transform="translate(40,158)">${toonCar("an-drive-slow", "#f7b731", `<path d="M114 26 L165 16 L165 44 L114 36 Z" fill="#fff7c9" opacity=".85"/>`)}</g>
    <g class="an-fog"><ellipse cx="260" cy="120" rx="150" ry="90" fill="#e8ecef" opacity=".92"/><ellipse cx="360" cy="180" rx="130" ry="80" fill="#dfe4e8" opacity=".95"/><ellipse cx="300" cy="60" rx="120" ry="60" fill="#eef1f3" opacity=".9"/></g>
    ${cap("🌫️ SİS / FOG — sis lambası: görüş 100 m altı", 12, 12, "#576574")}</svg>`,

  distance: () => `<svg viewBox="0 0 400 240">${SKY_DAY}${GRASS}${ROAD}
    <g transform="translate(240,158)">${toonCar("", "#20bf6b")}</g>
    <g transform="translate(20,158)">${toonCar("an-nudge", "#eb3b5a")}</g>
    <g class="an-pulse"><path d="M146 152 H232" stroke="#e67e22" stroke-width="4" stroke-dasharray="8 6"/>
      <path d="M146 152 l10 -6 v12 Z" fill="#e67e22"/><path d="M232 152 l-10 -6 v12 Z" fill="#e67e22"/>
      <rect x="158" y="122" width="64" height="22" rx="8" fill="#e67e22"/><text x="190" y="138" font-size="13" font-weight="800" fill="#fff" text-anchor="middle">2 sn / 2 s</text></g></svg>`,

  night: () => `<svg viewBox="0 0 400 240">${SKY_NIGHT}
    <rect y="150" width="400" height="90" fill="#243b2c"/>
    <rect y="168" width="400" height="58" fill="#3d4453"/><g stroke="#c8cdd6" stroke-width="4" stroke-dasharray="22 18"><line x1="0" y1="197" x2="400" y2="197"/></g>
    <g transform="translate(30,158)">${toonCar("an-drive-slow", "#4b6584", `<path d="M114 24 L200 10 L200 48 L114 38 Z" fill="#fff9c4" opacity=".55" class="an-beam"/>`)}</g>
    <g transform="translate(300,178)" class="an-fadein">${walker("", "#111", 1.1)}</g>
    ${cap("🌙 Koyu giysili yaya — çok zor görülür!", 12, 12, "#fff", true)}</svg>`,

  country: () => `<svg viewBox="0 0 400 240">${SKY_DAY}
    <path d="M0 160 Q90 120 200 150 Q310 180 400 140 V240 H0 Z" fill="#7cbf5f"/>
    <path d="M0 190 Q120 160 250 185 Q330 200 400 180 L400 215 Q320 235 240 218 Q110 195 0 222 Z" fill="#8d99ae"/>
    <g transform="translate(320,96)"><rect x="-6" y="18" width="12" height="30" fill="#8b5e34"/><circle cx="0" cy="6" r="26" fill="#2d8a4e"/><circle cx="-18" cy="16" r="17" fill="#37a45c"/><circle cx="18" cy="16" r="17" fill="#37a45c"/></g>
    <g class="an-sheep" transform="translate(150,182)"><ellipse cx="0" cy="0" rx="17" ry="11" fill="#fff"/><circle cx="15" cy="-6" r="7" fill="#333"/><circle cx="12" cy="-8" r="1.4" fill="#fff"/><path d="M-9 9 V17 M6 9 V17" stroke="#333" stroke-width="3.4"/></g>
    <g transform="translate(16,150) scale(.85)">${toonCar("an-nudge", "#fd9644")}</g>
    ${bubble(150, 148, "Mee!", "an-pop")}</svg>`,

  zebra: () => `<svg viewBox="0 0 400 240">${SKY_DAY}${GRASS}
    <rect y="168" width="400" height="58" fill="#5b6270"/>
    <g fill="#fff">${Array.from({ length: 5 }, (_, i) => `<rect x="${210 + i * 26}" y="168" width="15" height="58"/>`).join("")}</g>
    <g class="an-beacon"><circle cx="200" cy="120" r="9" fill="#f39c12"/><rect x="197" y="129" width="6" height="40" fill="#39424e"/></g>
    <g class="an-beacon2"><circle cx="352" cy="120" r="9" fill="#f39c12"/><rect x="349" y="129" width="6" height="40" fill="#39424e"/></g>
    <g transform="translate(30,158)">${toonCar("an-stopline", "#45aaf2")}</g>
    <g class="an-cross" transform="translate(262,190)">${walker("an-walkanim", "#8854d0", 1.15)}</g>
    ${cap("🚸 Zebra geçidi: yaya kraldır 👑", 12, 12)}</svg>`,

  pelican: () => `<svg viewBox="0 0 400 240">${SKY_DAY}${GRASS}
    <rect y="168" width="400" height="58" fill="#5b6270"/>
    <g stroke="#fff" stroke-width="3">${Array.from({ length: 6 }, (_, i) => `<line x1="${222 + i * 22}" y1="172" x2="${222 + i * 22}" y2="222"/>`).join("")}</g>
    <line x1="196" y1="168" x2="196" y2="226" stroke="#fff" stroke-width="5"/>
    <g transform="translate(150,60)">${trafficLightSVG("an-tl-redamber")}</g>
    <g transform="translate(24,158)">${toonCar("an-stopline2", "#26de81")}</g>
    <g transform="translate(280,190)">${walker("an-walkanim", "#eb3b5a", 1.15)}</g>
    ${cap("🚦 Pelikan geçidi / Pelican crossing", 12, 12)}</svg>`,

  patrol: () => `<svg viewBox="0 0 400 240">${SKY_DAY}${GRASS}${ROAD}
    <g transform="translate(30,158)">${toonCar("an-stopline", "#fc5c65")}</g>
    <g transform="translate(250,182)">
      <circle cx="0" cy="-38" r="8" fill="#f3c188"/><path d="M-7 -44 Q0 -52 7 -44 Z" fill="#f1c40f"/>
      <path d="M0 -30 V-4" stroke="#f1c40f" stroke-width="9" stroke-linecap="round"/>
      <path d="M0 -6 L-7 14 M0 -6 L7 14" stroke="#34495e" stroke-width="5" stroke-linecap="round"/>
      <path d="M0 -24 L-16 -34" stroke="#f1c40f" stroke-width="4.6" stroke-linecap="round"/>
      <g class="an-raise"><path d="M0 -24 L18 -40" stroke="#f1c40f" stroke-width="4.6" stroke-linecap="round"/>
        <g transform="translate(24,-58)"><circle r="15" fill="#e74c3c" stroke="#fff" stroke-width="3"/><text y="4.6" font-size="9.5" font-weight="800" fill="#fff" text-anchor="middle">STOP</text><rect x="-1.6" y="15" width="3.2" height="18" fill="#95a5a6"/></g></g></g>
    <g transform="translate(310,188)">${walker("an-walkanim", "#3867d6", .9)}</g>
    <g transform="translate(338,190)">${walker("an-walkanim", "#e056fd", .8)}</g>
    ${cap("🛑 Lollipop görevlisi = MUTLAKA dur", 12, 12, "#c0392b")}</svg>`,

  parked: () => `<svg viewBox="0 0 400 240">${SKY_DAY}${GRASS}${ROAD}
    <g transform="translate(236,142)"><rect x="0" y="10" width="120" height="44" rx="9" fill="#f5f6fa" stroke="#dcdde1" stroke-width="2"/><rect x="86" y="18" width="30" height="18" rx="4" fill="#74b9ff"/><circle cx="26" cy="56" r="11" fill="#2f3640"/><circle cx="96" cy="56" r="11" fill="#2f3640"/></g>
    ${cap("🍦 ICE CREAM", 248, 108, "#e17055")}
    <circle class="an-ball" cx="300" cy="212" r="9" fill="#e74c3c"/>
    <g class="an-child" transform="translate(310,196)">${walker("an-walkanim", "#fd79a8", .8)}</g>
    <g transform="translate(20,158)">${toonCar("an-stopline", "#00b894")}</g>
    ${cap("⚠️ Dikkat! Çocuk yola çıkabilir!", 12, 12, "#c0392b")}</svg>`,

  lights: () => `<svg viewBox="0 0 400 240">${SKY_DAY}${GRASS}${ROAD}
    <g transform="translate(196,52)">${trafficLightSVG("an-tl-cycle")}</g>
    <g transform="translate(40,158)">${toonCar("an-stopgo", "#a55eea")}</g>
    <g class="an-fadein"><rect x="244" y="58" width="148" height="70" rx="12" fill="rgba(255,255,255,.94)"/>
    <text x="256" y="80" font-size="13" font-weight="800" fill="#e74c3c">Kırmızı = DUR</text>
    <text x="256" y="98" font-size="13" font-weight="800" fill="#e67e22">Sarı = hazırlan</text>
    <text x="256" y="116" font-size="13" font-weight="800" fill="#27ae60">Yeşil = boşsa geç</text></g></svg>`,

  roundabout: () => `<svg viewBox="0 0 400 240"><rect width="400" height="240" fill="#8fd06c"/>
    <circle cx="200" cy="120" r="86" fill="#5b6270"/><circle cx="200" cy="120" r="40" fill="#7cbf5f" stroke="#fff" stroke-width="3"/>
    <rect x="0" y="102" width="120" height="36" fill="#5b6270"/><rect x="280" y="102" width="120" height="36" fill="#5b6270"/>
    <rect x="182" y="0" width="36" height="60" fill="#5b6270"/><rect x="182" y="180" width="36" height="60" fill="#5b6270"/>
    <g class="an-orbit"><g transform="translate(200,120)"><g transform="translate(-33,-82) scale(.55)">${toonCar("", "#f7b731")}</g></g></g>
    <g transform="translate(28,96) scale(.7)">${toonCar("an-nudge", "#eb3b5a")}</g>
    <path d="M118 96 q18 -18 40 -22" fill="none" stroke="#e74c3c" stroke-width="4" stroke-dasharray="7 5" class="an-pulse"/>
    ${cap("➡️ Sağdan gelene YOL VER!", 12, 8, "#c0392b")}
    ${cap("🔄 Saat yönünde dönülür / Clockwise", 12, 204)}</svg>`,

  junction: () => `<svg viewBox="0 0 400 240"><rect width="400" height="240" fill="#8fd06c"/>
    <rect x="0" y="90" width="400" height="60" fill="#5b6270"/>
    <rect x="170" y="0" width="60" height="240" fill="#5b6270"/>
    <g stroke="#fff" stroke-width="3" stroke-dasharray="14 10"><line x1="0" y1="120" x2="168" y2="120"/><line x1="232" y1="120" x2="400" y2="120"/></g>
    <g stroke="#fff" stroke-width="4"><line x1="174" y1="152" x2="192" y2="152"/><line x1="196" y1="152" x2="214" y2="152"/><line x1="174" y1="158" x2="192" y2="158"/><line x1="196" y1="158" x2="214" y2="158"/></g>
    <g class="an-crosscar"><g transform="translate(-40,96) scale(.8)">${toonCar("", "#20bf6b")}</g></g>
    <g transform="translate(178,206) rotate(-90 24 24)"><g transform="scale(.66)">${toonCar("an-nudge", "#4b7bec")}</g></g>
    ${cap("⏳ Boşluk bekle / Wait for a gap", 132, 202)}</svg>`,

  train: () => `<svg viewBox="0 0 400 240">${SKY_DAY}${GRASS}
    <rect y="150" width="400" height="26" fill="#7f8c8d"/><g fill="#5d4037">${Array.from({ length: 10 }, (_, i) => `<rect x="${8 + i * 40}" y="152" width="18" height="22"/>`).join("")}</g>
    <g stroke="#95a5a6" stroke-width="4"><line x1="0" y1="156" x2="400" y2="156"/><line x1="0" y1="170" x2="400" y2="170"/></g>
    <g class="an-train"><rect x="0" y="112" width="150" height="42" rx="8" fill="#eb3b5a"/><rect x="14" y="120" width="26" height="17" rx="3" fill="#dff3fb"/><rect x="52" y="120" width="26" height="17" rx="3" fill="#dff3fb"/><rect x="90" y="120" width="26" height="17" rx="3" fill="#dff3fb"/><circle cx="30" cy="154" r="8" fill="#2f3640"/><circle cx="75" cy="154" r="8" fill="#2f3640"/><circle cx="120" cy="154" r="8" fill="#2f3640"/></g>
    <rect x="60" y="182" width="7" height="46" fill="#39424e"/>
    <g class="an-barrier"><rect x="60" y="182" width="130" height="9" rx="4" fill="#fff" stroke="#e74c3c" stroke-width="2.4" stroke-dasharray="16 12"/></g>
    <g><circle cx="40" cy="192" r="7" fill="#e74c3c" class="an-blink"/><circle cx="40" cy="210" r="7" fill="#e74c3c" class="an-blink2"/></g>
    <g transform="translate(210,190) scale(.85)">${toonCar("", "#f7b731")}</g>
    ${cap("🚂 DUR ve BEKLE! / STOP and WAIT!", 12, 12, "#c0392b")}</svg>`,

  cyclist: () => `<svg viewBox="0 0 400 240">${SKY_DAY}${GRASS}${ROAD}
    <g class="an-cyclist" transform="translate(250,176)">
      <g class="an-wheel"><circle cx="0" cy="22" r="14" fill="none" stroke="#2f3640" stroke-width="3.6"/></g>
      <g class="an-wheel"><circle cx="34" cy="22" r="14" fill="none" stroke="#2f3640" stroke-width="3.6"/></g>
      <path d="M0 22 L14 2 H30 L34 22 M14 2 L20 22" fill="none" stroke="#e74c3c" stroke-width="3.4"/>
      <circle cx="24" cy="-16" r="6.4" fill="#f3c188"/><path d="M17 -21 Q24 -27 31 -21 Z" fill="#0984e3"/>
      <path d="M24 -10 L18 4 M24 -10 L30 0" stroke="#0984e3" stroke-width="4.4" stroke-linecap="round"/></g>
    <g transform="translate(30,144) scale(.9)">${toonCar("an-drive-slow", "#26de81")}</g>
    <g class="an-pulse"><path d="M158 176 V214" stroke="#e67e22" stroke-width="4"/><path d="M158 176 l-6 10 h12 Z" fill="#e67e22"/><path d="M158 214 l-6 -10 h12 Z" fill="#e67e22"/>
      <rect x="166" y="184" width="66" height="21" rx="8" fill="#e67e22"/><text x="199" y="199" font-size="12.5" font-weight="800" fill="#fff" text-anchor="middle">1.5 m!</text></g></svg>`,

  siren: () => `<svg viewBox="0 0 400 240">${SKY_DAY}${GRASS}${ROAD}
    <g class="an-ambulance"><g transform="translate(0,150)"><rect x="0" y="8" width="110" height="38" rx="8" fill="#fff" stroke="#dcdde1" stroke-width="2"/><rect x="76" y="14" width="26" height="16" rx="3" fill="#74b9ff"/><rect x="30" y="16" width="22" height="7" fill="#e74c3c"/><rect x="37.5" y="9" width="7" height="21" fill="#e74c3c"/><circle cx="24" cy="48" r="10" fill="#2f3640"/><circle cx="86" cy="48" r="10" fill="#2f3640"/><rect x="40" y="-2" width="18" height="8" rx="3" fill="#3498db" class="an-bluelight"/></g></g>
    <g transform="translate(250,164) scale(.9)"><g class="an-pullover">${toonCar("", "#f7b731")}</g></g>
    ${cap("🚨 Nii-nuu! Yol aç / Make way!", 140, 26, "#2d3436")}</svg>`,

  motorway: () => `<svg viewBox="0 0 400 240">${SKY_DAY}
    <rect y="118" width="400" height="122" fill="#5b6270"/>
    <g stroke="#fff" stroke-width="4" stroke-dasharray="24 18"><line x1="0" y1="158" x2="400" y2="158"/><line x1="0" y1="198" x2="400" y2="198"/></g>
    <rect y="118" width="400" height="6" fill="#f39c12"/>
    <g transform="translate(60,20)"><rect width="280" height="54" rx="8" fill="#2f3640"/><rect x="8" y="54" width="8" height="64" fill="#2f3640"/><rect x="264" y="54" width="8" height="64" fill="#2f3640"/>
      <g transform="translate(36,8)"><rect width="56" height="38" rx="5" fill="#111"/><g class="an-redx" stroke="#e74c3c" stroke-width="6" stroke-linecap="round"><line x1="14" y1="8" x2="42" y2="30"/><line x1="42" y1="8" x2="14" y2="30"/></g></g>
      <g transform="translate(112,8)"><rect width="56" height="38" rx="5" fill="#111"/><circle cx="28" cy="19" r="16" fill="none" stroke="#e74c3c" stroke-width="4"/><text x="28" y="25" font-size="15" font-weight="800" fill="#fff" text-anchor="middle">50</text></g>
      <g transform="translate(188,8)"><rect width="56" height="38" rx="5" fill="#111"/><path d="M18 26 V14 l10 6 l10 -6 v12" stroke="#2ecc71" stroke-width="3.4" fill="none"/><path d="M28 8 l-5 8 h10 Z" fill="#2ecc71"/></g></g>
    <g class="an-mwcar1"><g transform="translate(0,124) scale(.8)">${toonCar("", "#45aaf2")}</g></g>
    <g class="an-mwcar2"><g transform="translate(0,164) scale(.8)">${toonCar("", "#26de81")}</g></g>
    ${cap("❌ Kırmızı X = şerit KAPALI", 12, 86, "#c0392b")}</svg>`,

  dash: () => `<svg viewBox="0 0 400 240"><rect width="400" height="240" fill="#2d3436"/>
    <path d="M40 220 A160 160 0 0 1 360 220" fill="none" stroke="#636e72" stroke-width="10"/>
    <g transform="translate(120,70)"><circle r="34" fill="#111" stroke="#636e72" stroke-width="4"/><g class="an-needle"><line x1="0" y1="0" x2="0" y2="-26" stroke="#e74c3c" stroke-width="4" stroke-linecap="round"/></g><text y="50" font-size="11" fill="#b2bec3" text-anchor="middle">mph</text></g>
    <g transform="translate(280,70)"><circle r="34" fill="#111" stroke="#636e72" stroke-width="4"/><g class="an-needle2"><line x1="0" y1="0" x2="0" y2="-26" stroke="#e67e22" stroke-width="4" stroke-linecap="round"/></g><text y="50" font-size="11" fill="#b2bec3" text-anchor="middle">rpm</text></g>
    <g transform="translate(88,150)" class="an-blink"><rect width="52" height="40" rx="8" fill="#111"/><text x="26" y="27" font-size="20" text-anchor="middle">🛢️</text></g>
    <g transform="translate(174,150)" class="an-blink2"><rect width="52" height="40" rx="8" fill="#111"/><text x="26" y="27" font-size="20" text-anchor="middle">🌡️</text></g>
    <g transform="translate(260,150)" class="an-blink"><rect width="52" height="40" rx="8" fill="#111"/><text x="26" y="28" font-size="19" text-anchor="middle" fill="#e74c3c" font-weight="800">(!)</text></g>
    ${cap("💡 Uyarı ışığı = araç seninle konuşuyor!", 46, 202, "#fff", true)}</svg>`,

  hill: () => `<svg viewBox="0 0 400 240">${SKY_DAY}
    <path d="M0 240 L0 200 L400 90 L400 240 Z" fill="#8fd06c"/>
    <path d="M0 214 L400 104 L400 132 L0 242 Z" fill="#5b6270"/>
    <g transform="translate(150,132) rotate(-15.4)">${toonCar("", "#eb3b5a")}</g>
    ${cap("🤚 El freni kullan! / Use the handbrake", 12, 12, "#c0392b")}
    <path class="an-antiroll" d="M118 196 l-26 8" stroke="#c0392b" stroke-width="5" stroke-linecap="round"/>
    <path d="M92 204 l12 -1 l-7 -9 Z" fill="#c0392b" class="an-antiroll"/>
    </svg>`,

  park: () => `<svg viewBox="0 0 400 240">${SKY_DAY}${GRASS}
    <rect y="168" width="400" height="58" fill="#5b6270"/>
    <rect y="160" width="400" height="10" fill="#95a5a6"/>
    <g stroke="#f1c40f" stroke-width="5"><line x1="0" y1="172" x2="400" y2="172"/><line x1="0" y1="181" x2="400" y2="181"/></g>
    <g transform="translate(140,158)">${toonCar("", "#45aaf2")}</g>
    <g class="an-noPulse"><circle cx="200" cy="120" r="34" fill="none" stroke="#e74c3c" stroke-width="8"/><line x1="176" y1="96" x2="224" y2="144" stroke="#e74c3c" stroke-width="8"/></g>\n    ${cap("🚫 Çift sarı çizgi = PARK YASAK", 12, 12, "#c0392b")}</svg>`,

  phone: () => `<svg viewBox="0 0 400 240">${SKY_DAY}${GRASS}${ROAD}
    <g transform="translate(60,158)">${toonCar("an-weave", "#fd9644", `<g transform="translate(52,-16)"><rect x="-7" y="-12" width="14" height="24" rx="3.5" fill="#2f3640"/><rect x="-4.6" y="-9" width="9.2" height="15" fill="#74b9ff"/><g class="an-buzz"><path d="M10 -14 q6 4 0 9" stroke="#e17055" stroke-width="2.4" fill="none"/><path d="M15 -18 q9 7 0 16" stroke="#e17055" stroke-width="2.4" fill="none"/></g></g>`)}</g>
    <g class="an-noPulse"><circle cx="112" cy="120" r="30" fill="none" stroke="#e74c3c" stroke-width="7"/><line x1="91" y1="99" x2="133" y2="141" stroke="#e74c3c" stroke-width="7"/></g>
    ${cap("📵 Elde telefon = YASAK (6 puan)", 12, 12, "#c0392b")}
    <path class="an-weaveline" d="M60 232 q40 -8 80 0 q40 8 80 0 q40 -8 80 0" stroke="#e17055" stroke-width="3.4" stroke-dasharray="9 7" fill="none"/></svg>`,

  impaired: () => `<svg viewBox="0 0 400 240">${SKY_NIGHT}
    <rect y="150" width="400" height="90" fill="#2c3a4f"/>
    <rect y="168" width="400" height="58" fill="#3d4453"/><g stroke="#c8cdd6" stroke-width="4" stroke-dasharray="22 18"><line x1="0" y1="197" x2="400" y2="197"/></g>
    <g transform="translate(120,158)">${toonCar("an-weave", "#a55eea")}</g>
    <path class="an-weaveline" d="M40 230 q40 -10 80 0 q40 10 80 0 q40 -10 80 0 q40 10 80 0" stroke="#e74c3c" stroke-width="3.6" stroke-dasharray="10 8" fill="none"/>
    <g class="an-pop"><text x="48" y="70" font-size="30">🍺</text><text x="90" y="70" font-size="26">💊</text><text x="128" y="70" font-size="28">😴</text></g>
    <g class="an-noPulse"><circle cx="100" cy="62" r="54" fill="none" stroke="#e74c3c" stroke-width="7"/><line x1="63" y1="25" x2="137" y2="99" stroke="#e74c3c" stroke-width="7"/></g>
    ${cap("🚫 Alkollü / yorgun SÜRME!", 168, 16, "#fff", true)}</svg>`,

  belt: () => `<svg viewBox="0 0 400 240"><rect width="400" height="240" fill="#dfe6e9"/>
    <g transform="translate(200,130)">
      <rect x="-64" y="-20" width="128" height="120" rx="18" fill="#636e72"/>
      <rect x="-52" y="-88" width="104" height="74" rx="16" fill="#636e72"/>
      <circle cx="0" cy="-46" r="26" fill="#f3c188"/><path d="M-22 -56 Q0 -78 22 -56 Q14 -68 0 -68 Q-14 -68 -22 -56" fill="#6c5ce7"/>
      <circle cx="-9" cy="-48" r="3" fill="#333"/><circle cx="9" cy="-48" r="3" fill="#333"/><path d="M-8 -36 q8 7 16 0" stroke="#333" stroke-width="2.4" fill="none"/>
      <rect x="-46" y="-16" width="92" height="82" rx="14" fill="#0984e3"/>
      <path class="an-belt" d="M-46 -30 L38 66" stroke="#2d3436" stroke-width="13" stroke-linecap="round"/>
      <rect x="28" y="56" width="26" height="18" rx="4" fill="#e17055"/></g>
    <text x="200" y="34" font-size="17" font-weight="800" fill="#2d3436" text-anchor="middle">Klik! 🎯 Kemer hayat kurtarır</text>
    <text x="330" y="130" font-size="42" class="an-pop">✅</text></svg>`,

  mirrors: () => `<svg viewBox="0 0 400 240"><rect width="400" height="240" fill="#8fd06c"/>
    <rect x="120" y="0" width="160" height="240" fill="#5b6270"/>
    <g stroke="#fff" stroke-width="4" stroke-dasharray="18 14"><line x1="200" y1="0" x2="200" y2="240"/></g>
    <g transform="translate(150,120)"><g class="an-mirrorcone"><path d="M24 40 L-30 150 L80 150 Z" fill="rgba(255,235,59,.35)"/></g>
      <rect x="0" y="0" width="48" height="86" rx="12" fill="#eb3b5a"/><rect x="7" y="12" width="34" height="20" rx="5" fill="#dff3fb"/><rect x="7" y="58" width="34" height="16" rx="5" fill="#f9d5d5"/>
      <rect x="-9" y="18" width="9" height="7" rx="2" fill="#eb3b5a"/><rect x="48" y="18" width="9" height="7" rx="2" fill="#eb3b5a"/></g>
    <g class="an-overtaker"><g transform="translate(222,250)"><rect x="0" y="0" width="48" height="86" rx="12" fill="#45aaf2"/><rect x="7" y="12" width="34" height="20" rx="5" fill="#dff3fb"/></g></g>
    <g class="an-msmtext"><rect x="10" y="26" width="136" height="94" rx="12" fill="rgba(255,255,255,.92)"/><text x="20" y="50" font-size="17" font-weight="800" fill="#2d3436">1️⃣ Ayna</text><text x="20" y="78" font-size="17" font-weight="800" fill="#2d3436">2️⃣ Sinyal</text><text x="20" y="106" font-size="17" font-weight="800" fill="#2d3436">3️⃣ Manevra</text></g></svg>`,

  works: () => `<svg viewBox="0 0 400 240">${SKY_DAY}${GRASS}${ROAD}
    <g transform="translate(250,148)">${Array.from({ length: 3 }, (_, i) => `<g transform="translate(${i * 46},${i * 8})"><path d="M0 46 L10 8 L20 46 Z" fill="#e17055"/><rect x="-3" y="42" width="26" height="7" rx="2.4" fill="#e17055"/><rect x="4" y="22" width="12" height="7" fill="#fff"/></g>`).join("")}</g>
    <g transform="translate(320,120)"><g class="an-dig"><circle cx="0" cy="-24" r="8" fill="#f3c188"/><path d="M-9 -31 Q0 -40 9 -31 Z" fill="#f1c40f"/><path d="M0 -16 V6" stroke="#e67e22" stroke-width="7" stroke-linecap="round"/><path d="M0 6 L-8 26 M0 6 L8 26" stroke="#34495e" stroke-width="5" stroke-linecap="round"/><path d="M0 -10 L20 4 L30 -4" stroke="#e67e22" stroke-width="4.6" fill="none" stroke-linecap="round"/><ellipse cx="33" cy="-2" rx="6" ry="3.6" fill="#95a5a6" transform="rotate(40 33 -2)"/></g></g>
    <g transform="translate(20,158)">${toonCar("an-drive-slow", "#4b7bec")}</g>
    ${cap("🚧 Yol çalışması: yavaşla!", 12, 12, "#d35400")}</svg>`,

  signshape: () => `<svg viewBox="0 0 400 240"><rect width="400" height="240" fill="#eef7ff"/>
    <g transform="translate(38,40)"><g class="an-signpop1">
      <circle cx="42" cy="42" r="40" fill="#fff" stroke="#c00" stroke-width="8"/>
      <text x="42" y="55" font-size="30" font-weight="800" text-anchor="middle" fill="#333">30</text>
      <text x="42" y="112" font-size="13" font-weight="800" text-anchor="middle" fill="#c0392b">Kırmızı çember</text>
      <text x="42" y="128" font-size="12" font-weight="700" text-anchor="middle" fill="#c0392b">= YASAK / EMİR</text></g></g>
    <g transform="translate(158,40)"><g class="an-signpop2">
      <path d="M42 2 L82 78 L2 78 Z" fill="#fff" stroke="#c00" stroke-width="7" stroke-linejoin="round"/>
      <text x="42" y="66" font-size="34" font-weight="800" text-anchor="middle" fill="#333">!</text>
      <text x="42" y="112" font-size="13" font-weight="800" text-anchor="middle" fill="#d35400">Üçgen</text>
      <text x="42" y="128" font-size="12" font-weight="700" text-anchor="middle" fill="#d35400">= UYARI</text></g></g>
    <g transform="translate(278,40)"><g class="an-signpop3">
      <circle cx="42" cy="42" r="40" fill="#0064c8"/>
      <path d="M42 66 V30" stroke="#fff" stroke-width="9"/><path d="M27 38 L42 16 L57 38 Z" fill="#fff"/>
      <text x="42" y="112" font-size="13" font-weight="800" text-anchor="middle" fill="#0064c8">Mavi daire</text>
      <text x="42" y="128" font-size="12" font-weight="700" text-anchor="middle" fill="#0064c8">= TALİMAT</text></g></g>
    <text x="200" y="200" font-size="15" font-weight="800" fill="#2d3436" text-anchor="middle" class="an-fadein">Şekli gör → anlamını bil! 🧠</text>
    <text x="200" y="222" font-size="12.5" font-weight="700" fill="#636e72" text-anchor="middle" class="an-fadein">Circle = order • Triangle = warning • Blue = instruction</text></svg>`,

  generic: () => `<svg viewBox="0 0 400 240"><rect width="400" height="240" fill="#dff9fb"/>
    <g transform="translate(200,120)"><g class="an-pop">
      <path d="M0 -74 L58 -52 V6 Q58 58 0 80 Q-58 58 -58 6 V-52 Z" fill="#26de81" stroke="#20bf6b" stroke-width="5"/>
      <path d="M-26 4 L-6 26 L32 -22" fill="none" stroke="#fff" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/></g></g>
    <g class="an-stars"><text x="70" y="60" font-size="24">✨</text><text x="300" y="80" font-size="22">⭐</text><text x="90" y="190" font-size="20">🌟</text><text x="310" y="190" font-size="24">✨</text></g>
    ${cap("Kararsızsan → EN GÜVENLİ seçenek! 🛡️", 52, 202)}</svg>`,
};

function renderScene(name, container) {
  const fn = SCENES[name] || SCENES.generic;
  container.innerHTML = `<div class="scene-frame">${fn()}</div>`;
}
