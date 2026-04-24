/**
 * @fileoverview VoteMate AI — Main Application Controller
 * @description Manages routing, chat UI, Google Gemini AI integration,
 * Firebase Analytics, voice input, and coordinates all feature modules.
 * @module App
 * @version 2.0.0
 */
const App = (() => {
  /** @type {string} Current active view ('landing' | 'main') */
  let currentView = 'landing';
  /** @type {string} Current active tab ('chat' | 'documents' | 'quiz') */
  let currentTab = 'chat';
  /** @constant {string} localStorage key for chat history */
  const CHAT_STORAGE = 'votemate_chat_history';

  /**
   * Initialize the application and all modules.
   * Sets up event listeners, Google services, and UI components.
   */
  function init() {
    // Init 3D background (Three.js)
    const canvas = document.getElementById('tubes-canvas');
    TubesBackground.init(canvas);
    canvas.addEventListener('click', () => TubesBackground.randomize());

    // ---- Google Services Integration ----
    // Initialize Firebase Analytics & Firestore
    FirebaseService.init().then(ready => {
      if (ready) {
        FirebaseService.logEvent('page_view', { page: 'landing' });
        console.log('Google Firebase: Analytics active');
      }
    });

    // Initialize Google Gemini AI (users can set API key via console)
    // Usage: App.setGeminiKey('YOUR_API_KEY') or set in localStorage
    const savedKey = localStorage.getItem('votemate_gemini_key');
    if (savedKey) {
      GeminiAI.init(savedKey);
      console.log('Google Gemini AI: Initialized');
    }

    // Landing CTA
    document.getElementById('cta-btn').addEventListener('click', () => {
      switchView('main');
      FirebaseService.logEvent('cta_clicked', { action: 'get_started' });
    });

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

    // Countdown timer
    Countdown.render(document.getElementById('countdown-container'));

    // Chat UI
    initChat();

    // Checklist
    Checklist.render(document.querySelector('.sidebar'));

    // Readiness dashboard
    updateReadiness();

    // Apply saved language preference
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

    // Track tab navigation in Firebase Analytics
    FirebaseService.logEvent('tab_switch', { tab_name: tab });

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

    /**
     * Send a message and get AI response.
     * Tries Google Gemini AI first, falls back to rule-based engine.
     */
    async function sendMessage() {
      const text = input.value.trim();
      if (!text) return;
      addUserMsg(text);
      input.value = '';
      chipsEl.innerHTML = '';

      // Log chat event to Firebase Analytics
      FirebaseService.logEvent('chat_message', { topic: text.substring(0, 50) });

      // Show typing indicator
      const typing = document.createElement('div');
      typing.className = 'chat-msg bot';
      typing.innerHTML = `<div class="chat-bubble"><div class="typing-indicator"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div></div>`;
      msgsEl.appendChild(typing);
      scrollChat();

      // Try Google Gemini AI first, fall back to rule-based engine
      if (GeminiAI.available()) {
        try {
          const geminiReply = await GeminiAI.chat(text);
          if (typing.parentNode) msgsEl.removeChild(typing);
          if (geminiReply) {
            addBotMsg(geminiReply.text);
            renderChips(geminiReply.chips);
            FirebaseService.logEvent('gemini_response', { success: true });
            return;
          }
        } catch (e) {
          console.warn('Gemini failed, using fallback:', e.message);
        }
      }

      // Fallback: rule-based ChatEngine
      setTimeout(() => {
        if (typing.parentNode) msgsEl.removeChild(typing);
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

  /**
   * Escape HTML special characters to prevent XSS.
   * @param {string} s - Raw user input string
   * @returns {string} Safely escaped HTML string
   */
  function escapeHtml(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  /**
   * Set Google Gemini API key for AI-powered chat.
   * @param {string} key - Gemini API key from https://aistudio.google.com/apikey
   */
  function setGeminiKey(key) {
    if (GeminiAI.init(key)) {
      localStorage.setItem('votemate_gemini_key', key);
      FirebaseService.logEvent('gemini_key_set', {});
      console.log('✅ Gemini AI activated! Chat will now use Google AI.');
    } else {
      console.error('❌ Invalid API key. Get one at https://aistudio.google.com/apikey');
    }
  }

  // Expose public API
  return { init, updateReadiness, setGeminiKey };
})();

// Launch on DOM ready
document.addEventListener('DOMContentLoaded', App.init);
