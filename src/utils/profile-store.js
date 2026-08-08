import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { mockData } from '../data/seed.js';

const STORAGE_KEY = 'desa_wisata_profil';
const EXTRA_STORAGE_KEY = 'desa_wisata_profil_extra';

/**
 * Get profile data synchronously from memory and localStorage fallback.
 */
export const getProfilDesaSync = () => {
  const base = { ...mockData.profil_desa };

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (saved && typeof saved === 'object') {
      Object.assign(base, saved);
    }

    const extra = JSON.parse(localStorage.getItem(EXTRA_STORAGE_KEY) || '{}');
    if (extra.banner_url) base.banner_url = extra.banner_url;
    if (extra.logo_url) base.logo_url = extra.logo_url;
  } catch (err) {
    console.warn('Error loading cached profile:', err);
  }

  return base;
};

/**
 * Asynchronously fetch profile data with multi-layer fallback & Supabase sync.
 */
export const getProfilDesa = async () => {
  const profil = getProfilDesaSync();

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('profil_desa')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data && !error) {
        Object.assign(profil, data);
        Object.assign(mockData.profil_desa, data);

        // Keep localStorage synchronized
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(profil));
          if (data.banner_url || data.logo_url) {
            localStorage.setItem(EXTRA_STORAGE_KEY, JSON.stringify({
              banner_url: data.banner_url || profil.banner_url || '',
              logo_url: data.logo_url || profil.logo_url || ''
            }));
          }
        } catch (_) {}
      }
    } catch (err) {
      console.warn('Supabase profile fetch error, using local cache:', err);
    }
  }

  return profil;
};

/**
 * Save updated profile data to memory, localStorage, and Supabase.
 */
export const saveProfilDesa = async (payload) => {
  const current = getProfilDesaSync();
  const merged = { ...current, ...payload };

  // 1. Update in-memory seed object
  Object.assign(mockData.profil_desa, merged);

  // 2. Persist to localStorage
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    localStorage.setItem(EXTRA_STORAGE_KEY, JSON.stringify({
      banner_url: merged.banner_url || '',
      logo_url: merged.logo_url || ''
    }));
  } catch (e) {
    console.warn('Failed to save profile to localStorage:', e);
  }

  // 3. Dispatch global event for immediate reactivity across open tabs/views
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('desa-profil-updated', { detail: merged }));
  }

  // 4. Sync to Supabase if configured
  if (isSupabaseConfigured() && supabase) {
    try {
      if (merged.id) {
        const { error } = await supabase
          .from('profil_desa')
          .update(payload)
          .eq('id', merged.id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('profil_desa')
          .upsert([payload])
          .select();

        if (error) throw error;
        if (data && data[0] && data[0].id) {
          merged.id = data[0].id;
          mockData.profil_desa.id = data[0].id;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        }
      }
    } catch (err) {
      console.warn('Primary Supabase save failed, attempting sanitized fallback:', err);
      // Fallback in case remote schema is missing specific columns
      if (err.message && (err.message.includes('logo_url') || err.message.includes('banner_url') || err.message.includes('schema cache'))) {
        const sanitized = { ...payload };
        delete sanitized.logo_url;
        delete sanitized.banner_url;

        if (merged.id) {
          await supabase.from('profil_desa').update(sanitized).eq('id', merged.id);
        } else {
          await supabase.from('profil_desa').upsert([sanitized]);
        }
      } else {
        throw err;
      }
    }
  }

  return merged;
};
