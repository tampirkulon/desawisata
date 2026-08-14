// Hash-based SPA Router for Desa Wisata Tampirkulon with Instant Progress Bar Feedback

class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.container = null;
    this.progressBar = null;
    
    if (typeof window !== 'undefined') {
      window.addEventListener('hashchange', () => this.handleRoute());
      window.addEventListener('DOMContentLoaded', () => this.handleRoute());
    }
  }

  init(containerId) {
    if (typeof document === 'undefined') return;
    this.container = document.getElementById(containerId);
    this._ensureProgressBar();
    this.handleRoute();
  }

  _ensureProgressBar() {
    if (!this.progressBar) {
      let bar = document.getElementById('router-progress-bar');
      if (!bar) {
        bar = document.createElement('div');
        bar.id = 'router-progress-bar';
        bar.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 0%;
          height: 3px;
          background: linear-gradient(90deg, #316342 0%, #4ade80 50%, #facc15 100%);
          z-index: 99999;
          transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
          opacity: 0;
          pointer-events: none;
          box-shadow: 0 0 10px rgba(74, 222, 128, 0.8);
        `;
        document.body.appendChild(bar);
      }
      this.progressBar = bar;
    }
  }

  _startProgress() {
    this._ensureProgressBar();
    if (this.progressBar) {
      this.progressBar.style.transition = 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease';
      this.progressBar.style.opacity = '1';
      this.progressBar.style.width = '35%';
    }
  }

  _finishProgress() {
    if (this.progressBar) {
      this.progressBar.style.width = '100%';
      setTimeout(() => {
        if (this.progressBar) {
          this.progressBar.style.opacity = '0';
          setTimeout(() => {
            if (this.progressBar) this.progressBar.style.width = '0%';
          }, 300);
        }
      }, 200);
    }
  }

  addRoute(path, handler, isProtected = false) {
    this.routes[path] = { handler, isProtected };
  }

  _extractRouteAndParams(rawHash) {
    let hash = (rawHash || '#/').trim();
    if (!hash.startsWith('#')) {
      hash = '#' + hash;
    }

    // Special case: Supabase auth recovery tokens (e.g. #access_token=...&type=recovery or #type=recovery)
    if (
      (hash.includes('type=recovery') || hash.includes('type=invite') || hash.includes('type=magiclink')) &&
      !hash.startsWith('#/admin/reset-password')
    ) {
      return {
        path: '#/admin/reset-password',
        queryParams: new URLSearchParams(hash.replace(/^#\/?/, '').replaceAll('#', '&'))
      };
    }

    let path = hash;
    let queryPart = '';

    if (path.startsWith('#/')) {
      const delimMatch = path.substring(2).search(/[?&#]/);
      if (delimMatch !== -1) {
        const cutIdx = 2 + delimMatch;
        queryPart = path.substring(cutIdx + 1);
        path = path.substring(0, cutIdx);
      }
    } else {
      const delimMatch = path.search(/[?&#]/);
      if (delimMatch !== -1) {
        queryPart = path.substring(delimMatch + 1);
        path = path.substring(0, delimMatch);
      }
    }

    if (!path.startsWith('#/')) {
      path = '#/' + path.replace(/^#+/, '');
    }

    const queryParams = new URLSearchParams();
    if (queryPart) {
      const normalizedQuery = queryPart.replaceAll('#', '&');
      const parsed = new URLSearchParams(normalizedQuery);
      parsed.forEach((val, key) => queryParams.set(key, val));
    }

    return { path, queryParams };
  }

  async handleRoute() {
    if (!this.container) return;

    const rawHash = typeof window !== 'undefined' ? window.location.hash : '#/';
    const { path, queryParams } = this._extractRouteAndParams(rawHash);

    const routeConfig = this.routes[path] || this.routes['#/'];
    
    if (routeConfig) {
      this.currentRoute = path;
      this._startProgress();
      
      try {
        // Execute route handler
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
        this._finishProgress();
      }
      
      // Scroll to top
      if (typeof window !== 'undefined') {
        window.scrollTo(0, 0);
      }
    }
  }

  navigate(path) {
    if (typeof window !== 'undefined') {
      window.location.hash = path;
    }
  }
}

export const router = new Router();
