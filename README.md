<<<<<<< HEAD
# ByteSpace

Marketing site and course pages for ByteSpace, built from the Figma designs (PDF exports, 1440px artboards).

Plain **HTML + CSS + JavaScript** — no framework, no build step, no backend. Open any `.html` file in a browser, or host the folder on any static host.

## Structure

```
index.html              Home
search.html             Course search / listing
course-details.html     Course — About tab
course-lessons.html     Course — Lessons tab
course-reviews.html     Course — Reviews tab
creator-profile.html    Creator profile
login.html              Sign in
register.html           Sign up
404.html                Not found

css/base.css            Design tokens, reset, typography, header, footer, shared UI (cards, pills, widgets…)
css/<page>.css          Page-specific styles
js/components.js        <site-header> and <site-footer> Web Components (shared layout)
js/main.js              Shared behaviour: reveal-on-scroll, counters, pill filters, parallax
js/<page>.js            Page-specific behaviour (where needed)
assets/fonts            Poppins 600 + Satoshi (variable), subset WOFF2
assets/img              Images extracted from the design, optimised WebP
assets/icons            SVG icons exported from the design
tools/                  QA only (not part of the site): static server, screenshots, Lighthouse
```

## Components

The header and footer are native Web Components rendered into the light DOM, so they are
styled by `css/base.css` like regular markup. Edit them once in `js/components.js`:

```html
<site-header active="home"></site-header>     <!-- active: home | courses | creators -->
<site-header variant="minimal"></site-header>  <!-- logo only (auth pages) -->
<site-footer></site-footer>
```

`js/components.js` is loaded (not deferred) in `<head>` so the markup exists before first paint.

## QA

```bash
npm install                  # installs Lighthouse + puppeteer-core (dev only)
npm run serve                # http://localhost:4173 with brotli/gzip like a real static host
npm run lighthouse           # mobile + desktop Lighthouse for every page → reports/
npm run screenshots          # full-page captures → screenshots/
npm run qa                   # overflow at 7 breakpoints, console errors, broken images, dead links
```

Current results: every page scores **100 / 100 / 100 / 100** (Performance, Accessibility,
Best Practices, SEO) on both mobile and desktop, and matches its PDF within 1px at 1440px
with identical page heights.

## Notes

- Forms (search, newsletter, sign in / sign up, filters, pagination) are handled entirely on
  the client — there is no backend.
- When opening files directly (`file://`) browsers ignore the font `preload` hints (CORS),
  but the fonts still load through CSS. Serve the folder over HTTP for production.
- If your host serves `404.html` for nested URLs, add `<base href="/">` to it (paths are relative).

## Fonts

- Poppins 600 — SIL Open Font License (Google Fonts)
- Satoshi — Fontshare Free Font License (`assets/fonts/FFL.txt`)
=======
# ByteSpace-New
"Built 'ByteSpace New' landing page for Doin Tech assessment using React, Tailwind CSS &amp; Vite. It features a pixel-perfect, responsive UI with reusable components, clean code &amp; modern glassmorphism. Followed strict Git branching (PR to main) &amp; deployed the live project on Vercel successfully."
>>>>>>> 17cd9488b426b8284b08e70467dc61c77c12c4ed
