/* =====================================================================
   Ehliyet Kankam UK — uygulama mantığı
   ===================================================================== */

const $ = (sel) => document.querySelector(sel);
const app = () => $("#app");

const state = {
  lang: localStorage.getItem("ek-lang") || "tr",   // arayüz dili
  qlang: localStorage.getItem("ek-qlang") || "both", // soru dili: en | tr | both
  auto: false,
  timer: null,
  speech: window.speechSynthesis || null,
};

const t = (key) => (UI[key] ? UI[key][state.lang] : key);
const byId = Object.fromEntries(QUESTIONS.map((q) => [q.id, q]));

/* ---------- profiller: her kullanıcının ilerlemesi ayrı ---------- */
const AVATARS = ["🚗", "🚙", "🏎️", "🛵", "🚌", "🦊", "🐱", "🦁", "🐼", "⭐", "🌙", "⚡"];
function getProfiles() {
  try { return JSON.parse(localStorage.getItem("ek-profiles")) || []; } catch { return []; }
}
function saveProfiles(ps) { localStorage.setItem("ek-profiles", JSON.stringify(ps)); }
function activeProfile() {
  const ps = getProfiles();
  return ps.find((p) => p.id === localStorage.getItem("ek-active")) || ps[0] || null;
}
function setActiveProfile(id) { localStorage.setItem("ek-active", id); }
function progKey() { const a = activeProfile(); return "ek-prog-" + (a ? a.id : "default"); }
/* Eski tek-kullanıcılı veriyi ilk profile taşı */
(function migrateLegacy() {
  if (getProfiles().length) return;
  const legacy = localStorage.getItem("ek-prog");
  if (legacy) {
    const id = "p" + Date.now();
    saveProfiles([{ id, name: "Ben", avatar: "🚗" }]);
    setActiveProfile(id);
    localStorage.setItem("ek-prog-" + id, legacy);
    localStorage.removeItem("ek-prog");
  }
})();

/* ---------- ilerleme (aktif profile bağlı) ---------- */
function loadProg() {
  try { return JSON.parse(localStorage.getItem(progKey())) || {}; } catch { return {}; }
}
function saveProg(p) { localStorage.setItem(progKey(), JSON.stringify(p)); }
function record(qid, ok) {
  const p = loadProg(); p.seen = p.seen || {};
  const s = p.seen[qid] || { c: 0, w: 0 };
  ok ? s.c++ : s.w++;
  p.seen[qid] = s; saveProg(p);
}

/* ---------- yardımcılar ---------- */
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

function stopSpeech() {
  // iptal edilen sesin onend'i tetiklenip otomatik akışı bozmasın
  if (state.pendingUtter) { state.pendingUtter.onend = null; state.pendingUtter = null; }
  if (state.speech) state.speech.cancel();
}

/* --- Ses kalitesi: cihazdaki EN İYİ sesi seç ---
   Google/Siri/Natural/Neural sesler öne alınır, robotik eSpeak dışlanır. */
let VOICES = [];
function refreshVoices() { if (state.speech) VOICES = state.speech.getVoices() || []; }
if (state.speech && "onvoiceschanged" in state.speech) state.speech.onvoiceschanged = refreshVoices;
refreshVoices();

function pickVoice(lang) {
  if (!VOICES.length) refreshVoices();
  const pref = lang === "en" ? "en-gb" : "tr";
  const base = lang === "en" ? "en" : "tr";
  const cands = VOICES.filter((v) => (v.lang || "").replace("_", "-").toLowerCase().startsWith(base));
  if (!cands.length) return null;
  const score = (v) => {
    let s = 0;
    const n = (v.name || "").toLowerCase();
    const l = (v.lang || "").replace("_", "-").toLowerCase();
    if (l.startsWith(pref)) s += 8;                        // İngiliz aksanı (en-GB) şart
    else if (lang === "en" && l.startsWith("en-us")) s -= 2; // Amerikan aksanını geri it
    for (const k of ["natural", "neural", "premium", "enhanced", "siri", "google", "yelda", "filiz", "daniel", "serena", "kate", "sonia", "libby"]) {
      if (n.includes(k)) { s += 5; break; }
    }
    if (v.default) s += 1;
    if (n.includes("espeak") || n.includes("eloquence")) s -= 8;
    return s;
  };
  return cands.slice().sort((a, b) => score(b) - score(a))[0];
}

/* Seslendirme metnini temizle: emojiler okunmasın, birimler doğru söylensin */
function ttsClean(text, lang) {
  let s = text.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{FE0F}]/gu, "").replace(/\s+/g, " ").trim();
  s = s.replace(/(\d+(?:[.,]\d+)?)\s*mm\b/g, lang === "tr" ? "$1 milimetre" : "$1 millimetres");
  s = s.replace(/(\d+(?:[.,]\d+)?)\s*m\b/g, lang === "tr" ? "$1 metre" : "$1 metres");
  if (lang === "tr") {
    s = s.replace(/(\d+)\s*mph\b/g, "saatte $1 mil");
    s = s.replace(/(\d)\.(\d)/g, "$1,$2");
    s = s.replace(/\bDVSA\b/g, "Di-Vi-Es-Ey").replace(/\bMOT\b/g, "Em-O-Ti").replace(/\bCPR\b/g, "kalp masajı");
  }
  return s;
}

/* Kullanıcının elle seçtiği ses (Ses Ayarları) otomatik seçimin önüne geçer */
function chosenVoice(lang) {
  const uri = localStorage.getItem("ek-voice-" + lang);
  if (!uri || uri === "auto") return null;
  return VOICES.find((v) => v.voiceURI === uri) || null;
}
function speedFactor() { return parseFloat(localStorage.getItem("ek-rate") || "1"); }

function makeUtter(text, lang) {
  const u = new SpeechSynthesisUtterance(ttsClean(text, lang));
  u.lang = lang === "en" ? "en-GB" : "tr-TR";
  u.rate = (lang === "en" ? 0.92 : 0.97) * speedFactor();
  u.pitch = 1.02;
  const v = chosenVoice(lang) || pickVoice(lang);
  if (v) u.voice = v;
  return u;
}

/* Türkçe ses yüklü değilse bir kez uyar (İngiliz sesiyle Türkçe okumak berbat çıkar) */
function trVoiceOk() {
  if (chosenVoice("tr") || pickVoice("tr")) return true;
  if (!localStorage.getItem("ek-trvoice-warned")) {
    localStorage.setItem("ek-trvoice-warned", "1");
    toast(t("trVoiceMissing"), 6000);
  }
  return false;
}

/* Cümle cümle kuyrukla — tek nefeste okuyan robotik akış yerine doğal duraklar */
function ttsSplit(text) { return text.split(/(?<=[.!?…])\s+/).map((s) => s.trim()).filter(Boolean); }
function queueText(text, lang) {
  const parts = ttsSplit(ttsClean(text, lang));
  const utters = parts.map((s) => makeUtter(s, lang));
  utters.forEach((u) => state.speech.speak(u));
  return utters;
}

