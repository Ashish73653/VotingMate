# 🗳️ VoteMate AI — AI-Powered Voting Assistant

> **Your intelligent companion for navigating India's voting process — from registration to casting your vote.**

![VoteMate AI](https://img.shields.io/badge/VoteMate-AI-00f0ff?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48dGV4dCB5PSIuOWVtIiBmb250LXNpemU9IjkwIj7wn5ez77iPPC90ZXh0Pjwvc3ZnPg==)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=flat&logo=three.js&logoColor=white)

---

## 📌 Chosen Vertical

**Election & Voter Assistance AI**

A smart, dynamic assistant that helps Indian citizens understand and complete the voting process. VoteMate AI serves as a non-partisan, AI-powered guide covering everything from voter registration to casting a vote on election day.

---

## 🧠 Approach & Logic

### Core Philosophy
- **Zero political bias** — The assistant never mentions parties, candidates, or political opinions
- **Step-by-step guidance** — Complex processes broken into simple, actionable steps
- **Multilingual accessibility** — Full Hindi/English bilingual support for wider reach
- **Offline-capable** — No backend API required; runs entirely in the browser

### Architecture Decision
Built as a **lightweight, zero-dependency vanilla web app** (HTML/CSS/JS) to maximize:
- **Accessibility** — Works on any device with a browser, no install needed
- **Performance** — Instant load, no build step, all dependencies via CDN
- **Portability** — Single folder, easy to deploy anywhere
- **Maintainability** — Clean, modular code with separation of concerns

### AI/Chatbot Logic
The chatbot uses a **pattern-matching engine** with:
- **12+ topic modules** covering the complete Indian voting lifecycle
- **Context-aware responses** with relevant follow-up suggestions
- **Structured output** — Every response uses bullet points and step-by-step formatting
- **Fallback handling** — Unrecognized queries receive helpful redirect suggestions
- **Quick-reply chips** — Pre-built response options for faster interaction

### Decision Flow
```
User Input → Lowercase & Trim → Pattern Matching → Topic Identification
    ↓                                                       ↓
Fallback Response ← (no match)          Structured Reply + Follow-up Chips
                                                            ↓
                                              Display with typing animation
```

---

## 🚀 How the Solution Works

### Features

| Feature | Description |
|---------|-------------|
| **💬 AI Chat** | Rule-based chatbot covering registration, documents, booths, EVM, VVPAT, eligibility & more |
| **✅ Voting Checklist** | 4-step interactive checklist (Register → ID → Booth → Vote) with localStorage persistence |
| **📋 Document Validation** | Client-side validation for Voter ID (EPIC), Aadhaar, and age eligibility |
| **🧠 Voter Quiz** | 5-question awareness quiz with scoring, explanations, and progress tracking |
| **🌐 Bilingual Support** | Full Hindi/English toggle across all UI and content |
| **🎙️ Voice Input** | Web Speech API integration for hands-free chat interaction |
| **⏱️ Election Countdown** | Live countdown timer to the next general election |
| **📊 Readiness Dashboard** | Circular progress ring showing voter readiness based on checklist |
| **🎉 Celebrations** | Confetti animation when all checklist items are completed |
| **🎨 3D Background** | Interactive WebGL tubes that react to cursor movement (Three.js) |

### User Flow
```
Landing Page → Get Started → Main App
                                 ├── Chat Tab (default)
                                 │     ├── AI chatbot interaction
                                 │     ├── Voice input support
                                 │     └── Quick-reply chips
                                 ├── Documents Tab
                                 │     ├── Voter ID validation
                                 │     ├── Aadhaar validation
                                 │     └── Age eligibility check
                                 └── Quiz Tab
                                       ├── 5 MCQ questions
                                       ├── Instant feedback
                                       └── Score card
```

### File Structure
```
VotingMate/
├── index.html              # Single-page app entry point
├── css/
│   └── styles.css          # Complete design system (neon + glassmorphism)
├── js/
│   ├── app.js              # App controller, routing, chat UI
│   ├── tubes.js            # 3D interactive background (Three.js CDN)
│   ├── chat.js             # Chatbot engine with pattern matching
│   ├── checklist.js        # 4-step checklist with persistence
│   ├── documents.js        # Document format validation
│   ├── quiz.js             # Voter awareness quiz system
│   ├── lang.js             # Hindi/English i18n module
│   ├── voice.js            # Web Speech API voice input
│   ├── countdown.js        # Election countdown timer
│   └── confetti.js         # Celebration animation
└── README.md
```

---

## 🎨 Design & UX

- **Futuristic Neon Theme** — Electric cyan, magenta, purple, and green accents
- **Glassmorphism** — Blurred glass cards with `backdrop-filter`, semi-transparent surfaces
- **3D Interactive Background** — WebGL tubes that follow cursor movement (click to randomize colors)
- **Micro-animations** — Message slide-ins, typing indicators, hover effects, glow pulses
- **Responsive Design** — Mobile-first with horizontal checklist, bottom tab bar on small screens
- **Typography** — Orbitron (display) + Inter (body) from Google Fonts

---

## 🔧 Google Services Used

| Service | Usage |
|---------|-------|
| **Google Fonts** | Inter & Orbitron font families loaded via `fonts.googleapis.com` |
| **Google Chrome Web Speech API** | Voice input for the chatbot (speech-to-text in English & Hindi) |

---

## 📋 Assumptions Made

1. **Target Audience**: Indian citizens aged 18+ who need guidance on the voting process
2. **Language**: Primary support for English and Hindi (the two most widely spoken languages in India)
3. **Elections**: Information is based on the Indian general election process using EVM/VVPAT systems
4. **Connectivity**: The app works offline after initial load (CDN resources are cached by the browser)
5. **Browser Support**: Modern browsers with ES6+ and `backdrop-filter` support (Chrome, Edge, Firefox, Safari)
6. **No Backend**: Deliberately chose client-side-only approach for maximum accessibility and zero hosting cost
7. **Next Election Date**: Countdown targets approximate 2029 general election date

---

## 🏃 How to Run

```bash
# Clone the repository
git clone git@github.com:Ashish73653/VotingMate.git
cd VotingMate

# Serve with any static file server
npx -y serve@latest -l 3000

# Open in browser
# http://localhost:3000
```

Or simply open `index.html` directly in your browser — no build step required.

---

## 🔒 Security Considerations

- **No user data collection** — All data stays in the browser (localStorage only)
- **No external API calls** — The chatbot runs entirely client-side
- **No authentication** — No login required, no personal data stored on servers
- **XSS Protection** — All user input is HTML-escaped before rendering in chat
- **Safe external links** — All outgoing links use `target="_blank"` with proper NVSP/ECI government URLs

---

## ♿ Accessibility

- Semantic HTML5 elements (`<nav>`, `<main>`, `<aside>`, `<section>`)
- `aria-label` attributes on interactive buttons
- Keyboard navigation support (Enter to send messages)
- High contrast neon text on dark backgrounds
- Voice input as alternative to typing
- Hindi language support for non-English speakers

---

## 📄 License

This project is built for the Google Antigravity Hackathon challenge.
