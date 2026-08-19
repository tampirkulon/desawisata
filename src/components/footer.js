import { IconInstagram, IconYouTube, IconWhatsApp } from './icons.js';
import { getProfilDesaSync } from '../utils/profile-store.js';
import { t, getLanguage, getLocalizedField } from '../utils/i18n.js';

// All available quick links with dynamic localization
const getQuickLinks = () => [
  { key: 'beranda', hash: '#/', label: t('nav.beranda') },
  { key: 'destinasi', hash: '#/destinasi', label: t('nav.destinasi') },
  { key: 'paket', hash: '#/paket', label: t('nav.paket') },
  { key: 'profil', hash: '#/profil', label: t('nav.profil') },
  { key: 'galeri', hash: '#/galeri', label: t('nav.galeri') },
  { key: 'blog', hash: '#/blog', label: t('nav.blog') },
];

/**
 * Normalizes URL for social media links to prevent broken href targets.
 * @private
 */
const _resolveSocialUrl = (value, baseUrl, prefixToRemove) => {
  if (!value) return '';
  if (value.startsWith('http')) return value;
  const cleanHandle = prefixToRemove ? value.replace(prefixToRemove, '') : value;
  return `${baseUrl}${cleanHandle}`;
};

/**
 * Resolves link hrefs and display settings for footer contacts and quick links.
 * @private
 */
const _getFooterData = (profilData) => {
  const profil = profilData && Object.keys(profilData).length > 0 ? profilData : getProfilDesaSync();
  const allLinks = getQuickLinks();

  const whatsapp = profil.whatsapp || profil.telepon || '';
  const waClean = whatsapp.replace(/\D/g, '').replace(/^0/, '62');

  const activeKeys = Array.isArray(profil.footer_quick_links) && profil.footer_quick_links.length > 0
    ? profil.footer_quick_links
    : allLinks.map((l) => l.key);

  const localizedDesc = getLocalizedField(profil, 'footer_deskripsi') || t('footer.deskripsi');

  const currentYear = String(new Date().getFullYear());
  const copyrightPattern = getLocalizedField(profil, 'footer_copyright') || t('footer.copyright');
  const copyrightText = copyrightPattern
    .replace('{year}', currentYear)
    .replace('{nama_desa}', profil.nama_desa || 'Desa Wisata Tampirkulon');

  return {
    profil,
    namaDesa: profil.nama_desa || 'Desa Wisata Tampirkulon',
    alamat: profil.alamat || 'Jl. Raya Candimulyo No. 12, Tampirkulon, Candimulyo, Magelang',
    telepon: profil.telepon || '+62 812-3456-7890',
    whatsapp,
    email: profil.email || 'info@tampirkulon.desawisata.id',
    footerDeskripsi: localizedDesc,
    jamOperasional: profil.jam_operasional || t('footer.operasional_text'),
    showSocial: profil.footer_show_social !== undefined ? Boolean(profil.footer_show_social) : (profil.show_footer_social !== false),
    copyrightText,
    instagramLink: _resolveSocialUrl(profil.instagram?.trim(), 'https://instagram.com/', /^@/),
    youtubeLink: _resolveSocialUrl(profil.youtube?.trim(), 'https://youtube.com/'),
    waLink: waClean ? `https://wa.me/${waClean}` : '',
    telLink: profil.telepon ? `tel:${profil.telepon.replace(/\D/g, '')}` : '',
    emailLink: profil.email?.trim() ? `mailto:${profil.email.trim()}` : '',
    displayedLinks: allLinks.filter((link) => activeKeys.includes(link.key)),
  };
};

