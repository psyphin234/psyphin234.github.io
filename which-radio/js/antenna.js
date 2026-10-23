/* Radiation patterns of a vertical whip: pure calculations, no DOM.
   Textbook antenna theory (a thin monopole with a sinusoidal current, over a
   perfect, endless metal ground plane, by image theory): the far field at
   angle theta from the vertical is
     E(theta) = [cos(kL cos theta) - cos(kL)] / sin theta,   kL = 2 pi L / lambda
   Directivity is that field squared over its average across the upper half-
   space, so both antennas are compared at the same radiated power. A real
   vehicle roof is a small ground plane, which tilts both patterns upward. */
(() => {
  "use strict";
  const STEPS = 2000;

  function field(lengthWaves, elevDeg) {
    const kl = 2 * Math.PI * lengthWaves;
    const th = Math.max(1e-6, ((90 - elevDeg) * Math.PI) / 180);
    return (Math.cos(kl * Math.cos(th)) - Math.cos(kl)) / Math.sin(th);
  }

  // integral of |E|^2 sin(theta) over 0..pi/2 (the half-space above the ground)
  function powerIntegral(lengthWaves) {
    let sum = 0;
    const h = Math.PI / 2 / STEPS;
    for (let i = 0; i < STEPS; i++) {
      const th = (i + 0.5) * h;
      const e = field(lengthWaves, 90 - (th * 180) / Math.PI);
      sum += e * e * Math.sin(th) * h;
    }
    return sum;
  }

  /* Directivity (linear) at an elevation angle: D = 2 |E|^2 / integral. */
  function makeAntenna(lengthWaves) {
    const P = powerIntegral(lengthWaves);
    const gain = (elevDeg) => {
      const e = field(lengthWaves, elevDeg);
      return (2 * e * e) / P;
    };
    const dBi = (elevDeg) => 10 * Math.log10(Math.max(gain(elevDeg), 1e-9));
    return { lengthWaves, gain, dBi };
  }

  const quarter = makeAntenna(0.25);
  const fiveEighths = makeAntenna(0.625);

  /* the 5/8 compared with the quarter-wave toward one elevation angle (dB) */
  function difference(elevDeg) {
    return fiveEighths.dBi(elevDeg) - quarter.dBi(elevDeg);
  }

  // the lowest angle above which the quarter-wave does better
  function crossover() {
    for (let a = 0; a <= 90; a += 0.1) if (difference(a) < 0) return a;
    return null;
  }

  // the 5/8's null: where cos(kL cos th) = cos(kL), away from the vertical
  function nullElevation() {
    let best = 0, min = Infinity;
    for (let a = 5; a < 85; a += 0.05) {
      const g = fiveEighths.gain(a);
      if (g < min) { min = g; best = a; }
    }
    return best;
  }

  // the angle above the null where the 5/8 is ahead again (its weak upper lobe)
  function crossoverHigh() {
    for (let a = nullElevation(); a <= 90; a += 0.1) if (difference(a) > 0) return a;
    return null;
  }

  window.RADIO = window.RADIO || {};
  window.RADIO.antenna = { quarter, fiveEighths, difference, crossover, nullElevation, crossoverHigh };
})();
