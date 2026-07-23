// Footer Component matching Stitch UI

export const renderFooter = (profilData = {}) => {
  const currentYear = new Date().getFullYear();
  const namaDesa = profilData.nama_desa || 'Desa Wisata Tampirkulon';
  const alamat = profilData.alamat || 'Jl. Raya Candimulyo No. 12, Tampirkulon, Candimulyo, Magelang';
  const telepon = profilData.telepon || '+62 812-3456-7890';

  return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <a href="#/" style="font-family: var(--font-display); font-size: 1.5rem; font-weight: 800; color: var(--primary); display: inline-block; margin-bottom: 12px;">
              Tampirkulon
            </a>
            <p style="font-size: 0.9rem; line-height: 1.6; color: var(--on-surface-variant); max-width: 320px; margin-bottom: 20px;">
              Memelihara kearifan budaya dan keasrian alam Jawa melalui pariwisata berkelanjutan.
            </p>
            <div style="display: flex; gap: 12px;">
              <a href="${profilData.instagram || '#'}" target="_blank" class="btn btn-sm btn-secondary" style="border-radius: 50%; width: 40px; height: 40px; padding: 0;">📸</a>
              <a href="${profilData.facebook || '#'}" target="_blank" class="btn btn-sm btn-secondary" style="border-radius: 50%; width: 40px; height: 40px; padding: 0;">📘</a>
              <a href="${profilData.youtube || '#'}" target="_blank" class="btn btn-sm btn-secondary" style="border-radius: 50%; width: 40px; height: 40px; padding: 0;">▶️</a>
            </div>
          </div>

          <div>
            <h4>Jelajahi</h4>
            <ul class="footer-links">
              <li><a href="#/destinasi">Wisata Alam</a></li>
              <li><a href="#/paket">Paket Tour Durian</a></li>
              <li><a href="#/galeri">Galeri Foto & Video</a></li>
              <li><a href="#/blog">Artikel & Berita</a></li>
            </ul>
          </div>

          <div>
            <h4>Informasi</h4>
            <ul class="footer-links">
              <li><a href="#/profil">Profil Desa</a></li>
              <li><a href="#/kontak">Kontak & Reservasi</a></li>
              <li><a href="#/admin/login">Login Pengelola Admin</a></li>
            </ul>
          </div>

          <div>
            <h4>Kontak & Alamat</h4>
            <p style="font-size: 0.875rem; color: var(--on-surface-variant); margin-bottom: 8px;">📍 ${alamat}</p>
            <p style="font-size: 0.875rem; color: var(--on-surface-variant); margin-bottom: 8px;">📞 ${telepon}</p>
            <p style="font-size: 0.875rem; color: var(--on-surface-variant);">✉️ ${profilData.email || 'info@tampirkulon.desawisata.id'}</p>
          </div>
        </div>

        <div class="footer-bottom">
          <p>© ${currentYear} ${namaDesa}. Preserving the Soul of Java.</p>
        </div>
      </div>
    </footer>
  `;
};
