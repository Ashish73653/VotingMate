# VoteMate AI — Implementation Plan

A futuristic, neon-themed AI voting assistant web app that helps Indian voters understand and complete the voting process.

## Architecture Decision

**Lightweight vanilla HTML/CSS/JS** — no framework. The app will be a single `index.html` with modular CSS and JS files, served via a simple dev server. This keeps it lightweight per the user's constraint while still achieving a premium feel.

### Key Dependencies (all via CDN)
- **Three.js** `^0.160.0` — for the 3D tubes background
- **threejs-components** `^0.0.19` — the tubes cursor effect
- **Google Fonts (Inter)** — modern typography

> [!IMPORTANT]
> No build tools or frameworks. Everything loads from CDN or is written inline. This means zero install time and instant deployment.

---

## Proposed File Structure

```
d:\Election\
├── index.html          # Single-page app (landing + main views)
├── css/
│   └── styles.css      # Complete design system + glassmorphism + neon theme
├── js/
│   ├── app.js          # App controller, routing, page transitions
│   ├── tubes.js        # 3D tubes background integration
│   ├── chat.js         # Chatbot engine + AI behavior
│   ├── checklist.js    # Step-by-step checklist system
│   ├── quiz.js         # Voter awareness quiz
│   └── documents.js    # Document validation feature
└── assets/
    └── (generated images if needed)
```

---

## Proposed Changes

### Design System & Theme

#### [NEW] [styles.css](file:///d:/Election/css/styles.css)

Complete design system with:
- **Neon color palette**: Electric cyan `#00f0ff`, neon magenta `#f967fb`, vivid green `#53bc28`, deep purple `#6958d5`
- **Glassmorphism tokens**: `backdrop-filter: blur(20px)`, semi-transparent backgrounds (`rgba(255,255,255,0.05)`), subtle borders (`rgba(255,255,255,0.1)`)
- **Typography**: Inter font family, fluid type scale
- **Dark base**: Near-black backgrounds (`#0a0a1a`) with gradient overlays
- **Micro-animations**: Glow pulses, slide-ins, fade transitions, hover lifts
- **Responsive grid**: CSS Grid + Flexbox for all layouts
- **CSS custom properties** for all tokens so the theme is easily adjustable

---

### HTML Structure

#### [NEW] [index.html](file:///d:/Election/index.html)

Single HTML file containing all views as sections that swap via JS:

1. **Landing Page** (`#landing`)
   - Full-screen 3D tubes background
   - Large title "VoteMate AI" with neon glow text effect
   - Subtitle: "Your AI-powered voting companion for India"
   - CTA button "Get Started" with glow hover effect
   - Animated scroll indicator

2. **Main Assistant Page** (`#main`)
   - 3D tubes background (persistent, dimmed)
   - **Left sidebar**: Step-by-step checklist (Register → ID Verification → Find Booth → Cast Vote)
   - **Center**: Chat interface with glassmorphism card
   - **Top nav**: App title + feature tabs (Chat, Documents, Quiz)
   - Smooth page transition from landing

3. **Document Validation View** (`#documents`)
   - Form to input document details (Voter ID, Aadhaar last 4 digits)
   - Visual validation feedback with animated checkmarks
   - Glassmorphism card layout

4. **Quiz View** (`#quiz`)
   - Multiple-choice questions about voting rights & process
   - Progress bar with neon fill
   - Score card at the end with glassmorphism

---

### 3D Background

#### [NEW] [tubes.js](file:///d:/Election/js/tubes.js)

Adapted from the reference implementation:
- Loads `threejs-components` tubes cursor via CDN dynamic import
- Initializes with neon color scheme matching app palette
- Click-to-randomize colors preserved
- Canvas fills entire viewport, positioned fixed behind all content
- Performance: single instance shared across all views (no re-init on page change)

---

### Chatbot Engine

#### [NEW] [chat.js](file:///d:/Election/js/chat.js)

Rule-based chatbot with pattern matching (no external AI API needed — keeps it lightweight):

**Behavior rules:**
- Breaks answers into bullet-point steps
- Uses simple language
- Asks what step the user is on
- Guides toward completion
- Asks clarifying questions for vague inputs
- Never shows political bias or mentions parties

**Topic coverage:**
- Voter registration process
- Required documents (Voter ID, Aadhaar, etc.)
- Polling booth location
- Voting day procedure
- EVM/VVPAT usage
- First-time voter guidance
- Age eligibility
- Online registration (NVSP portal)

**UX:**
- Typing indicator animation
- Message bubbles with timestamps
- Quick-reply suggestion chips
- Auto-scroll on new messages
- Welcome message on first load

---

### Checklist System

#### [NEW] [checklist.js](file:///d:/Election/js/checklist.js)

Four-step interactive checklist:
1. **Register to Vote** — links to NVSP, eligibility info
2. **ID Verification** — document checklist
3. **Find Your Booth** — guidance on locating polling station
4. **Cast Your Vote** — day-of voting procedure

Each step:
- Expandable with details
- Clickable to mark complete
- Connected by a vertical progress line with neon glow
- Completed steps get animated checkmark
- Clicking a step also sends context to the chatbot

---

### Document Validation

#### [NEW] [documents.js](file:///d:/Election/js/documents.js)

Simple client-side validation:
- Voter ID format check (3 letters + 7 digits)
- Aadhaar format check (12 digits)
- Age verification (18+ check from DOB input)
- Visual feedback: green glow for valid, red for invalid
- Summary card showing readiness status

---

### Voter Awareness Quiz

#### [NEW] [quiz.js](file:///d:/Election/js/quiz.js)

5-question quiz with topics like:
- Minimum voting age
- Required ID documents
- EVM usage
- Voting rights
- Election Commission role

Features:
- One question at a time with smooth transitions
- Neon progress bar
- Immediate feedback (correct/incorrect with explanation)
- Final score card with share-ready result

---

### App Controller

#### [NEW] [app.js](file:///d:/Election/js/app.js)

- View routing (landing ↔ main ↔ documents ↔ quiz)
- Smooth CSS transitions between views
- Keyboard shortcuts
- Mobile responsive handling
- State persistence (checklist progress in localStorage)

---

## Open Questions

> [!IMPORTANT]
> **AI Backend**: The plan uses a **rule-based chatbot** (pattern matching + predefined responses) to keep the app lightweight with zero API dependencies. If you'd prefer to integrate an actual AI API (e.g., Gemini), I can add that, but it would require an API key setup. Which approach do you prefer?

> [!NOTE]
> **Mobile Layout**: On mobile, the checklist sidebar will collapse into a top progress bar, and the chat will take full width. Does this sound good?

---

## Verification Plan

### Automated Tests
- Open the app in browser and verify:
  - 3D tubes background renders and responds to cursor
  - Landing → Main transition is smooth
  - Chat responds to voter-related queries
  - Checklist steps are interactive and persist state
  - Document validation shows correct feedback
  - Quiz flows through all questions and shows score
  - All glassmorphism effects render correctly

### Visual Verification
- Browser recording of full user flow
- Screenshot of landing page
- Screenshot of main assistant view
- Mobile responsiveness check
