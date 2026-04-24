// ========================================
// VoteMate AI — Voice Input (Web Speech API)
// ========================================
const VoiceInput = (() => {
  let recognition = null;
  let isListening = false;
  let onResult = null;
  let btn = null;

  function isSupported() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  function init(buttonEl, callback) {
    if (!isSupported()) {
      if (buttonEl) buttonEl.style.display = 'none';
      return;
    }
    btn = buttonEl;
    onResult = callback;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SR();
    recognition.lang = Lang.get() === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      if (onResult) onResult(transcript);
      stopListening();
    };

    recognition.onerror = () => stopListening();
    recognition.onend = () => stopListening();

    if (btn) {
      btn.addEventListener('click', toggle);
    }
  }

  function toggle() {
    if (isListening) stopListening();
    else startListening();
  }

  function startListening() {
    if (!recognition) return;
    recognition.lang = Lang.get() === 'hi' ? 'hi-IN' : 'en-IN';
    try {
      recognition.start();
      isListening = true;
      if (btn) btn.classList.add('listening');
    } catch (e) {}
  }

  function stopListening() {
    if (!recognition) return;
    try { recognition.stop(); } catch (e) {}
    isListening = false;
    if (btn) btn.classList.remove('listening');
  }

  return { init, isSupported, toggle };
})();
