(() => {
const C = window.GAME_CONFIG, G = C.game, M = C.messages, O = C.options;
const $ = s => document.querySelector(s);
const fmt = (t, n) => t.replace("{name}", n);
let cfg = C.players.map(p => ({ ...p })), S, muted = !G.sound, tick, uid = 0;

/* الألوان */
const r = document.documentElement.style, P = C.palette;
r.setProperty("--bg", P.bg); r.setProperty("--card", P.card); r.setProperty("--ink", P.ink);
r.setProperty("--accent", P.accent); r.setProperty("--ok", P.ok); r.setProperty("--no", P.no);
$("#title").textContent = C.title; $("#subtitle").textContent = C.subtitle; $("#desc").textContent = C.description;
document.title = C.title;

/* صوت */
let ac;
function beep(f, d = .15, t = "sine") {
  if (muted) return;
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = t; o.frequency.value = f; g.gain.value = .12;
    o.connect(g); g.connect(ac.destination); o.start(); g.gain.exponentialRampToValueAtTime(.001, ac.currentTime + d); o.stop(ac.currentTime + d);
  } catch (e) {}
}
const jingle = a => a.forEach((f, i) => setTimeout(() => beep(f, .18, "triangle"), i * 130));
$("#bSound").textContent = muted ? "🔇" : "🔊";
$("#bSound").onclick = () => { muted = !muted; $("#bSound").textContent = muted ? "🔇" : "🔊"; beep(660); };
$("#bFull").onclick = () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen && document.documentElement.requestFullscreen();

/* الشخصية: SVG مجسّم بتدرجات */
function face(p) {
  const id = "g" + (uid++), hair = "#4a2c1a", e = p.expression, k = p.gender;
  const back = k === "female" ? `<path d="M22 50q-6 44 8 58h40q14-14 8-58z" fill="${hair}"/>` : "";
  const top = k === "neutral" ? `<circle cx="50" cy="20" r="8" fill="${hair}"/><path d="M26 42q4-20 24-20t24 20q-24-9-48 0z" fill="${hair}"/>`
    : `<path d="M25 44q3-26 25-26t25 26q-25-11-50 0z" fill="${hair}"/>`;
  const mouth = { confident: "M39 61q11 9 22 0", genius: "M42 61q8 5 16 0", naughty: "M38 60q14 12 24-5", confused: "M38 62q6-5 12 0t12 0" }[e];
  const brow = { confident: "M33 38l12-2M55 36l12 2", genius: "M34 34h10M56 34h10", naughty: "M33 40l11-5M56 35l11 5", confused: "M33 36l11 3M56 39l11-3" }[e];
  const glasses = p.accessory === "glasses" || e === "genius" ? `<g fill="none" stroke="#222" stroke-width="2.5"><circle cx="40" cy="49" r="8"/><circle cx="60" cy="49" r="8"/><path d="M48 49h4"/></g>` : "";
  const acc = { crown: `<path d="M32 22l6-12 6 8 6-12 6 12 6-8 6 12z" fill="#ffd23f" stroke="#c98a00" stroke-width="2"/>`,
    cap: `<path d="M26 34q24-26 48 0z" fill="#3a86ff"/><path d="M60 33h26q-2 6-26 5z" fill="#2563c9"/>`,
    bow: `<path d="M50 78l-12-7v14zM50 78l12-7v14z" fill="#ff6b6b" stroke="#a8271d" stroke-width="1.5"/>`, glasses: "", none: "" }[p.accessory] || "";
  return `<svg viewBox="0 0 100 124" aria-hidden="true"><defs>
<radialGradient id="${id}h" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".5" stop-color="${p.skin}"/><stop offset="1" stop-color="${p.skin}" stop-opacity=".75"/></radialGradient>
<linearGradient id="${id}b" x1="0" x2="1"><stop offset="0" stop-color="${p.color}"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></linearGradient></defs>
${back}<rect x="27" y="74" width="46" height="42" rx="16" fill="url(#${id}b)"/><circle cx="24" cy="92" r="8" fill="${p.skin}"/><circle cx="76" cy="92" r="8" fill="${p.skin}"/>
<circle cx="50" cy="48" r="27" fill="url(#${id}h)"/>${top}
<circle cx="40" cy="49" r="${e === "confused" ? 4.5 : 3.2}" fill="#222"/><circle cx="60" cy="49" r="3.2" fill="#222"/>
<path d="${brow}" stroke="${hair}" stroke-width="3" stroke-linecap="round"/><path d="${mouth}" fill="none" stroke="#7a2e2e" stroke-width="3" stroke-linecap="round"/>
${glasses}${acc}</svg>`;
}

/* شاشة البداية */
const sel = (o, v) => Object.entries(o).map(([k, t]) => `<option value="${k}"${k === v ? " selected" : ""}>${t}</option>`).join("");
function buildSetup() {
  $("#setup").innerHTML = cfg.map((p, i) => `<div class="card pv" data-i="${i}"><div class="pvs"></div>
<label>الاسم<input data-f="name" value="${p.name}" maxlength="22"></label>
<label>الشخصية<select data-f="gender">${sel(O.genders, p.gender)}</select></label>
<label>الإكسسوار<select data-f="accessory">${sel(O.accessories, p.accessory)}</select></label>
<label>الأسلوب<select data-f="expression">${sel(O.expressions, p.expression)}</select></label>
<label>لون البشرة</label><div class="sw" data-f="skin"></div><label>لون الملابس</label><div class="sw" data-f="color"></div></div>`).join("");
  document.querySelectorAll("#setup .card").forEach(card => {
    const i = +card.dataset.i, draw = () => card.querySelector(".pvs").innerHTML = face(cfg[i]);
    ["skin", "color"].forEach(f => {
      const box = card.querySelector(`.sw[data-f=${f}]`);
      box.innerHTML = O[f + "s"].map(c => `<button type="button" style="background:${c}" data-c="${c}" aria-label="${c}" aria-pressed="${c === cfg[i][f]}"></button>`).join("");
      box.onclick = e => { const b = e.target.closest("button"); if (!b) return; cfg[i][f] = b.dataset.c;
        box.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b)); draw(); };
    });
    card.addEventListener("input", e => { const f = e.target.dataset.f; if (f) { cfg[i][f] = e.target.value; draw(); } });
    draw();
  });
}
const nums = (a, v, u = "") => a.map(n => `<option value="${n}"${n === v ? " selected" : ""}>${n}${u}</option>`).join("");
$("#oCount").innerHTML = nums(G.countChoices, G.questionCount); $("#oTime").innerHTML = nums(G.timeChoices, G.timeSeconds);
$("#oScene").innerHTML = sel(O.scenes, G.scene);
buildSetup();