/* Sesli anlatım tamamen kapatılabilir (robotik ses istemeyenler için) */
function isMuted() { return localStorage.getItem("ek-mute") === "1"; }
function toggleMute() {
  const m = !isMuted();
  localStorage.setItem("ek-mute", m ? "1" : "0");
  stopSpeech();
  if (m) toast(t("mutedNow"));
  rerender();
}

function speak(text, lang) {
  if (!state.speech || isMuted()) return;
  stopSpeech();
  if (lang === "tr" && !trVoiceOk()) return;
  queueText(text, lang);
}

/* Kısa bildirim balonu */
function toast(msg, ms = 3000) {
  const d = document.createElement("div");
  d.className = "toast";
  d.textContent = msg;
  document.body.appendChild(d);
  setTimeout(() => { d.classList.add("gone"); setTimeout(() => d.remove(), 400); }, ms);
}

/* Şık üretimi: özel yanlışlar varsa onlar, yoksa tipe uygun havuzdan */
function buildOptions(q) {
  let wrongs;
  if (q.signWrongs) {
    wrongs = shuffle(SIGNS.filter((s) => s.id !== q.signId)).slice(0, 3).map((s) => ({ en: s.en, tr: s.tr }));
  } else if (q.w) wrongs = q.w;
  else {
    const pool = q.type === "why" ? POOL_WHY : q.type === "when" ? POOL_WHEN : POOL_DO;
    const corrWords = (q.a.en.toLowerCase().match(/[a-zçğıöşü]+/g) || []).filter((w) => w.length > 3);
    const ok = pool.filter((o) => {
      const ow = o.en.toLowerCase();
      return !corrWords.some((w) => ow.includes(w));
    });
    wrongs = shuffle(ok).slice(0, 3);
    let extra = 0;
    while (wrongs.length < 3) wrongs.push(pool[extra++ % pool.length]);
  }
  const opts = shuffle([{ ...q.a, ok: true }, ...wrongs.map((w) => ({ ...w, ok: false }))]);
  return opts;
}

/* Levha sorusu ise soru kartında levhayı göster */
function signBlock(q) {
  if (!q.signId) return "";
  const s = SIGNS.find((x) => x.id === q.signId);
  return s ? `<div class="q-sign">${s.svg}</div>` : "";
}

/* Ses efektleri (WebAudio — kısa ding / buzz) */
function sfx(ok) {
  try {
    const ctx = sfx.ctx || (sfx.ctx = new (window.AudioContext || window.webkitAudioContext)());
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    const t = ctx.currentTime;
    if (ok) {
      o.type = "sine"; o.frequency.setValueAtTime(660, t); o.frequency.setValueAtTime(880, t + 0.1);
      g.gain.setValueAtTime(0.12, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      o.start(t); o.stop(t + 0.35);
    } else {
      o.type = "square"; o.frequency.setValueAtTime(160, t);
      g.gain.setValueAtTime(0.07, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      o.start(t); o.stop(t + 0.3);
    }
  } catch (e) { /* ses yoksa sessiz devam */ }
}

function qText(obj) {
  if (state.qlang === "en") return `<div class="q-en">${esc(obj.en)}</div>`;
  if (state.qlang === "tr") return `<div class="q-tr">${esc(obj.tr)}</div>`;
  return `<div class="q-en">${esc(obj.en)}</div><div class="q-tr">${esc(obj.tr)}</div>`;
}

function header(showBack, title) {
  const a = activeProfile();
  return `<header class="top">
    ${showBack ? `<button class="icon-btn" onclick="goHome()">←</button>` : `<span class="logo">🚗</span>`}
    <div class="top-title">${title || t("appName")}</div>
    <div class="top-actions">
      ${a ? `<button class="icon-btn avatar-btn" onclick="setView(profilesView)" title="${esc(a.name)}">${a.avatar}</button>` : ""}
      <button class="icon-btn lang-btn" onclick="toggleLang()">${state.lang === "tr" ? "🇬🇧 EN" : "🇹🇷 TR"}</button>
    </div></header>`;
}

function toggleLang() { state.lang = state.lang === "tr" ? "en" : "tr"; localStorage.setItem("ek-lang", state.lang); rerender(); }
let lastView = () => home();
function rerender() { lastView(); }
function setView(fn) { lastView = fn; stopSpeech(); clearInterval(state.timer); fn(); window.scrollTo(0, 0); }
function goHome() { setView(home); }

/* =====================================================================
   ANA SAYFA
   ===================================================================== */
function home() {
  const p = loadProg();
  const seen = p.seen ? Object.keys(p.seen).length : 0;
  let c = 0, w = 0;
  if (p.seen) for (const s of Object.values(p.seen)) { c += s.c; w += s.w; }
  const acc = c + w ? Math.round((100 * c) / (c + w)) : 0;
  const best = p.bestMock != null ? `${p.bestMock}/50` : "—";

  app().innerHTML = `${header(false)}
  <div class="hero">
    <div class="hero-car">${SCENES.generic ? "" : ""}<span class="hero-emoji">🚗💨</span></div>
    <h1>${t("appName")}</h1>
    <p class="tagline">${t("tagline")}</p>
  </div>
  <div class="stats">
    <div class="stat"><b>${seen}</b><span>${t("statSeen")}</span></div>
    <div class="stat"><b>%${acc}</b><span>${t("statCorrect")}</span></div>
    <div class="stat"><b>${best}</b><span>${t("statBest")}</span></div>
  </div>
  <nav class="menu">
    <button class="menu-card mc-lessons" onclick="setView(lessonList)">
      <span class="mc-icon">🎬</span><span class="mc-title">${t("lessons")}</span><span class="mc-sub">${t("lessonsSub")}</span></button>
    <button class="menu-card mc-quiz" onclick="setView(quizSetup)">
      <span class="mc-icon">❓</span><span class="mc-title">${t("quiz")}</span><span class="mc-sub">${t("quizSub")}</span></button>
    <button class="menu-card mc-cards" onclick="setView(cardsView)">
      <span class="mc-icon">🃏</span><span class="mc-title">${t("cards")}</span><span class="mc-sub">${t("cardsSub")}</span></button>
    <button class="menu-card mc-mock" onclick="setView(mockStart)">
      <span class="mc-icon">📝</span><span class="mc-title">${t("mock")}</span><span class="mc-sub">${t("mockSub")}</span></button>
    <button class="menu-card mc-signs" onclick="setView(signsView)">
      <span class="mc-icon">🚸</span><span class="mc-title">${t("signs")}</span><span class="mc-sub">${t("signsSub")}</span></button>
    <button class="menu-card mc-mistakes" onclick="startQuiz('mistakes')">
      <span class="mc-icon">🔁</span><span class="mc-title">${t("mistakes")}</span><span class="mc-sub">${t("mistakesSub")}</span></button>
    <button class="menu-card mc-install wide" onclick="installApp()">
      <span class="mc-icon">📥</span><span class="mc-title">${t("installTitle")}</span><span class="mc-sub">${t("installSub")}</span></button>
    <button class="menu-card mc-guide" onclick="setView(guideView)">
      <span class="mc-icon">🗓️</span><span class="mc-title">${t("guide")}</span><span class="mc-sub">${t("guideSub")}</span></button>
    <button class="menu-card mc-glossary" onclick="setView(glossaryView)">
      <span class="mc-icon">📖</span><span class="mc-title">${t("glossary")}</span><span class="mc-sub">${t("glossarySub")}</span></button>
  </nav>
  <div class="qlang-row">
    <span>${t("qLangLabel")}:</span>
    ${["both", "en", "tr"].map((m) => `<button class="chip ${state.qlang === m ? "on" : ""}" onclick="setQlang('${m}')">${m === "both" ? t("both") : m.toUpperCase()}</button>`).join("")}
  </div>
  <div class="backup-row">
    <span>${t("backupTitle")}:</span>
    <button class="chip" onclick="backupCopy()">${t("copyBackup")}</button>
    <button class="chip" onclick="backupLoad()">${t("pasteBackup")}</button>
    <button class="chip danger" onclick="progReset()">${t("resetProg")}</button>
  </div>
  <div class="backup-row">
    <button class="chip" onclick="setView(voiceView)">${t("voiceSettings")}</button>
  </div>
  <footer class="foot">${t("installHint")}<br>${t("nonCommercial")}</footer>`;
}
function setQlang(m) { state.qlang = m; localStorage.setItem("ek-qlang", m); rerender(); }

/* ---------- ilerleme yedeği: cihazlar arası taşıma ---------- */
function backupCopy() {
  const code = btoa(JSON.stringify(loadProg()));
  const done = () => alert(t("copied"));
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code).then(done, () => prompt(t("showCode"), code));
  } else {
    prompt(t("showCode"), code);
  }
}
function backupLoad() {
  const code = prompt(t("pastePrompt"));
  if (!code) return;
  try {
    const data = JSON.parse(atob(code.trim()));
    if (typeof data !== "object" || data === null) throw new Error("bad");
    saveProg(data);
    alert(t("loadedOk"));
    rerender();
  } catch (e) { alert(t("badBackup")); }
}
function progReset() {
  if (!confirm(t("confirmReset"))) return;
  localStorage.removeItem("ek-prog");
  rerender();
}

