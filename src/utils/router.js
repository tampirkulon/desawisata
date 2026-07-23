// Hash-based SPA Router for Desa Wisata Tampirkulon

class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.container = null;
    
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('DOMContentLoaded', () => this.handleRoute());
  }

  init(containerId) {
    this.container = document.getElementById(containerId);
    this.handleRoute();
  }

  addRoute(path, handler, isProtected = false) {
    this.routes[path] = { handler, isProtected };
  }

  async handleRoute() {
    if (!this.container) return;

    let hash = window.location.hash || '#/';
    let [path, queryString] = hash.split('?');

    // Parse query params
    const queryParams = new URLSearchParams(queryString || '');

    const routeConfig = this.routes[path] || this.routes['#/'];
    
    if (routeConfig) {
      this.currentRoute = path;
      
      // Execute route handler
      const content = await routeConfig.handler(queryParams);
      
      if (content instanceof HTMLElement) {
        this.container.innerHTML = '';
        this.container.appendChild(content);
      } else if (typeof content === 'string') {
        this.container.innerHTML = content;
      }
      
      // Scroll to top
      window.scrollTo(0, 0);
    }
  }

  navigate(path) {
    window.location.hash = path;
  }
}

export const router = new Router();
