// ========================================
// VoteMate AI — Language / i18n Module
// ========================================
const Lang = (() => {
  const STORAGE_KEY = 'votemate_lang';
  let current = localStorage.getItem(STORAGE_KEY) || 'en';

  const ui = {
    en: {
      badge: 'AI-Powered Voting Assistant',
      subtitle: "Your intelligent companion for navigating India's voting process — from registration to casting your vote.",
      cta: 'Get Started',
      scroll: 'Click to begin',
      featChat: 'AI Chat', featCheck: 'Checklist', featDoc: 'Doc Check', featQuiz: 'Quiz',
      home: 'Home', chat: 'Chat', documents: 'Documents', quiz: 'Quiz', docs: 'Docs',
      checklistTitle: 'Voting Checklist', progress: 'Progress',
      chatPlaceholder: 'Ask about voting...',
      register: 'Register to Vote', registerDesc: 'Apply online at NVSP portal or offline at ERO',
      verify: 'ID Verification', verifyDesc: 'Ensure you have valid photo ID ready',
      booth: 'Find Your Booth', boothDesc: 'Locate your assigned polling station',
      vote: 'Cast Your Vote', voteDesc: 'Visit on election day and vote!',
      docTitle: '📋 Document Validation', docSubtitle: 'Verify your documents are ready for voting',
      voterId: 'Voter ID (EPIC)', aadhaar: 'Aadhaar Number', dob: 'Date of Birth',
      validate: 'Validate', readiness: 'Readiness Status',
      allVerified: 'All documents verified!', docsVerified: 'documents verified',
      voterIdOk: '✓ Valid Voter ID format', voterIdErr: '✗ Should be 3 letters + 7 digits (e.g., ABC1234567)',
      aadhaarOk: '✓ Valid Aadhaar format', aadhaarErr: '✗ Should be exactly 12 digits',
      eligible: '✓ Age {age} — You are eligible to vote!', notEligible: '✗ Age {age} — Must be 18+ to vote',
      enterDob: '✗ Please enter your date of birth',
      quizTitle: 'Voter Awareness Quiz', quizSub: "Test your knowledge about India's voting process",
      quizInfo: '5 questions • No time limit', startQuiz: 'Start Quiz →',
      questionOf: 'Question {n} of {t}', correct: 'correct', nextQ: 'Next Question →',
      seeResults: 'See Results →', retake: '↺ Retake Quiz',
      excellent: "Excellent! You're well-prepared!", good: 'Good job! Review a few topics.',
      learn: 'Keep learning! Chat with me for help.', tryAgain: "Don't worry! I'll guide you through everything.",
      countdown: 'Next General Election',
      days: 'Days', hours: 'Hours', minutes: 'Minutes', seconds: 'Seconds',
      readinessTitle: 'Voter Readiness',
      readyLabel: 'Ready to Vote!', notReadyLabel: 'Complete your checklist',
      voiceListening: 'Listening...',
      langToggle: 'हिंदी'
    },
    hi: {
      badge: 'AI-संचालित मतदान सहायक',
      subtitle: 'भारत की मतदान प्रक्रिया को समझने के लिए आपका बुद्धिमान साथी — पंजीकरण से लेकर मतदान तक।',
      cta: 'शुरू करें',
      scroll: 'शुरू करने के लिए क्लिक करें',
      featChat: 'AI चैट', featCheck: 'चेकलिस्ट', featDoc: 'दस्तावेज़', featQuiz: 'प्रश्नोत्तरी',
      home: 'होम', chat: 'चैट', documents: 'दस्तावेज़', quiz: 'प्रश्नोत्तरी', docs: 'दस्तावेज़',
      checklistTitle: 'मतदान चेकलिस्ट', progress: 'प्रगति',
      chatPlaceholder: 'मतदान के बारे में पूछें...',
      register: 'मतदाता पंजीकरण', registerDesc: 'NVSP पोर्टल या ERO कार्यालय में आवेदन करें',
      verify: 'पहचान सत्यापन', verifyDesc: 'सुनिश्चित करें कि आपके पास वैध फोटो ID है',
      booth: 'बूथ खोजें', boothDesc: 'अपना मतदान केंद्र खोजें',
      vote: 'मतदान करें', voteDesc: 'चुनाव के दिन जाएं और मतदान करें!',
      docTitle: '📋 दस्तावेज़ सत्यापन', docSubtitle: 'अपने दस्तावेज़ों की जांच करें',
      voterId: 'मतदाता पहचान पत्र (EPIC)', aadhaar: 'आधार नंबर', dob: 'जन्म तिथि',
      validate: 'सत्यापित करें', readiness: 'तैयारी स्थिति',
      allVerified: 'सभी दस्तावेज़ सत्यापित!', docsVerified: 'दस्तावेज़ सत्यापित',
      voterIdOk: '✓ वैध मतदाता ID प्रारूप', voterIdErr: '✗ 3 अक्षर + 7 अंक होने चाहिए (जैसे, ABC1234567)',
      aadhaarOk: '✓ वैध आधार प्रारूप', aadhaarErr: '✗ ठीक 12 अंक होने चाहिए',
      eligible: '✓ आयु {age} — आप मतदान के योग्य हैं!', notEligible: '✗ आयु {age} — मतदान के लिए 18+ होना चाहिए',
      enterDob: '✗ कृपया अपनी जन्म तिथि दर्ज करें',
      quizTitle: 'मतदाता जागरूकता प्रश्नोत्तरी', quizSub: 'भारत की मतदान प्रक्रिया के बारे में अपना ज्ञान जांचें',
      quizInfo: '5 प्रश्न • कोई समय सीमा नहीं', startQuiz: 'शुरू करें →',
      questionOf: 'प्रश्न {n} / {t}', correct: 'सही', nextQ: 'अगला प्रश्न →',
      seeResults: 'परिणाम देखें →', retake: '↺ फिर से प्रयास करें',
      excellent: 'उत्कृष्ट! आप पूरी तरह तैयार हैं!', good: 'अच्छा! कुछ विषय दोहराएं।',
      learn: 'सीखते रहें! मुझसे चैट करें।', tryAgain: 'चिंता न करें! मैं आपका मार्गदर्शन करूंगा।',
      countdown: 'अगला आम चुनाव',
      days: 'दिन', hours: 'घंटे', minutes: 'मिनट', seconds: 'सेकंड',
      readinessTitle: 'मतदाता तैयारी',
      readyLabel: 'मतदान के लिए तैयार!', notReadyLabel: 'अपनी चेकलिस्ट पूरी करें',
      voiceListening: 'सुन रहा हूँ...',
      langToggle: 'English'
    }
  };

  function t(key, vars) {
    let s = ui[current]?.[key] || ui.en[key] || key;
    if (vars) Object.entries(vars).forEach(([k, v]) => { s = s.replace(`{${k}}`, v); });
    return s;
  }

  function get() { return current; }

  function set(lang) {
    current = lang;
    localStorage.setItem(STORAGE_KEY, lang);
  }

  function toggle() {
    set(current === 'en' ? 'hi' : 'en');
    return current;
  }

  return { t, get, set, toggle };
})();
