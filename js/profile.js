/* ByteSpace — creator profile page behaviour (creator-profile.html)
 * - Follow / Following toggle (client-side only, aria-pressed)
 * - Filter / Level / Category / Sort popovers that filter and order the course cards
 */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- follow toggle
  const follow = document.querySelector('[data-follow]');
  const followers = document.querySelector('[data-followers]');
  if (follow) {
    const base = Number(followers ? followers.textContent : 0);
    follow.addEventListener('click', () => {
      const on = follow.getAttribute('aria-pressed') !== 'true';
      follow.setAttribute('aria-pressed', String(on));
      follow.querySelector('.follow-btn__label').textContent = on ? 'Following' : 'Follow';
      if (followers) followers.textContent = base + (on ? 1 : 0);
      follow.classList.remove('is-bump');
      void follow.offsetWidth; // restart the bump animation
      follow.classList.add('is-bump');
    });
  }

  // --- toolbar popovers
  const grid = document.getElementById('course-grid');
  if (!grid) return;
  const cards = [...grid.querySelectorAll('.course-card')];
  const status = document.querySelector('[data-results-status]');
  const empty = document.querySelector('[data-empty]');
  const sortLabel = document.querySelector('[data-sort-label]');
  const state = { rating: 0, level: '', category: '', sort: 'relevant' };
  const dropdowns = [...document.querySelectorAll('[data-dropdown]')];

  const close = (dd, focus) => {
    const btn = dd.querySelector('.tool-btn');
    btn.setAttribute('aria-expanded', 'false');
    dd.querySelector('.dropdown__menu').hidden = true;
    if (focus) btn.focus();
  };
  const closeAll = except => dropdowns.forEach(dd => { if (dd !== except) close(dd); });

  const apply = () => {
    let shown = 0;
    cards.forEach(card => {
      const ok = Number(card.dataset.rating) >= state.rating &&
        (!state.level || card.dataset.level === state.level) &&
        (!state.category || card.dataset.category === state.category);
      card.hidden = !ok;
      if (ok) shown++;
    });
    const sorted = [...cards].sort((a, b) => {
      if (state.sort === 'rating') return b.dataset.rating - a.dataset.rating || a.dataset.order - b.dataset.order;
      if (state.sort === 'title') {
        return a.querySelector('.course-card__title').textContent.trim()
          .localeCompare(b.querySelector('.course-card__title').textContent.trim(), undefined, { sensitivity: 'base' });
      }
      return a.dataset.order - b.dataset.order;
    });
    sorted.forEach(card => {
      grid.append(card);
      card.classList.add('is-in');
      if (!reduce && !card.hidden) {
        card.classList.remove('is-shown');
        void card.offsetWidth;
        card.classList.add('is-shown');
      }
    });
    if (empty) empty.hidden = shown > 0;
    if (status) status.textContent = `${shown} course${shown === 1 ? '' : 's'} shown`;
  };

  dropdowns.forEach(dd => {
    const key = dd.dataset.dropdown;
    const btn = dd.querySelector('.tool-btn');
    const menu = dd.querySelector('.dropdown__menu');
    const options = [...menu.querySelectorAll('.dropdown__option')];

    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      closeAll(dd);
      btn.setAttribute('aria-expanded', String(open));
      menu.hidden = !open;
      if (open) (options.find(o => o.getAttribute('aria-pressed') === 'true') || options[0]).focus();
    });

    menu.addEventListener('click', e => {
      const opt = e.target.closest('.dropdown__option');
      if (!opt) return;
      options.forEach(o => o.setAttribute('aria-pressed', String(o === opt)));
      const value = opt.dataset.value;
      state[key] = key === 'rating' ? Number(value) : value;
      if (key === 'sort') sortLabel.textContent = opt.textContent;
      else btn.classList.toggle('is-set', Boolean(state[key]));
      apply();
      close(dd, true);
    });

    // arrow keys move between options, Escape closes
    dd.addEventListener('keydown', e => {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') {
        e.stopPropagation();
        close(dd, true);
        return;
      }
      if (menu.hidden || !['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return;
      e.preventDefault();
      const i = options.indexOf(document.activeElement);
      const n = options.length;
      const next = e.key === 'Home' ? 0 : e.key === 'End' ? n - 1
        : e.key === 'ArrowDown' ? (i + 1) % n : (i - 1 + n) % n;
      options[next].focus();
    });

    dd.addEventListener('focusout', e => { if (!dd.contains(e.relatedTarget) && e.relatedTarget) close(dd); });
  });

  document.addEventListener('click', e => { if (!e.target.closest('[data-dropdown]')) closeAll(); });

  // reset from the empty state
  const reset = document.querySelector('[data-reset]');
  if (reset) {
    reset.addEventListener('click', () => {
      Object.assign(state, { rating: 0, level: '', category: '' });
      dropdowns.forEach(dd => {
        if (dd.dataset.dropdown === 'sort') return;
        dd.querySelector('.tool-btn').classList.remove('is-set');
        dd.querySelectorAll('.dropdown__option').forEach((o, i) => o.setAttribute('aria-pressed', String(i === 0)));
      });
      apply();
      dropdowns[0].querySelector('.tool-btn').focus();
    });
  }
})();
