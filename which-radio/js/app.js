/* Which Two-Way Radio? The page: what radio you need (VHF and UHF side by
   side), inside the car vs an antenna outside, ZARA60 vs ZARA130, handheld vs
   mobile, licences, illegal radios, type approval. All text comes from data.js
   (our own strings, so building HTML from them is safe); the only visitor input
   is chip picks. */
(() => {
  "use strict";
  const D = window.RADIO;
  const model = D.model;
  const AN = D.antenna;
  const $ = (sel) => document.querySelector(sel);
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  function esc(s) {
    return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  function fmtKm(km) {
    if (km < 1) return `${Math.max(50, Math.round((km * 1000) / 50) * 50)} m`;
    if (km < 10) return `${Math.round(km * 10) / 10} km`;
    return `${Math.round(km)} km`;
  }

  // clear-speech range on open, flat ground from the range model
  const clearKm = (radio, position) =>
    model.reach({ radio, position, band: D.RADIOS[radio].band, terrain: "open", km: 1 }).clear;

  /* ---------------------------------------------------------- sources */
  const ORDER = ["law", "regulator", "standard", "issuer", "maker", "catalogue", "news", "photo", "physics"];
  const sourceIds = Object.keys(D.SOURCES).sort((a, b) =>
    ORDER.indexOf(D.SOURCES[a].kind) - ORDER.indexOf(D.SOURCES[b].kind));
  const refNo = (id) => sourceIds.indexOf(id) + 1;

  function refs(ids) {
    if (!ids || !ids.length) return "";
    const uniq = [...new Set(ids)].sort((a, b) => refNo(a) - refNo(b));
    return `<p class="refs">Sources: ${uniq.map((id) =>
      `<a href="#src-${id}" title="${esc(D.SOURCES[id].by + ": " + D.SOURCES[id].title)}">[${refNo(id)}]</a>`).join(" ")}</p>`;
  }

  function renderSources() {
    $("#source-list").innerHTML = sourceIds.map((id) => {
      const s = D.SOURCES[id];
      const title = s.url ? `<a href="${s.url}" target="_blank" rel="noopener">${esc(s.title)} &#8599;</a>` : esc(s.title);
      return `<li id="src-${id}"><span class="src-by">${esc(s.by)}</span> ${title} <span class="src-kind">${s.kind}</span></li>`;
    }).join("");
  }

  function chips(name, items, value) {
    return items.map(([val, text, sub]) =>
      `<label class="chip"><input type="radio" name="${name}" value="${val}"${value === val ? " checked" : ""}><span>${esc(text)}${sub ? `<small>${esc(sub)}</small>` : ""}</span></label>`).join("");
  }

  /* ---------------------------------------------------------- 1 + 2. what radio, VHF and UHF */
  const C = D.CHOOSER;
  const answers = { ...C.defaults };
  (function fromUrl() {
    const p = new URLSearchParams(location.search);
    C.questions.forEach((q) => {
      const v = p.get(q.id);
      if (v && q.options.some(([val]) => val === v)) answers[q.id] = v;
    });
  })();

  function renderChooser() {
    $("#chooser").innerHTML = C.questions.map((q, i) => `
      <fieldset class="q">
        <legend><span class="q-no">${i + 1}</span>${esc(q.label)}</legend>
        <div class="chips">${chips(q.id, q.options, answers[q.id])}</div>
      </fieldset>`).join("");
    $("#chooser").addEventListener("change", (e) => {
      if (!e.target.name) return;
      answers[e.target.name] = e.target.value;
      updateChooser();
    });
  }

  function updateChooser() {
    const a = C.answer(answers);
    $("#answer").innerHTML = `<span class="answer-band">${a.band === "VHF" ? "Club VHF" : "Licence-free UHF"}</span> ${esc(a.text)}`;
    document.querySelectorAll(".band").forEach((b) => b.classList.toggle("band--pick", b.dataset.band === a.band));
    try {
      const p = new URLSearchParams(answers);
      history.replaceState(null, "", "?" + p.toString() + location.hash);
    } catch (e) { /* file:// */ }
  }

  function renderBands() {
    $("#bands").innerHTML = ["VHF", "UHF"].map((k) => {
      const b = D.BANDS[k];
      return `<article class="band" data-band="${k}">
        <p class="band-pick-tag" aria-hidden="true">Your fit</p>
        <div class="band-head"><h3>${b.title}</h3><span class="badge badge--${k === "UHF" ? "pass" : "info"}">${esc(b.tag)}</span></div>
        <p class="band-lead">${esc(b.lead)}</p>
        <dl class="facts">${b.rows.map(([dt, dd]) => `<div><dt>${esc(dt)}</dt><dd>${esc(dd)}</dd></div>`).join("")}</dl>
        ${refs(b.sources)}
      </article>`;
    }).join("");
    $("#bands-note").textContent = D.BANDS.note;
  }

  /* ---------------------------------------------------------- vehicle drawing */
  function vehicle(x, y, flip, pos) {
    const s = flip ? -1 : 1;
    const X = (dx) => x + s * dx;
    let ant = "", tip;
    if (pos === "roof") {
      ant = `<line x1="${X(6)}" y1="${y - 64}" x2="${X(6)}" y2="${y - 98}" class="whip"/>`;
      tip = [X(6), y - 98];
    } else if (pos === "none") {
      tip = [X(6), y - 64];
    } else if (pos === "window") {
      ant = `<rect x="${X(36) - 4}" y="${y - 58}" width="8" height="14" rx="2" class="handheld"/><line x1="${X(36)}" y1="${y - 58}" x2="${X(36)}" y2="${y - 70}" class="stub"/>`;
      tip = [X(36), y - 70];
    } else {
      ant = `<rect x="${X(4) - 4}" y="${y - 52}" width="8" height="13" rx="2" class="handheld handheld--in"/><line x1="${X(4)}" y1="${y - 52}" x2="${X(4)}" y2="${y - 60}" class="stub stub--in"/>`;
      tip = [X(4), y - 56];
    }
    const cab = `M${X(-30)} ${y - 40} L${X(-20)} ${y - 64} L${X(28)} ${y - 64} L${X(38)} ${y - 40} Z`;
    const glass = `M${X(-22)} ${y - 42} L${X(-15)} ${y - 60} L${X(24)} ${y - 60} L${X(31)} ${y - 42} Z`;
    return { svg: `<g class="vehicle">
      <rect x="${x - 56}" y="${y - 42}" width="112" height="26" rx="6" class="body"/>
      <path d="${cab}" class="body"/>
      <path d="${glass}" class="glass"/>
      <path d="M${X(-17)} ${y - 64} V${y - 70} H${X(25)} V${y - 64}" class="rack"/>
      <circle cx="${X(-60)}" cy="${y - 30}" r="9" class="spare"/>
      ${pos === "cab" ? ant : ""}
      <circle cx="${X(-32)}" cy="${y - 14}" r="14" class="wheel"/><circle cx="${X(32)}" cy="${y - 14}" r="14" class="wheel"/>
      ${pos !== "cab" ? ant : ""}
    </g>`, tip };
  }

  /* ---------------------------------------------------------- 4x4 side view (detailed)
     Local units, ground at y = 0, front of the vehicle at +x. */
  const CAR = {
    body: "M-112 -34 L-112 -82 Q-112 -94 -100 -94 L34 -94 Q40 -94 44 -89 L62 -64 L104 -60 Q114 -58 114 -48 L114 -34 Z",
    windows: [
      [[-104, -88], [-72, -88], [-72, -66], [-104, -66]],
      [[-66, -88], [-14, -88], [-14, -66], [-66, -66]],
      [[-8, -88], [33, -88], [53, -66], [-8, -66]]
    ],
    cabin: [[-108, -91], [36, -91], [58, -63], [-108, -63]]
  };
  const polyD = (pts) => "M" + pts.map((p) => p.join(" ")).join(" L") + " Z";

  function car4x4(extra) {
    return `<g class="car">
      <circle cx="-122" cy="-62" r="13" class="tyre"/><circle cx="-122" cy="-62" r="5" class="rim"/>
      <path d="${CAR.body}" class="shell"/>
      <rect x="-118" y="-41" width="10" height="9" rx="2" class="trim"/>
      <rect x="108" y="-45" width="12" height="11" rx="2" class="trim"/>
      <rect x="104" y="-58" width="8" height="6" rx="1" class="lamp"/>
      <path d="M-100 -94 V-101 H32 V-94 M-70 -101 V-94 M-30 -101 V-94 M10 -101 V-94" class="rack"/>
      <path d="M59 -66 L59 -104 Q59 -109 65 -109 L71 -109" class="snorkel"/>
      ${CAR.windows.map((w) => `<path d="${polyD(w)}" class="glass2"/>`).join("")}
      <path d="M-69 -94 V-36 M-11 -94 V-36 M56 -64 V-36" class="seam"/>
      <rect x="44" y="-75" width="7" height="6" rx="1" class="trim"/>
      <circle cx="-68" cy="-24" r="25" class="arch"/><circle cx="68" cy="-24" r="25" class="arch"/>
      <circle cx="-68" cy="-20" r="20" class="tyre"/><circle cx="-68" cy="-20" r="8" class="rim"/>
      <circle cx="68" cy="-20" r="20" class="tyre"/><circle cx="68" cy="-20" r="8" class="rim"/>
      ${extra || ""}
    </g>`;
  }

  /* ---------------------------------------------------------- 3. inside vs outside */
  const OUT = {
    VHF: { label: "Club VHF", inside: ["vhfHand", "cab"], outside: ["vhfMobile", "roof"],
      insideName: "Handheld inside the cab", outsideName: "Fitted radio, antenna on the roof", outTitle: "Antenna on the roof" },
    UHF: { label: "Licence-free UHF", inside: ["pmr", "cab"], outside: ["pmr", "window"],
      insideName: "Handheld inside the cab", outsideName: "Handheld held out of the window", outTitle: "Held out of the window" }
  };
  let outBand = "VHF";
  const OUT_G = 290, OUT_S = 1.35, OUT_L = 225, OUT_R = 675;
  const toScreen = (cx, [x, y]) => [cx + x * OUT_S, OUT_G + y * OUT_S];

  function renderOutsideControls() {
    $("#outside-band").innerHTML = chips("outside-band", [["VHF", "Club VHF"], ["UHF", "Licence-free UHF"]], outBand);
    $("#outside-band").addEventListener("change", (e) => {
      outBand = e.target.value;
      updateOutsideText();
      drawOutside(performance.now());
    });
  }

  function rings(tip, ms, opacity, n = 5) {
    let out = "";
    for (let i = 0; i < n; i++) {
      const p = reduceMotion ? (i + 0.6) / n : ((ms / 1800) + i / n) % 1;
      out += `<circle cx="${tip[0].toFixed(1)}" cy="${tip[1].toFixed(1)}" r="${(8 + p * 205).toFixed(1)}" class="wave-ring" opacity="${((1 - p) * opacity).toFixed(3)}"/>`;
    }
    return out;
  }

  // a cone from the radio through one window, far out (screen coords)
  function cone(T, win) {
    const angs = win.map(([x, y]) => Math.atan2(y - T[1], x - T[0]));
    const a1 = Math.min(...angs), a2 = Math.max(...angs);
    const far = 400;
    let d = `M${T[0].toFixed(1)} ${T[1].toFixed(1)}`;
    for (let k = 0; k <= 6; k++) {
      const a = a1 + ((a2 - a1) * k) / 6;
      d += ` L${(T[0] + far * Math.cos(a)).toFixed(1)} ${(T[1] + far * Math.sin(a)).toFixed(1)}`;
    }
    return d + " Z";
  }

  function drawOutside(ms) {
    const o = OUT[outBand];
    const L = OUT_L, R = OUT_R;
    // left: the handheld inside, low in the cab, below the window line
    const T = toScreen(L, [-40, -64]);
    const radioIn = `<g class="radio-in"><rect x="-44" y="-56" width="8" height="15" rx="2"/><line x1="-40" y1="-56" x2="-40" y2="-64"/></g>
      <path d="M-40 -64 L-52 -90 L-82 -67 M-40 -64 L-22 -90 L4 -67 M-40 -64 L-98 -84 L-106 -66" class="bounce" marker-end="url(#arrow)"/>`;
    const cabin = polyD(CAR.cabin.map((p) => toScreen(L, p)));
    const cones = CAR.windows.map((w) => `<path d="${cone(T, w.map((p) => toScreen(L, p)))}"/>`).join("");
    // right: a roof antenna (VHF), or the handheld held out of the window (UHF)
    const rTipLocal = outBand === "VHF" ? [0, -160] : [18, -118];
    const rTip = toScreen(R, rTipLocal);
    const rExtra = outBand === "VHF"
      ? `<line x1="0" y1="-101" x2="0" y2="-160" class="whip"/><rect x="-5" y="-103" width="10" height="4" rx="1" class="trim"/>`
      : `<rect x="14" y="-106" width="8" height="15" rx="2" class="handheld"/><line x1="18" y1="-106" x2="18" y2="-118" class="stub"/>`;
    const sc = (cx) => `translate(${cx} ${OUT_G}) scale(${OUT_S})`;
    $("#outside-svg").innerHTML = `
      <desc id="outside-desc">Left: ${esc(o.insideName.toLowerCase())}; the vehicle's metal body traps most of the signal and some escapes through the windows. Right: ${esc(o.outsideName.toLowerCase())}, with the signal spreading freely.</desc>
      <defs>
        <linearGradient id="osky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#071033"/><stop offset="1" stop-color="#0c1a45"/></linearGradient>
        <clipPath id="oclipCabin"><path d="${cabin}"/></clipPath>
        <clipPath id="oclipCones">${cones}</clipPath>
        <clipPath id="oclipL"><rect x="0" y="0" width="449" height="${OUT_G}"/></clipPath>
        <clipPath id="oclipR"><rect x="451" y="0" width="449" height="${OUT_G}"/></clipPath>
        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" class="arrowhead"/></marker>
      </defs>
      <rect width="900" height="380" fill="url(#osky)"/>
      <line x1="450" y1="16" x2="450" y2="364" class="divider"/>
      <g clip-path="url(#oclipL)"><g clip-path="url(#oclipCones)">${rings(T, ms, 0.5)}</g></g>
      <text x="${L - 40}" y="96" text-anchor="middle" class="onote onote--esc">some escapes through the windows</text>
      <g clip-path="url(#oclipR)">${rings(rTip, ms, 0.85)}</g>
      <rect x="0" y="${OUT_G}" width="900" height="${380 - OUT_G}" class="oground"/>
      <g transform="${sc(L)}">${car4x4(radioIn)}</g>
      <g clip-path="url(#oclipCabin)">${rings(T, ms, 0.9, 6)}</g>
      <g transform="${sc(R)}">${car4x4(rExtra)}</g>
      <text x="${L}" y="${OUT_G + 34}" text-anchor="middle" class="otitle">${esc(o.insideName)}</text>
      <text x="${L}" y="${OUT_G + 56}" text-anchor="middle" class="onote">The metal body is a partial Faraday cage:</text>
      <text x="${L}" y="${OUT_G + 76}" text-anchor="middle" class="onote">the signal bounces around inside</text>
      <text x="${R}" y="${OUT_G + 34}" text-anchor="middle" class="otitle">${esc(o.outTitle)}</text>
      <text x="${R}" y="${OUT_G + 56}" text-anchor="middle" class="onote">Outside the metal body,</text>
      <text x="${R}" y="${OUT_G + 76}" text-anchor="middle" class="onote">and higher up</text>`;
  }

  function updateOutsideText() {
    const o = OUT[outBand];
    const kIn = clearKm(...o.inside), kOut = clearKm(...o.outside);
    const max = Math.max(kIn, kOut);
    const bar = (km, cls) => `<span class="reach-bar ${cls}" style="width:${Math.max(4, (km / max) * 100).toFixed(1)}%"></span>`;
    $("#outside-reach").innerHTML = `
      <div class="reach-row"><span class="reach-label">${esc(o.insideName)}</span>${bar(kIn, "reach-bar--in")}<span class="reach-km">about ${fmtKm(kIn)}</span></div>
      <div class="reach-row"><span class="reach-label">${esc(o.outsideName)}</span>${bar(kOut, "reach-bar--out")}<span class="reach-km">about ${fmtKm(kOut)}</span></div>`;
    const note = outBand === "VHF"
      ? `Clear speech on open, flat ground, from the range model. Most of the difference is the metal body and the antenna's height, not the watts: the same 5 W handheld held out of the window reaches about ${fmtKm(clearKm("vhfHand", "window"))}. The fitted radio's figure matches ORRA's 15-30 km.`
      : `Clear speech on open, flat ground, from the range model. A licence-free radio keeps its own antenna and 0.5 W, so out of the window is as far as it legally goes.`;
    $("#outside-note").innerHTML = esc(note) + refs(["physics", "p526", "orraVhf", "annexB2023", "ta2018"]);
  }

  /* ---------------------------------------------------------- 4. antennas */
  const A = D.ANTENNAS;
  let antScenario = "mountains";
  const BX = 300, BG = 340, BR = 300;
  const gMax = AN.fiveEighths.gain(0);
  const LO = AN.crossover(), HI = AN.crossoverHigh();   // about 18° and 60°
  // drawn to scale in power (linear gain): 3 dB = twice as long
  const bRadius = (ant, deg) => BR * Math.max(0, ant.gain(deg)) / gMax;

  /* The two antennas side by side, drawn to one scale (0.2 px per mm) from
     Webb's cutting chart at about 150 MHz. Drawings, not photos. */
  function antennaPic(name, kind, whipMm, base, cls) {
    const S = 0.2, G = 372, X = 130;
    const baseTop = G - 8 - (base === "coil" ? 30 : 20);
    const top = baseTop - whipMm * S;
    let parts = `<rect x="${X - 11}" y="${G - 8}" width="22" height="8" rx="2" class="pmount"/>`;
    if (base === "coil") {
      parts += `<rect x="${X - 8}" y="${baseTop}" width="16" height="30" rx="5" class="pcoil"/>`;
    } else {
      let d = `M${X} ${G - 8}`;
      for (let i = 1; i <= 9; i++) d += ` L${X + (i % 2 ? 6 : -6)} ${G - 8 - i * 2}`;
      parts += `<path d="${d} L${X} ${baseTop}" class="pspring"/>`;
    }
    parts += `<line x1="${X}" y1="${baseTop}" x2="${X}" y2="${top}" class="pwhip"/><circle cx="${X}" cy="${top}" r="3.5" class="ptip"/>`;
    const dim = `<line x1="${X + 30}" y1="${baseTop}" x2="${X + 30}" y2="${top}" class="pdim" marker-start="url(#parr-${cls})" marker-end="url(#parr-${cls})"/>
      <text x="${X + 42}" y="${(baseTop + top) / 2 - 4}" class="pdim-t">whip about</text>
      <text x="${X + 42}" y="${(baseTop + top) / 2 + 20}" class="pdim-t pdim-t--n">${String(whipMm).replace(/\B(?=(\d{3})+$)/, ",")} mm</text>`;
    return `<figure class="ant-pic ant-pic--${cls}">
      <svg viewBox="0 0 300 400" role="img" aria-label="Drawing of the ${esc(name)}, ${esc(kind.toLowerCase())}: whip about ${whipMm} mm">
        <defs><marker id="parr-${cls}" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" class="parrow"/></marker></defs>
        <path d="M0 ${G} L300 ${G} L300 400 L0 400 Z" class="proof"/>
        ${parts}${dim}
      </svg>
      <figcaption><strong>${esc(name)}</strong> <span>${esc(kind)}</span></figcaption>
    </figure>`;
  }

  function renderAntenna() {
    const t = A.tuning;
    $("#ant-pics").innerHTML =
      antennaPic("ZARA60", "Quarter-wave whip with a spring", t.len60.low, "spring", "q") +
      antennaPic("ZARA130", "Base-loaded 5/8-wave: a coil at the base", t.len130.low, "coil", "f");
    $("#zara-table").innerHTML = `<thead><tr><th scope="col"></th><th scope="col">ZARA60<br><span class="muted">quarter-wave</span></th><th scope="col">ZARA130<br><span class="muted">5/8-wave</span></th></tr></thead><tbody>${A.rows.map(([k, a, b]) =>
      `<tr><th scope="row">${esc(k)}</th><td>${esc(a)}</td><td>${esc(b)}</td></tr>`).join("")}</tbody>`;
    $("#tuning-points").innerHTML = A.tuning.text.map((p) => `<li>${esc(p)}</li>`).join("");
    $("#tuning-refs").innerHTML = refs(A.tuning.sources);
    drawTuning();
    $("#antenna-scenario").innerHTML = chips("antenna-scenario", A.scenarios.map((s) => [s.id, s.label, `${s.deg}° up`]), antScenario);
    $("#antenna-scenario").addEventListener("change", (e) => { antScenario = e.target.value; drawBubble(performance.now()); });
    $("#key-sf").textContent = `Orange sky: the ZARA130 is stronger (horizon to ${Math.round(LO)}° up)`;
    $("#key-sq").textContent = `Blue sky: the ZARA60 is stronger (${Math.round(LO)}° to ${Math.round(HI)}° up)`;
    $("#antenna-points").innerHTML = A.points.map((p) => `<li>${esc(p)}</li>`).join("");
    $("#antenna-refs").innerHTML = refs(A.sources);
  }

  /* Which channels each antenna covers: ORRA's two channel groups and each
     antenna's tuned bandwidth, to scale in MHz (no frequencies shown). */
  function drawTuning() {
    const t = A.tuning;
    const px = 58;                       // px per MHz
    const x0 = 150;                      // channels 5-7
    const xHi = x0 + t.groupGapMHz * px; // channel 1 (2-4 within groupSpanMHz)
    const xHi2 = xHi + t.groupSpanMHz * px;
    const mid60 = (x0 + xHi2) / 2, w60 = t.bw60 * px;
    const mid130 = (xHi + xHi2) / 2, w130 = t.bw130 * px;
    // solid across the rated bandwidth (SWR 1.5:1 or better), fading beyond it as the SWR rises
    const win = (mid, w, y, cls, label, id) => {
      const W = w * 1.16;
      return `<linearGradient id="${id}" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stop-opacity="0"/><stop offset="0.07" stop-opacity="1"/><stop offset="0.93" stop-opacity="1"/><stop offset="1" stop-opacity="0"/>
        </linearGradient>
        <rect x="${(mid - W / 2).toFixed(1)}" y="${y}" width="${W.toFixed(1)}" height="26" rx="13" class="${cls}" style="fill:url(#${id})"/>
        <text x="40" y="${y + 18}" class="tlabel">${label}</text>`;
    };
    const ok60lo = x0 >= mid60 - w60 / 2 - 8, ok130lo = x0 >= mid130 - w130 / 2;
    $("#tuning-svg").innerHTML = `
      <desc>ORRA's channels in two groups about ${t.groupGapMHz} MHz apart. A ZARA60's 9 MHz bandwidth spans both groups; a ZARA130's 3 MHz bandwidth covers only channels 1-4.</desc>
      <line x1="${x0}" y1="40" x2="${x0}" y2="190" class="chan"/>
      <line x1="${xHi}" y1="40" x2="${xHi}" y2="190" class="chan"/>
      <line x1="${xHi2}" y1="40" x2="${xHi2}" y2="190" class="chan"/>
      <text x="${x0}" y="30" text-anchor="middle" class="tchan">Channels 5-7</text>
      <text x="${(xHi + xHi2) / 2}" y="30" text-anchor="middle" class="tchan">Channels 1-4</text>
      ${win(mid60, w60, 70, "bw bw--q", "ZARA60", "g60")}
      ${win(mid130, w130, 120, "bw bw--f", "ZARA130", "g130")}
      <text x="${x0 + 14}" y="${ok60lo ? 88 : 88}" class="tmark tmark--ok">${ok60lo ? "✓" : "✗"}</text>
      <text x="${x0 + 14}" y="138" class="tmark ${ok130lo ? "tmark--ok" : "tmark--bad"}">${ok130lo ? "✓" : "✗ not covered"}</text>
      <text x="${xHi2 + 12}" y="88" class="tmark tmark--ok">✓</text>
      <text x="${xHi2 + 12}" y="138" class="tmark tmark--ok">✓</text>
      <line x1="${x0}" y1="176" x2="${xHi}" y2="176" class="dim" marker-start="url(#tarrow)" marker-end="url(#tarrow)"/>
      <text x="${(x0 + xHi) / 2}" y="170" text-anchor="middle" class="tdim">about ${t.groupGapMHz} MHz apart</text>
      <text x="${mid130 - 40}" y="138" text-anchor="middle" class="tdim tdim--in">${t.bw130} MHz</text>
      <text x="${mid60}" y="88" text-anchor="middle" class="tdim tdim--in">up to ${t.bw60} MHz</text>
      <defs><marker id="tarrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" class="arrowhead"/></marker></defs>`;
  }

  function bubblePath(ant, ox, oy) {
    let d = `M${ox} ${oy}`;
    for (let a = 0; a <= 180; a += 1) {
      const e = a <= 90 ? a : 180 - a;
      const r = bRadius(ant, e);
      const rad = (a * Math.PI) / 180;
      d += ` L${(ox + r * Math.cos(rad)).toFixed(1)} ${(oy - r * Math.sin(rad)).toFixed(1)}`;
    }
    return d + " Z";
  }

  function drawBubble(ms) {
    const sc = A.scenarios.find((s) => s.id === antScenario);
    const a = sc.deg;
    const S1 = 1.15;
    const ox = BX, oy = BG - 101 * S1;   // antenna base on the roof
    const mount = `<rect x="-5" y="-103" width="10" height="4" rx="1" class="trim"/>`;
    const own = `<g transform="translate(${BX} ${BG}) scale(${S1})">${car4x4(mount)}</g>`;
    const rad = (a * Math.PI) / 180;
    const far = BR + 50;
    const sx = ox + far * Math.cos(rad), sy = oy - far * Math.sin(rad);
    const pt = (r) => [ox + r * Math.cos(rad), oy - r * Math.sin(rad)];
    const gq = AN.quarter.gain(a), gf = AN.fiveEighths.gain(a);
    const [qx, qy] = pt(bRadius(AN.quarter, a)), [fx, fy] = pt(bRadius(AN.fiveEighths, a));
    const q = bubblePath(AN.quarter, ox, oy), f = bubblePath(AN.fiveEighths, ox, oy);
    let pulse = "";
    if (!reduceMotion) {
      const p = (ms / 2200) % 1;
      pulse = `<path d="${q}" class="pulse-q" transform="translate(${ox} ${oy}) scale(${p.toFixed(3)}) translate(${-ox} ${-oy})" opacity="${((1 - p) * 0.6).toFixed(3)}"/>
        <path d="${f}" class="pulse-f" transform="translate(${ox} ${oy}) scale(${p.toFixed(3)}) translate(${-ox} ${-oy})" opacity="${((1 - p) * 0.6).toFixed(3)}"/>`;
    }
    // the other vehicle, drawn smaller (further away) with its antenna tip where the line ends
    const s2 = (101 * S1) / 160;          // on flat ground its antenna tip is level with ours
    const gy2 = sy + 160 * s2;            // where its wheels stand
    const other = `<g transform="translate(${sx.toFixed(1)} ${gy2.toFixed(1)}) scale(${-s2} ${s2})">${car4x4(`<line x1="0" y1="-101" x2="0" y2="-160" class="whip"/>`)}</g>`;
    const ground2 = a > 0
      ? `<path d="M${ox + 150} ${BG} L${(sx - 95).toFixed(1)} ${gy2.toFixed(1)} L900 ${gy2.toFixed(1)} L900 ${BG} Z" class="mountain"/>`
      : "";
    const times = (r) => (r >= 10 ? Math.round(r) : r.toFixed(1)) + "×";
    const ratio = gq > gf ? `ZARA60: ${times(gq / gf)} the power` : `ZARA130: ${times(gf / gq)} the power`;
    // the sky shaded by which antenna is stronger at each angle (right-hand side)
    const polar = (deg, r) => [ox + r * Math.cos((deg * Math.PI) / 180), oy - r * Math.sin((deg * Math.PI) / 180)].map((v) => v.toFixed(1));
    const sector = (a1, a2, cls) => `<path d="M${ox} ${oy} L${polar(a1, 900).join(" ")} A900 900 0 0 0 ${polar(a2, 900).join(" ")} Z" class="${cls}"/>`;
    const edge = (deg, rText) => {
      const [x2, y2] = polar(deg, 900), [tx, ty] = polar(deg, rText);
      return `<line x1="${ox}" y1="${oy}" x2="${x2}" y2="${y2}" class="sector-edge"/><text x="${tx}" y="${ty}" dx="8" class="sector-deg">${Math.round(deg)}°</text>`;
    };
    $("#bubble").innerHTML = `
      <desc id="bubble-desc">${esc(sc.where)} Gain pattern, drawn to scale in power. Both antennas get the same power from the radio. The quarter-wave's pattern is rounder; the 5/8's is flatter and twice as long toward the horizon. The ZARA130 is stronger from the horizon to ${Math.round(LO)}° up, the ZARA60 from ${Math.round(LO)}° to ${Math.round(HI)}° up. Toward the other vehicle: ${ratio}.</desc>
      <defs><linearGradient id="bsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#071033"/><stop offset="1" stop-color="#0c1a45"/></linearGradient></defs>
      <rect width="900" height="400" fill="url(#bsky)"/>
      ${sector(0, LO, "sector sector--f")}
      ${sector(LO, HI, "sector sector--q")}
      ${edge(LO, 470)}
      ${edge(HI, 200)}
      <text x="20" y="40" class="btitle">GAIN PATTERN</text>
      <text x="20" y="66" class="bsub">same power, different shape</text>
      ${ground2}
      <rect x="0" y="${BG}" width="900" height="${400 - BG}" class="bground"/>
      <path d="${q}" class="fill-q"/>
      <path d="${f}" class="fill-f"/>
      ${pulse}
      ${own}
      <line x1="${ox}" y1="${oy}" x2="${ox}" y2="${oy - 66}" class="whip"/>
      ${other}
      <line x1="${ox}" y1="${oy}" x2="${sx}" y2="${sy}" class="ray"/>
      <circle cx="${qx}" cy="${qy}" r="7" class="hit hit--q"/>
      <circle cx="${fx}" cy="${fy}" r="7" class="hit hit--f"/>
      <text x="880" y="380" text-anchor="end" class="blabel blabel--ratio">Toward the other vehicle: ${ratio}</text>`;
    const diff = AN.difference(a);
    const bar = (g) => Math.max(2, (g / gMax) * 100);
    const winner = diff > 0.5 ? "The ZARA130 is stronger here" : diff < -0.5 ? "The ZARA60 is stronger here" : "About the same here";
    $("#antenna-meters").innerHTML = `
      <p class="meters-head"><strong>${esc(sc.label)}:</strong> ${esc(sc.where)} <strong>${winner}</strong>${Math.abs(diff) > 0.5 ? `: ${ratio.split(": ")[1]} (${Math.abs(diff).toFixed(1)} dB)` : ""}.</p>
      <div class="reach-row"><span class="reach-label">ZARA60 (quarter-wave)</span><span class="reach-bar reach-bar--q" style="width:${bar(gq).toFixed(1)}%"></span></div>
      <div class="reach-row"><span class="reach-label">ZARA130 (5/8-wave)</span><span class="reach-bar reach-bar--f" style="width:${bar(gf).toFixed(1)}%"></span></div>
      <p class="small">Power sent toward the other vehicle, same radio, ideal patterns, drawn to scale in power: 3 dB is twice the power, so on the horizon the ZARA130's bubble is twice as long, matching Webb's "3 dB relative to a quarter-wave".</p>`;
  }

  /* ---------------------------------------------------------- 5 to 8 */
  function renderKinds() {
    const K = D.KINDS;
    const numbers = {
      handheld: `Club VHF handheld out of the window: clear to about ${fmtKm(clearKm("vhfHand", "window"))}; inside the cab: about ${fmtKm(clearKm("vhfHand", "cab"))}. Licence-free UHF out of the window: about ${fmtKm(clearKm("pmr", "window"))}.`,
      mobile: `Club VHF fitted with a roof antenna: clear to about ${fmtKm(clearKm("vhfMobile", "roof"))}.`
    };
    $("#kinds-list").innerHTML = ["handheld", "mobile"].map((k) => {
      const x = K[k];
      return `<article class="kind">
        <h3>${esc(x.title)}</h3>
        <ul class="pros">${x.pros.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
        <ul class="cons">${x.cons.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
        <p class="kind-numbers"><span class="muted">Range model, open flat ground:</span> ${esc(numbers[k])}</p>
        ${refs(x.sources)}
      </article>`;
    }).join("");
  }

  function renderLicences() {
    $("#licence-list").innerHTML = D.LICENCES.map((l) => `
      <article class="licence">
        <h3>${esc(l.title)}</h3>
        ${l.who ? `<p class="licence-who">${esc(l.who)}</p>` : ""}
        <ol>${l.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>
        ${l.extra ? `<p>${esc(l.extra)}</p>` : ""}
        ${l.links.length ? `<p class="links">${l.links.map(([t, u]) => `<a href="${u}" target="_blank" rel="noopener">${esc(t)} &#8599;</a>`).join(" &middot; ")}</p>` : ""}
        ${refs(l.sources)}
      </article>`).join("");
    $("#licence-then").innerHTML = `${esc(D.LICENCE_THEN)} ${refs(["baofeng2022"])}`;
  }

  function renderIllegal() {
    $("#illegal-list").innerHTML = D.ILLEGAL.map((x) => `
      <article class="illegal-card"><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p>${refs(x.sources)}</article>`).join("");
  }

  function renderExamples() {
    const E = D.EXAMPLES;
    $("#examples-intro").textContent = E.intro;
    $("#examples-photo").insertAdjacentHTML("beforeend", E.radios.map((r) =>
      `<span class="photo-badge photo-badge--${r.tone}" style="left:${(r.x * 100).toFixed(1)}%" aria-hidden="true">${r.n}</span>`).join(""));
    $("#examples-list").innerHTML = E.radios.map((r) => `
      <article class="example example--${r.tone}">
        <div class="example-head"><span class="example-no">${r.n}</span><h3>${esc(r.name)}</h3></div>
        <p class="example-verdict">${esc(r.verdict)}</p>
        <p>${esc(r.text)}</p>
        ${refs(r.sources)}
      </article>`).join("");
  }

  function renderDigital() {
    $("#digital-lead").textContent = D.DIGITAL.lead;
    $("#digital-list").innerHTML = D.DIGITAL.points.map((p) => `
      <article class="digital-card"><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p>${refs(p.sources)}</article>`).join("");
  }

  function renderApproval() {
    $("#approval-points").innerHTML = D.TYPE_APPROVAL.points.map((p) => `<li>${esc(p)}</li>`).join("");
    $("#approval-refs").innerHTML = refs(D.TYPE_APPROVAL.sources);
  }

  /* ---------------------------------------------------------- animation: about 30 fps, only on screen */
  const visible = { outside: false, bubble: false };
  let last = 0;
  function loop(ms) {
    if (ms - last > 33) {
      last = ms;
      if (visible.outside) drawOutside(ms);
      if (visible.bubble) drawBubble(ms);
    }
    requestAnimationFrame(loop);
  }

  /* ---------------------------------------------------------- start */
  document.querySelectorAll("[data-checked]").forEach((n) => { n.textContent = D.CHECKED; });
  $("#year").textContent = new Date().getFullYear();
  renderSources();
  renderBands();
  renderChooser();
  updateChooser();
  renderOutsideControls();
  updateOutsideText();
  drawOutside(0);
  renderAntenna();
  drawBubble(0);
  renderKinds();
  renderLicences();
  renderIllegal();
  renderExamples();
  renderApproval();
  renderDigital();
  if (!reduceMotion) {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      visible[e.target.id === "outside-svg" ? "outside" : "bubble"] = e.isIntersecting;
    }));
    io.observe($("#outside-svg"));
    io.observe($("#bubble"));
    requestAnimationFrame(loop);
  }
})();
