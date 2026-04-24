/**
 * @fileoverview VoteMate AI — Gemini AI Integration
 * @description Integrates Google's Gemini API for intelligent, context-aware
 * chatbot responses. Falls back to the rule-based ChatEngine when the API
 * key is not configured or when the request fails.
 * @module GeminiAI
 * @requires ChatEngine
 * @see https://ai.google.dev/
 */

const GeminiAI = (() => {
  /** @type {string|null} API key for Google Gemini */
  let apiKey = null;

  /** @type {boolean} Whether Gemini is ready to use */
  let isReady = false;

  /** @type {string} Gemini API endpoint */
  const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  /**
   * System prompt that defines VoteMate AI's behavior.
   * Ensures responses are non-partisan, step-by-step, and India-focused.
   * @constant {string}
   */
  const SYSTEM_PROMPT = `You are VoteMate AI, a friendly voting assistant for India.

RULES:
- Help users understand and complete the voting process in India
- Break answers into clear, numbered steps
- Use simple language that anyone can understand
- Ask what step the user is currently on
- Guide them toward completing their voting preparation
- If the user is confused, simplify your explanation and give examples
- If the user asks a vague question, ask a clarifying question
- NEVER show political bias or mention any political party
- NEVER recommend voting for any candidate or party
- Focus only on the voting PROCESS, not political opinions
- Use bullet points and short paragraphs
- Include relevant links to official resources when helpful:
  - NVSP: https://www.nvsp.in
  - Electoral Search: https://electoralsearch.eci.gov.in
  - Helpline: 1950

TOPICS YOU COVER:
- Voter registration (Form 6, NVSP portal)
- Required documents (Voter ID, Aadhaar, etc.)
- Finding polling booth location
- Voting day procedure (EVM, VVPAT)
- Voter eligibility (age 18+, citizenship)
- First-time voter guidance

GOAL: Make the user ready to vote in the easiest way possible.
Keep responses concise (under 200 words). Format with HTML tags: <strong>, <ul>, <li>, <a>.`;

  /** @type {Array<{role: string, parts: Array<{text: string}>}>} Conversation history for context */
  let conversationHistory = [];

  /**
   * Initialize Gemini with an API key.
   * @param {string} key - Google Gemini API key
   * @returns {boolean} Whether initialization succeeded
   */
  function init(key) {
    if (!key || key.trim().length < 10) {
      console.warn('GeminiAI: Invalid API key provided');
      isReady = false;
      return false;
    }
    apiKey = key.trim();
    isReady = true;
    conversationHistory = [];
    console.log('GeminiAI: Initialized successfully');
    return true;
  }

  /**
   * Send a message to Gemini API and get a response.
   * @param {string} userMessage - The user's input text
   * @returns {Promise<{text: string, chips: string[]}>} Bot response with suggestion chips
   */
  async function chat(userMessage) {
    if (!isReady || !apiKey) {
      return null; // Caller should fall back to ChatEngine
    }

    // Add user message to conversation history
    conversationHistory.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    try {
      const response = await fetch(`${API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_PROMPT }]
          },
          contents: conversationHistory,
          generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            topK: 40,
            maxOutputTokens: 512
          },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      if (!text) throw new Error('Empty response from Gemini');

      // Add assistant response to history
      conversationHistory.push({
        role: 'model',
        parts: [{ text }]
      });

      // Keep conversation history manageable (last 20 messages)
      if (conversationHistory.length > 20) {
        conversationHistory = conversationHistory.slice(-20);
      }

      // Format the response for HTML display
      const formatted = formatResponse(text);

      // Generate contextual follow-up chips
      const chips = generateChips(userMessage, text);

      return { text: formatted, chips };

    } catch (error) {
      console.error('GeminiAI: Request failed →', error.message);
      // Remove the failed user message from history
      conversationHistory.pop();
      return null; // Caller should fall back to ChatEngine
    }
  }

  /**
   * Format Gemini's markdown-like response to HTML.
   * @param {string} text - Raw text from Gemini
   * @returns {string} HTML-formatted text
   */
  function formatResponse(text) {
    let html = text
      // Convert **bold** to <strong>
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Convert *italic* to <em>
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Convert markdown links [text](url) to <a>
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
      // Convert bullet points
      .replace(/^[\s]*[-•]\s+(.*)/gm, '<li>$1</li>')
      // Convert numbered lists
      .replace(/^[\s]*\d+\.\s+(.*)/gm, '<li>$1</li>')
      // Wrap consecutive <li> items in <ul>
      .replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>')
      // Convert newlines to breaks
      .replace(/\n/g, '<br>');

    return html;
  }

  /**
   * Generate contextual suggestion chips based on the conversation.
   * @param {string} userMsg - User's original message
   * @param {string} botReply - Bot's response text
   * @returns {string[]} Array of suggestion chip texts
   */
  function generateChips(userMsg, botReply) {
    const lower = botReply.toLowerCase();
    const chips = [];

    if (lower.includes('register') || lower.includes('nvsp')) {
      chips.push('What documents do I need?');
    }
    if (lower.includes('document') || lower.includes('voter id')) {
      chips.push('Validate my documents');
    }
    if (lower.includes('booth') || lower.includes('polling')) {
      chips.push('How to vote on election day?');
    }
    if (lower.includes('evm') || lower.includes('vote')) {
      chips.push('What is VVPAT?');
    }

    // Always add a general chip if we have too few
    if (chips.length < 2) {
      chips.push('Take the quiz');
      chips.push('How to register?');
    }

    return chips.slice(0, 4);
  }

  /**
   * Check if Gemini AI is configured and ready.
   * @returns {boolean}
   */
  function available() {
    return isReady;
  }

  /**
   * Reset conversation history.
   */
  function resetHistory() {
    conversationHistory = [];
  }

  return { init, chat, available, resetHistory };
})();
