// Footer Component matching Stitch UI with dynamic profile settings
import { getProfilDesaSync } from '../utils/profile-store.js';

export const renderFooter = (profilData = null) => {
  const currentYear = new Date().getFullYear();
  const profil = profilData || getProfilDesaSync();
  const namaDesa = profil.nama_desa || 'Desa Wisata Tampirkulon';
  const alamat = profil.alamat || 'Jl. Raya Candimulyo No. 12, Tampirkulon, Magelang, Jawa Tengah 56191';
  const telepon = profil.telepon || '+62 812-3456-7890';
  const email = profil.email || 'info@tampirkulon.desawisata.id';
  const tagline = profil.tagline || profil.visi || 'Desa Wisata dengan perpaduan keindahan alam pegunungan dan kearifan lokal yang lestari.';
  const instagram = profil.instagram;
  const youtube = profil.youtube;
  const whatsapp = profil.whatsapp;

  return `
    <footer class="bg-primary-container text-on-primary w-full border-t border-outline-variant/20 mt-auto">
      <div class="py-12 px-4 sm:px-6 md:px-12 max-w-container-max mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <!-- Column 1: About & Social Links -->
          <div class="flex flex-col gap-4">
            <div class="font-display-lg text-2xl font-bold text-tertiary-fixed flex items-center gap-2.5">
              ${profil.logo_url ? `<img src="${profil.logo_url}" alt="${namaDesa}" class="h-8 w-8 object-contain rounded-md bg-white/10 p-0.5" />` : ''}
              <span>${namaDesa}</span>
            </div>
            <p class="text-on-primary-container font-body-sm text-sm leading-relaxed">
              ${tagline}
            </p>
            <!-- Social Media Icons Row -->
            <div class="flex items-center gap-3 pt-2">
              ${whatsapp ? `
                <a href="https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}" target="_blank" rel="noopener noreferrer" title="WhatsApp Pengelola" class="w-9 h-9 rounded-full bg-emerald-600/30 hover:bg-emerald-600 text-white flex items-center justify-center transition-all border border-emerald-400/40">
                  <span class="material-symbols-outlined text-sm">chat</span>
                </a>
              ` : ''}
              ${instagram ? `
                <a href="${instagram.startsWith('http') ? instagram : 'https://instagram.com/' + instagram}" target="_blank" rel="noopener noreferrer" title="Instagram Resmi" class="w-9 h-9 rounded-full bg-pink-600/30 hover:bg-pink-600 text-white flex items-center justify-center transition-all border border-pink-400/40">
                  <span class="material-symbols-outlined text-sm">photo_camera</span>
                </a>
              ` : ''}
              ${youtube ? `
                <a href="${youtube.startsWith('http') ? youtube : 'https://youtube.com/' + youtube}" target="_blank" rel="noopener noreferrer" title="Channel YouTube" class="w-9 h-9 rounded-full bg-red-600/30 hover:bg-red-600 text-white flex items-center justify-center transition-all border border-red-400/40">
                  <span class="material-symbols-outlined text-sm">smart_display</span>
                </a>
              ` : ''}
            </div>
          </div>

          <!-- Column 2: Quick Links -->
          <div class="flex flex-col gap-4">
            <h4 class="font-title-lg text-lg text-tertiary-fixed font-semibold">Tautan Cepat</h4>
            <ul class="flex flex-col gap-2 list-none p-0">
              <li><a href="#/" class="text-on-primary-container font-body-sm text-sm hover:text-tertiary-fixed transition-colors">Beranda</a></li>
              <li><a href="#/destinasi" class="text-on-primary-container font-body-sm text-sm hover:text-tertiary-fixed transition-colors">Destinasi Wisata</a></li>
              <li><a href="#/paket" class="text-on-primary-container font-body-sm text-sm hover:text-tertiary-fixed transition-colors">Paket Tour</a></li>
              <li><a href="#/profil" class="text-on-primary-container font-body-sm text-sm hover:text-tertiary-fixed transition-colors">Profil Desa</a></li>
              <li><a href="#/galeri" class="text-on-primary-container font-body-sm text-sm hover:text-tertiary-fixed transition-colors">Galeri Foto</a></li>
              <li><a href="#/blog" class="text-on-primary-container font-body-sm text-sm hover:text-tertiary-fixed transition-colors">Blog Artikel</a></li>
            </ul>
          </div>

          <!-- Column 3: Contact -->
          <div class="flex flex-col gap-4">
            <h4 class="font-title-lg text-lg text-tertiary-fixed font-semibold">Kontak Kami</h4>
            <ul class="flex flex-col gap-3 list-none p-0">
              <li class="flex items-start gap-3 text-on-primary-container font-body-sm text-sm">
                <span class="material-symbols-outlined text-tertiary-fixed shrink-0 mt-0.5">location_on</span>
                <span>${alamat}</span>
              </li>
              <li class="flex items-center gap-3 text-on-primary-container font-body-sm text-sm">
                <span class="material-symbols-outlined text-tertiary-fixed shrink-0">call</span>
                <span>${telepon}</span>
              </li>
              <li class="flex items-center gap-3 text-on-primary-container font-body-sm text-sm">
                <span class="material-symbols-outlined text-tertiary-fixed shrink-0">mail</span>
                <span>${email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="pt-8 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="text-on-primary-container/70 font-body-sm text-xs">
            © ${currentYear} ${namaDesa}. Hak Cipta Dilindungi.
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
