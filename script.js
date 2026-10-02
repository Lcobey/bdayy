/* =====================================================================
   EDIT HERE: everything you need to personalise is in this block
   ===================================================================== */
const birthdayConfig = {
  name: "Baby",                 // her name (shows on screens 2 and 5)
  fromName: "Baby mo",              // your name (shows in the signature)

  birthdayMessage: "I hope today reminds you how loved you are.",

  // Photos: replace the files in the images/ folder (keep the names).
  // Add or remove lines if you want more or fewer photos.
  photos: [
    { src: "images/photo1.jpg", caption: "One of my favorite pic of you." },
    { src: "images/photo2.jpg", caption: "One of our pics together na I first storied sa IG hehe." },
    { src: "images/photo3.jpg", caption: "First date natin together sa Cubao at Oldmoon." },
    { src: "images/photo4.jpg", caption: "2nd date natin para mag eat ng hashtag samngyup!" },
    { src: "images/photo5.jpg", caption: "Ang hashtag swimming nating sa Silk, talo ka sa'kin sa racing natin sa paglangoy AHAHHA" },
    { src: "images/photo6.jpg", caption: "Sunset at Iloilo." }
  ],

  // The letter. Each new line is a new line in the letter; an empty line is a gap.
  letter: `Happy birthday, love.

I wanted to make something for you instead of just giving you something I bought.

So I made this little corner of the internet just for you.

Thank you for being part of my life.

I hope you know how special you are to me.

Happy birthday. ❤️`,

  oneLastThing: "One last thing...",
  finalMessage: "I love you, {name} ❤️",   // {name} is replaced by her name
  signature: "Always, {from}.",      // {from} is replaced by your name

  letterSpeedMs: 140                           // time per word in the letter (lower = faster)
};
/* ===================== END OF EDITABLE SECTION ===================== */