const show = id => { ["start", "play", "end"].forEach(s => $("#s-" + s).hidden = s !== id); window.scrollTo(0, 0); };
const stat = v => M.status.find(s => v >= s.min);

/* المشهد */
function stage(p, scene, cls = "") {
  return `<div class="stage scene-${scene} ${cls}" style="--d:${1 - p.safety / 100}"><div class="slime"></div><div class="hazard">${scene === "rock" ? "🪨" : "🐍"}</div><div class="ground"></div><div class="shield"></div><div class="char">${face(p)}</div></div>`;
}
function renderArena() {
  $("#arena").innerHTML = S.pl.map((p, i) => {
    const st = stat(p.safety);
    return `<div class="card pl ${S.turn === i ? "on" : ""}"><div class="head"><span>${p.name}</span><span>⭐ ${p.points}</span></div>
${stage(p, S.scene, (p.safety < 30 ? "hi " : "") + (p.safety >= 80 ? "safe" : ""))}
<div class="meter" role="meter" aria-label="مستوى الأمان" aria-valuenow="${p.safety}" aria-valuemin="0" aria-valuemax="100"><i style="width:${p.safety}%"></i></div>
<div class="st">${st.icon} ${st.text} (${p.safety}%)${S.turn === i ? " • دوره الآن" : ""}</div></div>`;
  }).join("");
}

