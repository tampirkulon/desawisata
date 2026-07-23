// Footer Component matching Stitch UI

export const renderFooter = (profilData = {}) => {
  const currentYear = new Date().getFullYear();
  const namaDesa = profilData.nama_desa || 'Desa Wisata Tampirkulon';
  const alamat = profilData.alamat || 'Jl. Raya Tampirkulon No. 123, Candimulyo, Magelang, Jawa Tengah';
  const telepon = profilData.telepon || '+62 812-3456-7890';
  const email = profilData.email || 'info@tampirkulon.desa.id';

  return `
    <footer class="bg-primary-container text-on-primary w-full border-t border-outline-variant/20 mt-auto">
      <div class="py-12 px-4 md:px-16 max-w-container-max mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <!-- Column 1: About -->
          <div class="flex flex-col gap-4">
            <div class="font-display-lg text-2xl font-bold text-tertiary-fixed">
              ${namaDesa}
            </div>
            <p class="text-on-primary-container font-body-sm text-sm leading-relaxed">
              Desa Wisata Tampirkulon adalah destinasi yang memadukan keindahan alam pegunungan dengan kearifan lokal yang kental. Kami berkomitmen untuk melestarikan warisan budaya dan alam demi masa depan yang berkelanjutan.
            </p>
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
        <div class="pt-8 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="text-on-primary-container/70 font-body-sm text-xs">
            © ${currentYear} ${namaDesa}. Hak Cipta Dilindungi.
          </div>
          <div class="flex gap-6">
            <a href="#/admin/login" class="text-on-primary-container/70 hover:text-tertiary-fixed transition-colors font-body-sm text-xs">Admin Login</a>
          </div>
        </div>
      </div>
    </footer>
  `;
};
