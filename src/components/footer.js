import { IconInstagram, IconYouTube, IconWhatsApp } from './icons.js';

// All available quick links
const ALL_QUICK_LINKS = [
  { key: 'beranda', hash: '#/', label: 'Beranda' },
  { key: 'destinasi', hash: '#/destinasi', label: 'Destinasi Wisata' },
  { key: 'paket', hash: '#/paket', label: 'Paket Tour' },
  { key: 'profil', hash: '#/profil', label: 'Profil Desa' },
  { key: 'galeri', hash: '#/galeri', label: 'Galeri Foto' },
  { key: 'blog', hash: '#/blog', label: 'Blog Artikel' },
];

export const renderFooter = (profilData = {}) => {
  const currentYear = new Date().getFullYear();
  const namaDesa = profilData.nama_desa || 'Desa Wisata Tampirkulon';
  const alamat = profilData.alamat || 'Jl. Raya Tampirkulon No. 123, Candimulyo, Magelang, Jawa Tengah';
  const telepon = profilData.telepon || '+62 812-3456-7890';
  const email = profilData.email || 'info@tampirkulon.desa.id';

  // Custom description with fallback
  const footerDeskripsi = profilData.footer_deskripsi?.trim() || 
    'Desa Wisata Tampirkulon adalah destinasi yang memadukan keindahan alam pegunungan dengan kearifan lokal yang kental. Kami berkomitmen untuk melestarikan warisan budaya dan alam demi masa depan yang berkelanjutan.';

  // Custom copyright with fallback & {year} placeholder replacement
  const defaultCopyright = `© ${currentYear} ${namaDesa}. Hak Cipta Dilindungi.`;
  const rawCopyright = profilData.footer_copyright?.trim() || defaultCopyright;
  const copyrightText = rawCopyright.replace(/{year}/gi, currentYear);

  // Social media visibility & links
  const showSocial = profilData.footer_show_social !== false;
  const instagramUrl = profilData.instagram?.trim() || '';
  const youtubeUrl = profilData.youtube?.trim() || '';
  const waRaw = profilData.whatsapp?.trim() || profilData.telepon?.trim() || '';
  const waNumber = waRaw.replace(/[^0-9]/g, '').replace(/^0/, '62');
  const waUrl = waNumber ? `https://wa.me/${waNumber}` : '';

  // Filtered Quick Links
  const activeKeys = Array.isArray(profilData.footer_quick_links) && profilData.footer_quick_links.length > 0
    ? profilData.footer_quick_links
    : ALL_QUICK_LINKS.map(l => l.key);

  const displayedLinks = ALL_QUICK_LINKS.filter(link => activeKeys.includes(link.key));

  return `
    <footer class="bg-primary-container text-on-primary w-full border-t border-outline-variant/20 mt-auto">
      <div class="py-12 px-4 sm:px-6 md:px-12 max-w-container-max mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <!-- Column 1: About & Social -->
          <div class="flex flex-col gap-4">
            <div class="font-display-lg text-2xl font-bold text-tertiary-fixed">
              ${namaDesa}
            </div>
            <p class="text-on-primary-container font-body-sm text-sm leading-relaxed whitespace-pre-line">
              ${footerDeskripsi}
            </p>
            ${showSocial ? `
              <div class="flex items-center gap-3 mt-2">
                ${instagramUrl ? `
                  <a href="${instagramUrl}" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-tertiary-fixed flex items-center justify-center transition-all hover:scale-105" title="Instagram">
                    ${IconInstagram('w-4 h-4 fill-current')}
                  </a>
                ` : ''}
                ${youtubeUrl ? `
                  <a href="${youtubeUrl}" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-tertiary-fixed flex items-center justify-center transition-all hover:scale-105" title="YouTube">
                    ${IconYouTube('w-4 h-4 fill-current')}
                  </a>
                ` : ''}
                ${waUrl ? `
                  <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-tertiary-fixed flex items-center justify-center transition-all hover:scale-105" title="WhatsApp">
                    ${IconWhatsApp('w-4 h-4 fill-current')}
                  </a>
                ` : ''}
              </div>
            ` : ''}
          </div>

          <!-- Column 2: Quick Links -->
          <div class="flex flex-col gap-4">
            <h4 class="font-title-lg text-lg text-tertiary-fixed font-semibold">Tautan Cepat</h4>
            <ul class="flex flex-col gap-2 list-none p-0">
              ${displayedLinks.map(link => `
                <li><a href="${link.hash}" class="text-on-primary-container font-body-sm text-sm hover:text-tertiary-fixed transition-colors">${link.label}</a></li>
              `).join('')}
            </ul>
          </div>

          <!-- Column 3: Contact -->
          <div class="flex flex-col gap-4">
            <h4 class="font-title-lg text-lg text-tertiary-fixed font-semibold">Kontak Kami</h4>
            <ul class="flex flex-col gap-3 list-none p-0">
              <li class="flex items-start gap-3 text-on-primary-container font-body-sm text-sm">
                <span class="material-symbols-outlined text-tertiary-fixed">location_on</span>
                <span>${alamat}</span>
              </li>
              <li class="flex items-center gap-3 text-on-primary-container font-body-sm text-sm">
                <span class="material-symbols-outlined text-tertiary-fixed">call</span>
                <span>${telepon}</span>
              </li>
              <li class="flex items-center gap-3 text-on-primary-container font-body-sm text-sm">
                <span class="material-symbols-outlined text-tertiary-fixed">mail</span>
                <span>${email}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="pt-8 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="text-on-primary-container/70 font-body-sm text-xs">
            ${copyrightText}
          </div>
          <div class="flex gap-6">
            <a href="#/admin/login" class="text-on-primary-container/70 hover:text-tertiary-fixed transition-colors font-body-sm text-xs flex items-center gap-1">
              <span class="material-symbols-outlined text-xs">admin_panel_settings</span>
              <span>Portal Pengelola Desa</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  `;
};
