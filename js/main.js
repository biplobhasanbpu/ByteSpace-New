/* ByteSpace — shared page behaviour (loaded with `defer` on every page).
 * Header/footer behaviour lives in js/components.js.
 */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- single-select pill groups (course filters, review filters, …)
  document.querySelectorAll('[data-pills]').forEach(group => {
    group.addEventListener('click', e => {
      const pill = e.target.closest('.pill');
      if (!pill || !group.contains(pill)) return;
      group.querySelectorAll('.pill.is-active').forEach(p => {
        p.classList.remove('is-active');
        p.setAttribute('aria-pressed', 'false');
      });
      pill.classList.add('is-active');
      pill.setAttribute('aria-pressed', 'true');
    });
  });

  // --- search forms scroll to the results instead of hitting a backend
  document.querySelectorAll('form[data-search]').forEach(form => {
    form.addEventListener('submit', e => {
      const target = document.querySelector(form.dataset.search || '#courses');
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  // --- count-up numbers
  const countUp = el => {
    if (reduce) return;
    const to = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const t0 = performance.now();
    const dur = 1400;
    const tick = now => {
      const p = Math.min((now - t0) / dur, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  // --- scroll reveal, progress bars and counters
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      for (const { isIntersecting, target } of entries) {
        if (!isIntersecting) continue;
        target.classList.add('is-in');
        if (target.dataset.count) countUp(target);
        io.unobserve(target);
      }
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal, .progress, [data-count]').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.reveal, .progress').forEach(el => el.classList.add('is-in'));
  }

  // --- subtle pointer parallax on decorative shapes (desktop only)
  if (!reduce && matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('[data-parallax]').forEach(section => {
      const deco = section.querySelector('.deco');
      if (!deco) return;
      let raf = 0;
      section.addEventListener('pointermove', e => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          const r = section.getBoundingClientRect();
          deco.style.setProperty('--px', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
          deco.style.setProperty('--py', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
          raf = 0;
        });
      });
      section.addEventListener('pointerleave', () => {
        deco.style.setProperty('--px', 0);
        deco.style.setProperty('--py', 0);
      });
    });
  }
})();