export const renderFooter = (profilData = null) => {
  const d = _getFooterData(profilData);
  const isEn = getLanguage() === 'en';

  const instagramHtml = d.instagramLink
    ? `<a href="${d.instagramLink}" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-tertiary-fixed flex items-center justify-center transition-all hover:scale-105" title="Instagram">
        ${IconInstagram('w-4 h-4 fill-current')}
      </a>`
    : '';

  const youtubeHtml = d.youtubeLink
    ? `<a href="${d.youtubeLink}" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-tertiary-fixed flex items-center justify-center transition-all hover:scale-105" title="YouTube">
        ${IconYouTube('w-4 h-4 fill-current')}
      </a>`
    : '';

  const waHtml = d.waLink
    ? `<a href="${d.waLink}" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-tertiary-fixed flex items-center justify-center transition-all hover:scale-105" title="WhatsApp">
        ${IconWhatsApp('w-4 h-4 fill-current')}
      </a>`
    : '';

  const socialContainerHtml = d.showSocial
    ? `<div class="flex items-center gap-3 mt-2">
        ${instagramHtml}
        ${youtubeHtml}
        ${waHtml}
      </div>`
    : '';

  return `
    <footer class="bg-primary-container text-on-primary w-full border-t border-outline-variant/20 mt-auto">
      <div class="py-12 px-4 sm:px-6 md:px-12 max-w-container-max mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <!-- Column 1: About & Social -->
          <div class="flex flex-col gap-4">
            <div class="font-display-lg text-2xl font-bold text-tertiary-fixed">
              ${d.namaDesa}
            </div>
            <p class="text-on-primary-container font-body-sm text-sm leading-relaxed whitespace-pre-line">
              ${d.footerDeskripsi}
            </p>
            ${socialContainerHtml}
          </div>

          <!-- Column 2: Navigation Links -->
          <div class="flex flex-col gap-4">
            <h4 class="font-title-lg text-lg text-tertiary-fixed font-semibold">${t('footer.quick_links')}</h4>
            <ul class="flex flex-col gap-2.5 list-none p-0 m-0">
              ${d.displayedLinks.map((link) => `
                <li>
                  <a href="${link.hash}" class="text-on-primary-container hover:text-tertiary-fixed transition-colors text-sm font-medium inline-flex items-center gap-2">
                    <span class="text-tertiary-fixed/60 text-xs">›</span>
                    ${link.label}
                  </a>
                </li>
              `).join('')}
            </ul>
          </div>

          <!-- Column 3: Contact (Dynamically Connected to Profile Settings) -->
          <div class="flex flex-col gap-4">
            <h4 class="font-title-lg text-lg text-tertiary-fixed font-semibold">${t('footer.kontak_kami')}</h4>
            <ul class="flex flex-col gap-3 list-none p-0 m-0">
              ${d.alamat ? `
                <li class="flex items-start gap-3 text-on-primary-container font-body-sm text-sm">
                  <span class="material-symbols-outlined text-tertiary-fixed text-lg mt-0.5 shrink-0">location_on</span>
                  <span class="leading-relaxed">${d.alamat}</span>
                </li>
              ` : ''}
              ${d.whatsapp ? `
                <li class="flex items-center gap-3 text-on-primary-container font-body-sm text-sm">
                  <span class="material-symbols-outlined text-tertiary-fixed text-lg shrink-0">chat</span>
                  <a href="${d.waLink}" target="_blank" rel="noopener noreferrer" class="text-on-primary-container hover:text-tertiary-fixed transition-colors font-medium">
                    ${d.whatsapp} (WhatsApp)
                  </a>
                </li>
              ` : ''}
              ${d.telepon && d.telepon !== d.whatsapp ? `
                <li class="flex items-center gap-3 text-on-primary-container font-body-sm text-sm">
                  <span class="material-symbols-outlined text-tertiary-fixed text-lg shrink-0">call</span>
                  <a href="${d.telLink}" class="text-on-primary-container hover:text-tertiary-fixed transition-colors font-medium">
                    ${d.telepon}
                  </a>
                </li>
              ` : ''}
              ${d.email ? `
                <li class="flex items-center gap-3 text-on-primary-container font-body-sm text-sm">
                  <span class="material-symbols-outlined text-tertiary-fixed text-lg shrink-0">mail</span>
                  <a href="${d.emailLink}" class="text-on-primary-container hover:text-tertiary-fixed transition-colors font-medium">
                    ${d.email}
                  </a>
                </li>
              ` : ''}
              ${d.jamOperasional ? `
                <li class="flex items-start gap-3 text-on-primary-container font-body-sm text-sm pt-2 border-t border-white/10 mt-1">
                  <span class="material-symbols-outlined text-tertiary-fixed text-lg mt-0.5 shrink-0">schedule</span>
                  <div class="flex flex-col">
                    <span class="text-[10px] uppercase font-bold text-tertiary-fixed tracking-wider">${t('footer.jam_operasional')}</span>
                    <span class="text-xs text-on-primary-container/90">${d.jamOperasional}</span>
                  </div>
                </li>
              ` : ''}
            </ul>
          </div>
        </div>

        <div class="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-on-primary-container/80">
          <p class="m-0">${d.copyrightText}</p>
          <a href="#/admin/login" class="text-tertiary-fixed/80 hover:text-tertiary-fixed transition-colors">${isEn ? 'Village Admin Portal' : 'Portal Pengelola Desa'}</a>
        </div>
      </div>
    </footer>
  `;
};