/* =====================================================================
   AÇIKLAMA MODALI — yanlış cevapta animasyon + çift dilli anlatım
   ===================================================================== */
/* Yanlış cevapta sonuç (kaza / son anda fren) hikâyesi oynasın */
const STORY = { distance: "crash", mirrors: "crash", junction: "crash", parked: "nearmiss", zebra: "nearmiss", patrol: "nearmiss" };

function explainHTML(q, isWrong) {
  return `<div class="modal-backdrop" id="modal">
    <div class="modal">
      <div class="modal-head ${isWrong ? "bad" : "good"}">${isWrong ? t("wrong") : t("theAnswer")}</div>
      <div class="scene" id="modalScene"></div>
      ${isWrong ? `<div class="teach">${instructorSVG()}
        <div class="teach-bubble"><b>${state.lang === "tr" ? "Hayır, öyle değil! Doğrusu:" : "No, not like that! The answer is:"}</b> “${esc(state.lang === "tr" ? q.a.tr : q.a.en)}”
        <span class="tb-why">${state.lang === "tr" ? "Çünkü" : "Because"}: ${esc(state.lang === "tr" ? q.logic.tr : q.logic.en)}</span></div></div>` : ""}
      <div class="explain">
        <div class="ex-row ex-en"><span class="ex-label">🇬🇧 ${t("inEnglish")}:</span><b>“${esc(q.a.en)}”</b>
          <button class="mini-btn" onclick="speak(${JSON.stringify(q.q.en + ". The answer is: " + q.a.en + ". " + q.logic.en).replace(/"/g, "&quot;")},'en')">🔊</button></div>
        <div class="ex-row ex-tr"><span class="ex-label">🇹🇷 ${t("inTurkish")}:</span><b>“${esc(q.a.tr)}”</b>
          <button class="mini-btn" onclick="speak(${JSON.stringify(q.q.tr + ". Cevap: " + q.a.tr + ". " + q.logic.tr).replace(/"/g, "&quot;")},'tr')">🔊</button></div>
        <div class="ex-row ex-logic">💡 <b>${t("logic")}:</b> ${esc(state.lang === "tr" ? q.logic.tr : q.logic.en)}</div>
        <div class="ex-row ex-mnemo">🧠 <b>${t("mnemonic")}:</b> <code>${esc(q.ezber)}</code></div>
      </div>
      <button class="big-btn" onclick="closeModal()">${t("continueBtn")} →</button>
    </div></div>`;
}
let modalCb = null;
function openExplain(q, isWrong, cb) {
  modalCb = cb || null;
  document.body.insertAdjacentHTML("beforeend", explainHTML(q, isWrong));
  if (q.signId) {
    const s = SIGNS.find((x) => x.id === q.signId);
    $("#modalScene").innerHTML = `<div class="sign-hero"><div class="sign-hero-svg an-pop-css">${s ? s.svg : ""}</div></div>`;
  } else {
    // yanlışsa önce "sonuç" hikâyesi (kaza / son anda fren), yoksa konu sahnesi
    renderScene((isWrong && STORY[q.scene]) || q.scene, $("#modalScene"));
  }
  // eğitmen konuşur: önce İngilizce (sınav dili), sonra Türkçesi + nedeni
  setTimeout(() => {
    if (!state.speech || isMuted()) return;
    stopSpeech();
    queueText((isWrong ? "No, not like that! The correct answer is: " : "The correct answer is: ") + q.a.en + ".", "en");
    if (trVoiceOk()) queueText((isWrong ? "Hayır, öyle değil! Doğrusu: " : "Doğrusu: ") + q.a.tr + ". Çünkü " + q.logic.tr, "tr");
  }, 350);
}
function closeModal() {
  stopSpeech();
  const m = $("#modal"); if (m) m.remove();
  if (modalCb) { const cb = modalCb; modalCb = null; cb(); }
}

/* =====================================================================
   DERSLER — çizgi film tarzı animasyonlu anlatım
   ===================================================================== */
