/* ByteSpace — sign in / sign up behaviour (login.html, register.html)
 * There is no backend: forms are validated in the browser and, when valid,
 * a friendly success state replaces the form instead of submitting.
 */
(() => {
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const MIN_PASSWORD = 8;

  // --- validation rules per field name → error message (or '' when valid)
  const rules = {
    name: v => (!v ? 'Please enter your full name.' : v.length < 2 ? 'Your name looks a little short.' : ''),
    email: v => (!v ? 'Please enter your email address.' : !EMAIL.test(v) ? 'Please enter a valid email, e.g. designer@example.com.' : ''),
    password: v => (!v ? 'Please enter your password.' : v.length < MIN_PASSWORD ? `Password must be at least ${MIN_PASSWORD} characters.` : '')
  };

  const showError = (input, message) => {
    const error = document.getElementById(input.getAttribute('aria-describedby'));
    if (message) {
      input.setAttribute('aria-invalid', 'true');
      error.textContent = message;
      error.hidden = false;
    } else {
      input.removeAttribute('aria-invalid');
      error.textContent = '';
      error.hidden = true;
    }
  };

  const validate = input => {
    const rule = rules[input.name];
    const message = rule ? rule(input.value.trim()) : '';
    showError(input, message);
    return !message;
  };

  document.querySelectorAll('[data-auth-form]').forEach(form => {
    const inputs = [...form.querySelectorAll('.field__input')];

    // re-validate as the user fixes a field (only once it has been flagged)
    inputs.forEach(input => {
      input.addEventListener('input', () => { if (input.hasAttribute('aria-invalid')) validate(input); });
      input.addEventListener('blur', () => { if (input.value) validate(input); });
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      const invalid = inputs.filter(input => !validate(input));
      if (invalid.length) {
        invalid[0].focus();
        return;
      }

      // success: swap the form panel for the confirmation state
      const card = form.closest('.auth-card');
      const panel = card.querySelector('[data-auth-panel]');
      const success = card.querySelector('[data-auth-success]');
      const nameSlot = success.querySelector('[data-auth-name]');
      const name = form.elements.name ? form.elements.name.value.trim().split(/\s+/)[0] : '';
      if (nameSlot && name) nameSlot.textContent = `, ${name}`;
      panel.hidden = true;
      success.hidden = false;
      success.querySelector('h2').focus();
    });
  });

  // --- password visibility toggles
  document.querySelectorAll('[data-password-toggle]').forEach(btn => {
    const input = document.getElementById(btn.getAttribute('aria-controls'));
    btn.addEventListener('click', () => {
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.setAttribute('aria-pressed', String(show));
      btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    });
  });

  // --- social buttons: no OAuth backend in this static build
  const note = document.querySelector('[data-auth-note]');
  document.querySelectorAll('[data-social]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (note) note.textContent = `${btn.dataset.social} sign-in is coming soon — please use your email for now.`;
    });
  });
})();
