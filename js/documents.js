// ========================================
// VoteMate AI — Document Validation
// ========================================
const DocValidator = (() => {
  const rules = {
    voterId: {
      label: 'Voter ID (EPIC)',
      placeholder: 'e.g. ABC1234567',
      regex: /^[A-Z]{3}\d{7}$/,
      successMsg: '✓ Valid Voter ID format',
      errorMsg: '✗ Should be 3 letters + 7 digits (e.g., ABC1234567)'
    },
    aadhaar: {
      label: 'Aadhaar Number',
      placeholder: 'e.g. 1234 5678 9012',
      regex: /^\d{12}$/,
      successMsg: '✓ Valid Aadhaar format',
      errorMsg: '✗ Should be exactly 12 digits',
      transform: v => v.replace(/\s/g, '')
    },
    dob: {
      label: 'Date of Birth',
      placeholder: '',
      type: 'date',
      validate: v => {
        if (!v) return { valid: false, msg: '✗ Please enter your date of birth' };
        const birth = new Date(v);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        if (age >= 18) return { valid: true, msg: `✓ Age ${age} — You are eligible to vote!` };
        return { valid: false, msg: `✗ Age ${age} — Must be 18+ to vote` };
      }
    }
  };

  function render(container) {
    if (!container) return;
    container.innerHTML = `
      <div class="doc-header">
        <h2>📋 Document Validation</h2>
        <p>Verify your documents are ready for voting</p>
      </div>
      <div class="doc-cards">
        ${Object.entries(rules).map(([key, r]) => `
          <div class="doc-card">
            <div class="doc-card-title">
              <span class="icon">${key === 'voterId' ? '🪪' : key === 'aadhaar' ? '🆔' : '🎂'}</span>
              ${r.label}
            </div>
            <div class="doc-field">
              <label for="doc-${key}">${r.label}</label>
              <input id="doc-${key}" type="${r.type || 'text'}" placeholder="${r.placeholder || ''}" autocomplete="off" />
              <div class="field-msg" id="msg-${key}"></div>
            </div>
            <button class="doc-validate-btn" data-key="${key}">Validate</button>
          </div>
        `).join('')}
      </div>
      <div class="doc-summary" id="doc-summary" style="display:none">
        <h3>Readiness Status</h3>
        <div class="status" id="doc-status-icon"></div>
        <div class="status-text" id="doc-status-text"></div>
      </div>`;

    container.querySelectorAll('.doc-validate-btn').forEach(btn => {
      btn.addEventListener('click', () => validateField(btn.dataset.key));
    });

    // Also validate on Enter
    container.querySelectorAll('input').forEach(inp => {
      inp.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          const key = inp.id.replace('doc-', '');
          validateField(key);
        }
      });
    });
  }

  function validateField(key) {
    const rule = rules[key];
    const input = document.getElementById(`doc-${key}`);
    const msgEl = document.getElementById(`msg-${key}`);
    if (!input || !msgEl) return;

    let val = input.value.trim();
    if (rule.transform) val = rule.transform(val);

    let valid, msg;
    if (rule.validate) {
      const result = rule.validate(val);
      valid = result.valid;
      msg = result.msg;
    } else {
      valid = rule.regex.test(val.toUpperCase());
      msg = valid ? rule.successMsg : rule.errorMsg;
    }

    input.classList.remove('valid', 'invalid');
    input.classList.add(valid ? 'valid' : 'invalid');
    msgEl.className = `field-msg show ${valid ? 'success' : 'error'}`;
    msgEl.textContent = msg;

    updateSummary();
  }

  function updateSummary() {
    const summary = document.getElementById('doc-summary');
    const icon = document.getElementById('doc-status-icon');
    const text = document.getElementById('doc-status-text');
    if (!summary) return;

    const validCount = document.querySelectorAll('.doc-field input.valid').length;
    const total = Object.keys(rules).length;

    if (validCount > 0) {
      summary.style.display = 'block';
      if (validCount === total) {
        icon.textContent = '🎉';
        text.textContent = 'All documents verified!';
        text.className = 'status-text ready';
      } else {
        icon.textContent = '⏳';
        text.textContent = `${validCount}/${total} documents verified`;
        text.className = 'status-text not-ready';
      }
    }
  }

  return { render };
})();
