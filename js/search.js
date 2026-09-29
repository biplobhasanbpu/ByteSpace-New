/* ByteSpace — search page behaviour (search.html)
 * - dropdown menus (search scope, filter, level, category, sort): open/close,
 *   keyboard navigation, single-choice items (menuitemradio)
 * - client-side pagination (no backend): active page, prev/next state
 */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- dropdown menus ---------- */
  const dropdowns = [...document.querySelectorAll('[data-dropdown]')];

  const items = dd => [...dd.querySelectorAll('[role^="menuitem"]')];

  const close = (dd, focusButton = false) => {
    if (!dd.classList.contains('is-open')) return;
    dd.classList.remove('is-open');
    const btn = dd.querySelector('[aria-expanded]');
    btn.setAttribute('aria-expanded', 'false');
    if (focusButton) btn.focus();
  };

  const open = (dd, focusIndex = null) => {
    dropdowns.forEach(other => other !== dd && close(other));
    dd.classList.add('is-open');
    dd.querySelector('[aria-expanded]').setAttribute('aria-expanded', 'true');
    if (focusIndex === null) return;
    const list = items(dd);
    const checked = list.findIndex(i => i.getAttribute('aria-checked') === 'true');
    list[focusIndex === 'checked' ? Math.max(checked, 0) : (focusIndex + list.length) % list.length].focus();
  };

  const choose = (dd, item) => {
    items(dd).forEach(i => i.setAttribute('aria-checked', String(i === item)));
    const label = dd.querySelector('[data-dropdown-label]');
    const btn = dd.querySelector('[aria-expanded]');
    if (label) label.textContent = item.textContent.trim();
    // filter buttons keep their design label; mark them when a non-default choice is set
    else btn.classList.toggle('is-set', items(dd).indexOf(item) > 0);
    close(dd, true);
  };

  dropdowns.forEach(dd => {
    const btn = dd.querySelector('[aria-expanded]');

    btn.addEventListener('click', () => {
      dd.classList.contains('is-open') ? close(dd) : open(dd);
    });
    btn.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        open(dd, e.key === 'ArrowDown' ? 'checked' : -1);
      }
    });

    dd.querySelector('.menu').addEventListener('click', e => {
      const item = e.target.closest('[role^="menuitem"]');
      if (item) choose(dd, item);
    });
    dd.querySelector('.menu').addEventListener('keydown', e => {
      const list = items(dd);
      const i = list.indexOf(document.activeElement);
      const move = {
        ArrowDown: i + 1,
        ArrowUp: i - 1,
        Home: 0,
        End: list.length - 1
      }[e.key];
      if (move !== undefined) {
        e.preventDefault();
        list[(move + list.length) % list.length].focus();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        close(dd, true);
      } else if (e.key === 'Tab') {
        close(dd);
      }
    });
  });

  document.addEventListener('click', e => {
    dropdowns.forEach(dd => { if (!dd.contains(e.target)) close(dd); });
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const openDd = dropdowns.find(dd => dd.classList.contains('is-open'));
    if (openDd) close(openDd, true);
  });

  /* ---------- pagination ---------- */
  const nav = document.querySelector('[data-pagination]');
  const grid = document.getElementById('results-grid');
  if (!nav || !grid) return;

  const pages = [...nav.querySelectorAll('.pagination__page')];
  const prev = nav.querySelector('[rel="prev"]');
  const next = nav.querySelector('[rel="next"]');
  const cards = [...grid.children];
  let current = 1;

  const goTo = page => {
    if (page < 1 || page > pages.length || page === current) return;
    current = page;
    pages.forEach(p => {
      if (Number(p.dataset.page) === page) p.setAttribute('aria-current', 'page');
      else p.removeAttribute('aria-current');
    });
    prev.setAttribute('aria-disabled', String(page === 1));
    next.setAttribute('aria-disabled', String(page === pages.length));

    // no backend: show the same catalogue in a different order per page
    const shift = ((page - 1) * 4) % cards.length;
    cards.slice(shift).concat(cards.slice(0, shift)).forEach(c => grid.append(c));
    grid.classList.remove('is-paging');
    void grid.offsetWidth;
    grid.classList.add('is-paging');

    document.getElementById('results').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  };

  nav.addEventListener('click', e => {
    const link = e.target.closest('[data-page]');
    if (!link) return;
    e.preventDefault();
    const key = link.dataset.page;
    goTo(key === 'prev' ? current - 1 : key === 'next' ? current + 1 : Number(key));
  });
})();