/* اللعب */
function start() {
  let qs = C.questions.slice();
  if (G.shuffle) qs.sort(() => Math.random() - .5);
  S = { pl: cfg.map(p => ({ ...p, points: 0, safety: G.startSafety })), qs: qs.slice(0, +$("#oCount").value), time: +$("#oTime").value,
    scene: $("#oScene").value, i: 0, turn: 0, phase: "ask" };
  show("play"); question();
}
function question() {
  const q = S.qs[S.i], p = S.pl[S.turn];
  S.phase = "ask"; S.left = S.time;
  $("#qTurn").textContent = fmt(M.turn, p.name); $("#qCat").textContent = q.cat; $("#qPts").textContent = q.points + " نقطة";
  $("#qText").textContent = q.q; $("#qAns").hidden = true; $("#qMsg").textContent = "";
  $("#judge").hidden = false; $("#bNext").hidden = true; renderArena(); runTimer();
}
function runTimer() {
  clearInterval(tick); const el = $("#qTime");
  const paint = () => { el.textContent = S.left; el.classList.toggle("low", S.left <= 5); };
  paint();
  tick = setInterval(() => {
    S.left--; paint(); if (S.left <= 5 && S.left > 0) beep(880, .06);
    if (S.left <= 0) { clearInterval(tick); beep(180, .4, "sawtooth"); $("#qMsg").textContent = M.timeUp; }
  }, 1000);
}
const clamp = v => Math.max(0, Math.min(100, v));
function judge(ok) {
  const q = S.qs[S.i], me = S.pl[S.turn], opp = S.pl[1 - S.turn];
  if (S.phase === "ask") {
    clearInterval(tick);
    if (ok) { me.points += q.points; me.safety = clamp(me.safety + G.safetyStep); $("#qMsg").textContent = M.correct; jingle([523, 659, 784]); return finish(); }
    me.points = Math.max(0, me.points - Math.round(q.points * G.wrongPenalty)); me.safety = clamp(me.safety - G.safetyStep);
    beep(200, .35, "sawtooth"); renderArena();
    if (G.steal) { S.phase = "steal"; $("#qMsg").textContent = fmt(M.stealAsk, opp.name); return; }
    $("#qMsg").textContent = M.wrong; return finish();
  }
  if (ok) { opp.points += Math.round(q.points * G.stealPoints); opp.safety = clamp(opp.safety + G.stealSafety); $("#qMsg").textContent = M.stealWin; jingle([659, 784, 988]); }
  else $("#qMsg").textContent = M.wrong;
  finish();
}
function finish() {
  const q = S.qs[S.i]; S.phase = "done";
  $("#qAns").innerHTML = `✅ الإجابة النموذجية: ${q.a}` + (q.note ? `<br><small>${q.note}</small>` : ""); $("#qAns").hidden = false;
  $("#judge").hidden = true; $("#bNext").hidden = false; $("#bNext").textContent = S.i + 1 >= S.qs.length ? "عرض النتيجة" : "التالي";
  renderArena(); $("#bNext").focus();
}
$("#bOk").onclick = () => judge(true); $("#bNo").onclick = () => judge(false);
$("#bNext").onclick = () => { S.i++; if (S.i >= S.qs.length) return end(); S.turn = 1 - S.turn; question(); };

/* النهاية */
function end() {
  clearInterval(tick); const [a, b] = S.pl, tie = a.points === b.points, w = a.points > b.points ? 0 : 1;
  document.body.classList.remove("still"); show("end");
  $("#endTitle").textContent = tie ? M.tie : fmt(M.win, S.pl[w].name);
  $("#endArena").innerHTML = S.pl.map((p, i) => {
    const win = tie || i === w; p.safety = win ? 100 : 0;
    return `<div class="card pl"><div class="head"><span>${p.name}</span><span>⭐ ${p.points}</span></div>${stage(p, S.scene, win ? "win safe" : "lose")}<div class="st">${win ? "🏆 نجا!" : fmt(M.lose, p.name)}</div></div>`;
  }).join("");
  $("#endScore").textContent = `${a.name}: ${a.points} — ${b.name}: ${b.points}`;
  const cf = $("#confetti"); cf.innerHTML = "";
  for (let i = 0; i < 40; i++) { const e = document.createElement("i");
    e.style.cssText = `left:${Math.random() * 100}%;background:hsl(${Math.random() * 360},90%,60%);animation-duration:${2 + Math.random() * 3}s;animation-delay:${Math.random()}s`; cf.appendChild(e); }
  jingle([523, 659, 784, 1046]);
}
$("#bSkip").onclick = () => { document.body.classList.add("still"); $("#confetti").innerHTML = ""; };
$("#bAgain").onclick = start;
const reset = () => { clearInterval(tick); $("#confetti").innerHTML = ""; show("start"); };
$("#bNew").onclick = reset; $("#bReset").onclick = reset;
$("#bStart").onclick = () => { cfg.forEach((p, i) => p.name = p.name.trim() || C.players[i].name); start(); };
})();