function lessonList() {
  app().innerHTML = `${header(true, t("lessons"))}
  <p class="page-sub">🎬 ${t("lessonsSub")}</p>
  <div class="lesson-list">
    ${LESSONS.map((l) => {
      const p = loadProg(); const done = (p.lessonsDone || []).includes(l.id);
      return `<button class="lesson-item" onclick="startLesson('${l.id}')">
        <span class="li-icon">${l.icon}</span>
        <span class="li-body"><b>${l.title[state.lang]}</b><small>${l.qids.length + 1} ${t("step").toLowerCase()} ${done ? "• ✅" : ""}</small></span>
        <span class="li-go">▶</span></button>`;
    }).join("")}
  </div>`;
}

let lessonState = null;
function startLesson(id) {
  const l = LESSONS.find((x) => x.id === id);
  lessonState = { l, i: 0, auto: false, autoT: null };
  setView(renderLessonStep);
}

function renderLessonStep() {
  const { l, i } = lessonState;
  const total = l.qids.length + 1;
  const isIntro = i === 0;
  const q = isIntro ? null : byId[l.qids[i - 1]];

  app().innerHTML = `${header(true, l.title[state.lang])}
  <div class="lesson-progress"><div style="width:${((i + 1) / total) * 100}%"></div></div>
  <div class="scene big" id="lessonScene"></div>
  ${isIntro
    ? `<div class="teach lesson-teach">${instructorSVG()}
        <div class="teach-bubble"><b>${l.icon} ${l.title[state.lang]}</b>
          <span class="tb-why">${l.intro[state.lang]}</span>
          <button class="mini-btn" onclick="speak(${JSON.stringify(l.intro.tr).replace(/"/g, "&quot;")},'tr')">${t("listenTR")}</button>
          <button class="mini-btn" onclick="speak(${JSON.stringify(l.intro.en).replace(/"/g, "&quot;")},'en')">${t("listenEN")}</button>
        </div></div>`
    : `<div class="teach lesson-teach">${instructorSVG()}
        <div class="teach-bubble">
          <div class="lt-q">🎬 <b>${t("whatHappens")}</b> ${qText(q.q)}</div>
          <div class="ex-row ex-en">🇬🇧 <b>“${esc(q.a.en)}”</b>
            <button class="mini-btn" onclick="speak(${JSON.stringify(q.a.en).replace(/"/g, "&quot;")},'en')">🔊</button></div>
          <div class="ex-row ex-tr">🇹🇷 <b>“${esc(q.a.tr)}”</b>
            <button class="mini-btn" onclick="speak(${JSON.stringify(q.a.tr + ". " + q.logic.tr).replace(/"/g, "&quot;")},'tr')">🔊</button></div>
          <div class="ex-row ex-logic">💡 ${esc(state.lang === "tr" ? q.logic.tr : q.logic.en)}</div>
          <div class="ex-row ex-mnemo">🧠 <code>${esc(q.ezber)}</code></div>
        </div></div>`}
  <button class="text-btn narrate-btn" onclick="narrateStep()">${t("narrate")}</button>
  <div class="lesson-nav">
    <button class="nav-btn" ${i === 0 ? "disabled" : ""} onclick="lessonGo(-1)">← ${t("prev")}</button>
    <button class="nav-btn auto ${lessonState.auto ? "on" : ""}" onclick="toggleAuto()">${lessonState.auto ? t("stopAuto") : t("playAll")}</button>
    <button class="nav-btn primary" onclick="lessonGo(1)">${i === total - 1 ? t("finish") : t("next") + " →"}</button>
  </div>
  <div class="step-label">${t("step")} ${i + 1} / ${total}</div>`;

  // Giriş: başkahraman tahtada — tahtaya konu başlığı ve ezber kodları yazılır
  if (isIntro) {
    renderScene("classroom", $("#lessonScene"), {
      title: l.title[state.lang],
      lines: l.qids.slice(0, 3).map((id) => byId[id].ezber),
    });
  } else {
    renderScene(q.scene, $("#lessonScene"));
  }
  if (lessonState.auto) {
    // video gibi: sesli anlatım biter bitmez sonraki sahneye geç
    const stepAtStart = lessonState.i;
    const advance = () => {
      if (!lessonState || !lessonState.auto || lessonState.i !== stepAtStart) return;
      lessonState.autoT = setTimeout(() => lessonGo(1), 1000);
    };
    if (state.speech) {
      narrateStep(advance);
      // ses hiç başlamazsa diye emniyet zamanlayıcısı
      lessonState.autoT = setTimeout(advance, 30000);
    } else {
      lessonState.autoT = setTimeout(() => lessonGo(1), isIntro ? 7000 : 11000);
    }
  }
}

/* Her adımı iki dilde seslendir: önce İngilizce (sınav dili), sonra Türkçe.
   onDone verilirse Türkçe anlatım bitince çağrılır (video akışı için). */
function narrateStep(onDone) {
  if (!state.speech || isMuted()) { if (onDone) setTimeout(onDone, 5000); return; }
  const { l, i } = lessonState;
  stopSpeech();
  let enText, trText;
  if (i === 0) {
    enText = l.intro.en; trText = l.intro.tr;
  } else {
    const q = byId[l.qids[i - 1]];
    enText = q.q.en + " The answer is: " + q.a.en + ".";
    trText = "Türkçesi: " + q.q.tr + " Cevap: " + q.a.tr + ". " + q.logic.tr;
  }
  const enUtters = ttsSplit(ttsClean(enText, "en")).map((s) => makeUtter(s, "en"));
  const trUtters = trVoiceOk() ? ttsSplit(ttsClean(trText, "tr")).map((s) => makeUtter(s, "tr")) : [];
  const all = enUtters.concat(trUtters);
  const last = all[all.length - 1];
  if (onDone && last) { last.onend = onDone; state.pendingUtter = last; }
  all.forEach((u) => state.speech.speak(u));
}

function toggleAuto() {
  lessonState.auto = !lessonState.auto;
  clearTimeout(lessonState.autoT); stopSpeech();
  renderLessonStep();
}

function lessonGo(dir) {
  clearTimeout(lessonState.autoT); stopSpeech();
  const total = lessonState.l.qids.length + 1;
  lessonState.i += dir;
  if (lessonState.i >= total) {
    const p = loadProg(); p.lessonsDone = p.lessonsDone || [];
    if (!p.lessonsDone.includes(lessonState.l.id)) p.lessonsDone.push(lessonState.l.id);
    saveProg(p);
    app().innerHTML = `${header(true)}<div class="done-screen"><div class="done-emoji">🎓✨</div>
      <h2>${t("lessonDone")}</h2>
      <button class="big-btn" onclick="setView(lessonList)">${t("lessons")}</button>
      <button class="big-btn ghost" onclick="goHome()">${t("backHome")}</button></div>`;
    return;
  }
  if (lessonState.i < 0) lessonState.i = 0;
  renderLessonStep();
}

/* =====================================================================
   QUIZ — yanlışta animasyon devreye girer
   ===================================================================== */
