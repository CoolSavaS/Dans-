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

/* ---------- ilerleme ---------- */
function loadProg() {
  try { return JSON.parse(localStorage.getItem("ek-prog")) || {}; } catch { return {}; }
}
function saveProg(p) { localStorage.setItem("ek-prog", JSON.stringify(p)); }
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
function speak(text, lang) {
  if (!state.speech) return;
  stopSpeech();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang === "en" ? "en-GB" : "tr-TR";
  u.rate = 0.95;
  const voices = state.speech.getVoices();
  const v = voices.find((v) => v.lang.startsWith(lang === "en" ? "en-GB" : "tr")) ||
            voices.find((v) => v.lang.startsWith(lang === "en" ? "en" : "tr"));
  if (v) u.voice = v;
  state.speech.speak(u);
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
  return `<header class="top">
    ${showBack ? `<button class="icon-btn" onclick="goHome()">←</button>` : `<span class="logo">🚗</span>`}
    <div class="top-title">${title || t("appName")}</div>
    <div class="top-actions">
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
    <button class="menu-card mc-guide wide" onclick="setView(guideView)">
      <span class="mc-icon">🗓️</span><span class="mc-title">${t("guide")}</span><span class="mc-sub">${t("guideSub")}</span></button>
  </nav>
  <div class="qlang-row">
    <span>${t("qLangLabel")}:</span>
    ${["both", "en", "tr"].map((m) => `<button class="chip ${state.qlang === m ? "on" : ""}" onclick="setQlang('${m}')">${m === "both" ? t("both") : m.toUpperCase()}</button>`).join("")}
  </div>
  <footer class="foot">${t("installHint")}<br>${t("nonCommercial")}</footer>`;
}
function setQlang(m) { state.qlang = m; localStorage.setItem("ek-qlang", m); rerender(); }

/* =====================================================================
   AÇIKLAMA MODALI — yanlış cevapta animasyon + çift dilli anlatım
   ===================================================================== */
function explainHTML(q, isWrong) {
  return `<div class="modal-backdrop" id="modal">
    <div class="modal">
      <div class="modal-head ${isWrong ? "bad" : "good"}">${isWrong ? t("wrong") : t("theAnswer")}</div>
      <div class="scene" id="modalScene"></div>
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
    renderScene(q.scene, $("#modalScene"));
  }
  // otomatik sesli anlatım: önce EN sonra TR
  setTimeout(() => {
    if (!state.speech) return;
    stopSpeech();
    // önce İngilizce (sınav dili), sonra Türkçesi + mantığı
    const uEn = new SpeechSynthesisUtterance("The correct answer is: " + q.a.en);
    uEn.lang = "en-GB"; uEn.rate = 0.95;
    const uTr = new SpeechSynthesisUtterance("Türkçesi: " + q.a.tr + ". " + q.logic.tr);
    uTr.lang = "tr-TR"; uTr.rate = 0.98;
    state.speech.speak(uEn); state.speech.speak(uTr);
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
  <div class="lesson-text">
    ${isIntro
      ? `<h2>${l.icon} ${l.title[state.lang]}</h2><p class="intro">${l.intro[state.lang]}</p>
         <button class="mini-btn" onclick="speak(${JSON.stringify(l.intro.tr).replace(/"/g, "&quot;")},'tr')">${t("listenTR")}</button>
         <button class="mini-btn" onclick="speak(${JSON.stringify(l.intro.en).replace(/"/g, "&quot;")},'en')">${t("listenEN")}</button>`
      : `<div class="lt-q">🎬 <b>${t("whatHappens")}</b> ${qText(q.q)}</div>
         <div class="ex-row ex-en">🇬🇧 <b>“${esc(q.a.en)}”</b>
           <button class="mini-btn" onclick="speak(${JSON.stringify(q.a.en).replace(/"/g, "&quot;")},'en')">🔊</button></div>
         <div class="ex-row ex-tr">🇹🇷 <b>“${esc(q.a.tr)}”</b>
           <button class="mini-btn" onclick="speak(${JSON.stringify(q.a.tr + ". " + q.logic.tr).replace(/"/g, "&quot;")},'tr')">🔊</button></div>
         <div class="ex-row ex-logic">💡 ${esc(state.lang === "tr" ? q.logic.tr : q.logic.en)}</div>
         <div class="ex-row ex-mnemo">🧠 <code>${esc(q.ezber)}</code></div>`}
  </div>
  <button class="text-btn narrate-btn" onclick="narrateStep()">${t("narrate")}</button>
  <div class="lesson-nav">
    <button class="nav-btn" ${i === 0 ? "disabled" : ""} onclick="lessonGo(-1)">← ${t("prev")}</button>
    <button class="nav-btn auto ${lessonState.auto ? "on" : ""}" onclick="toggleAuto()">${lessonState.auto ? t("stopAuto") : t("playAll")}</button>
    <button class="nav-btn primary" onclick="lessonGo(1)">${i === total - 1 ? t("finish") : t("next") + " →"}</button>
  </div>
  <div class="step-label">${t("step")} ${i + 1} / ${total}</div>`;

  renderScene(isIntro ? "generic" : q.scene, $("#lessonScene"));
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
  if (!state.speech) { if (onDone) onDone(); return; }
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
  const uEn = new SpeechSynthesisUtterance(enText);
  uEn.lang = "en-GB"; uEn.rate = 0.95;
  const uTr = new SpeechSynthesisUtterance(trText);
  uTr.lang = "tr-TR"; uTr.rate = 1;
  if (onDone) { uTr.onend = onDone; state.pendingUtter = uTr; }
  state.speech.speak(uEn); state.speech.speak(uTr);
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
  app().innerHTML = `${header(true, t("quiz"))}
  <p class="page-sub">${t("chooseCat")} — ${t("quizSub").toLowerCase()}</p>
  <div class="cat-grid">
    <button class="cat-card all" onclick="startQuiz('all')"><span>🎲</span>${t("allCats")}</button>
    ${Object.entries(CATS).map(([k, c]) => `<button class="cat-card" onclick="startQuiz('${k}')"><span>${c.icon}</span>${c[state.lang]}</button>`).join("")}
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
  <div class="question-card">${signBlock(q)}${qText(q.q)}</div>
  <div class="options">
    ${opts.map((o, idx) => `<button class="opt" id="opt${idx}" onclick="answerQuiz(${idx})">
      ${state.qlang === "en" ? esc(o.en) : state.qlang === "tr" ? esc(o.tr) : `<span class="o-en">${esc(o.en)}</span><span class="o-tr">${esc(o.tr)}</span>`}
    </button>`).join("")}
  </div>
  <button class="text-btn" onclick='openExplain(byId["${q.id}"], false, null)'>${t("showAnim")}</button>`;
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

/* ---------- başlat ---------- */
if (state.speech) state.speech.getVoices(); // ses listesini ısıt
if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", () => setView(home));
} else {
  setView(home);
}
