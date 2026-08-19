import idLocale from '../locales/id.js';
import enLocale from '../locales/en.js';

const STORAGE_KEY = 'app_language';
const SUPPORTED_LANGUAGES = ['id', 'en'];
const DEFAULT_LANGUAGE = 'id';

const locales = {
  id: idLocale,
  en: enLocale
};

let currentLanguage = null;

/**
 * Detect initial language preference from localStorage or navigator
 */
export function initLanguage() {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED_LANGUAGES.includes(saved)) {
      return saved;
    }

    const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    if (browserLang.startsWith('en')) {
      return 'en';
    }
  } catch (e) {
    console.warn('Unable to access localStorage for language preference:', e);
  }

  return DEFAULT_LANGUAGE;
}

/**
 * Get active language code ('id' | 'en')
 */
export function getLanguage() {
  if (!currentLanguage) {
    currentLanguage = initLanguage();
  }
  return currentLanguage;
}

/**
 * Set active language and trigger reactivity
 * @param {'id' | 'en'} lang
 */
export function setLanguage(lang) {
  if (!SUPPORTED_LANGUAGES.includes(lang)) return;

  currentLanguage = lang;

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      console.warn('Unable to save language to localStorage:', e);
    }

    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.setAttribute('lang', lang);
    }

    window.dispatchEvent(
      new CustomEvent('app:language-change', {
        detail: { language: lang }
      })
    );
  }
}

/**
 * Resolve a nested key from dictionary (e.g. 'beranda.hero_title')
 * @param {object} obj
 * @param {string} keyPath
 */
function resolveKey(obj, keyPath) {
  if (!obj || !keyPath) return undefined;
  const parts = keyPath.split('.');
  let curr = obj;
  for (const part of parts) {
    if (curr && typeof curr === 'object' && part in curr) {
      curr = curr[part];
    } else {
      return undefined;
    }
  }
  return curr;
}

/**
 * Translate a key into the active language with optional parameter interpolation
 * @param {string} key Dot notation key e.g. 'nav.beranda'
 * @param {Record<string, any>} [params]
 * @returns {string}
 */
export function t(key, params = {}) {
  const lang = getLanguage();
  const dict = locales[lang] || locales[DEFAULT_LANGUAGE];

  let value = resolveKey(dict, key);

  // Fallback to default language dictionary if missing in target
  if (value === undefined && lang !== DEFAULT_LANGUAGE) {
    value = resolveKey(locales[DEFAULT_LANGUAGE], key);
  }

  // Fallback to key if still unresolved
  if (value === undefined) {
    return key;
  }

  if (typeof value !== 'string') {
    return value;
  }

  // Parameter replacement: {name} -> params.name
  if (params && typeof params === 'object') {
    return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
      return params[paramKey] !== undefined ? params[paramKey] : match;
    });
  }

  return value;
}

/**
 * Extract localized field from an object with smart fallback to Indonesian
 * @param {object} item Data object (e.g. destinasi, artikel, paket_wisata)
 * @param {string} fieldName Base field name (e.g. 'nama', 'deskripsi', 'fasilitas')
 * @returns {any}
 */
export function getLocalizedField(item, fieldName) {
  if (!item || typeof item !== 'object') return '';

  const lang = getLanguage();
  if (lang === 'en') {
    const enVal = item[`${fieldName}_en`];
    if (Array.isArray(enVal) && enVal.length > 0) {
      return enVal;
    }
    if (typeof enVal === 'string' && enVal.trim() !== '') {
      return enVal;
    }
    if (enVal !== undefined && enVal !== null && typeof enVal !== 'string') {
      return enVal;
    }
  }

  const baseVal = item[fieldName];
  if (baseVal !== undefined && baseVal !== null) {
    return baseVal;
  }

  return Array.isArray(baseVal) ? [] : '';
}