function quizSetup() {
  // konu bazlı başarı yüzdesi (hangi konuya çalışmalı?)
  const seen = loadProg().seen || {};
  const catAcc = {};
  for (const q of QUESTIONS) {
    const s = seen[q.id];
    if (!s || (s.c + s.w) === 0) continue;
    catAcc[q.cat] = catAcc[q.cat] || { c: 0, w: 0 };
    catAcc[q.cat].c += s.c; catAcc[q.cat].w += s.w;
  }
  const accBadge = (k) => {
    const a = catAcc[k];
    if (!a) return "";
    const pct = Math.round((100 * a.c) / (a.c + a.w));
    const cls = pct >= 80 ? "good" : pct >= 50 ? "mid" : "low";
    return `<em class="cat-acc ${cls}">%${pct}</em>`;
  };
  app().innerHTML = `${header(true, t("quiz"))}
  <p class="page-sub">${t("chooseCat")} — ${t("quizSub").toLowerCase()}</p>
  <div class="cat-grid">
    <button class="cat-card all" onclick="startQuiz('all')"><span>🎲</span>${t("allCats")}</button>
    ${Object.entries(CATS).map(([k, c]) => `<button class="cat-card" onclick="startQuiz('${k}')"><span>${c.icon}</span>${c[state.lang]}${accBadge(k)}</button>`).join("")}
  </div>`;
}

let quiz = null;
function startQuiz(cat) {
  let pool;
  if (cat === "mistakes") {
    const seen = loadProg().seen || {};
    pool = QUESTIONS.filter((q) => (seen[q.id] || {}).w > 0);
    if (!pool.length) {
      app().innerHTML = `${header(true, t("mistakes"))}<div class="done-screen">
        <div class="done-emoji">🌟</div><h2>${t("noMistakes")}</h2>
        <button class="big-btn" onclick="setView(quizSetup)">${t("quiz")}</button>
        <button class="big-btn ghost" onclick="goHome()">${t("backHome")}</button></div>`;
      return;
    }
  } else {
    pool = cat === "all" ? QUESTIONS : QUESTIONS.filter((q) => q.cat === cat);
  }
  quiz = { qs: shuffle(pool).slice(0, 10), i: 0, score: 0, locked: false };
  setView(renderQuiz);
}

function renderQuiz() {
  const q = quiz.qs[quiz.i];
  const opts = buildOptions(q);
  quiz.opts = opts;
  app().innerHTML = `${header(true, `${t("quiz")} ${quiz.i + 1}/${quiz.qs.length}`)}
  <div class="quiz-top"><span class="badge">${CATS[q.cat].icon} ${CATS[q.cat][state.lang]}</span>
  <span class="badge score">⭐ ${quiz.score}</span></div>
  ${q.signId ? "" : `<div class="scene quiz-scene" id="quizScene"></div>`}
  <div class="question-card">${signBlock(q)}${qText(q.q)}</div>
  <div class="options">
    ${opts.map((o, idx) => `<button class="opt" id="opt${idx}" onclick="answerQuiz(${idx})">
      ${state.qlang === "en" ? esc(o.en) : state.qlang === "tr" ? esc(o.tr) : `<span class="o-en">${esc(o.en)}</span><span class="o-tr">${esc(o.tr)}</span>`}
    </button>`).join("")}
  </div>
  <button class="text-btn" onclick='openExplain(byId["${q.id}"], false, null)'>${t("showAnim")}</button>`;
  // soru sorulurken görsel oynar (çizgi film hissi)
  if (!q.signId) renderScene(q.scene, $("#quizScene"));
}

function answerQuiz(idx) {
  if (quiz.locked) return;
  quiz.locked = true;
  const q = quiz.qs[quiz.i];
  const o = quiz.opts[idx];
  const okIdx = quiz.opts.findIndex((x) => x.ok);
  $("#opt" + okIdx).classList.add("right");
  record(q.id, o.ok);
  if (o.ok) {
    quiz.score++;
    $("#opt" + idx).classList.add("right");
    sfx(true); confetti();
    setTimeout(nextQuiz, 900);
  } else {
    $("#opt" + idx).classList.add("wrongopt");
    sfx(false);
    setTimeout(() => openExplain(q, true, nextQuiz), 650);
  }
}

function nextQuiz() {
  quiz.i++; quiz.locked = false;
  if (quiz.i >= quiz.qs.length) {
    const pct = Math.round((100 * quiz.score) / quiz.qs.length);
    app().innerHTML = `${header(true)}<div class="done-screen">
      <div class="done-emoji">${pct >= 80 ? "🏆" : pct >= 50 ? "💪" : "📚"}</div>
      <h2>${t("score")}: ${quiz.score}/${quiz.qs.length}</h2>
      <p class="big-pct">%${pct}</p>
      <button class="big-btn" onclick="setView(quizSetup)">${t("tryAgain")}</button>
      <button class="big-btn ghost" onclick="goHome()">${t("backHome")}</button></div>`;
    return;
  }
  renderQuiz();
}

function confetti() {
  const div = document.createElement("div");
  div.className = "confetti";
  div.innerHTML = Array.from({ length: 18 }, (_, i) => `<span style="left:${5 + Math.random() * 90}%;animation-delay:${Math.random() * 0.3}s;background:hsl(${Math.random() * 360},80%,60%)"></span>`).join("");
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 1400);
}

/* =====================================================================
   DENEME SINAVI — 50 soru, 57 dk, 43 geçme notu (DVSA formatı)
   ===================================================================== */
let mock = null;
function mockStart() {
  app().innerHTML = `${header(true, t("mock"))}
  <div class="mock-intro">
    <div class="mock-emoji">📝⏱️</div>
    <h2>${t("mock")}</h2>
    <ul class="mock-rules">
      <li>📋 50 ${t("question").toLowerCase()}</li>
      <li>⏱️ 57 ${state.lang === "tr" ? "dakika" : "minutes"}</li>
      <li>✅ ${t("passmark")}</li>
      <li>🎬 ${t("reviewWrong")}</li>
    </ul>
    <button class="big-btn" onclick="mockBegin()">${t("start")} 🚀</button></div>`;
}

function mockBegin() {
  mock = { qs: shuffle(QUESTIONS).slice(0, 50), i: 0, answers: [], sec: 57 * 60 };
  clearInterval(state.timer);
  state.timer = setInterval(() => {
    mock.sec--;
    const el = $("#mockTime");
    if (el) { el.textContent = fmtTime(mock.sec); if (mock.sec < 300) el.classList.add("danger"); }
    if (mock.sec <= 0) mockFinish();
  }, 1000);
  renderMock();
}
const fmtTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

