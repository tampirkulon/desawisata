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
    reservasi_selesai: mockData.reservasi.filter(r => r.status === 'selesai').length,
    estimasi_pendapatan: 4250000
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

        const { data: resData } = await supabase.from('reservasi').select('*, paket_wisata(nama, harga)').order('created_at', { ascending: false }).limit(5);
        if (resData && resData.length > 0) {
          let totalRev = 0;
          recentReservations = resData.map((r, i) => {
            const pax = r.jumlah_orang || 1;
            const price = r.paket_wisata?.harga || 50000;
            if (r.status === 'selesai' || r.status === 'dikonfirmasi') {
              totalRev += pax * price;
            }
            return {
              rawId: r.id,
              displayId: `#RES-${String(i + 1).padStart(3, '0')}`,
              nama_pemesan: r.nama || r.nama_pemesan || 'Tamu',
              telepon: r.telepon || '',
              paket: r.paket_wisata?.nama || 'Kunjungan Mandiri',
              tanggal: r.tanggal_kunjungan ? new Date(r.tanggal_kunjungan).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Terbaru',
              status: (r.status || 'baru').toLowerCase()
            };
          });
          if (totalRev > 0) stats.estimasi_pendapatan = totalRev;
        }
      } catch (e) {
        console.warn('Fallback seed stats:', e);
      }
    }
  };

  await loadData();

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  const container = document.createElement('div');
  container.className = 'dashboard-wrapper donezo-bg';

  const renderPage = () => {
    container.innerHTML = `
      ${renderSidebar('overview')}

      <main class="admin-main donezo-bg h-full overflow-hidden flex flex-col">
        ${renderAdminHeader('Dashboard Overview')}

        <div class="flex-1 overflow-y-auto p-8 w-full">
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

            <!-- Card 4: Revenue KPI Card -->
            <div class="donezo-card p-6 flex flex-col justify-between">
              <div class="flex items-start justify-between">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-400 font-label">Estimasi Pendapatan</span>
                <a href="#/admin/reservasi" class="w-8 h-8 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition-colors">
                  <span class="material-symbols-outlined text-base">payments</span>
                </a>
              </div>
              <div class="mt-6">
                <h2 class="text-2xl lg:text-3xl font-extrabold text-slate-800 m-0 tracking-tight">${formatRupiah(stats.estimasi_pendapatan)}</h2>
                <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-[11px] font-semibold text-emerald-700 mt-3 border border-emerald-100">
                  <span>↗ Terkonfirmasi & Selesai</span>
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
                <div class="flex items-center justify-between mb-6 flex-wrap gap-2">
                  <div>
                    <h3 class="text-lg font-bold text-slate-800 m-0">Analisis Kunjungan Wisatawan</h3>
                    <p class="text-xs text-slate-400 m-0 mt-0.5">Statistik tren pengunjung per hari minggu ini.</p>
                  </div>
                  <select id="chart-period-filter" class="px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 outline-none cursor-pointer hover:bg-slate-200/80 transition-colors shadow-2xs">
                    <option value="minggu">Minggu Ini</option>
                    <option value="bulan">Bulan Ini</option>
                    <option value="tahun">Tahun Ini</option>
                  </select>
                </div>

                <!-- Pill Bar Chart Visual with Interactive Tooltips -->
                <div id="chart-bars-container" class="flex items-end justify-between gap-3 h-52 pt-8 px-2 border-b border-slate-100">
                  <!-- Day 1: Senin -->
                  <div class="group flex flex-col items-center gap-2 flex-1 h-full justify-end relative cursor-pointer">
                    <div class="chart-tooltip opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-200 pointer-events-none absolute -top-11 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-medium py-1.5 px-2.5 rounded-lg shadow-xl z-20 whitespace-nowrap">
                      <span>Senin: <strong>45 Wisatawan</strong></span>
                      <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                    </div>
                    <div class="chart-bar-el w-full max-w-[38px] h-[45%] bg-slate-200/80 group-hover:bg-[#316342]/60 rounded-full transition-all duration-300"></div>
                    <span class="chart-label-el text-xs font-semibold text-slate-400 group-hover:text-slate-700">Sen</span>
                  </div>

                  <!-- Day 2: Selasa -->
                  <div class="group flex flex-col items-center gap-2 flex-1 h-full justify-end relative cursor-pointer">
                    <div class="chart-tooltip opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-200 pointer-events-none absolute -top-11 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-medium py-1.5 px-2.5 rounded-lg shadow-xl z-20 whitespace-nowrap">
                      <span>Selasa: <strong>60 Wisatawan</strong></span>
                      <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                    </div>
                    <div class="chart-bar-el w-full max-w-[38px] h-[60%] bg-[#316342]/40 group-hover:bg-[#316342]/70 rounded-full transition-all duration-300"></div>
                    <span class="chart-label-el text-xs font-semibold text-slate-400 group-hover:text-slate-700">Sel</span>
                  </div>

                  <!-- Day 3: Rabu (Peak) -->
                  <div class="group flex flex-col items-center gap-2 flex-1 h-full justify-end relative cursor-pointer">
                    <span id="chart-badge-val" class="absolute -top-7 px-2 py-0.5 rounded-md bg-emerald-50 text-[#316342] font-bold text-[10px] border border-emerald-200 shadow-2xs">Puncak</span>
                    <div class="chart-tooltip opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-200 pointer-events-none absolute -top-14 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-medium py-1.5 px-2.5 rounded-lg shadow-xl z-20 whitespace-nowrap">
                      <span>Rabu: <strong>145 Wisatawan</strong> (Peak)</span>
                      <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                    </div>
                    <div id="chart-main-bar" class="chart-bar-el w-full max-w-[38px] h-[92%] bg-[#316342] rounded-full shadow-md transition-all duration-300"></div>
                    <span class="chart-label-el text-xs font-bold text-[#316342]">Rab</span>
                  </div>

                  <!-- Day 4: Kamis -->
                  <div class="group flex flex-col items-center gap-2 flex-1 h-full justify-end relative cursor-pointer">
                    <div class="chart-tooltip opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-200 pointer-events-none absolute -top-11 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-medium py-1.5 px-2.5 rounded-lg shadow-xl z-20 whitespace-nowrap">
                      <span>Kamis: <strong>90 Wisatawan</strong></span>
                      <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                    </div>
                    <div class="chart-bar-el w-full max-w-[38px] h-[74%] bg-[#4ADE80] group-hover:bg-[#316342] rounded-full shadow-sm transition-all duration-300"></div>
                    <span class="chart-label-el text-xs font-semibold text-slate-400 group-hover:text-slate-700">Kam</span>
                  </div>

                  <!-- Day 5: Jumat -->
                  <div class="group flex flex-col items-center gap-2 flex-1 h-full justify-end relative cursor-pointer">
                    <div class="chart-tooltip opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-200 pointer-events-none absolute -top-11 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-medium py-1.5 px-2.5 rounded-lg shadow-xl z-20 whitespace-nowrap">
                      <span>Jumat: <strong>55 Wisatawan</strong></span>
                      <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                    </div>
                    <div class="chart-bar-el w-full max-w-[38px] h-[55%] bg-slate-200/80 group-hover:bg-[#316342]/60 rounded-full transition-all duration-300"></div>
                    <span class="chart-label-el text-xs font-semibold text-slate-400 group-hover:text-slate-700">Jum</span>
                  </div>

                  <!-- Day 6: Sabtu -->
                  <div class="group flex flex-col items-center gap-2 flex-1 h-full justify-end relative cursor-pointer">
                    <div class="chart-tooltip opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-200 pointer-events-none absolute -top-11 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-medium py-1.5 px-2.5 rounded-lg shadow-xl z-20 whitespace-nowrap">
                      <span>Sabtu: <strong>85 Wisatawan</strong></span>
                      <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                    </div>
                    <div class="chart-bar-el w-full max-w-[38px] h-[68%] bg-slate-300 group-hover:bg-[#316342]/70 rounded-full transition-all duration-300"></div>
                    <span class="chart-label-el text-xs font-semibold text-slate-400 group-hover:text-slate-700">Sab</span>
                  </div>

                  <!-- Day 7: Minggu -->
                  <div class="group flex flex-col items-center gap-2 flex-1 h-full justify-end relative cursor-pointer">
                    <div class="chart-tooltip opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-200 pointer-events-none absolute -top-11 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-medium py-1.5 px-2.5 rounded-lg shadow-xl z-20 whitespace-nowrap">
                      <span>Minggu: <strong>110 Wisatawan</strong></span>
                      <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                    </div>
                    <div class="chart-bar-el w-full max-w-[38px] h-[82%] bg-[#316342]/80 group-hover:bg-[#316342] rounded-full transition-all duration-300"></div>
                    <span class="chart-label-el text-xs font-semibold text-slate-400 group-hover:text-slate-700">Min</span>
                  </div>
                </div>

                <!-- Footer Summary Legend -->
                <div class="mt-4 pt-3 flex items-center justify-between text-xs font-medium text-slate-500 flex-wrap gap-2">
                  <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-[#316342]"></span>
                    <span id="chart-avg-summary">Rata-rata: <strong>86 Pengunjung/Hari</strong></span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span id="chart-peak-summary">Hari Puncak: <strong>Rabu (145 Pax)</strong></span>
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
                        } else if (s === 'dibatalkan') {
                          badgeStyle = 'bg-rose-50 text-rose-700 border-rose-200';
                          statusText = 'Cancelled';
                        }

                        const waMsg = encodeURIComponent(`Halo ${res.nama_pemesan}, kami dari pengelola Desa Wisata Tampirkulon mengonfirmasi reservasi Anda (${res.paket}) untuk tanggal ${res.tanggal}.`);
                        const waUrl = res.telepon ? `https://wa.me/${res.telepon.replace(/^0/, '62')}?text=${waMsg}` : '#';

                        return `
                          <tr class="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                            <td class="py-3.5 px-3">
                              <div class="flex items-center gap-3">
                                <div class="w-8 h-8 rounded-full bg-slate-200 text-slate-600 font-bold flex items-center justify-center text-xs">
                                  ${res.nama_pemesan ? res.nama_pemesan.charAt(0) : 'T'}
                                </div>
                                <div>
                                  <div class="font-bold text-slate-800">${res.nama_pemesan}</div>
                                  <div class="text-[10px] text-slate-400">${res.telepon || 'No Contact'}</div>
                                </div>
                              </div>
                            </td>
                            <td class="py-3.5 px-3 font-semibold text-slate-700">${res.paket}</td>
                            <td class="py-3.5 px-3 font-medium text-slate-500">${res.tanggal}</td>
                            <td class="py-3.5 px-3">
                              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badgeStyle}">
                                ${statusText}
                              </span>
                            </td>
                            <td class="py-3.5 px-3 text-right">
                              <div class="flex items-center justify-end gap-2">
                                ${res.telepon ? `
                                  <a href="${waUrl}" target="_blank" class="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[11px] font-semibold border border-emerald-200 transition-colors flex items-center gap-1">
                                    <span class="material-symbols-outlined text-xs">chat</span> WA
                                  </a>
                                ` : ''}
                                ${s === 'baru' || s === 'pending' ? `
                                  <button class="quick-confirm-btn px-2.5 py-1 rounded-lg bg-[#316342] text-white hover:bg-[#254d33] text-[11px] font-semibold transition-colors shadow-2xs" data-id="${res.rawId}">
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

            <!-- Right Column (4 cols) -->
            <div class="lg:col-span-4 flex flex-col gap-8">
              <!-- Reminders / Schedule Card Widget -->
              <div class="donezo-card p-6">
                <div class="flex items-center justify-between mb-4">
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-label">AGENDA HARI INI</span>
                  <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
                <h4 class="text-sm font-bold text-slate-800 m-0 mb-1">Rombongan Edukasi Wisata Durian</h4>
                <p class="text-xs text-slate-400 m-0 mb-4">Waktu: 14.00 WIB - 16.30 WIB (35 Pax)</p>
                <button id="sambut-wisatawan-btn" class="w-full py-2.5 px-4 rounded-xl bg-[#316342] hover:bg-[#254d33] text-white font-bold text-xs transition-colors shadow-sm flex items-center justify-center gap-2">
                  Mulai Sambut Wisatawan
                </button>
              </div>

              <!-- Circular Donut Gauge Progress Widget -->
              <div class="donezo-card p-6 flex flex-col items-center justify-center text-center">
                <h3 class="text-sm font-bold text-slate-800 m-0 mb-4 self-start">Progres Kunjungan</h3>
                
                <!-- Donut SVG Gauge -->
                <div class="relative w-36 h-36 flex items-center justify-center my-2">
                  <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path class="text-slate-100" stroke-width="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path class="text-[#316342]" stroke-dasharray="75, 100" stroke-width="3.5" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div class="absolute flex flex-col items-center justify-center">
                    <span class="text-2xl font-extrabold text-slate-800">75%</span>
                    <span class="text-[10px] font-semibold text-slate-400">Kunjungan Selesai</span>
                  </div>
                </div>

                <div class="flex items-center justify-center gap-4 text-[11px] font-medium text-slate-500 mt-4 w-full border-t border-slate-100 pt-3">
                  <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-[#316342]"></span> Completed</span>
                  <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-[#4ADE80]"></span> In Progress</span>
                  <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-slate-300"></span> Pending</span>
                </div>
              </div>

              <!-- Top Destinations / Services Card Widget -->
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
                      <div class="w-8 h-8 rounded-lg bg-emerald-100 text-[#316342] flex items-center justify-center font-bold text-xs">
                        01
                      </div>
                      <div>
                        <h4 class="text-xs font-bold text-slate-800 m-0">Kebun Durian Candimulyo</h4>
                        <p class="text-[10px] text-slate-400 m-0">Wisata Edukasi • 1.2k pengunjung</p>
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                        02
                      </div>
                      <div>
                        <h4 class="text-xs font-bold text-slate-800 m-0">Susur Sungai Tampir</h4>
                        <p class="text-[10px] text-slate-400 m-0">Wisata Alam • 850 pengunjung</p>
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                        03
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

    const filterSelect = container.querySelector('#chart-period-filter');
    if (filterSelect) {
      filterSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        const bars = container.querySelectorAll('.chart-bar-el');
        const tooltips = container.querySelectorAll('.chart-tooltip span');
        const avgSummary = container.querySelector('#chart-avg-summary');
        const peakSummary = container.querySelector('#chart-peak-summary');

        if (val === 'bulan') {
          if (avgSummary) avgSummary.innerHTML = 'Rata-rata: <strong>340 Pengunjung/Minggu</strong>';
          if (peakSummary) peakSummary.innerHTML = 'Minggu Puncak: <strong>Minggu ke-3 (420 Pax)</strong>';
          const heights = ['55%', '70%', '95%', '85%', '60%', '75%', '85%'];
          const counts = ['210 Pax', '290 Pax', '420 Pax (Peak)', '350 Pax', '240 Pax', '310 Pax', '380 Pax'];
          bars.forEach((bar, idx) => {
            if (bar) bar.style.height = heights[idx] || '50%';
            if (tooltips[idx]) tooltips[idx].innerHTML = `Minggu ${idx + 1}: <strong>${counts[idx]}</strong>`;
          });
          showToast('Menampilkan data tren statistik Bulan Ini', 'info');
        } else if (val === 'tahun') {
          if (avgSummary) avgSummary.innerHTML = 'Rata-rata: <strong>1.450 Pengunjung/Bulan</strong>';
          if (peakSummary) peakSummary.innerHTML = 'Bulan Puncak: <strong>Agustus (2.100 Pax)</strong>';
          const heights = ['40%', '50%', '65%', '70%', '75%', '80%', '95%'];
          const counts = ['850 Pax', '1.100 Pax', '1.350 Pax', '1.500 Pax', '1.650 Pax', '1.800 Pax', '2.100 Pax (Peak)'];
          bars.forEach((bar, idx) => {
            if (bar) bar.style.height = heights[idx] || '50%';
            if (tooltips[idx]) tooltips[idx].innerHTML = `Bulan ${idx + 1}: <strong>${counts[idx]}</strong>`;
          });
          showToast('Menampilkan data tren statistik Tahun Ini', 'info');
        } else {
          if (avgSummary) avgSummary.innerHTML = 'Rata-rata: <strong>86 Pengunjung/Hari</strong>';
          if (peakSummary) peakSummary.innerHTML = 'Hari Puncak: <strong>Rabu (145 Pax)</strong>';
          const heights = ['45%', '60%', '92%', '74%', '55%', '68%', '82%'];
          const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
          const counts = ['45 Pax', '60 Pax', '145 Pax (Peak)', '90 Pax', '55 Pax', '85 Pax', '110 Pax'];
          bars.forEach((bar, idx) => {
            if (bar) bar.style.height = heights[idx] || '50%';
            if (tooltips[idx]) tooltips[idx].innerHTML = `${days[idx]}: <strong>${counts[idx]}</strong>`;
          });
          showToast('Menampilkan data tren statistik Minggu Ini', 'info');
        }
      });
    }

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


