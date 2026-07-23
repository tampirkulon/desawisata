import { auth } from '../../utils/auth.js';
import { renderAdminSidebar, initAdminSidebarEvents } from '../components/sidebar.js';
import { renderAdminHeader } from '../components/header.js';
import { supabase, isSupabaseConfigured } from '../../lib/supabase.js';
import { mockData } from '../../data/seed.js';

export const renderAdminOverview = async () => {
  const isAuthed = await auth.requireAuth();
  if (!isAuthed) return document.createElement('div');

  let stats = {
    destinasiCount: mockData.destinasi.length,
    paketCount: mockData.paket_wisata.length,
    artikelCount: mockData.artikel.length,
    reservasiBaruCount: mockData.reservasi.filter(r => r.status === 'baru').length
  };

  let recentReservations = mockData.reservasi;

  if (isSupabaseConfigured()) {
    try {
      const { count: cDest } = await supabase.from('destinasi').select('*', { count: 'exact', head: true });
      if (cDest !== null) stats.destinasiCount = cDest;

      const { count: cPaket } = await supabase.from('paket_wisata').select('*', { count: 'exact', head: true });
      if (cPaket !== null) stats.paketCount = cPaket;

      const { count: cArt } = await supabase.from('artikel').select('*', { count: 'exact', head: true }).eq('status', 'published');
      if (cArt !== null) stats.artikelCount = cArt;

      const { count: cRsv } = await supabase.from('reservasi').select('*', { count: 'exact', head: true }).eq('status', 'baru');
      if (cRsv !== null) stats.reservasiBaruCount = cRsv;

      const { data: recent } = await supabase.from('reservasi').select('*').order('created_at', { ascending: false }).limit(5);
      if (recent) recentReservations = recent;
    } catch (e) {
      console.warn('Fallback stats:', e);
    }
  }

  const container = document.createElement('div');
  container.className = 'dashboard-wrapper';

  container.innerHTML = `
    ${renderAdminSidebar('#/admin/overview')}

    <main class="admin-main">
      ${renderAdminHeader('Overview Dashboard')}

      <div class="admin-body">
        <!-- Stat Cards Grid -->
        <div class="admin-stats-grid">
          <div class="stat-card">
            <div class="stat-card-icon" style="background: #e6f4ea; color: var(--primary-500);">⛰️</div>
            <div class="stat-card-info">
              <h3>${stats.destinasiCount}</h3>
              <p>Total Destinasi Wisata</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-card-icon" style="background: #fff8e6; color: var(--accent-amber);">🎒</div>
            <div class="stat-card-info">
              <h3>${stats.paketCount}</h3>
              <p>Paket Wisata Aktif</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-card-icon" style="background: #e0f2fe; color: var(--status-info);">📰</div>
            <div class="stat-card-info">
              <h3>${stats.artikelCount}</h3>
              <p>Artikel Dipublikasikan</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-card-icon" style="background: #fee2e2; color: var(--status-error);">📋</div>
            <div class="stat-card-info">
              <h3>${stats.reservasiBaruCount}</h3>
              <p>Reservasi Baru</p>
            </div>
          </div>
        </div>

        <!-- Quick Actions & Recent Table -->
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px;">
          <!-- Recent Reservations -->
          <div class="card" style="padding: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <h3 style="font-size: 1.15rem;">📋 Reservasi Terbaru</h3>
              <a href="#/admin/reservasi" style="font-size: 0.85rem; color: var(--primary-500); font-weight: 600;">Lihat Semua →</a>
            </div>

            <div class="table-wrapper">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Pemesan</th>
                    <th>Tanggal</th>
                    <th>Jumlah</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${recentReservations.length === 0 ? `
                    <tr><td colspan="4" style="text-align: center; color: var(--neutral-600);">Belum ada reservasi masuk.</td></tr>
                  ` : recentReservations.map(item => `
                    <tr>
                      <td>
                        <strong>${item.nama}</strong>
                        <div style="font-size: 0.8rem; color: var(--neutral-600);">${item.telepon}</div>
                      </td>
                      <td>${item.tanggal_kunjungan}</td>
                      <td>${item.jumlah_orang} Orang</td>
                      <td>
                        <span class="badge ${item.status === 'baru' ? 'badge-primary' : item.status === 'dikonfirmasi' ? 'badge-warning' : 'badge-success'}">
                          ${item.status}
                        </span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Quick Shortcuts -->
          <div class="card" style="padding: 24px;">
            <h3 style="font-size: 1.15rem; margin-bottom: 16px;">⚡ Pintas Cepat</h3>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <a href="#/admin/destinasi" class="btn btn-outline" style="justify-content: flex-start; text-align: left;">
                ➕ Tambah Destinasi Wisata
              </a>
              <a href="#/admin/paket" class="btn btn-outline" style="justify-content: flex-start; text-align: left;">
                ➕ Tambah Paket Wisata
              </a>
              <a href="#/admin/artikel" class="btn btn-outline" style="justify-content: flex-start; text-align: left;">
                ✍️ Tulis Artikel Baru
              </a>
              <a href="#/admin/profil" class="btn btn-secondary" style="justify-content: flex-start; text-align: left;">
                ⚙️ Perbarui Info Profil Desa
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  `;

  setTimeout(() => initAdminSidebarEvents(), 0);
  return container;
};
