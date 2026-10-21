/* The range model: pure calculations, no DOM. A simplified link budget:
     received = power + antenna gains - path loss - extra losses
   path loss = the larger of free-space and two-ray plane-earth loss (physics);
   extra losses = knife-edge diffraction over the ridge and the earth's curve
   (ITU-R P.526 eq. 31, counted only above grazing because plane-earth already
   covers the ground), trees (ITU-R P.833 eq. 1, one terminal in woodland, at
   each end) and building entry (ITU-R P.2109 median). Parameters in data.js. */
(() => {
  "use strict";
  const M = window.RADIO.MODEL;
  const log10 = Math.log10;

  const dbm = (watts) => 10 * log10(watts * 1000);
  const lambda = (mhz) => 299.792458 / mhz;

  function fspl(mhz, km) {
    return 32.45 + 20 * log10(mhz) + 20 * log10(km);
  }

  function planeEarth(km, h1, h2) {
    return 40 * log10(km * 1000) - 20 * log10(h1) - 20 * log10(h2);
  }

  // ITU-R P.526-16 eq. (31), for v > -0.78
  function knifeEdge(v) {
    if (v <= -0.78) return 0;
    return 6.9 + 20 * log10(Math.sqrt((v - 0.1) ** 2 + 1) + v - 0.1);
  }
  const J0 = knifeEdge(0);

  // earth bulge at the midpoint (m), effective radius from data.js
  function bulge(km) {
    const half = (km * 1000) / 2;
    return (half * half) / (2 * M.earthRadiusKm * 1000);
  }

  /* Extra loss from whatever pokes above the straight line at the midpoint:
     the earth's curve plus a ridge of height hillM. Returns { loss, h, v }. */
  function obstruction(mhz, km, h1, h2, hillM) {
    const d = km * 1000;
    const h = bulge(km) + (hillM || 0) - (h1 + h2) / 2;
    const v = h * Math.sqrt(8 / (lambda(mhz) * d)); // d1 = d2 = d/2
    const loss = v > 0 ? Math.max(0, knifeEdge(v) - J0) : 0;
    return { loss, h, v };
  }

  function interpLogLog(mhz, key) {
    const [a, b] = M.vegetation;
    const t = Math.log(mhz / a.mhz) / Math.log(b.mhz / a.mhz);
    return Math.exp(Math.log(a[key]) + t * (Math.log(b[key]) - Math.log(a[key])));
  }

  // ITU-R P.833-10 eq. (1), one terminal in woodland, for each end
  function vegetation(mhz, km) {
    const gamma = interpLogLog(mhz, "gamma");
    const am = interpLogLog(mhz, "am");
    const depth = Math.min((km * 1000) / 2, 2000);
    const one = am * (1 - Math.exp((-depth * gamma) / am));
    return { loss: 2 * one, gamma, am };
  }

  // ITU-R P.2109-2 median building entry loss (P = 0.5), horizontal path
  function buildingEntry(mhz, type) {
    const c = M.bel[type];
    const f = mhz / 1000;
    const lf = log10(f);
    const lh = c.r + c.s * lf + c.t * lf * lf;
    const A = lh;            // F^-1(0.5) = 0, elevation 0
    const B = c.w + c.x * lf;
    const C = -3.0;
    return 10 * log10(10 ** (0.1 * A) + 10 ** (0.1 * B) + 10 ** (0.1 * C));
  }

  /* One link. opts: { radio, position, terrain, hill, building, band, km } */
  function link(opts) {
    const R = window.RADIO.RADIOS[opts.radio];
    const mhz = M.freqMHz[opts.band];
    const near = M.positions[opts.position];
    let far = near;
    let farWatts = R.watts;
    if (opts.terrain === "building") {
      far = { height: M.indoorHandheld.height, gainDbi: M.indoorHandheld.gainDbi, cab: false };
      if (R.kind === "mobile") farWatts = window.RADIO.RADIOS.vhfHand.watts;
    }
    const watts = Math.min(R.watts, farWatts); // the weaker direction decides
    const km = Math.max(0.05, opts.km);
    const base = Math.max(fspl(mhz, km), planeEarth(km, near.height, far.height));
    const obs = obstruction(mhz, km, near.height, far.height, opts.terrain === "hill" ? opts.hill : 0);
    const veg = opts.terrain === "bush" ? vegetation(mhz, km).loss : 0;
    const bel = opts.terrain === "building" ? buildingEntry(mhz, opts.building) : 0;
    const cab = (near.cab ? M.cabLossDb : 0) + (far.cab ? M.cabLossDb : 0);
    const rx = dbm(watts) + near.gainDbi + far.gainDbi - base - obs.loss - veg - bel - cab;
    const margin = rx - M.sensitivityDbm;
    const verdict = margin >= M.clearMarginDb ? "clear" : margin >= M.scratchyMarginDb ? "scratchy" : "none";
    return { margin, verdict, rx, parts: { base, obs: obs.loss, veg, bel, cab }, mhz, watts };
  }

  /* How far the same set-up stays clear / usable in this terrain. */
  function reach(opts) {
    let clear = 0, usable = 0;
    for (let km = 0.05; km <= 120; km *= 1.02) {
      const r = link({ ...opts, km });
      if (r.verdict === "clear") clear = km;
      if (r.verdict !== "none") usable = km;
      if (r.verdict === "none" && km > usable * 1.6) break;
    }
    return { clear, usable };
  }

  // radio horizon (km) for two antenna heights, from the same effective radius
  function horizon(h1, h2) {
    const a = M.earthRadiusKm * 1000;
    return (Math.sqrt(2 * a * h1) + Math.sqrt(2 * a * h2)) / 1000;
  }

  window.RADIO.model = { link, reach, horizon, bulge, buildingEntry, vegetation, knifeEdge };
})();
