// ========================================
// VoteMate AI — App Controller (v2)
// ========================================
const App = (() => {
  let currentView = 'landing';
  let currentTab = 'chat';
  const CHAT_STORAGE = 'votemate_chat_history';

  function init() {
    // Init 3D background
    const canvas = document.getElementById('tubes-canvas');
    TubesBackground.init(canvas);
    canvas.addEventListener('click', () => TubesBackground.randomize());

    // Landing CTA
    document.getElementById('cta-btn').addEventListener('click', () => switchView('main'));

    // Back button
    document.getElementById('nav-back-btn').addEventListener('click', () => switchView('landing'));

    // Tab switching
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });
    document.querySelectorAll('.mobile-tab').forEach(tab => {
      tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    // Language toggles
    document.getElementById('lang-toggle-landing').addEventListener('click', toggleLang);
    document.getElementById('lang-toggle-main').addEventListener('click', toggleLang);

    // Countdown
    Countdown.render(document.getElementById('countdown-container'));

    // Chat
    initChat();

    // Checklist
    Checklist.render(document.querySelector('.sidebar'));

    // Readiness
    updateReadiness();

    // Apply saved language
    applyLang();
  }

  function switchView(view) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(view).classList.add('active');
    currentView = view;
  }

  function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
    document.querySelectorAll('.mobile-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
    document.querySelectorAll('.tab-content').forEach(tc => tc.classList.toggle('active', tc.id === `tab-${tab}`));

    if (tab === 'documents') DocValidator.render(document.querySelector('.doc-panel'));
    if (tab === 'quiz') Quiz.render(document.querySelector('.quiz-panel'));
  }

  // ---- Language ----
  function toggleLang() {
    Lang.toggle();
    applyLang();
  }

  function applyLang() {
    const lang = Lang.get();
    document.documentElement.lang = lang === 'hi' ? 'hi' : 'en';

    // Toggle button text
    const toggleText = Lang.t('langToggle');
    const els = document.querySelectorAll('.lang-text');
    els.forEach(el => el.textContent = toggleText);

    // Landing page
    const set = (id, key) => { const el = document.getElementById(id); if (el) el.textContent = Lang.t(key); };
    set('landing-badge-text', 'badge');
    set('landing-subtitle', 'subtitle');
    set('cta-text', 'cta');

    // Nav
    set('nav-home-text', 'home');
    document.querySelectorAll('.tab-label').forEach(el => {
      el.textContent = Lang.t(el.dataset.key);
    });
    document.querySelectorAll('.mob-tab-text').forEach(el => {
      el.textContent = Lang.t(el.dataset.key);
    });

    // Sidebar
    set('sidebar-title', 'checklistTitle');
    set('progress-text', 'progress');

    // Chat
    const chatInput = document.getElementById('chat-input');
    if (chatInput) chatInput.placeholder = Lang.t('chatPlaceholder');

    // Re-render checklist (it uses Lang internally now via labels)
    Checklist.render(document.querySelector('.sidebar'));
    updateReadiness();

    // Countdown refreshes on next tick automatically

    // Re-render doc/quiz if active
    if (currentTab === 'documents') DocValidator.render(document.querySelector('.doc-panel'));
    if (currentTab === 'quiz') Quiz.render(document.querySelector('.quiz-panel'));
  }

  // ---- Readiness Dashboard ----
  function updateReadiness() {
    const pct = Checklist.getProgress();
    const ring = document.getElementById('readiness-ring-fill');
    const pctEl = document.getElementById('readiness-pct');
    const label = document.getElementById('readiness-label');
    if (!ring) return;

    const circumference = 2 * Math.PI * 52;
    const offset = circumference - (pct / 100) * circumference;
    ring.style.strokeDasharray = circumference;
    ring.style.strokeDashoffset = offset;

    pctEl.textContent = Math.round(pct) + '%';
    label.textContent = pct >= 100 ? Lang.t('readyLabel') : Lang.t('notReadyLabel');

    if (pct >= 100) {
      label.style.color = 'var(--green)';
      // Trigger confetti once
      if (!sessionStorage.getItem('votemate_confetti_done')) {
        Confetti.launch(4000);
        sessionStorage.setItem('votemate_confetti_done', '1');
      }
    } else {
      label.style.color = '';
      sessionStorage.removeItem('votemate_confetti_done');
    }
  }

  // ---- Chat UI ----
  function initChat() {
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send');
    const msgsEl = document.getElementById('chat-messages');
    const chipsEl = document.getElementById('chat-chips');

    // Voice input
    VoiceInput.init(document.getElementById('voice-btn'), (transcript) => {
      input.value = transcript;
      sendMessage();
    });

    // Load chat history or show welcome
    const saved = loadChatHistory();
    if (saved && saved.length > 0) {
      saved.forEach(msg => {
        if (msg.type === 'bot') addBotMsg(msg.html, false);
        else addUserMsg(msg.text, false);
      });
      // Show welcome chips anyway
      renderChips(ChatEngine.getWelcome().chips);
    } else {
      const welcome = ChatEngine.getWelcome();
      addBotMsg(welcome.text);
      renderChips(welcome.chips);
    }

    sendBtn.addEventListener('click', () => sendMessage());
    input.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });

    function sendMessage() {
      const text = input.value.trim();
      if (!text) return;
      addUserMsg(text);
      input.value = '';
      chipsEl.innerHTML = '';

      // Typing indicator
      const typing = document.createElement('div');
      typing.className = 'chat-msg bot';
      typing.innerHTML = `<div class="chat-bubble"><div class="typing-indicator"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div></div>`;
      msgsEl.appendChild(typing);
      scrollChat();

      setTimeout(() => {
        msgsEl.removeChild(typing);
        const reply = ChatEngine.getReply(text);
        addBotMsg(reply.text);
        renderChips(reply.chips);
      }, 800 + Math.random() * 600);
    }

    function addUserMsg(text, save = true) {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const el = document.createElement('div');
      el.className = 'chat-msg user';
      el.innerHTML = `<div class="chat-sender">You</div><div class="chat-bubble">${escapeHtml(text)}</div><div class="chat-time">${time}</div>`;
      msgsEl.appendChild(el);
      scrollChat();
      if (save) saveChatMsg({ type: 'user', text });
    }

    function addBotMsg(html, save = true) {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const el = document.createElement('div');
      el.className = 'chat-msg bot';
      el.innerHTML = `<div class="chat-sender">VoteMate AI</div><div class="chat-bubble">${html}</div><div class="chat-time">${time}</div>`;
      msgsEl.appendChild(el);
      scrollChat();
      if (save) saveChatMsg({ type: 'bot', html });
    }

    function renderChips(chips) {
      if (!chips || !chips.length) { chipsEl.innerHTML = ''; return; }
      chipsEl.innerHTML = chips.map(c => `<button class="chat-chip">${c}</button>`).join('');
      chipsEl.querySelectorAll('.chat-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          input.value = chip.textContent;
          sendMessage();
        });
      });
    }

    function scrollChat() { msgsEl.scrollTop = msgsEl.scrollHeight; }
  }

  // ---- Chat Persistence ----
  function saveChatMsg(msg) {
    try {
      const history = JSON.parse(localStorage.getItem(CHAT_STORAGE) || '[]');
      history.push(msg);
      // Keep last 50 messages
      if (history.length > 50) history.splice(0, history.length - 50);
      localStorage.setItem(CHAT_STORAGE, JSON.stringify(history));
    } catch (e) {}
  }

  function loadChatHistory() {
    try {
      return JSON.parse(localStorage.getItem(CHAT_STORAGE) || '[]');
    } catch { return []; }
  }

  function escapeHtml(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  // Expose updateReadiness for checklist to call
  return { init, updateReadiness };
})();

// Launch
document.addEventListener('DOMContentLoaded', App.init);
