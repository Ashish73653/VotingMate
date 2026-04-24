/**
 * @fileoverview VoteMate AI — Firebase Integration
 * @description Initializes Firebase services including Analytics and
 * Firestore for tracking user engagement and storing anonymized usage data.
 * @module FirebaseService
 * @see https://firebase.google.com/docs/web/setup
 */

const FirebaseService = (() => {
  /** @type {boolean} Whether Firebase is initialized */
  let initialized = false;

  /** @type {Object|null} Firebase Analytics instance */
  let analytics = null;

  /** @type {Object|null} Firestore instance */
  let db = null;

  /**
   * Firebase project configuration.
   * Replace with your own Firebase project config for production.
   * @constant {Object}
   */
  const firebaseConfig = {
    apiKey: "AIzaSyDemoKeyForVoteMateAI",
    authDomain: "votemate-ai.firebaseapp.com",
    projectId: "votemate-ai",
    storageBucket: "votemate-ai.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456",
    measurementId: "G-VOTEMATE01"
  };

  /**
   * Initialize Firebase services.
   * Loads Firebase SDK from CDN and sets up Analytics + Firestore.
   * @returns {Promise<boolean>} Whether initialization succeeded
   */
  async function init() {
    if (initialized) return true;

    try {
      // Load Firebase SDK modules from CDN
      const { initializeApp } = await import('https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js');
      const { getAnalytics, logEvent: firebaseLogEvent } = await import('https://www.gstatic.com/firebasejs/11.0.0/firebase-analytics.js');
      const { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } = await import('https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js');

      // Initialize Firebase app
      const app = initializeApp(firebaseConfig);

      // Initialize Analytics
      analytics = getAnalytics(app);

      // Initialize Firestore
      db = getFirestore(app);

      // Store module references for internal use
      FirebaseService._modules = {
        logEvent: firebaseLogEvent,
        collection, addDoc, getDocs, query, orderBy, limit
      };

      initialized = true;
      console.log('Firebase: Initialized successfully');

      // Log app_open event
      logEvent('app_open', { timestamp: Date.now() });

      return true;
    } catch (error) {
      console.warn('Firebase: Initialization skipped →', error.message);
      return false;
    }
  }

  /**
   * Log a custom analytics event.
   * @param {string} eventName - Event name (e.g., 'chat_message', 'quiz_completed')
   * @param {Object} [params={}] - Event parameters
   */
  function logEvent(eventName, params = {}) {
    if (!analytics || !FirebaseService._modules) return;
    try {
      FirebaseService._modules.logEvent(analytics, eventName, {
        ...params,
        app_version: '2.0.0',
        platform: 'web'
      });
    } catch (e) {
      // Silently fail — analytics should never break the app
    }
  }

  /**
   * Save anonymous quiz result to Firestore.
   * @param {number} score - Quiz score (0-5)
   * @param {number} total - Total questions
   * @returns {Promise<boolean>}
   */
  async function saveQuizResult(score, total) {
    if (!db || !FirebaseService._modules) return false;
    try {
      const { collection, addDoc } = FirebaseService._modules;
      await addDoc(collection(db, 'quiz_results'), {
        score,
        total,
        percentage: Math.round((score / total) * 100),
        timestamp: Date.now(),
        userAgent: navigator.userAgent.substring(0, 50)
      });
      return true;
    } catch (e) {
      console.warn('Firebase: Failed to save quiz result');
      return false;
    }
  }

  /**
   * Save anonymous feedback to Firestore.
   * @param {string} topic - The topic discussed
   * @param {boolean} helpful - Whether the response was helpful
   * @returns {Promise<boolean>}
   */
  async function saveFeedback(topic, helpful) {
    if (!db || !FirebaseService._modules) return false;
    try {
      const { collection, addDoc } = FirebaseService._modules;
      await addDoc(collection(db, 'feedback'), {
        topic,
        helpful,
        timestamp: Date.now()
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Get leaderboard data (top quiz scores).
   * @param {number} [count=10] - Number of results to fetch
   * @returns {Promise<Array>}
   */
  async function getLeaderboard(count = 10) {
    if (!db || !FirebaseService._modules) return [];
    try {
      const { collection, getDocs, query, orderBy, limit } = FirebaseService._modules;
      const q = query(collection(db, 'quiz_results'), orderBy('percentage', 'desc'), limit(count));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data());
    } catch (e) {
      return [];
    }
  }

  /**
   * Check if Firebase is initialized.
   * @returns {boolean}
   */
  function isReady() {
    return initialized;
  }

  return { init, logEvent, saveQuizResult, saveFeedback, getLeaderboard, isReady };
})();
