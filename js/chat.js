// ========================================
// VoteMate AI — Chatbot Engine
// ========================================
const ChatEngine = (() => {
  const responses = {
    greeting: {
      patterns: ['hello', 'hi', 'hey', 'namaste', 'good morning', 'good evening', 'help', 'start'],
      reply: `👋 <strong>Namaste! Welcome to VoteMate AI!</strong>\n\nI'm here to help you with the voting process in India. Here's what I can assist with:\n<ul><li>Voter registration</li><li>Required documents</li><li>Finding your polling booth</li><li>Voting day procedure</li><li>First-time voter guidance</li></ul>\nWhat would you like to know about?`,
      chips: ['How to register?', 'What documents do I need?', 'How to find my booth?', 'Voting day steps']
    },
    registration: {
      patterns: ['register', 'registration', 'enroll', 'sign up', 'new voter', 'form 6', 'nvsp', 'voter list'],
      reply: `📝 <strong>How to Register as a Voter</strong>\n\nFollow these steps:\n<ul><li><strong>Step 1:</strong> Visit the NVSP portal → <a href="https://www.nvsp.in" target="_blank">nvsp.in</a></li><li><strong>Step 2:</strong> Click "New Voter Registration" (Form 6)</li><li><strong>Step 3:</strong> Fill in your personal details</li><li><strong>Step 4:</strong> Upload a passport-size photo</li><li><strong>Step 5:</strong> Upload address & age proof</li><li><strong>Step 6:</strong> Submit — you'll get a reference number</li></ul>\n<strong>Eligibility:</strong> You must be 18+ years of age as of January 1st of the current year.\n\nWould you like help with documents or checking your registration status?`,
      chips: ['What documents?', 'Check my status', 'Am I eligible?']
    },
    documents: {
      patterns: ['document', 'id', 'proof', 'aadhaar', 'aadhar', 'voter id', 'epic', 'pan card', 'passport', 'identity'],
      reply: `🪪 <strong>Documents for Voting</strong>\n\nYou need <strong>one</strong> of these at the polling booth:\n<ul><li>Voter ID Card (EPIC) — <em>most common</em></li><li>Aadhaar Card</li><li>Passport</li><li>Driving License</li><li>PAN Card</li><li>Government Photo ID</li></ul>\n<strong>For Registration:</strong>\n<ul><li>Age proof (birth certificate, 10th marksheet)</li><li>Address proof (Aadhaar, utility bill, bank statement)</li><li>Passport-size photo</li></ul>\nDo you have your Voter ID? I can help you validate it!`,
      chips: ['Validate my ID', 'Don\'t have Voter ID', 'How to get Voter ID?']
    },
    booth: {
      patterns: ['booth', 'polling', 'station', 'where to vote', 'find', 'location', 'polling station', 'which booth'],
      reply: `📍 <strong>Find Your Polling Booth</strong>\n\nHere's how:\n<ul><li><strong>Online:</strong> Visit <a href="https://electoralsearch.eci.gov.in" target="_blank">Electoral Search</a></li><li><strong>SMS:</strong> Send "EPIC &lt;your_voter_id&gt;" to 1950</li><li><strong>App:</strong> Download "Voter Helpline" app</li><li><strong>Helpline:</strong> Call 1950</li></ul>\nYou'll need your Voter ID number or name + area details.\n\nHave you found your booth or need more help?`,
      chips: ['I found my booth', 'Need more help', 'What to carry on voting day?']
    },
    votingday: {
      patterns: ['voting day', 'election day', 'how to vote', 'cast vote', 'evm', 'vvpat', 'procedure', 'process', 'actual voting'],
      reply: `🗳️ <strong>Voting Day Step-by-Step</strong>\n\n<ul><li><strong>Step 1:</strong> Go to your assigned polling booth</li><li><strong>Step 2:</strong> Stand in queue — carry your ID</li><li><strong>Step 3:</strong> Officer verifies your identity</li><li><strong>Step 4:</strong> Get indelible ink mark on your finger</li><li><strong>Step 5:</strong> Enter the voting compartment</li><li><strong>Step 6:</strong> Press the button next to your chosen candidate on the EVM</li><li><strong>Step 7:</strong> Check the VVPAT slip (7 seconds display)</li><li><strong>Step 8:</strong> Exit the booth</li></ul>\n<strong>Tip:</strong> Voting hours are usually 7 AM to 6 PM.\n\nAny questions about the EVM or VVPAT?`,
      chips: ['What is EVM?', 'What is VVPAT?', 'What if I make a mistake?']
    },
    evm: {
      patterns: ['evm', 'electronic voting machine', 'machine', 'button'],
      reply: `🖥️ <strong>About the EVM</strong>\n\n<ul><li>EVM = Electronic Voting Machine</li><li>It has a <strong>Ballot Unit</strong> with candidate names + symbols</li><li>Press the <strong>blue button</strong> next to your chosen candidate</li><li>A beep + red light confirms your vote</li><li>Each EVM records only one vote per person</li><li>EVMs are <strong>not connected to the internet</strong></li></ul>\nThe process is simple and takes only a few seconds!\n\nWant to know about VVPAT verification?`,
      chips: ['What is VVPAT?', 'Is EVM safe?', 'Back to voting steps']
    },
    vvpat: {
      patterns: ['vvpat', 'paper trail', 'slip', 'verification', 'verify vote'],
      reply: `📄 <strong>About VVPAT</strong>\n\n<ul><li>VVPAT = Voter Verifiable Paper Audit Trail</li><li>After pressing the EVM button, a <strong>paper slip</strong> is displayed</li><li>It shows the candidate name + symbol you voted for</li><li>Slip is visible for <strong>7 seconds</strong> through a window</li><li>It then drops into a sealed box</li><li>This is your confirmation — <strong>no one else can see it</strong></li></ul>\nThis adds a layer of transparency to electronic voting.\n\nAnything else you'd like to know?`,
      chips: ['How to register?', 'Voting day steps', 'Take the quiz']
    },
    age: {
      patterns: ['age', 'eligible', 'eligibility', '18', 'how old', 'minimum age', 'can i vote'],
      reply: `🎂 <strong>Voter Eligibility</strong>\n\n<ul><li>Minimum age: <strong>18 years</strong></li><li>You must be 18 on or before <strong>January 1st</strong> of the qualifying year</li><li>You must be a <strong>citizen of India</strong></li><li>You must be a <strong>resident</strong> of your constituency</li><li>You must <strong>not be disqualified</strong> under any law</li></ul>\nAre you 18+? Would you like to start the registration process?`,
      chips: ['Yes, help me register', 'Check documents needed', 'I\'m already registered']
    },
    status: {
      patterns: ['status', 'check', 'already registered', 'am i registered', 'verify registration'],
      reply: `🔍 <strong>Check Your Voter Registration</strong>\n\n<ul><li>Visit <a href="https://electoralsearch.eci.gov.in" target="_blank">Electoral Search</a></li><li>Search by <strong>Voter ID</strong> or <strong>Name + Area</strong></li><li>If found — you're registered! ✅</li><li>If not — you can register online via NVSP</li></ul>\nYou can also call <strong>1950</strong> for assistance.\n\nWould you like to validate your documents?`,
      chips: ['Validate documents', 'How to register?', 'Find my booth']
    },
    mistake: {
      patterns: ['mistake', 'wrong button', 'wrong vote', 'change vote', 'cancel vote'],
      reply: `⚠️ <strong>What If You Make a Mistake?</strong>\n\n<ul><li>Once you press the button, the vote is <strong>recorded</strong></li><li>You <strong>cannot change</strong> your vote after pressing</li><li>Take your time — there's no rush inside the booth</li><li>If the EVM malfunctions, inform the <strong>Presiding Officer</strong></li></ul>\n<strong>Important:</strong> You get only <strong>one chance</strong>, so choose carefully.\n\nAny other questions?`,
      chips: ['Voting day steps', 'What is EVM?', 'Back to start']
    },
    noid: {
      patterns: ['don\'t have', 'no voter id', 'lost', 'lost id', 'no id', 'get voter id', 'apply voter id'],
      reply: `📋 <strong>Getting a Voter ID Card</strong>\n\n<ul><li><strong>Apply Online:</strong> Visit <a href="https://www.nvsp.in" target="_blank">NVSP</a> → Form 6</li><li><strong>Apply Offline:</strong> Visit your nearest Electoral Registration Office</li><li><strong>Timeline:</strong> Usually 2-4 weeks after verification</li><li><strong>Track Status:</strong> Use your reference number on NVSP</li></ul>\n<strong>Meanwhile:</strong> You can still vote using Aadhaar, Passport, or any government photo ID.\n\nNeed help with anything else?`,
      chips: ['What documents work?', 'Registration steps', 'Back to start']
    },
    quiz: {
      patterns: ['quiz', 'test', 'question', 'awareness', 'check knowledge'],
      reply: `🧠 <strong>Voter Awareness Quiz</strong>\n\nGreat idea! Test your knowledge about India's voting process.\n\nYou can start the quiz from the <strong>"Quiz"</strong> tab at the top.\n\nThe quiz has 5 questions covering:\n<ul><li>Voting age & eligibility</li><li>EVM & VVPAT</li><li>Voter ID & documents</li><li>Election Commission</li><li>Voting rights</li></ul>\nGood luck! 🍀`,
      chips: ['How to register?', 'Voting day steps', 'Find my booth']
    },
    thanks: {
      patterns: ['thanks', 'thank you', 'thankyou', 'great', 'awesome', 'perfect', 'got it'],
      reply: `🙏 <strong>You're welcome!</strong>\n\nRemember — every vote counts! If you need any help later, just come back and ask.\n\n<strong>Key resources:</strong>\n<ul><li><a href="https://www.nvsp.in" target="_blank">NVSP Portal</a></li><li><a href="https://eci.gov.in" target="_blank">Election Commission</a></li><li>Helpline: <strong>1950</strong></li></ul>\nIs there anything else I can help with?`,
      chips: ['Start over', 'Take the quiz', 'Validate documents']
    }
  };

  const fallbacks = [
    `🤔 I'm not sure I understood that. Could you try asking in a different way?\n\nHere's what I can help with:\n<ul><li>Voter registration</li><li>Required documents</li><li>Finding your booth</li><li>Voting steps</li></ul>`,
    `I didn't quite catch that. Try asking about <strong>registration</strong>, <strong>documents</strong>, <strong>polling booth</strong>, or <strong>voting procedure</strong>.`,
    `Hmm, I'm best at answering voting-related questions! Could you rephrase that? Or pick a topic from the suggestions below.`
  ];
  const fallbackChips = ['How to register?', 'Documents needed', 'Voting day steps', 'Take the quiz'];

  function getReply(input) {
    const lower = input.toLowerCase().trim();
    for (const key in responses) {
      const r = responses[key];
      if (r.patterns.some(p => lower.includes(p))) {
        return { text: r.reply, chips: r.chips || [] };
      }
    }
    return {
      text: fallbacks[Math.floor(Math.random() * fallbacks.length)],
      chips: fallbackChips
    };
  }

  function getWelcome() {
    return {
      text: responses.greeting.reply,
      chips: responses.greeting.chips
    };
  }

  return { getReply, getWelcome };
})();
