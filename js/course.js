/* ByteSpace — course pages (details / lessons / reviews).
 * Preview video play state, share button and review rating filter.
 * Single-select pill behaviour itself comes from js/main.js ([data-pills]).
 */
(() => {
  // --- preview video: client-side play / pause state (no media backend)
  const video = document.querySelector('[data-video]');
  if (video) {
    const btn = video.querySelector('.course-video__play');
    const bar = video.querySelector('.course-video__bar span');
    bar.addEventListener('animationend', () => {
      video.classList.remove('is-playing', 'is-paused');
      btn.setAttribute('aria-pressed', 'false');
      btn.setAttribute('aria-label', 'Play course preview');
    });
    btn.addEventListener('click', () => {
      const playing = !video.classList.contains('is-playing');
      video.classList.toggle('is-playing', playing);
      video.classList.toggle('is-paused', !playing);
      btn.setAttribute('aria-pressed', String(playing));
      btn.setAttribute('aria-label', playing ? 'Pause course preview' : 'Play course preview');
    });
  }

  // --- share: native share sheet when available, otherwise copy the link
  const share = document.querySelector('[data-share]');
  if (share) {
    const label = share.querySelector('[data-share-label]');
    share.addEventListener('click', async () => {
      const data = { title: document.title, url: location.href };
      try {
        if (navigator.share) {
          await navigator.share(data);
          return;
        }
        await navigator.clipboard.writeText(location.href);
        label.textContent = 'Link copied';
      } catch (err) {
        if (err && err.name === 'AbortError') return;
        label.textContent = 'Copy failed';
      }
      share.classList.add('is-copied');
      setTimeout(() => {
        label.textContent = 'Share';
        share.classList.remove('is-copied');
      }, 2000);
    });
  }

  // --- review filter: show only reviews matching the selected star rating
  const filter = document.querySelector('[data-review-filter]');
  const list = document.querySelector('[data-reviews]');
  if (filter && list) {
    const empty = list.querySelector('.reviews__empty');
    filter.addEventListener('click', e => {
      const pill = e.target.closest('.pill');
      if (!pill) return;
      const rating = pill.dataset.rating;
      let shown = 0;
      list.querySelectorAll('.review').forEach(review => {
        const match = rating === 'all' || review.dataset.rating === rating;
        review.hidden = !match;
        if (match) shown++;
      });
      empty.hidden = shown > 0;
    });
  }
})();
