const passwordInput = document.getElementById('password');
const bar = document.getElementById('bar');
const strengthText = document.getElementById('strength');
const suggestions = document.getElementById('suggestions');

const rules = {
  length: value => value.length >= 8,
  lower: value => /[a-z]/.test(value),
  upper: value => /[A-Z]/.test(value),
  number: value => /[0-9]/.test(value),
  special: value => /[^A-Za-z0-9]/.test(value),
  unique: value => !/(.)\1{2,}/.test(value) && !/(password|123456|qwerty|admin)/i.test(value)
};

function analyzePassword() {
  const value = passwordInput.value;
  if (!value) {
    bar.style.width = '0';
    strengthText.textContent = 'Enter a password to begin';
    strengthText.style.color = '#647087';
    Object.keys(rules).forEach(key => {
      const el = document.getElementById(key);
      el.classList.remove('pass');
      el.textContent = '○ ' + labels[key];
    });
    suggestions.innerHTML = '<li>Use at least 12 characters for better security.</li>';
    return;
  }

  let score = 0;
  Object.entries(rules).forEach(([key, test]) => {
    const passed = test(value);
    if (passed) score++;
    const el = document.getElementById(key);
    el.classList.toggle('pass', passed);
    el.textContent = (passed ? '✓ ' : '○ ') + labels[key];
  });

  // Extra credit for longer passwords.
  if (value.length >= 12) score++;
  if (value.length >= 16) score++;

  let level, color, width;
  if (score <= 2) { level = 'Weak'; color = '#e04444'; width = '25%'; }
  else if (score <= 4) { level = 'Medium'; color = '#e5a323'; width = '55%'; }
  else if (score <= 6) { level = 'Strong'; color = '#2d9b67'; width = '80%'; }
  else { level = 'Very Strong'; color = '#1673d1'; width = '100%'; }

  bar.style.width = width;
  bar.style.background = color;
  strengthText.textContent = 'Password strength: ' + level;
  strengthText.style.color = color;

  const tips = [];
  if (value.length < 12) tips.push('Increase the length to at least 12 characters.');
  if (!rules.upper(value)) tips.push('Add an uppercase letter.');
  if (!rules.lower(value)) tips.push('Add a lowercase letter.');
  if (!rules.number(value)) tips.push('Include at least one number.');
  if (!rules.special(value)) tips.push('Include a special character such as !, @, or #.');
  if (!rules.unique(value)) tips.push('Avoid common words and three or more repeated characters.');
  if (!tips.length) tips.push('Good work! Keep this password unique and do not reuse it on other websites.');
  suggestions.innerHTML = tips.map(tip => `<li>${tip}</li>`).join('');
}

const labels = {
  length: 'At least 8 characters',
  lower: 'Lowercase letter (a-z)',
  upper: 'Uppercase letter (A-Z)',
  number: 'Number (0-9)',
  special: 'Special character (!@#$...)',
  unique: 'Avoid common/repeated patterns'
};

passwordInput.addEventListener('input', analyzePassword);
document.getElementById('toggle').addEventListener('click', () => {
  const showing = passwordInput.type === 'text';
  passwordInput.type = showing ? 'password' : 'text';
  document.getElementById('toggle').textContent = showing ? 'Show' : 'Hide';
  document.getElementById('toggle').setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
});
document.getElementById('clear').addEventListener('click', () => {
  passwordInput.value = '';
  passwordInput.type = 'password';
  document.getElementById('toggle').textContent = 'Show';
  analyzePassword();
  passwordInput.focus();
});
