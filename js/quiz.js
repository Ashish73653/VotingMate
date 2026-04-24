// ========================================
// VoteMate AI — Voter Awareness Quiz
// ========================================
const Quiz = (() => {
  const questions = [
    {
      q: 'What is the minimum age to vote in India?',
      opts: ['16 years', '18 years', '21 years', '25 years'],
      answer: 1,
      explain: 'According to the Constitution of India, every citizen who is 18 years or older on January 1st of the qualifying year is eligible to vote.'
    },
    {
      q: 'What does EVM stand for?',
      opts: ['Electronic Vote Manager', 'Electronic Voting Machine', 'Election Verification Module', 'Electoral Vote Mechanism'],
      answer: 1,
      explain: 'EVM stands for Electronic Voting Machine. It is used across India for conducting elections since 2004.'
    },
    {
      q: 'Which document is most commonly used as voter ID at polling booths?',
      opts: ['PAN Card', 'Driving License', 'EPIC (Voter ID Card)', 'Ration Card'],
      answer: 2,
      explain: 'EPIC (Electors Photo Identity Card) is the primary document for voter identification, though other government photo IDs are also accepted.'
    },
    {
      q: 'What is VVPAT used for?',
      opts: ['Online voting', 'Verifying your vote on paper', 'Counting votes faster', 'Registering new voters'],
      answer: 1,
      explain: 'VVPAT (Voter Verifiable Paper Audit Trail) prints a slip showing which candidate you voted for, visible for 7 seconds as confirmation.'
    },
    {
      q: 'Which body conducts elections in India?',
      opts: ['Supreme Court', 'Election Commission of India', 'Parliament', 'State Government'],
      answer: 1,
      explain: 'The Election Commission of India (ECI) is an autonomous constitutional authority responsible for administering elections in India.'
    }
  ];

  let current = -1; // -1 = intro, 0-4 = questions, 5 = score
  let score = 0;
  let answered = false;
  const letters = ['A', 'B', 'C', 'D'];

  function render(container) {
    if (!container) return;
    if (current === -1) renderIntro(container);
    else if (current < questions.length) renderQuestion(container);
    else renderScore(container);
  }

  function renderIntro(c) {
    c.innerHTML = `
      <div class="quiz-container">
        <div class="quiz-card" style="text-align:center; padding:48px 32px;">
          <div style="font-size:3.5rem; margin-bottom:16px;">🧠</div>
          <h2 style="font-family:var(--font-display); font-size:1.5rem; margin-bottom:8px;">Voter Awareness Quiz</h2>
          <p style="color:var(--text-muted); margin-bottom:8px;">Test your knowledge about India's voting process</p>
          <p style="color:var(--text-dim); font-size:0.85rem;">${questions.length} questions • No time limit</p>
          <button class="quiz-start-btn" id="quiz-start">Start Quiz →</button>
        </div>
      </div>`;
    document.getElementById('quiz-start').addEventListener('click', () => { current = 0; score = 0; answered = false; render(c); });
  }

  function renderQuestion(c) {
    const q = questions[current];
    c.innerHTML = `
      <div class="quiz-container">
        <div class="quiz-progress">
          <div class="quiz-progress-label">
            <span>Question ${current + 1} of ${questions.length}</span>
            <span>${score} correct</span>
          </div>
          <div class="quiz-progress-bar">
            <div class="quiz-progress-fill" style="width:${((current) / questions.length) * 100}%"></div>
          </div>
        </div>
        <div class="quiz-card">
          <div class="quiz-question">
            <span class="q-num">Question ${current + 1}</span>
            ${q.q}
          </div>
          <div class="quiz-options">
            ${q.opts.map((o, i) => `
              <button class="quiz-option" data-idx="${i}">
                <span class="opt-letter">${letters[i]}</span>
                <span>${o}</span>
              </button>`).join('')}
          </div>
          <div id="quiz-feedback"></div>
        </div>
      </div>`;

    c.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', () => {
        if (answered) return;
        answered = true;
        const idx = parseInt(btn.dataset.idx);
        const correct = q.answer;
        if (idx === correct) score++;

        c.querySelectorAll('.quiz-option').forEach((b, i) => {
          b.classList.add('disabled');
          if (i === correct) b.classList.add('correct');
          if (i === idx && idx !== correct) b.classList.add('wrong');
        });

        const fb = document.getElementById('quiz-feedback');
        fb.innerHTML = `
          <div class="quiz-explanation">${idx === correct ? '✅ Correct! ' : '❌ Incorrect. '}${q.explain}</div>
          <button class="quiz-next-btn" id="quiz-next">${current < questions.length - 1 ? 'Next Question →' : 'See Results →'}</button>`;
        document.getElementById('quiz-next').addEventListener('click', () => { current++; answered = false; render(c); });
      });
    });
  }

  function renderScore(c) {
    const pct = Math.round((score / questions.length) * 100);
    let emoji = '🎉', remark = 'Excellent! You\'re well-prepared!';
    if (pct < 80) { emoji = '👍'; remark = 'Good job! Review a few topics.'; }
    if (pct < 60) { emoji = '📚'; remark = 'Keep learning! Chat with me for help.'; }
    if (pct < 40) { emoji = '💪'; remark = 'Don\'t worry! I\'ll guide you through everything.'; }

    c.innerHTML = `
      <div class="quiz-container">
        <div class="quiz-card quiz-score-card">
          <div style="font-size:3rem;">${emoji}</div>
          <div class="quiz-score-big">${score}/${questions.length}</div>
          <div class="quiz-score-label">${remark}</div>
          <button class="quiz-restart-btn" id="quiz-restart">↺ Retake Quiz</button>
        </div>
      </div>`;
    document.getElementById('quiz-restart').addEventListener('click', () => { current = -1; score = 0; answered = false; render(c); });
  }

  function reset() { current = -1; score = 0; answered = false; }

  return { render, reset };
})();