function renderMock() {
  const q = mock.qs[mock.i];
  const opts = buildOptions(q);
  mock.opts = opts;
  app().innerHTML = `${header(true, t("mock"))}
  <div class="quiz-top"><span class="badge">${t("question")} ${mock.i + 1}/50</span>
  <span class="badge time" id="mockTime">${fmtTime(mock.sec)}</span></div>
  <div class="lesson-progress"><div style="width:${(mock.i / 50) * 100}%"></div></div>
  <div class="question-card">${signBlock(q)}${qText(q.q)}</div>
  <div class="options">
    ${opts.map((o, idx) => `<button class="opt" onclick="answerMock(${idx})">
      ${state.qlang === "en" ? esc(o.en) : state.qlang === "tr" ? esc(o.tr) : `<span class="o-en">${esc(o.en)}</span><span class="o-tr">${esc(o.tr)}</span>`}
    </button>`).join("")}
  </div>`;
}

function answerMock(idx) {
  const q = mock.qs[mock.i];
  const ok = mock.opts[idx].ok;
  mock.answers.push({ id: q.id, ok });
  record(q.id, ok);
  mock.i++;
  if (mock.i >= 50) mockFinish(); else renderMock();
}

function mockFinish() {
  clearInterval(state.timer);
  const score = mock.answers.filter((a) => a.ok).length;
  const wrong = mock.answers.filter((a) => !a.ok);
  const passed = score >= 43;
  const p = loadProg();
  if (p.bestMock == null || score > p.bestMock) p.bestMock = score;
  saveProg(p);
  app().innerHTML = `${header(true)}<div class="done-screen">
    <div class="done-emoji">${passed ? "🎉🏆" : "💪📚"}</div>
    <h2 class="${passed ? "pass" : "fail"}">${passed ? t("passed") : t("failed")}</h2>
    <p class="big-pct">${score}/50</p><p>${t("passmark")}</p>
    ${wrong.length ? `<h3 class="rw-title">🎬 ${t("reviewWrong")}</h3>
      <div class="review-list">${wrong.map((a) => {
        const q = byId[a.id];
        return `<button class="review-item" onclick='openExplain(byId["${q.id}"], true, null)'>
          <span>❌</span><span class="ri-text">${esc(state.lang === "tr" ? q.q.tr : q.q.en)}</span><span>🎬</span></button>`;
      }).join("")}</div>` : ""}
    <button class="big-btn" onclick="setView(mockStart)">${t("tryAgain")}</button>
    <button class="big-btn ghost" onclick="goHome()">${t("backHome")}</button></div>`;
}

/* =====================================================================
   KARTLAR — hızlı ezber kartları
   ===================================================================== */
let cards = null;
function cardsView() {
  cards = { qs: shuffle(QUESTIONS), i: 0, flipped: false, known: 0 };
  setView(renderCard);
}

function renderCard() {
  const q = cards.qs[cards.i];
  app().innerHTML = `${header(true, `${t("cards")} ${cards.i + 1}/${cards.qs.length}`)}
  <div class="card-stage">
    <div class="flashcard ${cards.flipped ? "flipped" : ""}" onclick="flipCard()">
      <div class="fc-face fc-front">
        <div class="fc-key">${esc(q.ezber.split("=")[0].trim().toUpperCase())}</div>
        ${qText(q.q)}
        <div class="fc-hint">👆 ${t("flip")}</div>
      </div>
      <div class="fc-face fc-back">
        <div class="ex-row ex-en">🇬🇧 <b>${esc(q.a.en)}</b></div>
        <div class="ex-row ex-tr">🇹🇷 <b>${esc(q.a.tr)}</b></div>
        <div class="ex-row ex-mnemo">🧠 <code>${esc(q.ezber)}</code></div>
        <div class="ex-row ex-logic">💡 ${esc(state.lang === "tr" ? q.logic.tr : q.logic.en)}</div>
        <button class="mini-btn" onclick="event.stopPropagation();speak(${JSON.stringify(q.a.en).replace(/"/g, "&quot;")},'en')">${t("listenEN")}</button>
        <button class="mini-btn" onclick="event.stopPropagation();openExplain(byId['${q.id}'],false,null)">🎬</button>
      </div>
    </div>
  </div>
  <div class="card-btns">
    <button class="nav-btn bad-btn" onclick="cardNext(false)">${t("didntKnow")}</button>
    <button class="nav-btn good-btn" onclick="cardNext(true)">${t("knew")}</button>
  </div>`;
}
function flipCard() { cards.flipped = !cards.flipped; renderCard(); }
function cardNext(knew) {
  record(cards.qs[cards.i].id, knew);
  if (knew) cards.known++;
  cards.i++; cards.flipped = false;
  if (cards.i >= cards.qs.length) {
    app().innerHTML = `${header(true)}<div class="done-screen"><div class="done-emoji">🃏✨</div>
      <h2>${t("score")}: ${cards.known}/${cards.qs.length}</h2>
      <button class="big-btn" onclick="cardsView()">${t("tryAgain")}</button>
      <button class="big-btn ghost" onclick="goHome()">${t("backHome")}</button></div>`;
    return;
  }
  renderCard();
}

/* =====================================================================
   LEVHALAR — inceleme + quiz
   ===================================================================== */
function signsView() {
  const cats = [["order", "catOrder"], ["warning", "catWarning"], ["works", "catWorks"], ["info", "catInfo"]];
  app().innerHTML = `${header(true, t("signs"))}
  <div class="sign-actions"><button class="big-btn" onclick="startSignQuiz()">🎯 ${t("signQuiz")}</button></div>
  ${cats.map(([c, label]) => `
    <h3 class="sign-cat">${t(label)}</h3>
    <div class="sign-grid">
      ${SIGNS.filter((s) => s.cat === c).map((s) => `
        <div class="sign-card" onclick="speak(${JSON.stringify(s.en).replace(/"/g, "&quot;")},'en')">
          <div class="sign-svg">${s.svg}</div>
          <div class="sign-name"><b>${esc(s[state.lang === "tr" ? "tr" : "en"])}</b><small>${esc(s[state.lang === "tr" ? "en" : "tr"])}</small></div>
        </div>`).join("")}
    </div>`).join("")}`;
}

