import { auth } from '../../utils/auth.js';
import { renderSidebar, initAdminSidebarEvents } from '../components/sidebar.js';
import { renderAdminHeader } from '../components/header.js';
import { showToast } from '../../components/toast.js';
import { supabase, isSupabaseConfigured } from '../../lib/supabase.js';
import { mockData } from '../../data/seed.js';
import { getDateRange, fetchDashboardStats } from '../services/dashboard-data.js';

export const renderAdminOverview = async () => {
  const isAuthed = await auth.requireAuth();
  if (!isAuthed) return document.createElement('div');

  let selectedPeriod = 'minggu'; // default
  let dashboardData = null;

  const loadData = async () => {
    const { startDate, endDate } = getDateRange(selectedPeriod);
    dashboardData = await fetchDashboardStats(startDate, endDate);
  };

  await loadData();

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  const container = document.createElement('div');
  container.className = 'dashboard-wrapper donezo-bg';

  // ============================================================
  // CHART HELPER FUNCTIONS
  // ============================================================

  const _renderChartBars = (chartData) => {
    if (!chartData || chartData.length === 0) {
      return '<div class="flex-1 flex items-center justify-center text-xs text-slate-400 font-medium py-8">Belum ada data kunjungan di periode ini.</div>';
    }
    const maxVal = Math.max(...chartData.map(d => d.value), 1);
    const displayData = chartData; // Display all grouped buckets (5 hours, 7 days, 4 weeks, 12 months)

    return displayData.map((item) => {
      const pct = Math.max(5, Math.round((item.value / maxVal) * 92));
      const isPeak = item.value === maxVal && item.value > 0;
      const barColor = isPeak
        ? 'bg-[#316342]'
        : item.value > maxVal * 0.7
          ? 'bg-[#316342]/80'
          : item.value > maxVal * 0.4
            ? 'bg-[#4ADE80]'
            : 'bg-slate-200/80';

      return `
        <div class="group flex flex-col items-center gap-1.5 flex-1 h-full justify-end relative cursor-pointer min-w-0">
          ${isPeak ? `<span class="absolute -top-7 px-1.5 py-0.5 rounded-md bg-emerald-50 text-[#316342] font-bold text-[9px] sm:text-[10px] border border-emerald-200 shadow-2xs whitespace-nowrap">Puncak</span>` : ''}
          <div class="chart-tooltip opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-200 pointer-events-none absolute ${isPeak ? '-top-14' : '-top-11'} left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-medium py-1.5 px-2.5 rounded-lg shadow-xl z-20 whitespace-nowrap">
            <span>${item.label}: <strong>${item.value} Wisatawan</strong></span>
            <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
          </div>
          <div class="w-full max-w-[32px] sm:max-w-[38px] ${barColor} group-hover:bg-[#316342] rounded-full transition-all duration-300 ${isPeak ? 'shadow-md' : ''}" style="height: ${pct}%"></div>
          <span class="text-[10px] sm:text-[11px] font-semibold text-center whitespace-nowrap truncate w-full ${isPeak ? 'text-[#316342] font-bold' : 'text-slate-400 group-hover:text-slate-700'}" title="${item.label}">${item.label}</span>
        </div>
      `;
    }).join('');
  };

  const _getChartSummary = (chartData) => {
    if (!chartData || chartData.length === 0) {
      return { avgLabel: 'Rata-rata: <strong>0 Pengunjung</strong>', peakLabel: 'Belum ada data puncak' };
    }
    const total = chartData.reduce((s, d) => s + d.value, 0);
    const avg = Math.round(total / chartData.length);
    const peak = chartData.reduce((max, d) => d.value > max.value ? d : max, chartData[0]);
    return {
      avgLabel: `Rata-rata: <strong>${avg} Pengunjung</strong>`,
      peakLabel: `Puncak: <strong>${peak.label} (${peak.value} Pax)</strong>`,
    };
  };

  // ============================================================
  // RENDER PAGE SHELL & CONTENT
  // ============================================================

  // Build outer wrapper shell once
  container.innerHTML = `
    ${renderSidebar('overview')}
    <main class="admin-main donezo-bg h-full overflow-hidden flex flex-col">
      ${renderAdminHeader('Dashboard Overview')}
      <div id="dashboard-view-content" class="flex-1 overflow-y-auto p-8 w-full"></div>
    </main>
  `;

  setTimeout(() => initAdminSidebarEvents(), 0);

  const viewContent = container.querySelector('#dashboard-view-content');

  // ============================================================
  // RENDER CONTENT AREA
  // ============================================================

  const renderDashboardContent = () => {
    const d = dashboardData;
    const nSelesai = d.reservasiSelesai || 0;
    const nProses = d.reservasiDikonfirmasi || 0;
    const nPending = d.reservasiPending || 0;
    const totalRes = nSelesai + nProses + nPending;

    let pctSelesai = 0;
    let pctProses = 0;
    let pctPending = 0;

    if (totalRes > 0) {
      pctSelesai = Math.round((nSelesai / totalRes) * 100);
      pctProses = Math.round((nProses / totalRes) * 100);
      pctPending = Math.max(0, 100 - pctSelesai - pctProses);
    }

    const { label: periodLabel } = getDateRange(selectedPeriod);
    const periodButtons = ['hari', 'minggu', 'bulan', 'tahun', 'semua'];
    const periodLabels = { hari: 'Hari Ini', minggu: '7 Hari', bulan: 'Bulan Ini', tahun: 'Tahun Ini', semua: 'Semua' };

    viewContent.innerHTML = `
      <!-- Page Header & Global Period Filter -->
      <div class="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 class="font-display-lg text-3xl font-extrabold text-slate-800 m-0">Dashboard</h1>
          <p class="text-sm font-medium text-slate-400 m-0 mt-1">Kelola, pantau, dan selesaikan reservasi serta operasional desa wisata dengan mudah.</p>
        </div>
        <div class="flex items-center gap-3 flex-wrap">
          <!-- GLOBAL PERIOD FILTER (Pill Group) -->
          <div class="flex items-center gap-1 bg-white border border-slate-200 rounded-full px-1.5 py-1 shadow-2xs">
            ${periodButtons.map(p => `
              <button class="global-period-btn px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${selectedPeriod === p
                ? 'bg-[#316342] text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }" data-period="${p}">
                ${periodLabels[p]}
              </button>
            `).join('')}
          </div>

          <a href="#/admin/destinasi" class="px-5 py-2.5 rounded-full bg-[#316342] text-white font-bold text-xs hover:bg-[#254d33] transition-colors shadow-md flex items-center gap-2">
            <span class="material-symbols-outlined text-sm">add</span>
            Tambah Destinasi
          </a>
        </div>
      </div>

      <!-- Hero Stat Cards Grid (4 Cards) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Card 1: Reservasi Perlu Konfirmasi (Dark Hero) -->
        <div class="donezo-hero-card p-6 flex flex-col justify-between relative overflow-hidden">
          <div class="flex items-start justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-emerald-100/90 font-label">Reservasi Perlu Konfirmasi</span>
            <a href="#/admin/reservasi" class="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors">
              <span class="material-symbols-outlined text-base">north_east</span>
            </a>
          </div>
          <div class="mt-6">
            <h2 class="text-4xl font-extrabold text-white m-0 tracking-tight">${nPending}</h2>
            <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-[11px] font-semibold text-emerald-100 mt-3">
              <span>Periode: ${periodLabel}</span>
            </div>
          </div>
        </div>

        <!-- Card 2: Kunjungan Selesai -->
        <div class="donezo-card p-6 flex flex-col justify-between">
          <div class="flex items-start justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400 font-label">Kunjungan Selesai</span>
            <a href="#/admin/reservasi" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors">
              <span class="material-symbols-outlined text-base">north_east</span>
            </a>
          </div>
          <div class="mt-6">
            <h2 class="text-4xl font-extrabold text-slate-800 m-0 tracking-tight">${nSelesai}</h2>
            <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-[11px] font-semibold text-emerald-700 mt-3 border border-emerald-100">
              <span>Periode: ${periodLabel}</span>
            </div>
          </div>
        </div>

        <!-- Card 3: Total Destinasi -->
        <div class="donezo-card p-6 flex flex-col justify-between">
          <div class="flex items-start justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400 font-label">Total Destinasi</span>
            <a href="#/admin/destinasi" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors">
              <span class="material-symbols-outlined text-base">north_east</span>
            </a>
          </div>
          <div class="mt-6">
            <h2 class="text-4xl font-extrabold text-slate-800 m-0 tracking-tight">${d.totalDestinasi}</h2>
            <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-[11px] font-semibold text-blue-700 mt-3 border border-blue-100">
              <span>↗ ${d.totalDestinasi} Objek Wisata Aktif</span>
            </div>
          </div>
        </div>

        <!-- Card 4: Estimasi Pendapatan -->
        <div class="donezo-card p-6 flex flex-col justify-between">
          <div class="flex items-start justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400 font-label">Estimasi Pendapatan</span>
            <a href="#/admin/reservasi" class="w-8 h-8 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition-colors">
              <span class="material-symbols-outlined text-base">payments</span>
            </a>
          </div>
          <div class="mt-6">
            <h2 class="text-2xl lg:text-3xl font-extrabold text-slate-800 m-0 tracking-tight">${formatRupiah(d.estimasiPendapatan)}</h2>
            <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-[11px] font-semibold text-emerald-700 mt-3 border border-emerald-100">
              <span>↗ Terkonfirmasi & Selesai (${periodLabel})</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Layout Grid (2 Columns: 8/12 & 4/12) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Left Column (8 cols) -->
        <div class="lg:col-span-8 flex flex-col gap-8">
          <!-- Analytics Bar Chart Widget (Dynamic) -->
          <div class="donezo-card p-6">
            <div class="flex items-center justify-between mb-6 flex-wrap gap-2">
              <div>
                <h3 class="text-lg font-bold text-slate-800 m-0">Analisis Kunjungan Wisatawan</h3>
                <p class="text-xs text-slate-400 m-0 mt-0.5">Statistik tren pengunjung — ${periodLabel}.</p>
              </div>
            </div>

            <!-- Dynamic Pill Bar Chart -->
            <div id="chart-bars-container" class="flex items-end justify-between gap-2.5 pt-8 px-1 border-b border-slate-100" style="height: 220px;">
              ${_renderChartBars(d.chartData)}
            </div>

            <!-- Footer Summary Legend -->
            <div class="mt-4 pt-3 flex items-center justify-between text-xs font-medium text-slate-500 flex-wrap gap-2">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-[#316342]"></span>
                <span>${_getChartSummary(d.chartData).avgLabel}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>${_getChartSummary(d.chartData).peakLabel}</span>
              </div>
            </div>
          </div>

          <!-- Actionable Recent Reservations Table Widget -->
          <div class="donezo-card p-6 overflow-hidden">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="text-lg font-bold text-slate-800 m-0">Reservasi Terbaru</h3>
                <p class="text-xs text-slate-400 m-0 mt-0.5">Daftar transaksi wisatawan terbaru — ${periodLabel}.</p>
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
                  ${d.recentReservations.length === 0 ? `
                    <tr>
                      <td colspan="5" class="py-8 text-center text-slate-400">Belum ada reservasi di periode ini.</td>
                    </tr>
                  ` : d.recentReservations.map(res => {
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

          <!-- Testimonial Moderation Card Widget -->
          <div class="donezo-card p-6 overflow-hidden">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="text-lg font-bold text-slate-800 m-0">Moderasi Ulasan Pengunjung</h3>
                <p class="text-xs text-slate-400 m-0 mt-0.5">Ulasan baru dari pengunjung website yang memerlukan persetujuan.</p>
              </div>
              <span class="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">${d.pendingTestimonials.length} Menunggu</span>
            </div>
            ${d.pendingTestimonials.length === 0 ? `
              <div class="py-6 text-center text-slate-400 text-xs font-medium">Tidak ada ulasan baru yang menunggu moderasi.</div>
            ` : `
              <div class="space-y-3">
                ${d.pendingTestimonials.map(t => `
                  <div class="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <div class="flex items-center gap-2 mb-1">
                        <span class="font-bold text-xs text-slate-800">${t.nama}</span>
                        <span class="text-[10px] text-slate-400">(${t.asal || 'Pengunjung'})</span>
                        <span class="text-amber-500 text-xs ml-2">${'★'.repeat(t.rating || 5)}</span>
                      </div>
                      <p class="text-xs text-slate-600 italic m-0">"${t.pesan}"</p>
                    </div>
                    <div class="flex items-center gap-2 shrink-0">
                      <button class="approve-test-btn px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-2xs" data-id="${t.id}">Setujui & Tampilkan</button>
                      <button class="reject-test-btn px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-colors" data-id="${t.id}">Hapus</button>
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>
        </div>

        <!-- Right Column (4 cols) -->
        <div class="lg:col-span-4 flex flex-col gap-8">
          <!-- Agenda Hari Ini Widget (Dynamic) -->
          <div class="donezo-card p-6">
            <div class="flex items-center justify-between mb-4">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-label">AGENDA HARI INI</span>
              <span class="w-2 h-2 rounded-full ${d.agendaHariIni.length > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}"></span>
            </div>
            ${d.agendaHariIni.length > 0 ? `
              <div class="flex flex-col gap-3">
                ${d.agendaHariIni.map(a => `
                  <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div>
                      <h4 class="text-sm font-bold text-slate-800 m-0">${a.paket}</h4>
                      <p class="text-xs text-slate-400 m-0 mt-0.5">${a.nama} — ${a.jumlah_orang} Pax</p>
                    </div>
                    <span class="px-2.5 py-1 rounded-full text-[10px] font-bold ${a.status === 'dikonfirmasi' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}">${a.status}</span>
                  </div>
                `).join('')}
              </div>
              <button id="sambut-wisatawan-btn" class="w-full mt-4 py-2.5 px-4 rounded-xl bg-[#316342] hover:bg-[#254d33] text-white font-bold text-xs transition-colors shadow-sm flex items-center justify-center gap-2">
                Mulai Sambut Wisatawan
              </button>
            ` : `
              <div class="py-6 text-center">
                <span class="material-symbols-outlined text-3xl text-slate-300 mb-2">event_available</span>
                <p class="text-xs text-slate-400 font-medium m-0">Tidak ada kunjungan terjadwal hari ini.</p>
              </div>
            `}
          </div>

          <!-- Circular Donut Gauge Progress Widget -->
          <div class="donezo-card p-6 flex flex-col items-center justify-center text-center">
            <h3 class="text-sm font-bold text-slate-800 m-0 mb-4 self-start">Progres Kunjungan (${periodLabel})</h3>
            
            <!-- Donut SVG Gauge -->
            <div class="relative w-36 h-36 flex items-center justify-center my-2">
              <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <!-- Base Track -->
                <path class="text-slate-100" stroke-width="3.8" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                
                <!-- Segment 1: Selesai (Dark Green) -->
                ${pctSelesai > 0 ? `
                  <path class="text-[#316342] transition-all duration-500 ease-out" stroke-width="3.8" stroke-dasharray="${pctSelesai} ${100 - pctSelesai}" stroke-dashoffset="0" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                ` : ''}

                <!-- Segment 2: Proses (Light Green) -->
                ${pctProses > 0 ? `
                  <path class="text-[#4ADE80] transition-all duration-500 ease-out" stroke-width="3.8" stroke-dasharray="${pctProses} ${100 - pctProses}" stroke-dashoffset="-${pctSelesai}" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                ` : ''}

                <!-- Segment 3: Pending (Amber) -->
                ${pctPending > 0 ? `
                  <path class="text-amber-400 transition-all duration-500 ease-out" stroke-width="3.8" stroke-dasharray="${pctPending} ${100 - pctPending}" stroke-dashoffset="-${pctSelesai + pctProses}" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                ` : ''}
              </svg>

              <div class="absolute flex flex-col items-center justify-center">
                <span class="text-3xl font-extrabold text-slate-800 tracking-tight">${totalRes}</span>
                <span class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total Reservasi</span>
              </div>
            </div>

            <div class="flex items-center justify-center gap-3 text-[11px] font-medium text-slate-500 mt-4 w-full border-t border-slate-100 pt-3 flex-wrap">
              <span class="flex items-center gap-1.5" title="Kunjungan Selesai"><span class="w-2.5 h-2.5 rounded-full bg-[#316342]"></span> Selesai (${nSelesai})</span>
              <span class="flex items-center gap-1.5" title="Dalam Proses / Dikonfirmasi"><span class="w-2.5 h-2.5 rounded-full bg-[#4ADE80]"></span> Proses (${nProses})</span>
              <span class="flex items-center gap-1.5" title="Pending / Perlu Konfirmasi"><span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Pending (${nPending})</span>
            </div>
          </div>

          <!-- Destinasi Populer Widget (Dynamic) -->
          <div class="donezo-card p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-base font-bold text-slate-800 m-0">Destinasi Populer</h3>
              <a href="#/admin/destinasi" class="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px]">
                + New
              </a>
            </div>

            <div class="flex flex-col gap-3.5">
              ${d.destinasiPopuler.length > 0 ? d.destinasiPopuler.map((dest, idx) => {
                const colors = [
                  'bg-emerald-100 text-[#316342]',
                  'bg-blue-100 text-blue-700',
                  'bg-amber-100 text-amber-700',
                ];
                return `
                  <div class="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-lg ${colors[idx] || colors[2]} flex items-center justify-center font-bold text-xs">
                        ${String(idx + 1).padStart(2, '0')}
                      </div>
                      <div>
                        <h4 class="text-xs font-bold text-slate-800 m-0">${dest.nama}</h4>
                        <p class="text-[10px] text-slate-400 m-0">${dest.kategori} • ${dest.totalPengunjung} pengunjung</p>
                      </div>
                    </div>
                  </div>
                `;
              }).join('') : `
                <div class="py-4 text-center text-xs text-slate-400 font-medium">Belum ada data kunjungan di periode ini.</div>
              `}
            </div>
          </div>
        </div>
      </div>
    `;

    bindContentEvents();
  };

  // ============================================================
  // BIND CONTENT EVENTS
  // ============================================================

  const bindContentEvents = () => {
    // --- GLOBAL PERIOD FILTER ---
    viewContent.querySelectorAll('.global-period-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const period = e.currentTarget.getAttribute('data-period');
        if (period === selectedPeriod) return;

        selectedPeriod = period;

        // Instant UI feedback: Highlight active button immediately without animation extra DOM nodes
        viewContent.querySelectorAll('.global-period-btn').forEach(b => {
          const p = b.getAttribute('data-period');
          const isSelected = p === selectedPeriod;
          b.className = `global-period-btn px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
            isSelected
              ? 'bg-[#316342] text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`;
        });

        const { label } = getDateRange(period);
        showToast(`Menampilkan data periode: ${label}`, 'info');

        await loadData();
        renderDashboardContent();
      });
    });

    // --- Quick Confirm Reservasi ---
    viewContent.querySelectorAll('.quick-confirm-btn').forEach(btn => {
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
        renderDashboardContent();
      });
    });

    // --- Sambut Wisatawan Button ---
    const sambutBtn = viewContent.querySelector('#sambut-wisatawan-btn');
    if (sambutBtn) {
      sambutBtn.addEventListener('click', () => {
        showToast('Selamat datang para wisatawan! 🎉 Semoga menikmati kunjungan hari ini.', 'success');
      });
    }

    // --- Testimonial Moderation ---
    viewContent.querySelectorAll('.approve-test-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        btn.disabled = true;
        btn.innerText = 'Menyetujui...';

        if (isSupabaseConfigured() && supabase) {
          try {
            await supabase.from('testimoni').update({ is_shown: true }).eq('id', id);
            showToast('Ulasan berhasil disetujui & ditampilkan di beranda!', 'success');
          } catch (err) {
            showToast('Gagal menyetujui ulasan: ' + err.message, 'error');
          }
        } else {
          const item = mockData.testimoni.find(t => t.id === id);
          if (item) item.is_shown = true;
          showToast('Ulasan disetujui (Demo mode)!', 'success');
        }

        await loadData();
        renderDashboardContent();
      });
    });

    viewContent.querySelectorAll('.reject-test-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        btn.disabled = true;

        if (isSupabaseConfigured() && supabase) {
          try {
            await supabase.from('testimoni').delete().eq('id', id);
            showToast('Ulasan berhasil dihapus.', 'info');
          } catch (err) {
            showToast('Gagal menghapus ulasan: ' + err.message, 'error');
          }
        } else {
          const idx = mockData.testimoni.findIndex(t => t.id === id);
          if (idx !== -1) mockData.testimoni.splice(idx, 1);
          showToast('Ulasan dihapus (Demo mode).', 'info');
        }

        await loadData();
        renderDashboardContent();
      });
    });
  };

  renderDashboardContent();
  return container;
};
