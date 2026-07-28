import { auth } from '../../utils/auth.js';
import { renderSidebar, initAdminSidebarEvents } from '../components/sidebar.js';
import { renderAdminHeader } from '../components/header.js';
import { supabase, isSupabaseConfigured } from '../../lib/supabase.js';

export const renderAdminOverview = async () => {
  const isAuthed = await auth.requireAuth();
  if (!isAuthed) return document.createElement('div');
  let stats = { destinasi: 12, paket: 8, artikel: 24, reservasi: 15 };
  let recentReservations = [
    { id: '#RES-001', nama_pemesan: 'Budi Santoso', paket: 'Paket Jelajah Alam', tanggal: '12 Okt 2024', status: 'Baru' },
    { id: '#RES-002', nama_pemesan: 'Siti Aminah', paket: 'Paket Edukasi Budaya', tanggal: '14 Okt 2024', status: 'Selesai' },
    { id: '#RES-003', nama_pemesan: 'Ahmad Yani', paket: 'Paket Jelajah Alam', tanggal: '15 Okt 2024', status: 'Baru' },
    { id: '#RES-004', nama_pemesan: 'Lina Marlina', paket: 'Paket Kulinari Desa', tanggal: '18 Okt 2024', status: 'Baru' },
  ];

  if (isSupabaseConfigured()) {
    try {
      const { count: cDest } = await supabase.from('destinasi').select('*', { count: 'exact', head: true });
      const { count: cPaket } = await supabase.from('paket_wisata').select('*', { count: 'exact', head: true });
      const { count: cBlog } = await supabase.from('artikel').select('*', { count: 'exact', head: true });
      const { count: cRes } = await supabase.from('reservasi').select('*', { count: 'exact', head: true });

      if (cDest !== null) stats.destinasi = cDest;
      if (cPaket !== null) stats.paket = cPaket;
      if (cBlog !== null) stats.artikel = cBlog;
      if (cRes !== null) stats.reservasi = cRes;

      const { data: resData } = await supabase.from('reservasi').select('*, paket_wisata(nama)').order('created_at', { ascending: false }).limit(5);
      if (resData && resData.length > 0) {
        recentReservations = resData.map((r, i) => ({
          id: `#RES-${String(i + 1).padStart(3, '0')}`,
          nama_pemesan: r.nama_pemesan,
          paket: r.paket_wisata?.nama || 'Paket General',
          tanggal: r.tanggal_kunjungan ? new Date(r.tanggal_kunjungan).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Terbaru',
          status: r.status === 'pending' ? 'Baru' : 'Selesai'
        }));
      }
    } catch (e) {
      console.warn('Fallback seed stats:', e);
    }
  }

  const container = document.createElement('div');
  container.className = 'dashboard-wrapper';

  container.innerHTML = `
    ${renderSidebar('overview')}

    <main class="admin-main">
      ${renderAdminHeader('Overview Dashboard')}

      <div class="admin-body overflow-y-auto">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-surface-container-lowest p-6 rounded-2xl shadow-level-1 flex items-center justify-between border border-outline-variant/20">
            <div>
              <p class="font-label-caps text-xs font-bold text-on-surface-variant uppercase mb-1">TOTAL DESTINASI</p>
              <h3 class="font-display-lg text-3xl font-bold text-primary m-0">${stats.destinasi}</h3>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-primary-container text-white flex items-center justify-center shadow-sm">
              <span class="material-symbols-outlined text-2xl">landscape</span>
            </div>
          </div>

          <div class="bg-surface-container-lowest p-6 rounded-2xl shadow-level-1 flex items-center justify-between border border-outline-variant/20">
            <div>
              <p class="font-label-caps text-xs font-bold text-on-surface-variant uppercase mb-1">TOTAL PAKET</p>
              <h3 class="font-display-lg text-3xl font-bold text-primary m-0">${stats.paket}</h3>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-primary-container text-white flex items-center justify-center shadow-sm">
              <span class="material-symbols-outlined text-2xl">inventory_2</span>
            </div>
          </div>

          <div class="bg-surface-container-lowest p-6 rounded-2xl shadow-level-1 flex items-center justify-between border border-outline-variant/20">
            <div>
              <p class="font-label-caps text-xs font-bold text-on-surface-variant uppercase mb-1">ARTIKEL BLOG</p>
              <h3 class="font-display-lg text-3xl font-bold text-primary m-0">${stats.artikel}</h3>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-primary-container text-white flex items-center justify-center shadow-sm">
              <span class="material-symbols-outlined text-2xl">rss_feed</span>
            </div>
          </div>

          <div class="bg-surface-container-lowest p-6 rounded-2xl shadow-level-1 flex items-center justify-between border border-outline-variant/20">
            <div>
              <p class="font-label-caps text-xs font-bold text-on-surface-variant uppercase mb-1">RESERVASI BARU</p>
              <h3 class="font-display-lg text-3xl font-bold text-primary m-0">${stats.reservasi}</h3>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-secondary-container text-secondary flex items-center justify-center shadow-sm font-bold">
              <span class="material-symbols-outlined text-2xl">event_available</span>
            </div>
          </div>
        </div>

        <!-- Recent Reservations Table -->
        <div class="bg-surface-container-lowest rounded-2xl shadow-level-1 border border-outline-variant/20 overflow-hidden">
          <div class="px-6 py-5 border-b border-outline-variant/20 flex justify-between items-center bg-surface">
            <h3 class="font-display-lg text-lg font-bold text-primary m-0">Recent Reservations</h3>
            <a href="#/admin/reservasi" class="text-primary hover:text-secondary transition-colors font-bold text-xs">VIEW ALL</a>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-outline-variant/20 bg-surface-container-low text-xs text-on-surface-variant uppercase tracking-wider font-bold">
                  <th class="py-4 px-6">ID</th>
                  <th class="py-4 px-6">Tamu</th>
                  <th class="py-4 px-6">Paket Wisata</th>
                  <th class="py-4 px-6">Tanggal</th>
                  <th class="py-4 px-6">Status</th>
                </tr>
              </thead>
              <tbody class="font-body-md text-sm text-on-surface">
                ${recentReservations.map(res => `
                  <tr class="border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors">
                    <td class="py-4 px-6 font-bold text-primary">${res.id}</td>
                    <td class="py-4 px-6 font-semibold">${res.nama_pemesan}</td>
                    <td class="py-4 px-6 text-on-surface-variant">${res.paket}</td>
                    <td class="py-4 px-6">${res.tanggal}</td>
                    <td class="py-4 px-6">
                      <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${res.status === 'Baru' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}">
                        ${res.status}
                      </span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  `;

  setTimeout(() => {
    initAdminSidebarEvents();
    container.querySelector('#logout-btn')?.addEventListener('click', () => {
      auth.logout();
    });
  }, 0);

  return container;
};