let signQuiz = null;
function startSignQuiz() {
  signQuiz = { qs: shuffle(SIGNS).slice(0, 10), i: 0, score: 0, locked: false };
  setView(renderSignQuiz);
}
function renderSignQuiz() {
  const s = signQuiz.qs[signQuiz.i];
  const others = shuffle(SIGNS.filter((x) => x.id !== s.id)).slice(0, 3);
  const opts = shuffle([{ ...s, ok: true }, ...others.map((o) => ({ ...o, ok: false }))]);
  signQuiz.opts = opts;
  app().innerHTML = `${header(true, `${t("signQuiz")} ${signQuiz.i + 1}/10`)}
  <div class="quiz-top"><span class="badge score">⭐ ${signQuiz.score}</span></div>
  <div class="sign-question"><div class="sign-svg big">${s.svg}</div><p>${t("whichSign")}</p></div>
  <div class="options">
    ${opts.map((o, idx) => `<button class="opt" id="opt${idx}" onclick="answerSign(${idx})">
      <span class="o-en">${esc(o.en)}</span><span class="o-tr">${esc(o.tr)}</span></button>`).join("")}
  </div>`;
}
function answerSign(idx) {
  if (signQuiz.locked) return;
  signQuiz.locked = true;
  const o = signQuiz.opts[idx];
  const okIdx = signQuiz.opts.findIndex((x) => x.ok);
  $("#opt" + okIdx).classList.add("right");
  if (o.ok) { signQuiz.score++; sfx(true); confetti(); }
  else {
    sfx(false);
    $("#opt" + idx).classList.add("wrongopt");
    const s = signQuiz.qs[signQuiz.i];
    speak(s.en + ". " + s.tr, "en");
  }
  setTimeout(() => {
    signQuiz.i++; signQuiz.locked = false;
    if (signQuiz.i >= 10) {
      app().innerHTML = `${header(true)}<div class="done-screen"><div class="done-emoji">🚸🏅</div>
        <h2>${t("score")}: ${signQuiz.score}/10</h2>
        <button class="big-btn" onclick="startSignQuiz()">${t("tryAgain")}</button>
        <button class="big-btn ghost" onclick="setView(signsView)">${t("browse")}</button></div>`;
    } else renderSignQuiz();
  }, o.ok ? 900 : 2200);
}

/* =====================================================================
   SINAV GÜNÜ REHBERİ
   ===================================================================== */
function guideView() {
  app().innerHTML = `${header(true, t("guide"))}
  <p class="page-sub">🗓️ ${t("guideSub")}</p>
  <div class="guide-list">
    ${GUIDE.map((g, i) => `
      <div class="guide-card">
        <div class="guide-head"><span class="guide-icon">${g.icon}</span><b>${g.title[state.lang]}</b></div>
        <div class="scene" id="guideScene${i}"></div>
        <p class="guide-tr">🇹🇷 ${g.tr}</p>
        <p class="guide-en">🇬🇧 ${g.en}</p>
        <button class="mini-btn" onclick="speak(${JSON.stringify(g.en).replace(/"/g, "&quot;")},'en')">${t("listenEN")}</button>
        <button class="mini-btn" onclick="speak(${JSON.stringify(g.tr).replace(/"/g, "&quot;")},'tr')">${t("listenTR")}</button>
      </div>`).join("")}
  </div>
  <button class="big-btn" onclick="setView(mockStart)">📝 ${t("mock")} →</button>
  <button class="big-btn ghost" onclick="goHome()">${t("backHome")}</button>`;
  GUIDE.forEach((g, i) => renderScene(g.scene, $("#guideScene" + i)));
}

/* =====================================================================
   SÖZLÜK — İngilizce sınav terimleri, arama + sesli telaffuz
   ===================================================================== */
function glossaryView() {
  app().innerHTML = `${header(true, t("glossary"))}
  <input type="search" id="glsearch" class="gl-search" placeholder="${t("searchPh")}" oninput="renderGlossaryList(this.value)">
  <div id="gllist"></div>`;
  renderGlossaryList("");
}

function renderGlossaryList(filter) {
  const f = filter.trim().toLowerCase();
  const items = GLOSSARY.filter(([en, tr]) => !f || en.toLowerCase().includes(f) || tr.toLowerCase().includes(f));
  $("#gllist").innerHTML = items.length
    ? `<div class="gl-list">${items.map(([en, tr]) => `
        <div class="gl-row">
          <button class="gl-speak" onclick="speak(${JSON.stringify(en).replace(/"/g, "&quot;")},'en')">🔊</button>
          <div class="gl-words"><b>${esc(en)}</b><span>${esc(tr)}</span></div>
        </div>`).join("")}</div>`
    : `<p class="gl-empty">${t("noResult")}</p>`;
}

/* =====================================================================
   CİHAZA KURULUM — PWA: telefon/tablet/bilgisayara uygulama olarak
   ===================================================================== */
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  state.installEvt = e;
});
async function installApp() {
  if (state.installEvt) {
    state.installEvt.prompt();
    try {
      const r = await state.installEvt.userChoice;
      if (r && r.outcome === "accepted") toast("🎉 " + t("installed"));
    } catch (e) { /* kullanıcı vazgeçti */ }
    state.installEvt = null;
    return;
  }
  setView(installView);
}
function installView() {
  const rows = [
    ["🤖 Android", t("instAndroid")],
    ["🍎 iPhone / iPad", t("instIOS")],
    ["💻 Bilgisayar / PC", t("instPC")],
  ];
  app().innerHTML = `${header(true, t("installTitle"))}
  <p class="page-sub">${t("installIntro")}</p>
  ${rows.map(([k, v]) => `<div class="setup-card"><h3>${k}</h3><p class="inst-p">${v}</p></div>`).join("")}
  <div class="setup-card inst-note">💡 ${t("instNote")}</div>
  <button class="big-btn ghost" onclick="goHome()">${t("backHome")}</button>`;
}

/* =====================================================================
   SES AYARLARI — cihazdaki sesler arasından seçim + hız + deneme
   ===================================================================== */
function voiceView() {
  refreshVoices();
  const rate = String(speedFactor());
  const opts = (lang) => {
    const cur = localStorage.getItem("ek-voice-" + lang) || "auto";
    const base = lang === "en" ? "en" : "tr";
    const list = VOICES.filter((v) => (v.lang || "").replace("_", "-").toLowerCase().startsWith(base));
    return `<option value="auto" ${cur === "auto" ? "selected" : ""}>${t("voiceAuto")}</option>` +
      list.map((v) => `<option value="${esc(v.voiceURI)}" ${cur === v.voiceURI ? "selected" : ""}>${esc(v.name)} (${esc(v.lang)})</option>`).join("");
  };
  // düşük kaliteli (compact) ses mi kullanılıyor?
  const activeTr = chosenVoice("tr") || pickVoice("tr");
  const activeEn = chosenVoice("en") || pickVoice("en");
  const isCompact = (v) => v && ((v.voiceURI || "") + (v.name || "")).toLowerCase().includes("compact");
  const compactWarn = (isCompact(activeTr) || isCompact(activeEn))
    ? `<div class="setup-card inst-note">${t("compactWarn")}</div>` : "";
  app().innerHTML = `${header(true, t("voiceSettings"))}
  <p class="page-sub">${t("voiceIntro")}</p>
  <button class="big-btn ${isMuted() ? "" : "ghost"}" onclick="toggleMute()">${isMuted() ? t("muteOff") : t("muteOn")}</button>
  <div class="setup-card inst-note"><b>${t("voiceFixTitle")}</b>
    <p class="inst-p">🍎 ${t("voiceFixIOS")}</p>
    <p class="inst-p">🤖 ${t("voiceFixAnd")}</p></div>
  ${compactWarn}
  ${VOICES.length ? "" : `<div class="setup-card"><b>${t("noVoices")}</b></div>`}
  <div class="setup-card">
    <h3>🇬🇧 ${t("voiceEN")}</h3>
    <select id="ven" class="gl-search" onchange="setVoice('en', this.value)">${opts("en")}</select>
    <button class="mini-btn" onclick="speak('Give way to traffic on the major road. The stopping distance at 30 miles per hour is 23 metres.','en')">${t("voiceTest")} 🇬🇧</button>
  </div>
  <div class="setup-card">
    <h3>🇹🇷 ${t("voiceTR")}</h3>
    <select id="vtr" class="gl-search" onchange="setVoice('tr', this.value)">${opts("tr")}</select>
    <button class="mini-btn" onclick="speak('Ana yoldaki trafiğe yol ver. Islak yolda durma mesafesi iki katına çıkar.','tr')">${t("voiceTest")} 🇹🇷</button>
  </div>
  <div class="setup-card">
    <h3>⏩ ${t("voiceSpeed")}</h3>
    <div class="qlang-row" style="margin:8px 0 0">
      ${[["0.82", t("vsSlow")], ["1", t("vsNormal")], ["1.15", t("vsFast")]].map(([v, l]) =>
        `<button class="chip ${rate === v ? "on" : ""}" onclick="localStorage.setItem('ek-rate','${v}');voiceView()">${l}</button>`).join("")}
    </div>
  </div>
  <button class="big-btn ghost" onclick="goHome()">${t("backHome")}</button>`;
}
function setVoice(lang, uri) { localStorage.setItem("ek-voice-" + lang, uri); }

