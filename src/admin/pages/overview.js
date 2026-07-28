import { auth } from '../../utils/auth.js';
import { renderSidebar, initAdminSidebarEvents } from '../components/sidebar.js';
import { renderAdminHeader } from '../components/header.js';
import { showToast } from '../../components/toast.js';
import { supabase, isSupabaseConfigured } from '../../lib/supabase.js';
import { mockData } from '../../data/seed.js';

export const renderAdminOverview = async () => {
  const isAuthed = await auth.requireAuth();
  if (!isAuthed) return document.createElement('div');

  let stats = {
    destinasi: mockData.destinasi.length,
    paket: mockData.paket_wisata.length,
    artikel: mockData.artikel.length,
    galeri: mockData.galeri.length,
    reservasi_pending: mockData.reservasi.filter(r => r.status === 'baru' || r.status === 'pending').length,
    reservasi_selesai: mockData.reservasi.filter(r => r.status === 'selesai').length
  };

  let recentReservations = mockData.reservasi.slice(0, 5).map((r, i) => {
    const pkt = mockData.paket_wisata.find(p => p.id === r.paket_id);
    return {
      rawId: r.id,
      displayId: `#RES-${String(i + 1).padStart(3, '0')}`,
      nama_pemesan: r.nama,
      telepon: r.telepon || '',
      paket: pkt ? pkt.nama : 'Kunjungan Mandiri',
      tanggal: r.tanggal_kunjungan,
      status: (r.status || 'baru').toLowerCase()
    };
  });

  const loadData = async () => {
    if (isSupabaseConfigured()) {
      try {
        const { count: cDest } = await supabase.from('destinasi').select('*', { count: 'exact', head: true });
        const { count: cPaket } = await supabase.from('paket_wisata').select('*', { count: 'exact', head: true });
        const { count: cBlog } = await supabase.from('artikel').select('*', { count: 'exact', head: true });
        const { count: cGal } = await supabase.from('galeri').select('*', { count: 'exact', head: true });
        const { count: cResPending } = await supabase.from('reservasi').select('*', { count: 'exact', head: true }).eq('status', 'baru');
        const { count: cResSelesai } = await supabase.from('reservasi').select('*', { count: 'exact', head: true }).eq('status', 'selesai');

        if (cDest !== null) stats.destinasi = cDest;
        if (cPaket !== null) stats.paket = cPaket;
        if (cBlog !== null) stats.artikel = cBlog;
        if (cGal !== null) stats.galeri = cGal;
        if (cResPending !== null) stats.reservasi_pending = cResPending;
        if (cResSelesai !== null) stats.reservasi_selesai = cResSelesai;

        const { data: resData } = await supabase.from('reservasi').select('*, paket_wisata(nama)').order('created_at', { ascending: false }).limit(5);
        if (resData && resData.length > 0) {
          recentReservations = resData.map((r, i) => ({
            rawId: r.id,
            displayId: `#RES-${String(i + 1).padStart(3, '0')}`,
            nama_pemesan: r.nama || r.nama_pemesan || 'Tamu',
            telepon: r.telepon || '',
            paket: r.paket_wisata?.nama || 'Kunjungan Mandiri',
            tanggal: r.tanggal_kunjungan ? new Date(r.tanggal_kunjungan).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Terbaru',
            status: (r.status || 'baru').toLowerCase()
          }));
        }
      } catch (e) {
        console.warn('Fallback seed stats:', e);
      }
    }
  };

  await loadData();

  const container = document.createElement('div');
  container.className = 'dashboard-wrapper donezo-bg';

  const renderPage = () => {
    container.innerHTML = `
      ${renderSidebar('overview')}

      <main class="admin-main donezo-bg min-h-screen">
        ${renderAdminHeader('Dashboard Overview')}

        <div class="p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          <!-- Page Header & Action Buttons -->
          <div class="flex items-center justify-between flex-wrap gap-4 mb-8">
            <div>
              <h1 class="font-display-lg text-3xl font-extrabold text-slate-800 m-0">Dashboard</h1>
              <p class="text-sm font-medium text-slate-400 m-0 mt-1">Kelola, pantau, dan selesaikan reservasi serta operasional desa wisata dengan mudah.</p>
            </div>
            <div class="flex items-center gap-3">
              <a href="#/admin/destinasi" class="px-5 py-2.5 rounded-full bg-[#316342] text-white font-bold text-xs hover:bg-[#254d33] transition-colors shadow-md flex items-center gap-2">
                <span class="material-symbols-outlined text-sm">add</span>
                Tambah Destinasi
              </a>
              <a href="#/admin/reservasi" class="px-5 py-2.5 rounded-full bg-white text-slate-700 font-bold text-xs border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs flex items-center gap-2">
                Kelola Reservasi
              </a>
            </div>
          </div>

          <!-- Hero Stat Cards Grid (4 Cards) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <!-- Card 1: Featured Dark Green Card -->
            <div class="donezo-hero-card p-6 flex flex-col justify-between relative overflow-hidden">
              <div class="flex items-start justify-between">
                <span class="text-xs font-bold uppercase tracking-wider text-emerald-100/90 font-label">Reservasi Perlu Konfirmasi</span>
                <a href="#/admin/reservasi" class="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors">
                  <span class="material-symbols-outlined text-base">north_east</span>
                </a>
              </div>
              <div class="mt-6">
                <h2 class="text-4xl font-extrabold text-white m-0 tracking-tight">${stats.reservasi_pending}</h2>
                <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-[11px] font-semibold text-emerald-100 mt-3">
                  <span>↗ +12% dari bulan lalu</span>
                </div>
              </div>
            </div>

            <!-- Card 2: White Card -->
            <div class="donezo-card p-6 flex flex-col justify-between">
              <div class="flex items-start justify-between">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-400 font-label">Kunjungan Selesai</span>
                <a href="#/admin/reservasi" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors">
                  <span class="material-symbols-outlined text-base">north_east</span>
                </a>
              </div>
              <div class="mt-6">
                <h2 class="text-4xl font-extrabold text-slate-800 m-0 tracking-tight">${stats.reservasi_selesai}</h2>
                <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-[11px] font-semibold text-emerald-700 mt-3 border border-emerald-100">
                  <span>↗ +8% dari bulan lalu</span>
                </div>
              </div>
            </div>

            <!-- Card 3: White Card -->
            <div class="donezo-card p-6 flex flex-col justify-between">
              <div class="flex items-start justify-between">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-400 font-label">Total Destinasi</span>
                <a href="#/admin/destinasi" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors">
                  <span class="material-symbols-outlined text-base">north_east</span>
                </a>
              </div>
              <div class="mt-6">
                <h2 class="text-4xl font-extrabold text-slate-800 m-0 tracking-tight">${stats.destinasi}</h2>
                <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-[11px] font-semibold text-blue-700 mt-3 border border-blue-100">
                  <span>↗ ${stats.destinasi} Objek Wisata Aktif</span>
                </div>
              </div>
            </div>

            <!-- Card 4: White Card -->
            <div class="donezo-card p-6 flex flex-col justify-between">
              <div class="flex items-start justify-between">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-400 font-label">Total Paket Wisata</span>
                <a href="#/admin/paket" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors">
                  <span class="material-symbols-outlined text-base">north_east</span>
                </a>
              </div>
              <div class="mt-6">
                <h2 class="text-4xl font-extrabold text-slate-800 m-0 tracking-tight">${stats.paket}</h2>
                <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-[11px] font-semibold text-amber-700 mt-3 border border-amber-100">
                  <span>↗ Paket Edukasi & Alam</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Main Layout Grid (2 Columns: 8/12 & 4/12) -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <!-- Left Column (8 cols) -->
            <div class="lg:col-span-8 flex flex-col gap-8">
              <!-- Analytics Bar Chart Widget -->
              <div class="donezo-card p-6">
                <div class="flex items-center justify-between mb-6">
                  <div>
                    <h3 class="text-lg font-bold text-slate-800 m-0">Analisis Kunjungan Wisatawan</h3>
                    <p class="text-xs text-slate-400 m-0 mt-0.5">Statistik tren pengunjung per hari minggu ini.</p>
                  </div>
                  <div class="px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200">
                    Minggu Ini ▾
                  </div>
                </div>

                <!-- Pill Bar Chart Visual -->
                <div class="flex items-end justify-between gap-4 h-48 pt-6 px-4 border-b border-slate-100">
                  <div class="flex flex-col items-center gap-2 flex-1 h-full justify-end">
                    <div class="w-full max-w-[42px] h-[45%] bg-slate-200/70 rounded-full"></div>
                    <span class="text-xs font-semibold text-slate-400">S</span>
                  </div>
                  <div class="flex flex-col items-center gap-2 flex-1 h-full justify-end">
                    <div class="w-full max-w-[42px] h-[60%] bg-[#316342]/40 rounded-full"></div>
                    <span class="text-xs font-semibold text-slate-400">M</span>
                  </div>
                  <div class="flex flex-col items-center gap-2 flex-1 h-full justify-end relative">
                    <span class="absolute -top-7 px-2 py-0.5 rounded-md bg-emerald-50 text-[#316342] font-bold text-[10px] border border-emerald-200">74%</span>
                    <div class="w-full max-w-[42px] h-[74%] bg-[#4ADE80] rounded-full shadow-sm"></div>
                    <span class="text-xs font-bold text-[#316342]">T</span>
                  </div>
                  <div class="flex flex-col items-center gap-2 flex-1 h-full justify-end">
                    <div class="w-full max-w-[42px] h-[90%] bg-[#316342] rounded-full shadow-md"></div>
                    <span class="text-xs font-semibold text-slate-400">W</span>
                  </div>
                  <div class="flex flex-col items-center gap-2 flex-1 h-full justify-end">
                    <div class="w-full max-w-[42px] h-[55%] bg-slate-200/70 rounded-full"></div>
                    <span class="text-xs font-semibold text-slate-400">T</span>
                  </div>
                  <div class="flex flex-col items-center gap-2 flex-1 h-full justify-end">
                    <div class="w-full max-w-[42px] h-[65%] bg-slate-200/70 rounded-full"></div>
                    <span class="text-xs font-semibold text-slate-400">F</span>
                  </div>
                  <div class="flex flex-col items-center gap-2 flex-1 h-full justify-end">
                    <div class="w-full max-w-[42px] h-[80%] bg-slate-300 rounded-full"></div>
                    <span class="text-xs font-semibold text-slate-400">S</span>
                  </div>
                </div>
              </div>

              <!-- Actionable Recent Reservations Table Widget -->
              <div class="donezo-card p-6 overflow-hidden">
                <div class="flex items-center justify-between mb-6">
                  <div>
                    <h3 class="text-lg font-bold text-slate-800 m-0">Reservasi Terbaru</h3>
                    <p class="text-xs text-slate-400 m-0 mt-0.5">Daftar transaksi wisatawan terbaru yang memerlukan aksi.</p>
                  </div>
                  <a href="#/admin/reservasi" class="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors">
                    Lihat Semua ↗
                  </a>
                </div>

                <div class="overflow-x-auto">
                  <table class="w-full text-left border-collapse">
                    <thead>
                      <tr class="border-b border-slate-100 text-xs text-slate-400 uppercase font-bold tracking-wider">
                        <th class="pb-3 px-3">Tamu</th>
                        <th class="pb-3 px-3">Paket Wisata</th>
                        <th class="pb-3 px-3">Tanggal</th>
                        <th class="pb-3 px-3">Status</th>
                        <th class="pb-3 px-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody class="text-xs text-slate-700">
                      ${recentReservations.length === 0 ? `
                        <tr>
                          <td colspan="5" class="py-8 text-center text-slate-400">Belum ada reservasi masuk.</td>
                        </tr>
                      ` : recentReservations.map(res => {
                        const s = res.status;
                        let badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                        let statusText = 'Completed';
                        if (s === 'baru' || s === 'pending') {
                          badgeStyle = 'bg-amber-50 text-amber-700 border-amber-200';
                          statusText = 'Pending';
                        } else if (s === 'dikonfirmasi') {
                          badgeStyle = 'bg-blue-50 text-blue-700 border-blue-200';
                          statusText = 'In Progress';
                        }

                        const cleanPhone = res.telepon ? res.telepon.replace(/[^0-9]/g, '') : '';
                        const waUrl = cleanPhone ? `https://wa.me/${cleanPhone}` : '#';

                        return `
                          <tr class="border-b border-slate-100/70 hover:bg-slate-50/80 transition-colors">
                            <td class="py-3.5 px-3">
                              <div class="flex items-center gap-2.5">
                                <div class="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                                  ${res.nama_pemesan ? res.nama_pemesan.charAt(0) : 'T'}
                                </div>
                                <div>
                                  <div class="font-bold text-slate-800">${res.nama_pemesan}</div>
                                  ${res.telepon ? `<div class="text-[10px] text-slate-400">${res.telepon}</div>` : ''}
                                </div>
                              </div>
                            </td>
                            <td class="py-3.5 px-3 font-medium text-slate-600">${res.paket}</td>
                            <td class="py-3.5 px-3 text-slate-500">${res.tanggal}</td>
                            <td class="py-3.5 px-3">
                              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badgeStyle}">
                                ${statusText}
                              </span>
                            </td>
                            <td class="py-3.5 px-3 text-right">
                              <div class="inline-flex items-center gap-1.5 justify-end">
                                ${cleanPhone ? `
                                  <a href="${waUrl}" target="_blank" class="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] transition-colors inline-flex items-center gap-1">
                                    <span class="material-symbols-outlined text-xs">chat</span>
                                    WA
                                  </a>
                                ` : ''}
                                ${(s === 'baru' || s === 'pending') ? `
                                  <button class="px-2.5 py-1 rounded-lg bg-[#316342] text-white hover:bg-[#254d33] font-bold text-[11px] transition-colors quick-confirm-btn" data-id="${res.rawId}">
                                    Konfirmasi
                                  </button>
                                ` : ''}
                              </div>
                            </td>
                          </tr>
                        `;
                      }).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- Right Column Widgets (4 cols) -->
            <div class="lg:col-span-4 flex flex-col gap-8">
              <!-- Reminders / Schedule Card -->
              <div class="donezo-card p-6">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-400 font-label">Agenda Hari Ini</span>
                <h4 class="text-base font-bold text-slate-800 m-0 mt-3">Rombongan Edukasi Wisata Durian</h4>
                <p class="text-xs text-slate-400 m-0 mt-1">Waktu: 14.00 WIB - 16.30 WIB (35 Pax)</p>

                <button class="w-full mt-5 py-3 rounded-full bg-[#316342] text-white font-bold text-xs hover:bg-[#254d33] transition-colors shadow-md flex items-center justify-center gap-2">
                  <span class="material-symbols-outlined text-base">video_camera_front</span>
                  Mulai Sambut Wisatawan
                </button>
              </div>

              <!-- Project Progress Donut Gauge Widget -->
              <div class="donezo-card p-6">
                <h3 class="text-base font-bold text-slate-800 m-0 mb-4">Progres Kunjungan</h3>
                <div class="flex flex-col items-center justify-center py-4 relative">
                  <!-- Circular Donut Chart Visual -->
                  <div class="w-36 h-36 rounded-full border-[14px] border-slate-100 border-t-[#316342] border-r-[#4ADE80] border-b-[#316342] flex flex-col items-center justify-center shadow-inner">
                    <span class="text-2xl font-extrabold text-slate-800 leading-none">75%</span>
                    <span class="text-[10px] font-semibold text-slate-400 mt-1">Kunjungan Selesai</span>
                  </div>
                </div>

                <div class="flex items-center justify-between text-xs pt-4 border-t border-slate-100 font-medium text-slate-600">
                  <div class="flex items-center gap-1.5">
                    <span class="w-2.5 h-2.5 rounded-full bg-[#316342]"></span>
                    <span>Completed</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <span class="w-2.5 h-2.5 rounded-full bg-[#4ADE80]"></span>
                    <span>In Progress</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <span class="w-2.5 h-2.5 rounded-full bg-slate-200"></span>
                    <span>Pending</span>
                  </div>
                </div>
              </div>

              <!-- Top Destinations & Packages List -->
              <div class="donezo-card p-6">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-base font-bold text-slate-800 m-0">Destinasi Populer</h3>
                  <a href="#/admin/destinasi" class="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px]">
                    + New
                  </a>
                </div>

                <div class="flex flex-col gap-3.5">
                  <div class="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-lg bg-emerald-100 text-[#316342] flex items-center justify-center font-bold">
                        🍃
                      </div>
                      <div>
                        <h4 class="text-xs font-bold text-slate-800 m-0">Kebun Durian Candimulyo</h4>
                        <p class="text-[10px] text-slate-400 m-0">Wisata Edukasi • 1.2k pengunjung</p>
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                        🌊
                      </div>
                      <div>
                        <h4 class="text-xs font-bold text-slate-800 m-0">Susur Sungai Tampir</h4>
                        <p class="text-[10px] text-slate-400 m-0">Wisata Alam • 850 pengunjung</p>
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                        🍱
                      </div>
                      <div>
                        <h4 class="text-xs font-bold text-slate-800 m-0">Paket Kuliner Tradisional</h4>
                        <p class="text-[10px] text-slate-400 m-0">Paket Wisata • 620 pemesan</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    `;

    bindEvents();
  };

  const bindEvents = () => {
    initAdminSidebarEvents();

    container.querySelectorAll('.quick-confirm-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const rawId = e.currentTarget.getAttribute('data-id');
        btn.disabled = true;
        btn.innerText = 'Updating...';

        if (isSupabaseConfigured()) {
          try {
            await supabase.from('reservasi').update({ status: 'dikonfirmasi' }).eq('id', rawId);
            showToast('Reservasi berhasil dikonfirmasi!', 'success');
          } catch (err) {
            showToast('Gagal update status: ' + err.message, 'error');
          }
        } else {
          const item = mockData.reservasi.find(r => r.id === rawId);
          if (item) item.status = 'dikonfirmasi';
          showToast('Reservasi dikonfirmasi (Demo mode)!', 'success');
        }

        await loadData();
        renderPage();
      });
    });
  };

  renderPage();
  return container;
};


