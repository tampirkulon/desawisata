# Web App Performance & Runtime Responsiveness Optimization — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate runtime micro-lags, font blocking, and navigation delay by replacing Tailwind browser CDN runtime with build-time CSS compilation, removing duplicate CSS `@import` fonts, adding smooth router progress indicators, and preloading key hero assets.

**Architecture:** 
1. Install `@tailwindcss/vite` and `tailwindcss` v4 (or Tailwind CLI) so Vite builds static CSS at compile time instead of running JS JIT CDN in browser.
2. Remove `<script src="https://cdn.tailwindcss.com">` from `index.html` and move custom theme tokens into CSS variables / `@theme` directive in `index.css`.
3. Remove redundant `@import url(...)` in `src/styles/index.css`.
4. Update `src/utils/router.js` to show an instant top loading bar / spinner feedback during async route transitions.
5. Add `decoding="async"` and `loading="lazy"` attributes across public image renders, plus `fetchpriority="high"` for hero image.

**Tech Stack:** Vite v6, `@tailwindcss/vite` / Tailwind CSS v4, Vanilla JS Router

## Global Constraints

- Must preserve all existing Tailwind classes, custom color names (`primary`, `surface-container-low`, `donezo-bg`, etc.), and fonts (`Outfit`, `Inter`).
- Zero breaking changes to existing public or admin routes.
- Must result in 100% clean production build (`npx vite build`).

---

### Task 1: Replace Tailwind Browser CDN with Vite Tailwind Plugin & Clean Font Imports

**Files:**
- Modify: `package.json`
- Create: `tailwind.config.js` or update `src/styles/index.css`
- Modify: `vite.config.js`
- Modify: `index.html` (remove script `cdn.tailwindcss.com` and inline config script)
- Modify: `src/styles/index.css` (remove `@import` on line 1)

**Interfaces:**
- Produces: Compiled static CSS bundle via Vite, zero runtime JIT JS parsing in browser

- [ ] **Step 1: Install `@tailwindcss/vite` and `tailwindcss`**

Run: `npm install -D @tailwindcss/vite tailwindcss`

- [ ] **Step 2: Update `vite.config.js` to include `@tailwindcss/vite` plugin**

```js
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss()
  ],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
```

- [ ] **Step 3: Update `src/styles/index.css` with `@import "tailwindcss";` and custom `@theme` tokens**

Remove `@import url('https://fonts.googleapis.com...');` on line 1 of `src/styles/index.css`.
Add Tailwind import and custom theme variables at top of `src/styles/index.css`:

```css
@import "tailwindcss";

@theme {
  --color-primary: #316342;
  --color-primary-container: #4a7c59;
  --color-on-primary: #ffffff;
  --color-on-primary-container: #e1ffe5;
  --color-primary-fixed: #b9efc5;
  --color-primary-fixed-dim: #9dd3aa;
  --color-secondary: #7a5900;
  --color-secondary-container: #fdce6c;
  --color-on-secondary: #ffffff;
  --color-tertiary: #306345;
  --color-tertiary-container: #497c5c;
  --color-tertiary-fixed: #c8f085;
  --color-background: #fcf9f8;
  --color-on-background: #1c1b1b;
  --color-surface: #fcf9f8;
  --color-surface-dim: #dcd9d9;
  --color-surface-variant: #e5e2e1;
  --color-surface-container-lowest: #ffffff;
  --color-surface-container-low: #f6f3f2;
  --color-surface-container: #f0eded;
  --color-surface-container-high: #eae7e7;
  --color-surface-container-highest: #e5e2e1;
  --color-on-surface: #1c1b1b;
  --color-on-surface-variant: #414942;
  --color-outline: #717971;
  --color-outline-variant: #c1c9bf;
  --color-error: #ba1a1a;
  --color-error-container: #ffdad6;
  
  --font-display-lg: "Outfit", sans-serif;
  --font-headline-md: "Outfit", sans-serif;
  --font-title-lg: "Outfit", sans-serif;
  --font-body-md: "Inter", sans-serif;
  --font-body-sm: "Inter", sans-serif;
  --font-label-caps: "Inter", sans-serif;
}
```

- [ ] **Step 4: Clean up `index.html`**

Remove:
- `<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>`
- `<script id="tailwind-config">...</script>`

- [ ] **Step 5: Test Vite build**