/* =====================================================================
   PROFİLLER — her kullanıcı ayrı hesap, ilerlemeler karışmaz
   ===================================================================== */
let setupAvatar = AVATARS[0];
function profileSetup() {
  app().innerHTML = `<div class="setup">
    <div class="hero"><span class="hero-emoji">🚗💨</span>
      <h1>${t("appName")}</h1><p class="tagline">${t("tagline")}</p></div>
    <div class="setup-card">
      <h2>${t("whoTitle")}</h2>
      <p class="page-sub">${t("whoSub")}</p>
      <div class="avatar-grid">
        ${AVATARS.map((a) => `<button class="avatar-pick ${a === setupAvatar ? "on" : ""}" onclick="setupAvatar='${a}';profileSetup()">${a}</button>`).join("")}
      </div>
      <input id="pname" class="gl-search" maxlength="20" placeholder="${t("namePh")}" value="">
      <button class="big-btn" onclick="createProfile()">${t("createProfile")} ✨</button>
    </div>
    <footer class="foot">${t("nonCommercial")}</footer></div>`;
}

function createProfile(fromList) {
  const el = $("#pname");
  const name = (el && el.value.trim()) || (fromList ? "" : "");
  if (!name) { if (el) { el.focus(); el.classList.add("err"); } return; }
  const ps = getProfiles();
  const id = "p" + Date.now();
  ps.push({ id, name, avatar: setupAvatar });
  saveProfiles(ps);
  setActiveProfile(id);
  goHome();
}

function profilesView() {
  const ps = getProfiles();
  const act = activeProfile();
  app().innerHTML = `${header(true, t("profiles"))}
  <p class="page-sub">${t("whoSub")}</p>
  <div class="profile-list">
    ${ps.map((p) => {
      let seen = 0;
      try { const d = JSON.parse(localStorage.getItem("ek-prog-" + p.id)) || {}; seen = d.seen ? Object.keys(d.seen).length : 0; } catch {}
      return `<div class="profile-item ${act && act.id === p.id ? "on" : ""}">
        <button class="pi-main" onclick="setActiveProfile('${p.id}');goHome()">
          <span class="pi-avatar">${p.avatar}</span>
          <span class="pi-body"><b>${esc(p.name)}</b><small>${seen} ${t("statSeen")}${act && act.id === p.id ? " • ✅ " + t("activeLabel") : ""}</small></span>
        </button>
        ${ps.length > 1 ? `<button class="pi-del" onclick="deleteProfile('${p.id}')">✕</button>` : ""}
      </div>`;
    }).join("")}
  </div>
  <div class="setup-card">
    <h3>${t("addProfile")}</h3>
    <div class="avatar-grid">
      ${AVATARS.map((a) => `<button class="avatar-pick ${a === setupAvatar ? "on" : ""}" onclick="setupAvatar='${a}';profilesView()">${a}</button>`).join("")}
    </div>
    <input id="pname" class="gl-search" maxlength="20" placeholder="${t("namePh")}">
    <button class="big-btn" onclick="createProfile(true)">${t("createProfile")} ✨</button>
  </div>`;
}

function deleteProfile(id) {
  if (!confirm(t("confirmDelete"))) return;
  let ps = getProfiles().filter((p) => p.id !== id);
  saveProfiles(ps);
  localStorage.removeItem("ek-prog-" + id);
  if (localStorage.getItem("ek-active") === id && ps.length) setActiveProfile(ps[0].id);
  profilesView();
}

/* ---------- başlat ---------- */
if (state.speech) state.speech.getVoices(); // ses listesini ısıt

/* =====================================================================
   GİRİŞ KODU — uygulama herkese açık adreste olsa bile kodu bilmeyen
   giremez. (Not: içerik koruması içindir; kod cihazda bir kez sorulur.)
   ===================================================================== */
const APP_PIN = "1907";
function isUnlocked() { return localStorage.getItem("ek-unlocked") === APP_PIN; }
function lockView() {
  app().innerHTML = `<div class="setup">
    <div class="hero"><span class="hero-emoji">🚗🔒</span>
      <h1>${t("appName")}</h1><p class="tagline">${t("tagline")}</p></div>
    <div class="setup-card">
      <h2>${t("lockTitle")}</h2>
      <p class="page-sub">${t("lockSub")}</p>
      <input id="pin" class="gl-search" type="password" inputmode="numeric" autocomplete="off" placeholder="${t("lockPh")}"
        onkeydown="if(event.key==='Enter')tryUnlock()">
      <button class="big-btn" onclick="tryUnlock()">${t("lockBtn")}</button>
    </div>
    <footer class="foot">${t("nonCommercial")}</footer></div>`;
  setTimeout(() => { const el = $("#pin"); if (el) el.focus(); }, 150);
}
function tryUnlock() {
  const el = $("#pin");
  if (el && el.value.trim() === APP_PIN) {
    localStorage.setItem("ek-unlocked", APP_PIN);
    boot();
  } else if (el) {
    el.value = ""; el.classList.add("err");
    toast(t("lockWrong"));
    setTimeout(() => el.classList.remove("err"), 600);
  }
}

function boot() {
  if (!isUnlocked()) { setView(lockView); return; }
  setView(getProfiles().length ? home : profileSetup);
}
if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
