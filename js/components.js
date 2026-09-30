/* ByteSpace — shared layout components (header + footer)
 *
 * Native Web Components rendered into the light DOM, so they are styled by
 * css/base.css like any other markup. Load this file in <head> (not deferred)
 * so the markup exists before first paint:
 *
 *   <site-header active="home"></site-header>      active: home | courses | creators
 *   <site-header variant="minimal"></site-header>   logo mark only (login / register)
 *   <site-footer></site-footer>
 */

const LOGO = `<svg class="logo" aria-hidden="true" focusable="false" viewBox="0 0 171 35"><path fill="#d4fb1f" d="M10.5 10.5C10.5 4.7 5.8 0 0 0L0 21C0 26.8 4.7 31.5 10.5 31.5L10.5 10.5"/><path fill="#d4fb1f" d="M18.38 10.5C24.17 10.5 28.88 15.2 28.88 21L21 21C15.2 21 10.5 16.3 10.5 10.5L18.38 10.5"/><path fill="#d4fb1f" d="M18.38 31.5C24.17 31.5 28.88 26.8 28.88 21L21 21C15.2 21 10.5 25.7 10.5 31.5L18.38 31.5"/><path fill="currentColor" d="M48.5 30L37.72 30L37.72 13.92L47.94 13.92C51.42 13.92 53.15 15.29 53.15 17.81C53.15 19.87 52.07 21.34 49.14 21.46L49.14 21.7C52.36 21.82 53.9 23.3 53.9 25.54C53.9 28.25 52.34 30 48.5 30M42.21 17.98L42.21 20.02L47.46 20.02C48.38 20.02 48.64 19.75 48.64 19.01C48.64 18.26 48.28 17.98 47.34 17.98L42.21 17.98M42.21 23.71L42.21 25.94L47.92 25.94C49 25.94 49.34 25.73 49.34 24.82C49.34 23.93 49.02 23.71 47.92 23.71L42.21 23.71M57.52 34.08L55.33 34.08L55.33 30L58.84 30C59.2 30 59.48 29.95 59.68 29.86L53.89 17.9L59.03 17.9L61.12 22.66L61.98 25.44L62.29 25.44L63.08 22.61L64.88 17.9L69.92 17.9L64.19 30.48C62.89 33.34 61.04 34.08 57.52 34.08M79.46 30L76.3 30C73.27 30 71.47 28.54 71.47 25.39L71.47 21.6L69.7 21.6L69.7 17.9L71.47 17.9L71.47 15.82L75.98 15.82L75.98 17.9L79.46 17.9L79.46 21.6L75.98 21.6L75.98 24.74C75.98 25.7 76.27 25.94 77.3 25.94L79.46 25.94L79.46 30M87.28 30.24C83.18 30.24 80.3 28.49 80.3 23.95C80.3 20.02 83.16 17.66 87.19 17.66C91.36 17.66 94.03 19.75 94.03 23.64C94.03 24.05 94 24.36 93.96 24.79L84.48 24.79C84.55 26.26 85.2 26.66 87.12 26.66C88.94 26.66 89.42 26.35 89.42 25.63L89.42 25.37L93.93 25.37L93.93 25.66C93.93 28.34 91.36 30.24 87.28 30.24M87.09 21.12C85.44 21.12 84.74 21.48 84.55 22.51L89.66 22.51C89.49 21.48 88.77 21.12 87.09 21.12M103.04 30.24C98.12 30.24 95.12 28.49 95.12 24.41L95.12 24.26L99.63 24.26L99.63 24.77C99.63 25.85 100.01 26.14 103.04 26.14C105.77 26.14 106.06 25.92 106.06 25.2C106.06 24.62 105.75 24.38 104.43 24.22L99.39 23.54C96.39 23.14 94.88 21.53 94.88 18.94C94.88 16.37 96.87 13.68 102.68 13.68C107.79 13.68 110.24 15.91 110.24 19.51L110.24 19.66L105.72 19.66L105.72 19.3C105.72 18.14 105.22 17.76 102.2 17.76C99.89 17.76 99.39 18.07 99.39 18.77C99.39 19.27 99.68 19.51 100.54 19.63L105.58 20.38C109.52 20.95 110.57 22.97 110.57 25.03C110.57 27.79 108.46 30.24 103.04 30.24M116.15 34.08L111.64 34.08L111.64 17.9L115.87 17.9L115.87 21.17L116.11 21.17C116.49 18.77 117.93 17.66 120.76 17.66C124.46 17.66 126.5 20.04 126.5 23.95C126.5 27.89 124.51 30.24 120.95 30.24C118.1 30.24 116.75 28.9 116.39 26.88L116.15 26.88L116.15 34.08M116.15 24.1C116.15 25.8 117.11 26.14 119.13 26.14C121.22 26.14 121.94 25.56 121.94 23.95C121.94 22.34 121.22 21.79 119.13 21.79C117.11 21.79 116.15 22.18 116.15 23.93L116.15 24.1M131.61 30.24C128.87 30.24 127.34 28.99 127.34 26.93C127.34 25.22 128.51 24 131.25 23.74L136.17 23.26L136.17 23.02C136.17 21.79 135.64 21.6 134.03 21.6C132.54 21.6 132.09 21.89 132.09 22.9L132.09 22.99L127.58 22.99L127.58 22.94C127.58 19.73 130.26 17.66 134.37 17.66C138.59 17.66 140.63 19.73 140.63 23.11L140.63 30L136.41 30L136.41 27.46L136.17 27.46C135.71 29.16 134.22 30.24 131.61 30.24M131.87 26.64C131.87 27.02 132.26 27.1 132.95 27.1C135.14 27.1 136.02 26.83 136.14 25.75L132.45 26.18C132.04 26.23 131.87 26.38 131.87 26.64M148.76 30.24C144.47 30.24 141.73 27.86 141.73 23.95C141.73 20.02 144.47 17.66 148.76 17.66C152.89 17.66 155.53 19.78 155.53 23.02L155.53 23.4L151.04 23.4L151.04 23.21C151.04 21.96 150.13 21.7 148.67 21.7C147.01 21.7 146.22 22.06 146.22 23.95C146.22 25.82 147.01 26.18 148.67 26.18C150.13 26.18 151.04 25.94 151.04 24.7L151.04 24.48L155.53 24.48L155.53 24.89C155.53 28.1 152.89 30.24 148.76 30.24M163.48 30.24C159.38 30.24 156.5 28.49 156.5 23.95C156.5 20.02 159.35 17.66 163.38 17.66C167.56 17.66 170.22 19.75 170.22 23.64C170.22 24.05 170.2 24.36 170.15 24.79L160.67 24.79C160.74 26.26 161.39 26.66 163.31 26.66C165.14 26.66 165.62 26.35 165.62 25.63L165.62 25.37L170.13 25.37L170.13 25.66C170.13 28.34 167.56 30.24 163.48 30.24M163.29 21.12C161.63 21.12 160.94 21.48 160.74 22.51L165.86 22.51C165.69 21.48 164.97 21.12 163.29 21.12"/></svg>`;
const LOGO_MARK = `<svg class="logo logo--mark" aria-hidden="true" focusable="false" viewBox="0 0 29 35"><path fill="#d4fb1f" d="M10.5 10.5C10.5 4.7 5.8 0 0 0L0 21C0 26.8 4.7 31.5 10.5 31.5L10.5 10.5"/><path fill="#d4fb1f" d="M18.38 10.5C24.17 10.5 28.88 15.2 28.88 21L21 21C15.2 21 10.5 16.3 10.5 10.5L18.38 10.5"/><path fill="#d4fb1f" d="M18.38 31.5C24.17 31.5 28.88 26.8 28.88 21L21 21C15.2 21 10.5 25.7 10.5 31.5L18.38 31.5"/></svg>`;
const CART = `<svg class="cart-icon" aria-hidden="true" focusable="false" viewBox="0 0 18 22"><path fill="currentColor" d="M15 5L13 5C13 2.79 11.21 1 9 1C6.79 1 5 2.79 5 5L3 5C1.9 5 1 5.9 1 7L1 19C1 20.1 1.9 21 3 21L15 21C16.1 21 17 20.1 17 19L17 7C17 5.9 16.1 5 15 5M9 3C10.1 3 11 3.9 11 5L7 5C7 3.9 7.9 3 9 3M15 19L3 19L3 7L5 7L5 9C5 9.55 5.45 10 6 10C6.55 10 7 9.55 7 9L7 7L11 7L11 9C11 9.55 11.45 10 12 10C12.55 10 13 9.55 13 9L13 7L15 7L15 19"/></svg>`;