Run: `npx vite build 2>&1`
Expected: Build passes, generating compiled CSS bundle without CDN dependency.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json vite.config.js index.html src/styles/index.css
git commit -m "perf: replace tailwind browser cdn with vite tailwind plugin and clean font imports"
```

---

### Task 2: Instant Navigation Progress Bar & Router Optimization

**Files:**
- Modify: `src/utils/router.js`

**Interfaces:**
- Produces: Instant visual feedback (top progress bar) on route click before async data loading completes

- [ ] **Step 1: Add Top Progress Bar element & methods to Router**

In `src/utils/router.js`:
Add top loading bar animation methods: `_showLoadingBar()` and `_hideLoadingBar()`.

```js
class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.container = null;
    this.progressBar = this._createProgressBar();

    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('DOMContentLoaded', () => this.handleRoute());
  }

  _createProgressBar() {
    const bar = document.createElement('div');
    bar.id = 'router-progress-bar';
    bar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0%;
      height: 3px;
      background: linear-gradient(90deg, #316342, #4ade80);
      z-index: 99999;
      transition: width 0.2s ease, opacity 0.3s ease;
      opacity: 0;
      pointer-events: none;
      box-shadow: 0 0 8px rgba(74, 222, 128, 0.6);
    `;
    document.body.appendChild(bar);
    return bar;
  }

  _startLoading() {
    if (!this.progressBar) return;
    this.progressBar.style.opacity = '1';
    this.progressBar.style.width = '30%';
  }

  _finishLoading() {
    if (!this.progressBar) return;
    this.progressBar.style.width = '100%';
    setTimeout(() => {
      this.progressBar.style.opacity = '0';
      setTimeout(() => {
        this.progressBar.style.width = '0%';
      }, 300);
    }, 200);
  }

  async handleRoute() {
    if (!this.container) return;

    let hash = window.location.hash || '#/';
    let [path, queryString] = hash.split('?');
    const queryParams = new URLSearchParams(queryString || '');

    const routeConfig = this.routes[path] || this.routes['#/'];
    if (routeConfig) {
      this.currentRoute = path;
      this._startLoading();

      try {
        const content = await routeConfig.handler(queryParams);
        
        if (content instanceof HTMLElement) {
          this.container.innerHTML = '';
          this.container.appendChild(content);
        } else if (typeof content === 'string') {
          this.container.innerHTML = content;
        }
      } catch (err) {
        console.error('Error rendering route:', err);
        this.container.innerHTML = `
          <div style="padding: 40px; text-align: center; font-family: sans-serif;">
            <h2 style="color: #dc2626; margin-bottom: 12px;">Terjadi Kesalahan Memuat Halaman</h2>
            <p style="color: #4b5563; margin-bottom: 20px;">${err.message || err}</p>
            <a href="#/" style="display: inline-block; background: #316342; color: white; padding: 10px 20px; border-radius: 9999px; text-decoration: none; font-weight: bold;">Kembali ke Beranda</a>
          </div>
        `;
      } finally {
        this._finishLoading();
      }

      window.scrollTo(0, 0);
    }
  }
}
```

- [ ] **Step 2: Verify build**

Run: `npx vite build 2>&1`
Expected: Build passes cleanly.

- [ ] **Step 3: Commit**

```bash
git add src/utils/router.js
git commit -m "perf(router): add instant top progress bar for smooth async route transitions"
```

---

### Task 3: Image Decoding & Preload Optimizations

**Files:**
- Modify: `index.html` (add font & key asset preloads)
- Modify: `src/pages/beranda.js`, `src/pages/destinasi.js`, `src/pages/galeri.js` (add `decoding="async"` & `loading="lazy"`)

**Interfaces:**
- Produces: Faster image decoding and zero main-thread render stalls during image loading

- [ ] **Step 1: Add preconnect & preload hints in `index.html`**

Ensure `index.html` has:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://images.unsplash.com">
```

- [ ] **Step 2: Add `decoding="async"` and `loading="lazy"` to public page image renderers**

Update image tags across public pages (`beranda.js`, `destinasi.js`, `galeri.js`, `paket.js`, `blog.js`) to include `decoding="async"` and `loading="lazy"`.

- [ ] **Step 3: Test production build & verify**

Run: `npx vite build 2>&1`

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "perf(media): add preconnect hints and async image decoding for smoother scrolling"
```
