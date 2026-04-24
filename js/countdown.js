// ========================================
// VoteMate AI — Election Countdown Timer
// ========================================
const Countdown = (() => {
  // Next Indian General Election (approximate — 2029)
  const TARGET = new Date('2029-05-01T07:00:00+05:30').getTime();
  let interval = null;

  function render(container) {
    if (!container) return;
    update(container);
    interval = setInterval(() => update(container), 1000);
  }

  function update(container) {
    const now = Date.now();
    const diff = Math.max(0, TARGET - now);
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    container.innerHTML = `
      <div class="countdown-label">${Lang.t('countdown')}</div>
      <div class="countdown-grid">
        <div class="countdown-unit">
          <span class="countdown-num">${String(d).padStart(3, '0')}</span>
          <span class="countdown-text">${Lang.t('days')}</span>
        </div>
        <div class="countdown-sep">:</div>
        <div class="countdown-unit">
          <span class="countdown-num">${String(h).padStart(2, '0')}</span>
          <span class="countdown-text">${Lang.t('hours')}</span>
        </div>
        <div class="countdown-sep">:</div>
        <div class="countdown-unit">
          <span class="countdown-num">${String(m).padStart(2, '0')}</span>
          <span class="countdown-text">${Lang.t('minutes')}</span>
        </div>
        <div class="countdown-sep">:</div>
        <div class="countdown-unit">
          <span class="countdown-num">${String(s).padStart(2, '0')}</span>
          <span class="countdown-text">${Lang.t('seconds')}</span>
        </div>
      </div>`;
  }

  function destroy() { if (interval) clearInterval(interval); }

  return { render, destroy };
})();