(function () {
  "use strict";
  const $ = (s) => document.querySelector(s), $$ = (s) => [...document.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const C = birthdayConfig, FINALE_MS = 9800;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const fill = (t) => t.replace("{name}", C.name).replace("{from}", C.fromName);
  const screens = $$(".screen"), audio = $("#bgm"), musicBtn = $("#musicBtn");
  let timers = [], typing = null;
  document.body.dataset.s = 0;
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  const clearAll = () => { timers.forEach(clearTimeout); timers = []; clearInterval(typing); };

  /* ---------- text from config ---------- */
  document.title = "For " + C.name + " ♡";
  $$("[data-name]").forEach((e) => (e.innerHTML = [...C.name].map((c, i) =>
    `<span class="ch" style="--k:${i}">${c === " " ? "&nbsp;" : c}</span>`).join("")));
  $("#bdayMsg").textContent = C.birthdayMessage;
  $("#oneLast").textContent = C.oneLastThing;
  $("#finalMsg").textContent = fill(C.finalMessage);
  $("#signature").textContent = fill(C.signature);

  function safeImg(img, src, alt) {
    img.classList.remove("missing");
    img.onerror = () => img.classList.add("missing");
    img.alt = alt; img.src = src;
  }
  safeImg($("#heroImg"), C.photos[0].src, "A photo of us");

  /* ---------- twinkling stars + balloons ---------- */
  for (let i = 0; i < 28; i++) {
    const s = document.createElement("i"); s.className = "st";
    s.style.cssText = `left:${rnd(0, 100)}%;top:${rnd(0, 100)}%;--z:${rnd(2, 5)}px;--t:${rnd(2.5, 5)}s;--dl:${rnd(0, 4)}s`;
    $("#stars").appendChild(s);
  }
  for (let i = 0; i < 16; i++) {   // slow golden bokeh, drifts up behind everything
    const k = document.createElement("i"); k.className = "bk";
    k.style.cssText = `--x:${rnd(0, 96)}%;--z:${rnd(40, 130).toFixed(0)}px;--t:${rnd(16, 30).toFixed(1)}s;--dl:${rnd(-20, 0).toFixed(1)}s;--dx:${rnd(-60, 60).toFixed(0)}px;--o:${rnd(.25, .6).toFixed(2)}`;
    $("#bokeh").appendChild(k);
  }
  const BC = ["#f2a7b8", "#f7c4c9", "#e4829c", "#f9d3b4", "#cdb4e0", "#fbd9e3", "#f0b9a4"];
  for (let i = 0; i < 9; i++) {
    const b = document.createElement("i"); b.className = "bl";
    b.style.cssText = `--x:${rnd(2, 90)}%;--w:${rnd(46, 74)}px;--c:${BC[i % BC.length]};--d:${rnd(9, 15)}s;--dl:${rnd(0.2, 6)}s`;
    $("#balloons").appendChild(b);
  }

  /* ---------- navigation ---------- */
  function go(n) {
    screens.forEach((s, i) => { s.classList.toggle("active", i === n); s.setAttribute("aria-hidden", i !== n); });
    screens[n].scrollTop = 0;
    clearAll();
    document.body.classList.toggle("is-night", n === 4);
    document.body.dataset.s = n;
    if (n !== 4) $("#s5").classList.remove("dusk");
    if (n === 3) startLetter();
    if (n === 4) startGarden();
  }
  $$("[data-go]").forEach((b) => b.addEventListener("click", () => go(+b.dataset.go)));

  /* ---------- music ---------- */
  function setMusicUI(on) {
    musicBtn.classList.toggle("off", !on);
    musicBtn.setAttribute("aria-label", on ? "Pause music" : "Play music");
  }
  function playMusic() {
    audio.volume = 0.6;
    const p = audio.play(); if (p && p.catch) p.catch(() => setMusicUI(false));
    setMusicUI(true);
  }
  musicBtn.addEventListener("click", () => { if (audio.paused) playMusic(); else { audio.pause(); setMusicUI(false); } });

  /* ---------- particles (petals + hearts) ---------- */
  const cv = $("#fx"), cx = cv.getContext("2d");
  const COLORS = ["#f3b3c1", "#f8d2d8", "#e58aa3", "#fbe0cf", "#ffffff", "#efc58f"];
  let W = 0, H = 0, parts = [], running = true;
  function resize() {
    const d = Math.min(window.devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight; cv.width = W * d; cv.height = H * d; cx.setTransform(d, 0, 0, d, 0, 0);
  }
  addEventListener("resize", resize); resize();
  function ambient() {
    return { x: rnd(0, W), y: -20, vx: rnd(-.25, .25), vy: rnd(.35, .9), s: rnd(5, 10), r: rnd(0, 6.28), vr: rnd(-.02, .02),
      heart: Math.random() < .12, c: COLORS[(Math.random() * COLORS.length) | 0], a: rnd(.35, .75), sw: rnd(0, 6.28) };
  }
  function burst(x, y, n) {
    for (let i = 0; i < n; i++) {
      const ang = rnd(0, 6.28), sp = rnd(2, 7);
      parts.push({ x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 3, s: rnd(6, 12), r: rnd(0, 6.28), vr: rnd(-.12, .12),
        heart: Math.random() < .5, c: COLORS[(Math.random() * COLORS.length) | 0], a: 1, life: 110, b: true, sw: 0 });
    }
  }
  function drawHeart(s) {
    cx.beginPath(); cx.moveTo(0, s * .35);
    cx.bezierCurveTo(-s, -s * .4, -s * .5, -s * 1.1, 0, -s * .5);
    cx.bezierCurveTo(s * .5, -s * 1.1, s, -s * .4, 0, s * .35); cx.fill();
  }
  function drawPetal(s) {
    cx.beginPath(); cx.moveTo(0, -s * 1.1);
    cx.bezierCurveTo(s * .95, -s * .7, s * .8, s * .6, 0, s * .95);
    cx.bezierCurveTo(-s * .8, s * .6, -s * .95, -s * .7, 0, -s * 1.1); cx.fill();
  }
  function frame() {
    if (!running) return;
    cx.clearRect(0, 0, W, H);
    const target = reduce ? 0 : (W < 500 ? 12 : 24);
    if (parts.filter((p) => !p.b).length < target && Math.random() < .06) parts.push(ambient());
    parts = parts.filter((p) => p.y < H + 30 && !(p.b && p.life <= 0));
    for (const p of parts) {
      if (p.b) { p.vy += .13; p.vx *= .985; p.life--; p.a = Math.min(1, p.life / 40); }
      else { p.sw += .02; p.x += Math.sin(p.sw) * .4; }
      p.x += p.vx; p.y += p.vy; p.r += p.vr;
      cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r); cx.globalAlpha = p.a; cx.fillStyle = p.c;
      if (p.heart) drawHeart(p.s * .8); else drawPetal(p.s * .85);
      cx.restore();
    }
    requestAnimationFrame(frame);
  }
  document.addEventListener("visibilitychange", () => { running = !document.hidden; if (running) requestAnimationFrame(frame); });
  requestAnimationFrame(frame);
  addEventListener("pointerdown", (e) => {   // tap anywhere for a little burst of hearts
    if (!reduce && !e.target.closest("button,.lb,.letter")) burst(e.clientX, e.clientY, 8);
  });

  /* ---------- screen 1: open the gift ---------- */
  const gift = $("#gift"), openBtn = $("#openBtn");
  openBtn.addEventListener("click", () => {
    openBtn.disabled = true; gift.classList.add("opened");
    const r = gift.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + 20, reduce ? 12 : 60);
    playMusic(); musicBtn.classList.add("show");
    later(() => go(1), reduce ? 200 : 2000);
  });

  /* ---------- screen 3: polaroids on a string + lightbox ---------- */
  const ROT = [-5, 4, -3, 6, -6, 3, -4], board = $("#board"), lb = $("#lb");
  let cols = 0, cur = 0, lastFocus = null;
  function buildBoard() {
    const per = innerWidth < 520 ? 2 : 3;
    if (per === cols) return;
    cols = per; board.innerHTML = "";
    for (let r = 0; r < C.photos.length; r += per) {
      const set = C.photos.slice(r, r + per), row = document.createElement("div");
      row.className = "row"; row.style.setProperty("--n", set.length);
      row.innerHTML = '<svg viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden="true"><path d="M0,2 Q50,34 100,2"/></svg>';
      set.forEach((ph, k) => {
        const i = r + k, t = (k + .5) / set.length;
        const cell = document.createElement("div"); cell.className = "hang";
        cell.style.setProperty("--dy", (64 * t * (1 - t)).toFixed(1) + "px");
        const b = document.createElement("button"); b.className = "pol";
        b.style.cssText = `--r:${ROT[i % ROT.length]}deg;--dl:${(i * .28 + .3).toFixed(2)}s`;
        b.setAttribute("aria-label", "Open photo " + (i + 1));
        const img = document.createElement("img"); img.loading = "lazy"; safeImg(img, ph.src, ph.caption);
        b.appendChild(img); b.addEventListener("click", () => openPhoto(i, b));
        cell.appendChild(b); row.appendChild(cell);
      });
      board.appendChild(row);
    }
  }
  buildBoard(); addEventListener("resize", buildBoard);
  function showPhoto(i) {
    cur = (i + C.photos.length) % C.photos.length;
    safeImg($("#lbImg"), C.photos[cur].src, C.photos[cur].caption);
    $("#lbCap").textContent = C.photos[cur].caption;
  }
  function openPhoto(i, trigger) { lastFocus = trigger; showPhoto(i); lb.hidden = false; $("#lbClose").focus(); }
  function closePhoto() { lb.hidden = true; if (lastFocus) lastFocus.focus(); }
  $("#lbClose").addEventListener("click", closePhoto);
  $("#lbPrev").addEventListener("click", () => showPhoto(cur - 1));
  $("#lbNext").addEventListener("click", () => showPhoto(cur + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) closePhoto(); });
  addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") closePhoto();
    if (e.key === "ArrowLeft") showPhoto(cur - 1);
    if (e.key === "ArrowRight") showPhoto(cur + 1);
  });

  /* ---------- screen 4: envelope opens, the letter writes itself ---------- */
  const lst = $("#lstage");
  let words = [], opened = false;
  function buildLetter() {
    const box = $("#letterText"); box.innerHTML = ""; words = [];
    C.letter.split("\n").forEach((line) => {
      const p = document.createElement("p");
      if (!line.trim()) p.className = "gap";
      else line.trim().split(/\s+/).forEach((w) => {
        const s = document.createElement("span"); s.className = "w"; s.textContent = w + " "; p.appendChild(s); words.push(s);
      });
      box.appendChild(p);
    });
    $("#letterNext").classList.remove("show");
  }
  function finishLetter() { clearInterval(typing); words.forEach((w) => w.classList.add("on")); $("#letterNext").classList.add("show"); }
  function typeLetter() {
    let i = 0;
    typing = setInterval(() => { if (i < words.length) words[i++].classList.add("on"); else finishLetter(); }, C.letterSpeedMs);
  }
  function openEnv() {
    if (opened) return; opened = true; lst.classList.add("open");
    later(() => lst.classList.add("out"), 1000);
    later(typeLetter, 2300);
  }
  function startLetter() {
    buildLetter(); opened = false; lst.className = "l-stage";
    if (reduce) { opened = true; lst.classList.add("open", "out"); return finishLetter(); }
    later(openEnv, 1200);
  }
  $("#env").addEventListener("click", openEnv);
  $("#letter").addEventListener("click", finishLetter);

  /* ---------- screen 5: dusk, then your flower animation ---------- */
  const pristine = $("#scene").cloneNode(true);   // untouched copy so Replay can restart the animation
  function startGarden() {
    const s5 = $("#s5"), one = $("#oneLast"), fin = $("#finale");
    one.classList.remove("on", "dusk", "off"); fin.classList.remove("show"); s5.classList.remove("dusk");
    const fresh = pristine.cloneNode(true); $("#scene").replaceWith(fresh);   // stays paused (class "container")
    later(() => one.classList.add("on"), 400);
    later(() => { one.classList.add("dusk"); s5.classList.add("dusk"); }, 1200);
    later(() => fresh.classList.remove("container"), reduce ? 600 : 2600);   // flowers start growing
    later(() => one.classList.add("off"), 3400);
    later(() => { fin.classList.add("show"); burst(innerWidth / 2, innerHeight * .25, reduce ? 0 : 45); }, reduce ? 900 : FINALE_MS);
  }

  /* ---------- replay ---------- */
  $("#replayBtn").addEventListener("click", () => {
    clearAll(); audio.pause(); audio.currentTime = 0; setMusicUI(true); musicBtn.classList.remove("show");
    gift.classList.remove("opened"); openBtn.disabled = false;
    go(0);
  });
})();
