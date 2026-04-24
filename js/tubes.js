// ========================================
// VoteMate AI — 3D Tubes Background
// ========================================
const TubesBackground = (() => {
  let app = null, canvas = null, loaded = false;

  function randomColors(n) {
    return Array.from({ length: n }, () =>
      '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
    );
  }

  async function init(el) {
    if (!el) return;
    canvas = el;
    try {
      const m = await import('https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js');
      app = m.default(canvas, {
        tubes: {
          colors: ['#00f0ff', '#6958d5', '#f967fb'],
          lights: { intensity: 180, colors: ['#00f0ff', '#f967fb', '#53bc28', '#6958d5'] }
        }
      });
      loaded = true;
    } catch (e) { console.error('Tubes load failed:', e); }
  }

  function randomize() {
    if (!app || !loaded) return;
    try {
      app.tubes.setColors(randomColors(3));
      app.tubes.setLightsColors(randomColors(4));
    } catch (e) {}
  }

  return { init, randomize };
})();
