import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { mockData } from '../data/seed.js';

const STORAGE_KEY = 'desa_wisata_profil';
const EXTRA_STORAGE_KEY = 'desa_wisata_profil_extra';

/**
 * Robust converter for Google Maps inputs (Handles regular URLs, place links, query links, coords, or iframe embed code).
 */
export const formatGoogleMapsEmbed = (input) => {
  if (!input?.trim()) return '';

  const trimmed = input.trim();

  // 1. If it's already an iframe tag
  if (trimmed.includes('<iframe')) {
    const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);

    if (srcMatch?.[1]) {
      return `<iframe class="w-full h-full border-0 rounded-xl" src="${srcMatch[1]}" loading="lazy" allowfullscreen></iframe>`;
    }

    return trimmed.replace('<iframe', '<iframe class="w-full h-full border-0 rounded-xl"');
  }

  // 2. If it's already a google embed URL
  if (trimmed.includes('output=embed') || trimmed.includes('/embed')) {
    return `<iframe class="w-full h-full border-0 rounded-xl" src="${trimmed}" loading="lazy" allowfullscreen></iframe>`;
  }

  // 3. Extract exact pin lat/lng from Google Maps data string (!3d... !4d...)
  const pinMatch = trimmed.match(/!3d(-?\d+(?:\.\d+)?)(?:!4d(-?\d+(?:\.\d+)?))/);

  if (pinMatch?.[1] && pinMatch?.[2]) {
    const lat = pinMatch[1];
    const lng = pinMatch[2];
    return `<iframe class="w-full h-full border-0 rounded-xl" src="https://maps.google.com/maps?q=${lat},${lng}&hl=id&z=16&output=embed" loading="lazy" allowfullscreen></iframe>`;
  }

  // 4. Extract @lat,lng from URL
  const atMatch = trimmed.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);

  if (atMatch?.[1] && atMatch?.[2]) {
    const lat = atMatch[1];
    const lng = atMatch[2];
    return `<iframe class="w-full h-full border-0 rounded-xl" src="https://maps.google.com/maps?q=${lat},${lng}&hl=id&z=16&output=embed" loading="lazy" allowfullscreen></iframe>`;
  }

  // 5. Extract place name from /place/PlaceName
  const placeMatch = trimmed.match(/\/place\/([^/@?#]+)/);

  if (placeMatch?.[1]) {
    const placeName = decodeURIComponent(placeMatch[1].replaceAll('+', ' '));
    return `<iframe class="w-full h-full border-0 rounded-xl" src="https://maps.google.com/maps?q=${encodeURIComponent(placeName)}&hl=id&z=16&output=embed" loading="lazy" allowfullscreen></iframe>`;
  }

  // 6. If it contains ?q=query
  const qMatch = trimmed.match(/[?&]q=([^&#]+)/);

  if (qMatch?.[1]) {
    const query = decodeURIComponent(qMatch[1].replaceAll('+', ' '));
    return `<iframe class="w-full h-full border-0 rounded-xl" src="https://maps.google.com/maps?q=${encodeURIComponent(query)}&hl=id&z=16&output=embed" loading="lazy" allowfullscreen></iframe>`;
  }

  // 7. General URL fallback: convert to query search embed
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return `<iframe class="w-full h-full border-0 rounded-xl" src="https://maps.google.com/maps?q=${encodeURIComponent(trimmed)}&hl=id&z=15&output=embed" loading="lazy" allowfullscreen></iframe>`;
  }

  // 8. Plain text address or coords
  return `<iframe class="w-full h-full border-0 rounded-xl" src="https://maps.google.com/maps?q=${encodeURIComponent(trimmed)}&hl=id&z=15&output=embed" loading="lazy" allowfullscreen></iframe>`;
};

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
    if (extra.footer_deskripsi) base.footer_deskripsi = extra.footer_deskripsi;
    if (extra.footer_deskripsi_en) base.footer_deskripsi_en = extra.footer_deskripsi_en;
    if (extra.footer_copyright) base.footer_copyright = extra.footer_copyright;
    if (extra.footer_show_social !== undefined) base.footer_show_social = extra.footer_show_social;
    if (extra.footer_quick_links) base.footer_quick_links = extra.footer_quick_links;
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
            localStorage.setItem(
              EXTRA_STORAGE_KEY,
              JSON.stringify({
                banner_url: data.banner_url || profil.banner_url || '',
                logo_url: data.logo_url || profil.logo_url || '',
              })
            );
          }
        } catch (storageErr) {
          // Ignore localStorage errors (e.g., quota exceeded or private browsing mode)
          console.debug('Failed to cache profile extra details to localStorage:', storageErr);
        }
      }
    } catch (err) {
      console.warn('Supabase profile fetch error, using local cache:', err);
    }
  }

  return profil;
};


/** Saves profile data to local storage and dispatches update event. @private */
const _persistProfileLocally = (merged) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    localStorage.setItem(
      EXTRA_STORAGE_KEY,
      JSON.stringify({
        banner_url: merged.banner_url || '',
        logo_url: merged.logo_url || '',
      })
    );
  } catch (e) {
    console.warn('Failed to save profile to localStorage:', e);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('desa-profil-updated', { detail: merged }));
  }
};

/** Handles Supabase fallback logic for schema cache or missing column errors. @private */
const _syncFallbackToSupabase = async (payload, mergedId) => {
  const sanitized = { ...payload };
  delete sanitized.logo_url;
  delete sanitized.banner_url;

  if (mergedId) {
    await supabase.from('profil_desa').update(sanitized).eq('id', mergedId);
  } else {
    await supabase.from('profil_desa').upsert([sanitized]);
  }
};

/** Syncs profile payload directly to Supabase. @private */
const _syncToSupabase = async (payload, merged) => {
  if (!isSupabaseConfigured() || !supabase) return;

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

      if (data?.[0]?.id) {
        merged.id = data[0].id;
        mockData.profil_desa.id = data[0].id;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      }
    }
  } catch (err) {
    console.warn('Primary Supabase save failed, attempting sanitized fallback:', err);

    const isSchemaError = err.message && (
      err.message.includes('logo_url') ||
      err.message.includes('banner_url') ||
      err.message.includes('schema cache')
    );

    if (isSchemaError) {
      await _syncFallbackToSupabase(payload, merged.id);
    } else {
      throw err;
    }
  }
};

/**
 * Save updated profile data to memory, localStorage, and Supabase.
 */
export const saveProfilDesa = async (payload) => {
  const current = getProfilDesaSync();
  const merged = { ...current, ...payload };

  // 1. Update in-memory state
  Object.assign(mockData.profil_desa, merged);

  // 2. Persist to localStorage & trigger event
  _persistProfileLocally(merged);

  // 3. Sync to Supabase
  await _syncToSupabase(payload, merged);

  return merged;
};