class SiteHeader extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready) return;
    this.dataset.ready = 'true';
    const active = this.getAttribute('active');
    const link = (href, key, label) =>
      `<li><a class="nav-link${active === key ? ' is-active' : ''}" href="${href}"${active === key ? ' aria-current="page"' : ''}>${label}</a></li>`;

    if (this.getAttribute('variant') === 'minimal') {
      this.innerHTML = `
        <header class="site-header site-header--minimal">
          <div class="container site-header__inner">
            <a class="site-header__logo" href="index.html" aria-label="ByteSpace home">${LOGO_MARK}</a>
          </div>
        </header>`;
      return;
    }

    this.innerHTML = `
      <header class="site-header">
        <div class="container site-header__inner">
          <a class="site-header__logo" href="index.html" aria-label="ByteSpace home">${LOGO}</a>
          <nav class="site-nav" id="site-nav" aria-label="Primary">
            <ul class="site-nav__links">
              ${link('index.html', 'home', 'Home')}
              ${link('search.html', 'courses', 'Courses')}
              ${link('creator-profile.html', 'creators', 'Creators')}
            </ul>
            <div class="site-nav__actions">
              <a class="nav-link" href="login.html">Sign In</a>
              <a class="nav-link nav-link--join" href="register.html">Join Us</a>
            </div>
          </nav>
          <a class="site-header__cart" href="#cart" aria-label="Shopping cart">${CART}</a>
          <button class="menu-toggle" type="button" aria-controls="site-nav" aria-expanded="false" aria-label="Open menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>`;

    const header = this.querySelector('.site-header');
    const toggle = this.querySelector('.menu-toggle');
    const setOpen = open => {
      header.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    toggle.addEventListener('click', () => setOpen(!header.classList.contains('menu-open')));
    header.addEventListener('click', e => { if (e.target.closest('.site-nav a')) setOpen(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
  }
}

class SiteFooter extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready) return;
    this.dataset.ready = 'true';
    this.innerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="site-footer__top">
            <div class="site-footer__newsletter">
              <a class="site-footer__logo" href="index.html" aria-label="ByteSpace home">${LOGO}</a>
              <p class="site-footer__lead">Stay Up to date with our latest features and releases by joining our newsletter.</p>
              <form class="newsletter" action="#" novalidate>
                <label class="sr-only" for="newsletter-email">Email address</label>
                <input class="newsletter__input" id="newsletter-email" type="email" name="email" placeholder="Enter your email" autocomplete="email" required>
                <button class="btn btn--lime newsletter__btn" type="submit">Search</button>
              </form>
              <p class="site-footer__legal">By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.</p>
            </div>
            <nav class="site-footer__links" aria-label="Footer">
              <div class="footer-col">
                <h2 class="sr-only">Browse</h2>
                <ul>
                  <li><a href="search.html">Featured Courses</a></li>
                  <li><a href="index.html#categories">Featured Categories</a></li>
                  <li><a href="search.html">Business</a></li>
                  <li><a href="search.html">IT</a></li>
                  <li><a href="search.html">Design</a></li>
                </ul>
              </div>
              <div class="footer-col">
                <h2 class="sr-only">Categories</h2>
                <ul>
                  <li><a href="search.html">Development</a></li>
                  <li><a href="search.html">Marketing</a></li>
                  <li><a href="search.html">Photography</a></li>
                  <li><a href="search.html">Finance</a></li>
                  <li><a href="search.html">Sport</a></li>
                </ul>
              </div>
              <div class="footer-col">
                <h2 class="sr-only">Platform</h2>
                <ul>
                  <li><a href="register.html">Become a Creator</a></li>
                  <li><a href="#affiliate">Affiliate Program</a></li>
                  <li><a href="#contact">Contact</a></li>
                  <li><a href="#help">Help</a></li>
                  <li><a href="#about">About</a></li>
                </ul>
              </div>
            </nav>
          </div>
          <div class="site-footer__bottom">
            <p>@ 2023 ByteSpace. All rights reserved.</p>
            <ul class="site-footer__policies">
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#cookies">Cookies Settings</a></li>
            </ul>
          </div>
        </div>
      </footer>`;

    const form = this.querySelector('.newsletter');
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      form.classList.add('is-done');
      form.querySelector('button').textContent = 'Thanks!';
    });
  }
}

customElements.define('site-header', SiteHeader);
customElements.define('site-footer', SiteFooter);
