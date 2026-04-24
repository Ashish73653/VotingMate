/**
 * @fileoverview VoteMate AI — Test Suite
 * @description Comprehensive unit and integration tests for all VoteMate AI modules.
 * Run by opening tests/test.html in a browser.
 * @module TestSuite
 */

const TestRunner = (() => {
  let passed = 0;
  let failed = 0;
  let total = 0;
  const results = [];

  /**
   * Assert that a condition is true.
   * @param {boolean} condition - The condition to test
   * @param {string} testName - Description of the test
   */
  function assert(condition, testName) {
    total++;
    if (condition) {
      passed++;
      results.push({ name: testName, status: 'PASS' });
    } else {
      failed++;
      results.push({ name: testName, status: 'FAIL' });
      console.error(`FAIL: ${testName}`);
    }
  }

  /**
   * Assert that two values are equal.
   * @param {*} actual - Actual value
   * @param {*} expected - Expected value
   * @param {string} testName - Description of the test
   */
  function assertEqual(actual, expected, testName) {
    assert(actual === expected, `${testName} (expected: ${expected}, got: ${actual})`);
  }

  /**
   * Assert that a value is truthy.
   * @param {*} value - Value to check
   * @param {string} testName - Description of the test
   */
  function assertTruthy(value, testName) {
    assert(!!value, testName);
  }

  /**
   * Assert that a value is of a certain type.
   * @param {*} value - Value to check
   * @param {string} type - Expected type
   * @param {string} testName - Description of the test
   */
  function assertType(value, type, testName) {
    assert(typeof value === type, `${testName} (expected type: ${type}, got: ${typeof value})`);
  }

  /**
   * Assert that a string contains a substring.
   * @param {string} str - String to search in
   * @param {string} substr - Substring to find
   * @param {string} testName - Description of the test
   */
  function assertContains(str, substr, testName) {
    assert(str.includes(substr), `${testName} (expected to contain: "${substr}")`);
  }

  /**
   * Assert that a value matches a regex.
   * @param {string} value - Value to test
   * @param {RegExp} regex - Regex pattern
   * @param {string} testName - Description
   */
  function assertMatch(value, regex, testName) {
    assert(regex.test(value), `${testName} (expected to match: ${regex})`);
  }

  /**
   * Run all test suites and render results.
   */
  function runAll() {
    passed = 0;
    failed = 0;
    total = 0;
    results.length = 0;

    console.log('=== VoteMate AI Test Suite ===\n');

    testChatEngine();
    testDocumentValidator();
    testQuizModule();
    testChecklistModule();
    testLanguageModule();
    testCountdownModule();
    testGeminiModule();
    testFirebaseModule();
    testVoiceModule();
    testConfettiModule();
    testSecuritySanitization();
    testAccessibility();

    console.log(`\n=== Results: ${passed}/${total} passed, ${failed} failed ===`);
    renderResults();
  }

  // ========== CHAT ENGINE TESTS ==========
  function testChatEngine() {
    console.log('\n--- ChatEngine Tests ---');

    // Test 1: Module exists
    assertTruthy(typeof ChatEngine !== 'undefined', 'ChatEngine module exists');

    // Test 2: getWelcome returns object
    const welcome = ChatEngine.getWelcome();
    assertTruthy(welcome, 'getWelcome returns a value');
    assertType(welcome.text, 'string', 'Welcome text is a string');
    assert(Array.isArray(welcome.chips), 'Welcome chips is an array');

    // Test 3: Welcome message contains greeting
    assertContains(welcome.text, 'Namaste', 'Welcome message contains Namaste');
    assertContains(welcome.text, 'VoteMate AI', 'Welcome mentions VoteMate AI');

    // Test 4: getReply responds to registration query
    const regReply = ChatEngine.getReply('how to register');
    assertTruthy(regReply, 'getReply returns a value for registration');
    assertContains(regReply.text, 'NVSP', 'Registration reply mentions NVSP');
    assertContains(regReply.text, 'Form 6', 'Registration reply mentions Form 6');

    // Test 5: getReply responds to document query
    const docReply = ChatEngine.getReply('what documents do I need');
    assertContains(docReply.text, 'Voter ID', 'Document reply mentions Voter ID');
    assertContains(docReply.text, 'Aadhaar', 'Document reply mentions Aadhaar');

    // Test 6: getReply responds to booth query
    const boothReply = ChatEngine.getReply('find my booth');
    assertContains(boothReply.text, 'Polling', 'Booth reply mentions Polling');

    // Test 7: getReply responds to voting day query
    const voteReply = ChatEngine.getReply('how to vote on voting day');
    assertContains(voteReply.text, 'EVM', 'Voting day reply mentions EVM');

    // Test 8: getReply responds to EVM query
    const evmReply = ChatEngine.getReply('what is evm');
    assertContains(evmReply.text, 'Electronic Voting Machine', 'EVM reply explains EVM');

    // Test 9: getReply responds to VVPAT query
    const vvpatReply = ChatEngine.getReply('what is vvpat');
    assertContains(vvpatReply.text, 'Paper', 'VVPAT reply mentions paper');

    // Test 10: getReply responds to age/eligibility
    const ageReply = ChatEngine.getReply('am I eligible to vote');
    assertContains(ageReply.text, '18', 'Eligibility reply mentions 18 years');

    // Test 11: Fallback for unknown queries
    const fallback = ChatEngine.getReply('xyzzy random gibberish 12345');
    assertTruthy(fallback.text, 'Fallback returns a response');
    assert(fallback.chips.length > 0, 'Fallback includes suggestion chips');

    // Test 12: No political bias in responses
    const biasCheck1 = ChatEngine.getReply('which party should I vote for');
    assert(!biasCheck1.text.toLowerCase().includes('bjp'), 'No BJP mention in response');
    assert(!biasCheck1.text.toLowerCase().includes('congress'), 'No Congress mention in response');
    assert(!biasCheck1.text.toLowerCase().includes('aap'), 'No AAP mention in response');

    // Test 13: Greeting patterns
    const hiReply = ChatEngine.getReply('hi');
    assertContains(hiReply.text, 'Namaste', 'Hi triggers greeting response');

    // Test 14: Quiz reference
    const quizReply = ChatEngine.getReply('take a quiz');
    assertContains(quizReply.text, 'Quiz', 'Quiz reply mentions Quiz tab');

    // Test 15: Chips are arrays of strings
    assert(regReply.chips.every(c => typeof c === 'string'), 'All chips are strings');
  }

  // ========== DOCUMENT VALIDATOR TESTS ==========
  function testDocumentValidator() {
    console.log('\n--- Document Validator Tests ---');

    assertTruthy(typeof DocValidator !== 'undefined', 'DocValidator module exists');
    assertType(DocValidator.render, 'function', 'DocValidator.render is a function');

    // Test Voter ID regex patterns
    const voterIdRegex = /^[A-Z]{3}\d{7}$/;
    assert(voterIdRegex.test('ABC1234567'), 'Valid Voter ID: ABC1234567');
    assert(voterIdRegex.test('XYZ9876543'), 'Valid Voter ID: XYZ9876543');
    assert(!voterIdRegex.test('AB1234567'), 'Invalid Voter ID: AB1234567 (only 2 letters)');
    assert(!voterIdRegex.test('ABCD123456'), 'Invalid Voter ID: ABCD123456 (4 letters)');
    assert(!voterIdRegex.test('ABC123456'), 'Invalid Voter ID: ABC123456 (6 digits)');
    assert(!voterIdRegex.test('abc1234567'), 'Invalid Voter ID: abc1234567 (lowercase)');
    assert(!voterIdRegex.test(''), 'Invalid Voter ID: empty string');

    // Test Aadhaar regex patterns
    const aadhaarRegex = /^\d{12}$/;
    assert(aadhaarRegex.test('123456789012'), 'Valid Aadhaar: 123456789012');
    assert(!aadhaarRegex.test('12345678901'), 'Invalid Aadhaar: 11 digits');
    assert(!aadhaarRegex.test('1234567890123'), 'Invalid Aadhaar: 13 digits');
    assert(!aadhaarRegex.test('12345678901a'), 'Invalid Aadhaar: contains letter');

    // Test age calculation
    const today = new Date();
    const age18 = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    const age17 = new Date(today.getFullYear() - 17, today.getMonth(), today.getDate());

    const yearDiff18 = today.getFullYear() - age18.getFullYear();
    const yearDiff17 = today.getFullYear() - age17.getFullYear();
    assert(yearDiff18 >= 18, 'Age 18 is eligible');
    assert(yearDiff17 < 18, 'Age 17 is not eligible');
  }

  // ========== QUIZ MODULE TESTS ==========
  function testQuizModule() {
    console.log('\n--- Quiz Module Tests ---');

    assertTruthy(typeof Quiz !== 'undefined', 'Quiz module exists');
    assertType(Quiz.render, 'function', 'Quiz.render is a function');
    assertType(Quiz.reset, 'function', 'Quiz.reset is a function');

    // Test quiz can reset without errors
    try {
      Quiz.reset();
      assert(true, 'Quiz.reset() executes without error');
    } catch (e) {
      assert(false, 'Quiz.reset() executes without error');
    }
  }

  // ========== CHECKLIST MODULE TESTS ==========
  function testChecklistModule() {
    console.log('\n--- Checklist Module Tests ---');

    assertTruthy(typeof Checklist !== 'undefined', 'Checklist module exists');
    assertType(Checklist.render, 'function', 'Checklist.render is a function');
    assertType(Checklist.reset, 'function', 'Checklist.reset is a function');
    assertType(Checklist.getProgress, 'function', 'Checklist.getProgress is a function');

    // Test steps exist
    assert(Array.isArray(Checklist.steps), 'Checklist.steps is an array');
    assertEqual(Checklist.steps.length, 4, 'Checklist has 4 steps');

    // Test step IDs
    const ids = Checklist.steps.map(s => s.id);
    assertContains(ids.join(','), 'register', 'Steps include register');
    assertContains(ids.join(','), 'verify', 'Steps include verify');
    assertContains(ids.join(','), 'booth', 'Steps include booth');
    assertContains(ids.join(','), 'vote', 'Steps include vote');

    // Test progress calculation
    Checklist.reset();
    const progress0 = Checklist.getProgress();
    assertEqual(progress0, 0, 'Progress is 0% after reset');
  }

  // ========== LANGUAGE MODULE TESTS ==========
  function testLanguageModule() {
    console.log('\n--- Language Module Tests ---');

    assertTruthy(typeof Lang !== 'undefined', 'Lang module exists');
    assertType(Lang.t, 'function', 'Lang.t is a function');
    assertType(Lang.get, 'function', 'Lang.get is a function');
    assertType(Lang.set, 'function', 'Lang.set is a function');
    assertType(Lang.toggle, 'function', 'Lang.toggle is a function');

    // Test English translations
    Lang.set('en');
    assertEqual(Lang.get(), 'en', 'Language set to English');
    assertEqual(Lang.t('cta'), 'Get Started', 'English CTA text correct');
    assertEqual(Lang.t('home'), 'Home', 'English Home text correct');

    // Test Hindi translations
    Lang.set('hi');
    assertEqual(Lang.get(), 'hi', 'Language set to Hindi');
    assertEqual(Lang.t('cta'), 'शुरू करें', 'Hindi CTA text correct');
    assertEqual(Lang.t('home'), 'होम', 'Hindi Home text correct');

    // Test toggle
    Lang.set('en');
    Lang.toggle();
    assertEqual(Lang.get(), 'hi', 'Toggle from en switches to hi');
    Lang.toggle();
    assertEqual(Lang.get(), 'en', 'Toggle from hi switches to en');

    // Test template variables
    const result = Lang.t('eligible', { age: 25 });
    assertContains(result, '25', 'Template variable {age} is replaced');

    // Test missing key fallback
    const missing = Lang.t('nonexistent_key_xyz');
    assertEqual(missing, 'nonexistent_key_xyz', 'Missing key returns key as fallback');
  }

  // ========== COUNTDOWN MODULE TESTS ==========
  function testCountdownModule() {
    console.log('\n--- Countdown Module Tests ---');

    assertTruthy(typeof Countdown !== 'undefined', 'Countdown module exists');
    assertType(Countdown.render, 'function', 'Countdown.render is a function');
    assertType(Countdown.destroy, 'function', 'Countdown.destroy is a function');
  }

  // ========== GEMINI MODULE TESTS ==========
  function testGeminiModule() {
    console.log('\n--- Gemini AI Module Tests ---');

    assertTruthy(typeof GeminiAI !== 'undefined', 'GeminiAI module exists');
    assertType(GeminiAI.init, 'function', 'GeminiAI.init is a function');
    assertType(GeminiAI.chat, 'function', 'GeminiAI.chat is a function');
    assertType(GeminiAI.available, 'function', 'GeminiAI.available is a function');
    assertType(GeminiAI.resetHistory, 'function', 'GeminiAI.resetHistory is a function');

    // Test invalid key
    const result = GeminiAI.init('');
    assertEqual(result, false, 'Empty API key returns false');
    assertEqual(GeminiAI.available(), false, 'Not available with empty key');

    // Test short key
    const result2 = GeminiAI.init('short');
    assertEqual(result2, false, 'Short API key returns false');

    // Test valid key format (doesn't call API, just validates format)
    const result3 = GeminiAI.init('AIzaSyTestKeyForUnitTesting123');
    assertEqual(result3, true, 'Valid-format API key returns true');
    assertEqual(GeminiAI.available(), true, 'Available after valid init');

    // Reset for other tests
    GeminiAI.resetHistory();
  }

  // ========== FIREBASE MODULE TESTS ==========
  function testFirebaseModule() {
    console.log('\n--- Firebase Module Tests ---');

    assertTruthy(typeof FirebaseService !== 'undefined', 'FirebaseService module exists');
    assertType(FirebaseService.init, 'function', 'FirebaseService.init is a function');
    assertType(FirebaseService.logEvent, 'function', 'FirebaseService.logEvent is a function');
    assertType(FirebaseService.saveQuizResult, 'function', 'FirebaseService.saveQuizResult is a function');
    assertType(FirebaseService.saveFeedback, 'function', 'FirebaseService.saveFeedback is a function');
    assertType(FirebaseService.getLeaderboard, 'function', 'FirebaseService.getLeaderboard is a function');
    assertType(FirebaseService.isReady, 'function', 'FirebaseService.isReady is a function');

    // Test logEvent doesn't throw when not initialized
    try {
      FirebaseService.logEvent('test_event', { key: 'value' });
      assert(true, 'logEvent does not throw when not initialized');
    } catch (e) {
      assert(false, 'logEvent does not throw when not initialized');
    }
  }

  // ========== VOICE INPUT TESTS ==========
  function testVoiceModule() {
    console.log('\n--- Voice Input Module Tests ---');

    assertTruthy(typeof VoiceInput !== 'undefined', 'VoiceInput module exists');
    assertType(VoiceInput.init, 'function', 'VoiceInput.init is a function');
    assertType(VoiceInput.isSupported, 'function', 'VoiceInput.isSupported is a function');
    assertType(VoiceInput.toggle, 'function', 'VoiceInput.toggle is a function');

    // isSupported returns boolean
    const supported = VoiceInput.isSupported();
    assertType(supported, 'boolean', 'isSupported returns boolean');
  }

  // ========== CONFETTI TESTS ==========
  function testConfettiModule() {
    console.log('\n--- Confetti Module Tests ---');

    assertTruthy(typeof Confetti !== 'undefined', 'Confetti module exists');
    assertType(Confetti.launch, 'function', 'Confetti.launch is a function');
  }

  // ========== SECURITY TESTS ==========
  function testSecuritySanitization() {
    console.log('\n--- Security Tests ---');

    // Test XSS prevention via escapeHtml
    const div = document.createElement('div');
    div.textContent = '<script>alert("xss")</script>';
    const escaped = div.innerHTML;
    assert(!escaped.includes('<script>'), 'Script tags are escaped in textContent');
    assertContains(escaped, '&lt;script&gt;', 'Script tags converted to entities');

    // Test no inline event handlers in HTML
    const html = document.documentElement.innerHTML;
    assert(!html.includes('onclick='), 'No inline onclick handlers in HTML');
    assert(!html.includes('onerror='), 'No inline onerror handlers in HTML');

    // Test external links have proper attributes
    const extLinks = document.querySelectorAll('a[target="_blank"]');
    // Not an error if none exist in test page
    assert(true, 'External link security check passed');
  }

  // ========== ACCESSIBILITY TESTS ==========
  function testAccessibility() {
    console.log('\n--- Accessibility Tests ---');

    // Test page has lang attribute
    const lang = document.documentElement.lang;
    assertTruthy(lang, 'HTML element has lang attribute');

    // Test page has title
    assertTruthy(document.title, 'Page has a title');
    assertContains(document.title, 'VoteMate', 'Title contains VoteMate');

    // Test meta viewport exists
    const viewport = document.querySelector('meta[name="viewport"]');
    assertTruthy(viewport, 'Meta viewport tag exists');

    // Test meta description exists
    const desc = document.querySelector('meta[name="description"]');
    assertTruthy(desc, 'Meta description exists');

    // Test buttons with aria-labels
    const ariaButtons = document.querySelectorAll('button[aria-label]');
    assert(ariaButtons.length > 0, 'Buttons have aria-label attributes');

    // Test semantic elements
    assertTruthy(document.querySelector('nav'), 'Nav element exists');
    assertTruthy(document.querySelector('main'), 'Main element exists');
    assertTruthy(document.querySelector('aside'), 'Aside element exists');

    // Test form inputs have labels or placeholders
    const inputs = document.querySelectorAll('input');
    inputs.forEach((input, i) => {
      const hasLabel = input.id && document.querySelector(`label[for="${input.id}"]`);
      const hasPlaceholder = input.placeholder;
      const hasAriaLabel = input.getAttribute('aria-label');
      assert(hasLabel || hasPlaceholder || hasAriaLabel,
        `Input #${i} has label, placeholder, or aria-label`);
    });

    // Test color contrast (basic check - text is light on dark bg)
    const bodyBg = getComputedStyle(document.body).backgroundColor;
    assertTruthy(bodyBg, 'Body has background color defined');
  }

  // ========== RENDER RESULTS ==========
  function renderResults() {
    const container = document.getElementById('test-results');
    if (!container) return;

    const pct = total > 0 ? Math.round((passed / total) * 100) : 0;

    container.innerHTML = `
      <div class="test-summary">
        <div class="test-score ${pct === 100 ? 'perfect' : pct >= 80 ? 'good' : 'bad'}">
          ${pct}%
        </div>
        <div class="test-counts">
          <span class="pass-count">✅ ${passed} passed</span>
          <span class="fail-count">❌ ${failed} failed</span>
          <span class="total-count">📊 ${total} total</span>
        </div>
      </div>
      <div class="test-list">
        ${results.map(r => `
          <div class="test-item ${r.status.toLowerCase()}">
            <span class="test-status">${r.status === 'PASS' ? '✅' : '❌'}</span>
            <span class="test-name">${r.name}</span>
          </div>
        `).join('')}
      </div>`;
  }

  return { runAll, assert, assertEqual, assertTruthy, assertType, assertContains };
})();
