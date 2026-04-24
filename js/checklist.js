// ========================================
// VoteMate AI — Checklist System (v2)
// ========================================
const Checklist = (() => {
  const STORAGE_KEY = 'votemate_checklist';
  const steps = [
    { id: 'register', labelKey: 'register', descKey: 'registerDesc', icon: '📝' },
    { id: 'verify', labelKey: 'verify', descKey: 'verifyDesc', icon: '🪪' },
    { id: 'booth', labelKey: 'booth', descKey: 'boothDesc', icon: '📍' },
    { id: 'vote', labelKey: 'vote', descKey: 'voteDesc', icon: '🗳️' }
  ];

  let state = loadState();

  function loadState() {
    try {
      const s = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return s && s.completed ? s : { completed: [], activeStep: 0 };
    } catch { return { completed: [], activeStep: 0 }; }
  }

  function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

  function toggle(id) {
    const idx = state.completed.indexOf(id);
    if (idx > -1) state.completed.splice(idx, 1);
    else state.completed.push(id);
    state.activeStep = getNextIncomplete();
    save();
  }

  function isCompleted(id) { return state.completed.includes(id); }

  function getNextIncomplete() {
    for (let i = 0; i < steps.length; i++) {
      if (!state.completed.includes(steps[i].id)) return i;
    }
    return steps.length;
  }

  function getProgress() { return (state.completed.length / steps.length) * 100; }

  function render(container) {
    if (!container) return;
    const listEl = container.querySelector('.checklist');
    const fillEl = container.querySelector('.progress-fill');
    const pctEl = container.querySelector('.progress-pct');
    if (!listEl) return;

    listEl.innerHTML = steps.map((step, i) => {
      const done = isCompleted(step.id);
      const active = i === state.activeStep && !done;
      const label = Lang.t(step.labelKey);
      const desc = Lang.t(step.descKey);
      return `
        <div class="checklist-item ${done ? 'completed' : ''} ${active ? 'active-step' : ''}" data-id="${step.id}">
          <div class="checklist-circle">${done ? '✓' : step.icon}</div>
          <div class="checklist-info">
            <div class="checklist-label">${label}</div>
            <div class="checklist-desc">${desc}</div>
          </div>
        </div>`;
    }).join('');

    if (fillEl) fillEl.style.width = getProgress() + '%';
    if (pctEl) pctEl.textContent = Math.round(getProgress()) + '%';

    listEl.querySelectorAll('.checklist-item').forEach(el => {
      el.addEventListener('click', () => {
        toggle(el.dataset.id);
        render(container);
        // Notify app to update readiness
        if (typeof App !== 'undefined' && App.updateReadiness) App.updateReadiness();
      });
    });
  }

  function reset() { state = { completed: [], activeStep: 0 }; save(); }

  return { steps, render, reset, getProgress };
})();
