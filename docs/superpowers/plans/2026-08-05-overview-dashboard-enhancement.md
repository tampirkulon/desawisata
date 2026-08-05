# Dashboard Overview Enhancement — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the admin Dashboard Overview page to use a global period filter that controls all data cards — replacing hardcoded/mock data with dynamic Supabase queries with mockData fallback.

**Architecture:** Extract a new `src/admin/services/dashboard-data.js` module responsible for all date-range-aware data fetching (Supabase + mockData fallback). The overview page becomes a thin rendering layer that calls this service whenever the global period changes. The global filter dropdown moves from inside the chart card to the page header bar, and a single `onChange` re-fetches + re-renders all widgets.

**Tech Stack:** Vanilla JS (ES Modules), Supabase JS Client v2, Vite, Tailwind CDN (existing)

## Global Constraints

- No new npm dependencies — use only `@supabase/supabase-js` (already installed) and browser APIs
- Follow existing patterns: `loadData()` → `renderPage()` → `bindEvents()` lifecycle in admin pages
- All Supabase queries must have a mockData fallback (use `isSupabaseConfigured()` guard)
- Preserve all existing CSS classes (`donezo-card`, `donezo-hero-card`, etc.) and Tailwind utility classes
- DB schema is read-only — no migrations. Tables used: `reservasi` (columns: `id`, `nama`, `email`, `telepon`, `tanggal_kunjungan` DATE, `jumlah_orang` INT, `paket_id` UUID FK, `status` TEXT, `created_at` TIMESTAMPTZ), `paket_wisata` (columns: `id`, `nama`, `harga` INT), `destinasi` (columns: `id`, `nama`, `kategori_id`), `testimoni`
- Preserve the existing Tailwind CDN runtime approach (optimasi ditunda per user request)
- File: `overview.js` is currently 693 lines. We will extract the data layer to keep it focused.

---

### Task 1: Create Dashboard Data Service Module

**Files:**
- Create: `src/admin/services/dashboard-data.js`

**Interfaces:**
- Consumes: `supabase` and `isSupabaseConfigured()` from `src/lib/supabase.js`, `mockData` from `src/data/seed.js`
- Produces:
  - `getDateRange(period: string): { startDate: string, endDate: string, label: string }` — returns ISO date strings for the selected period
  - `fetchDashboardStats(startDate: string, endDate: string): Promise<DashboardStats>` — returns all statistics for the dashboard
  - `DashboardStats` shape: `{ reservasiPending, reservasiDikonfirmasi, reservasiSelesai, totalDestinasi, totalPaket, totalArtikel, totalGaleri, estimasiPendapatan, recentReservations[], agendaHariIni[], destinasiPopuler[], chartData[], pendingTestimonials[], periodLabel }`

- [ ] **Step 1: Create `getDateRange` helper**

Create `src/admin/services/dashboard-data.js`:

```js
import { supabase, isSupabaseConfigured } from '../../lib/supabase.js';
import { mockData } from '../../data/seed.js';

/**
 * Calculate start/end ISO date strings for a given period.
 * @param {'hari'|'minggu'|'bulan'|'tahun'|'semua'} period
 * @returns {{ startDate: string|null, endDate: string, label: string }}
 */
export const getDateRange = (period) => {
  const now = new Date();
  const endDate = now.toISOString().split('T')[0]; // YYYY-MM-DD

  switch (period) {
    case 'hari': {
      return { startDate: endDate, endDate, label: 'Hari Ini' };
    }
    case 'minggu': {
      const start = new Date(now);
      start.setDate(now.getDate() - 6);
      return { startDate: start.toISOString().split('T')[0], endDate, label: 'Minggu Ini' };
    }
    case 'bulan': {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return { startDate: start.toISOString().split('T')[0], endDate, label: 'Bulan Ini' };
    }
    case 'tahun': {
      const start = new Date(now.getFullYear(), 0, 1);
      return { startDate: start.toISOString().split('T')[0], endDate, label: 'Tahun Ini' };
    }
    case 'semua':
    default:
      return { startDate: null, endDate, label: 'Semua Waktu' };
  }
};
```

- [ ] **Step 2: Create `fetchDashboardStats` function**

Append to `src/admin/services/dashboard-data.js`:

```js
/**
 * Fetch all dashboard statistics filtered by date range.
 * Falls back to mockData when Supabase is not configured.
 * @param {string|null} startDate - ISO date string (YYYY-MM-DD) or null for all time
 * @param {string} endDate - ISO date string (YYYY-MM-DD)
 * @returns {Promise<object>} DashboardStats
 */
export const fetchDashboardStats = async (startDate, endDate) => {
  const stats = {
    reservasiPending: 0,
    reservasiDikonfirmasi: 0,
    reservasiSelesai: 0,
    totalDestinasi: 0,
    totalPaket: 0,
    totalArtikel: 0,
    totalGaleri: 0,
    estimasiPendapatan: 0,
    recentReservations: [],
    agendaHariIni: [],
    destinasiPopuler: [],
    chartData: [],
    pendingTestimonials: [],
  };

  if (isSupabaseConfigured() && supabase) {
    try {
      await _fetchFromSupabase(stats, startDate, endDate);
    } catch (e) {
      console.warn('Dashboard Supabase fetch failed, using mockData:', e);
      _fetchFromMock(stats, startDate, endDate);
    }
  } else {
    _fetchFromMock(stats, startDate, endDate);
  }

  return stats;
};

/** @private */
const _filterByDateRange = (items, dateField, startDate, endDate) => {
  return items.filter(item => {
    const d = item[dateField];
    if (!d) return false;
    const dateStr = typeof d === 'string' ? d.split('T')[0] : d;
    if (startDate && dateStr < startDate) return false;
    if (endDate && dateStr > endDate) return false;
    return true;
  });
};

/** @private */
const _fetchFromMock = (stats, startDate, endDate) => {
  // Filter reservasi by date range
  const filtered = startDate
    ? _filterByDateRange(mockData.reservasi, 'tanggal_kunjungan', startDate, endDate)
    : [...mockData.reservasi];

  stats.reservasiPending = filtered.filter(r => r.status === 'baru' || r.status === 'pending').length;
  stats.reservasiDikonfirmasi = filtered.filter(r => r.status === 'dikonfirmasi').length;
  stats.reservasiSelesai = filtered.filter(r => r.status === 'selesai').length;

  // Static counts (not date-filtered)
  stats.totalDestinasi = mockData.destinasi.length;
  stats.totalPaket = mockData.paket_wisata.length;
  stats.totalArtikel = mockData.artikel.length;
  stats.totalGaleri = mockData.galeri.length;

  // Revenue from filtered reservasi
  stats.estimasiPendapatan = filtered
    .filter(r => r.status === 'selesai' || r.status === 'dikonfirmasi')
    .reduce((sum, r) => {
      const pkt = mockData.paket_wisata.find(p => p.id === r.paket_id);
      const pax = r.jumlah_orang || r.jumlah_peserta || 1;
      const price = pkt ? pkt.harga : 50000;
      return sum + (pax * price);
    }, 0);

  // Recent reservations (from filtered set, max 5)
  stats.recentReservations = filtered.slice(0, 5).map((r, i) => {
    const pkt = mockData.paket_wisata.find(p => p.id === r.paket_id);
    return {
      rawId: r.id,
      displayId: `#RES-${String(i + 1).padStart(3, '0')}`,
      nama_pemesan: r.nama || r.nama_pemesan || 'Tamu',
      telepon: r.telepon || '',
      paket: pkt ? pkt.nama : 'Kunjungan Mandiri',
      tanggal: r.tanggal_kunjungan,
      jumlah_orang: r.jumlah_orang || 1,
      status: (r.status || 'baru').toLowerCase(),
    };
  });

  // Agenda hari ini
  const today = new Date().toISOString().split('T')[0];
  const todayReservations = mockData.reservasi.filter(r => {
    const d = r.tanggal_kunjungan;
    return d && d.split('T')[0] === today && r.status !== 'dibatalkan';
  });
  stats.agendaHariIni = todayReservations.map(r => {
    const pkt = mockData.paket_wisata.find(p => p.id === r.paket_id);
    return {
      id: r.id,
      nama: r.nama || 'Tamu',
      paket: pkt ? pkt.nama : 'Kunjungan Mandiri',
      jumlah_orang: r.jumlah_orang || 1,
      tanggal: r.tanggal_kunjungan,
      status: r.status,
    };
  });

  // Destinasi populer (count reservasi per paket -> per destinasi)
  const paketCount = {};
  filtered.forEach(r => {
    if (r.paket_id) {
      paketCount[r.paket_id] = (paketCount[r.paket_id] || 0) + (r.jumlah_orang || 1);
    }
  });
  stats.destinasiPopuler = mockData.destinasi.map(d => {
    // Find paket_wisata that include this destinasi
    const relatedPakets = mockData.paket_wisata.filter(p =>
      (p.destinasi_ids || []).includes(d.id)
    );
    const totalPax = relatedPakets.reduce((sum, p) => sum + (paketCount[p.id] || 0), 0);
    const kategori = mockData.kategori_wisata
      ? mockData.kategori_wisata.find(k => k.id === d.kategori_id)
      : null;
    return {
      id: d.id,
      nama: d.nama,
      kategori: kategori ? kategori.nama : 'Wisata',
      totalPengunjung: totalPax,
    };
  }).sort((a, b) => b.totalPengunjung - a.totalPengunjung).slice(0, 3);

  // Chart data (aggregate visitors by day/week/month)
  stats.chartData = _buildChartData(filtered, startDate, endDate);

  // Pending testimonials (not date-filtered)
  stats.pendingTestimonials = mockData.testimoni.filter(t => !t.is_shown);
};

/** @private */
const _fetchFromSupabase = async (stats, startDate, endDate) => {
  // --- Reservasi counts (filtered by tanggal_kunjungan) ---
  const buildQuery = (statusFilter) => {
    let q = supabase.from('reservasi').select('*', { count: 'exact', head: true });
    if (startDate) q = q.gte('tanggal_kunjungan', startDate);
    q = q.lte('tanggal_kunjungan', endDate);
    if (statusFilter === 'pending') {
      q = q.or('status.eq.baru,status.eq.pending');
    } else if (statusFilter) {
      q = q.eq('status', statusFilter);
    }
    return q;
  };

  const [resPending, resDikonfirmasi, resSelesai] = await Promise.all([
    buildQuery('pending'),
    buildQuery('dikonfirmasi'),
    buildQuery('selesai'),
  ]);

  stats.reservasiPending = resPending.count || 0;
  stats.reservasiDikonfirmasi = resDikonfirmasi.count || 0;
  stats.reservasiSelesai = resSelesai.count || 0;

  // --- Static counts ---
  const [cDest, cPaket, cBlog, cGal] = await Promise.all([
    supabase.from('destinasi').select('*', { count: 'exact', head: true }),
    supabase.from('paket_wisata').select('*', { count: 'exact', head: true }),
    supabase.from('artikel').select('*', { count: 'exact', head: true }),
    supabase.from('galeri').select('*', { count: 'exact', head: true }),
  ]);
  stats.totalDestinasi = cDest.count || 0;
  stats.totalPaket = cPaket.count || 0;
  stats.totalArtikel = cBlog.count || 0;
  stats.totalGaleri = cGal.count || 0;

  // --- Estimasi Pendapatan (ALL matching reservasi, no limit) ---
  let revQuery = supabase.from('reservasi')
    .select('jumlah_orang, paket_wisata(harga)')
    .or('status.eq.selesai,status.eq.dikonfirmasi');
  if (startDate) revQuery = revQuery.gte('tanggal_kunjungan', startDate);
  revQuery = revQuery.lte('tanggal_kunjungan', endDate);
  const { data: revData } = await revQuery;

  if (revData) {
    stats.estimasiPendapatan = revData.reduce((sum, r) => {
      const pax = r.jumlah_orang || 1;
      const price = r.paket_wisata?.harga || 50000;
      return sum + (pax * price);
    }, 0);
  }

  // --- Recent Reservations (max 5, within period) ---
  let recQuery = supabase.from('reservasi')
    .select('*, paket_wisata(nama, harga)')
    .order('created_at', { ascending: false })
    .limit(5);
  if (startDate) recQuery = recQuery.gte('tanggal_kunjungan', startDate);
  recQuery = recQuery.lte('tanggal_kunjungan', endDate);
  const { data: recData } = await recQuery;

  if (recData && recData.length > 0) {
    stats.recentReservations = recData.map((r, i) => ({
      rawId: r.id,
      displayId: `#RES-${String(i + 1).padStart(3, '0')}`,
      nama_pemesan: r.nama || 'Tamu',
      telepon: r.telepon || '',
      paket: r.paket_wisata?.nama || 'Kunjungan Mandiri',
      tanggal: r.tanggal_kunjungan
        ? new Date(r.tanggal_kunjungan).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
        : 'Terbaru',
      jumlah_orang: r.jumlah_orang || 1,
      status: (r.status || 'baru').toLowerCase(),
    }));
  }

  // --- Agenda Hari Ini ---
  const today = new Date().toISOString().split('T')[0];
  const { data: agendaData } = await supabase.from('reservasi')
    .select('*, paket_wisata(nama)')
    .eq('tanggal_kunjungan', today)
    .neq('status', 'dibatalkan')
    .order('created_at', { ascending: true });

  if (agendaData) {
    stats.agendaHariIni = agendaData.map(r => ({
      id: r.id,
      nama: r.nama || 'Tamu',
      paket: r.paket_wisata?.nama || 'Kunjungan Mandiri',
      jumlah_orang: r.jumlah_orang || 1,
      tanggal: r.tanggal_kunjungan,
      status: r.status,
    }));
  }

  // --- Destinasi Populer (ranked by reservation count in period) ---
  let popQuery = supabase.from('reservasi')
    .select('paket_id, jumlah_orang');
  if (startDate) popQuery = popQuery.gte('tanggal_kunjungan', startDate);
  popQuery = popQuery.lte('tanggal_kunjungan', endDate);
  const { data: popData } = await popQuery;

  const { data: allDest } = await supabase.from('destinasi').select('id, nama, kategori_id');
  const { data: allPaket } = await supabase.from('paket_wisata').select('id, nama, destinasi_ids');
  const { data: allKategori } = await supabase.from('kategori_wisata').select('id, nama');

  if (popData && allDest && allPaket) {
    const paketPax = {};
    popData.forEach(r => {
      if (r.paket_id) {
        paketPax[r.paket_id] = (paketPax[r.paket_id] || 0) + (r.jumlah_orang || 1);
      }
    });

    stats.destinasiPopuler = allDest.map(d => {
      const relatedPakets = allPaket.filter(p =>
        (p.destinasi_ids || []).includes(d.id)
      );
      const totalPax = relatedPakets.reduce((sum, p) => sum + (paketPax[p.id] || 0), 0);
      const kat = allKategori ? allKategori.find(k => k.id === d.kategori_id) : null;
      return {
        id: d.id,
        nama: d.nama,
        kategori: kat ? kat.nama : 'Wisata',
        totalPengunjung: totalPax,
      };
    }).sort((a, b) => b.totalPengunjung - a.totalPengunjung).slice(0, 3);
  }

  // --- Chart Data ---
  let chartQuery = supabase.from('reservasi')
    .select('tanggal_kunjungan, jumlah_orang');
  if (startDate) chartQuery = chartQuery.gte('tanggal_kunjungan', startDate);
  chartQuery = chartQuery.lte('tanggal_kunjungan', endDate);
  const { data: chartRaw } = await chartQuery;

  if (chartRaw) {
    stats.chartData = _buildChartDataFromRecords(chartRaw, startDate, endDate);
  }

  // --- Pending Testimonials (not date-filtered) ---
  const { data: pendTest } = await supabase.from('testimoni')
    .select('*')
    .eq('is_shown', false)
    .order('created_at', { ascending: false });

  if (pendTest) stats.pendingTestimonials = pendTest;
};

/**
 * Build chart data from mock reservasi records.
 * Groups by day (minggu), week (bulan), or month (tahun).
 * @private
 */
const _buildChartData = (filteredReservasi, startDate, endDate) => {
  if (!startDate) {
    // 'Semua Waktu' — group by month, last 7 months
    return _groupByMonth(filteredReservasi, 7);
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

  if (diffDays <= 7) {
    // Minggu — group by day
    return _groupByDay(filteredReservasi, start, end);
  } else if (diffDays <= 31) {
    // Bulan — group by day but up to ~31 bars, show only 7 evenly spaced
    return _groupByDay(filteredReservasi, start, end);
  } else {
    // Tahun — group by month
    return _groupByMonth(filteredReservasi, 12);
  }
};

/** @private */
const _groupByDay = (records, startDate, endDate) => {
  const result = [];
  const current = new Date(startDate);
  while (current <= endDate) {
    const dateStr = current.toISOString().split('T')[0];
    const dayRecords = records.filter(r => {
      const d = r.tanggal_kunjungan;
      return d && d.split('T')[0] === dateStr;
    });
    const totalPax = dayRecords.reduce((sum, r) => sum + (r.jumlah_orang || 1), 0);
    result.push({
      label: current.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      value: totalPax,
      date: dateStr,
    });
    current.setDate(current.getDate() + 1);
  }
  return result;
};

/** @private */
const _groupByMonth = (records, maxMonths) => {
  const now = new Date();
  const result = [];
  for (let i = maxMonths - 1; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStr = monthDate.toISOString().slice(0, 7); // YYYY-MM
    const monthRecords = records.filter(r => {
      const d = r.tanggal_kunjungan;
      return d && d.startsWith(monthStr);
    });
    const totalPax = monthRecords.reduce((sum, r) => sum + (r.jumlah_orang || 1), 0);
    result.push({
      label: monthDate.toLocaleDateString('id-ID', { month: 'short' }),
      value: totalPax,
      date: monthStr,
    });
  }
  return result;
};

/**
 * Build chart data from raw Supabase records.
 * @private
 */
const _buildChartDataFromRecords = (rawRecords, startDate, endDate) => {
  // Re-use same logic by mapping to the format _buildChartData expects
  const mapped = rawRecords.map(r => ({
    tanggal_kunjungan: r.tanggal_kunjungan,
    jumlah_orang: r.jumlah_orang || 1,
  }));
  return _buildChartData(mapped, startDate, endDate);
};
```

- [ ] **Step 3: Verify module can be imported**

Run: `cd /home/aniiporangbaik/development/projects/desawisata && npx vite build --mode development 2>&1 | head -20`
Expected: No import/syntax errors related to `dashboard-data.js`

- [ ] **Step 4: Commit**

```bash
git add src/admin/services/dashboard-data.js
git commit -m "feat(admin): add dashboard data service with date-range filtering"
```

---

### Task 2: Refactor Overview Page — Global Period Filter & Data Integration

**Files:**
- Modify: `src/admin/pages/overview.js` (full refactor — lines 1–693)

**Interfaces:**
- Consumes: `getDateRange(period)` and `fetchDashboardStats(startDate, endDate)` from `src/admin/services/dashboard-data.js`
- Produces: Rendered dashboard DOM with global filter controlling all widgets

- [ ] **Step 1: Replace imports and data-loading with service calls**

In `src/admin/pages/overview.js`, replace lines 1–7 (imports) with:

```js
import { auth } from '../../utils/auth.js';
import { renderSidebar, initAdminSidebarEvents } from '../components/sidebar.js';
import { renderAdminHeader } from '../components/header.js';
import { showToast } from '../../components/toast.js';
import { supabase, isSupabaseConfigured } from '../../lib/supabase.js';
import { mockData } from '../../data/seed.js';
import { getDateRange, fetchDashboardStats } from '../services/dashboard-data.js';
```

- [ ] **Step 2: Replace state initialization and `loadData` function**

Replace lines 8–110 (from `export const renderAdminOverview` opening through `await loadData();`) with:

```js
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
```

- [ ] **Step 3: Rewrite `renderPage` — Page Header with Global Filter**

Replace the old page header section (lines ~143–157) with:

```js
  const renderPage = () => {
    const d = dashboardData;
    const nSelesai = d.reservasiSelesai || 0;
    const nProses = d.reservasiDikonfirmasi || 0;
    const nPending = d.reservasiPending || 0;
    const totalRes = nSelesai + nProses + nPending;
    const pctSelesai = totalRes > 0 ? Math.round((nSelesai / totalRes) * 100) : 0;
    const pctProses = totalRes > 0 ? Math.round((nProses / totalRes) * 100) : 0;
    const pctPending = totalRes > 0 ? Math.max(0, 100 - pctSelesai - pctProses) : 0;
    const { label: periodLabel } = getDateRange(selectedPeriod);

    container.innerHTML = `
      ${renderSidebar('overview')}

      <main class="admin-main donezo-bg h-full overflow-hidden flex flex-col">
        ${renderAdminHeader('Dashboard Overview')}

        <div class="flex-1 overflow-y-auto p-8 w-full">
          <!-- Page Header with GLOBAL PERIOD FILTER -->
          <div class="flex items-center justify-between flex-wrap gap-4 mb-8">
            <div>
              <h1 class="font-display-lg text-3xl font-extrabold text-slate-800 m-0">Dashboard</h1>
              <p class="text-sm font-medium text-slate-400 m-0 mt-1">Kelola, pantau, dan selesaikan reservasi serta operasional desa wisata dengan mudah.</p>
            </div>
            <div class="flex items-center gap-3">
              <!-- GLOBAL PERIOD FILTER -->
              <div class="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-1.5 py-1 shadow-2xs">
                ${['hari', 'minggu', 'bulan', 'tahun', 'semua'].map(p => `
                  <button class="global-period-btn px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${selectedPeriod === p
                    ? 'bg-[#316342] text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }" data-period="${p}">
                    ${p === 'hari' ? 'Hari Ini' : p === 'minggu' ? '7 Hari' : p === 'bulan' ? 'Bulan Ini' : p === 'tahun' ? 'Tahun Ini' : 'Semua'}
                  </button>
                `).join('')}
              </div>

              <a href="#/admin/destinasi" class="px-5 py-2.5 rounded-full bg-[#316342] text-white font-bold text-xs hover:bg-[#254d33] transition-colors shadow-md flex items-center gap-2">
                <span class="material-symbols-outlined text-sm">add</span>
                Tambah Destinasi
              </a>
            </div>
          </div>
```

- [ ] **Step 4: Rewrite Hero Stat Cards to use `dashboardData`**

Replace the 4-card grid section with:

```js
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
```

- [ ] **Step 5: Rewrite Chart Widget using dynamic `chartData`**

Replace the hardcoded bar chart HTML with a dynamically generated one:

```js
          <!-- Main Layout Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
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
```

- [ ] **Step 6: Rewrite Agenda Hari Ini widget with dynamic data**

Replace the static agenda card with:

```js
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
```

- [ ] **Step 7: Rewrite Destinasi Populer widget with dynamic ranking**

Replace the static top-3 list with:

```js
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
```

- [ ] **Step 8: Add helper functions for chart rendering**

Add these functions inside `renderAdminOverview` before `renderPage`:

```js
  const _renderChartBars = (chartData) => {
    if (!chartData || chartData.length === 0) {
      return '<div class="flex-1 flex items-center justify-center text-xs text-slate-400 font-medium">Belum ada data kunjungan.</div>';
    }
    const maxVal = Math.max(...chartData.map(d => d.value), 1);
    // Limit to 7 bars for display
    const displayData = chartData.length > 7
      ? _sampleEvenly(chartData, 7)
      : chartData;

    return displayData.map((item, idx) => {
      const pct = Math.max(5, Math.round((item.value / maxVal) * 92));
      const isPeak = item.value === maxVal && item.value > 0;
      const barColor = isPeak ? 'bg-[#316342]' : item.value > maxVal * 0.7 ? 'bg-[#316342]/80' : item.value > maxVal * 0.4 ? 'bg-[#4ADE80]' : 'bg-slate-200/80';

      return `
        <div class="group flex flex-col items-center gap-2 flex-1 h-full justify-end relative cursor-pointer">
          ${isPeak ? `<span class="absolute -top-7 px-2 py-0.5 rounded-md bg-emerald-50 text-[#316342] font-bold text-[10px] border border-emerald-200 shadow-2xs">Puncak</span>` : ''}
          <div class="chart-tooltip opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-200 pointer-events-none absolute ${isPeak ? '-top-14' : '-top-11'} left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-medium py-1.5 px-2.5 rounded-lg shadow-xl z-20 whitespace-nowrap">
            <span>${item.label}: <strong>${item.value} Wisatawan</strong></span>
            <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
          </div>
          <div class="w-full max-w-[38px] ${barColor} group-hover:bg-[#316342] rounded-full transition-all duration-300 ${isPeak ? 'shadow-md' : ''}" style="height: ${pct}%"></div>
          <span class="text-[11px] font-semibold ${isPeak ? 'text-[#316342] font-bold' : 'text-slate-400 group-hover:text-slate-700'}">${item.label}</span>
        </div>
      `;
    }).join('');
  };

  const _sampleEvenly = (arr, count) => {
    if (arr.length <= count) return arr;
    const result = [];
    const step = (arr.length - 1) / (count - 1);
    for (let i = 0; i < count; i++) {
      result.push(arr[Math.round(i * step)]);
    }
    return result;
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
```

- [ ] **Step 9: Rewrite `bindEvents` with global filter handler**

Replace the entire `bindEvents` function with:

```js
  const bindEvents = () => {
    initAdminSidebarEvents();

    // --- GLOBAL PERIOD FILTER ---
    container.querySelectorAll('.global-period-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const period = e.currentTarget.getAttribute('data-period');
        if (period === selectedPeriod) return;
        selectedPeriod = period;
        showToast(`Menampilkan data periode: ${getDateRange(period).label}`, 'info');
        await loadData();
        renderPage();
      });
    });

    // --- Quick Confirm Reservasi ---
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

    // --- Sambut Wisatawan Button ---
    const sambutBtn = container.querySelector('#sambut-wisatawan-btn');
    if (sambutBtn) {
      sambutBtn.addEventListener('click', () => {
        showToast('Selamat datang para wisatawan! 🎉 Semoga menikmati kunjungan hari ini.', 'success');
      });
    }

    // --- Testimonial Moderation ---
    container.querySelectorAll('.approve-test-btn').forEach(btn => {
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
        renderPage();
      });
    });

    container.querySelectorAll('.reject-test-btn').forEach(btn => {
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
        renderPage();
      });
    });
  };
```

- [ ] **Step 10: Verify build succeeds**

Run: `cd /home/aniiporangbaik/development/projects/desawisata && npx vite build 2>&1 | tail -10`
Expected: Build completes with no errors

- [ ] **Step 11: Commit**

```bash
git add src/admin/pages/overview.js
git commit -m "feat(admin): refactor overview with global period filter and dynamic data"
```

---

### Task 3: Manual Verification & Polish

**Files:**
- Possibly modify: `src/admin/pages/overview.js` (minor fixes if needed)

**Interfaces:**
- Consumes: Output from Tasks 1–2
- Produces: Verified, working dashboard

- [ ] **Step 1: Start dev server and test**

Run: `cd /home/aniiporangbaik/development/projects/desawisata && npm run dev`

Open `http://localhost:3000/#/admin/overview` in browser.

- [ ] **Step 2: Test global period filter buttons**

Click each period button ('Hari Ini', '7 Hari', 'Bulan Ini', 'Tahun Ini', 'Semua') and verify:
- All 4 hero stat cards update their numbers
- Chart bars re-render with appropriate data
- Reservasi Terbaru table filters by period
- Destinasi Populer ranking changes by period
- Toast notification appears on each filter change
- Active button gets green highlight style

- [ ] **Step 3: Test Agenda Hari Ini widget**

Verify:
- Shows actual reservations for today's date (or empty state if none)
- "Mulai Sambut Wisatawan" button triggers toast notification
- Pulse animation shows on green dot when agenda exists

- [ ] **Step 4: Test quick actions (confirm reservasi, approve/reject testimoni)**

- Click "Konfirmasi" on a pending reservation → verify toast + status updates
- Click "Setujui & Tampilkan" on a pending testimonial → verify removal from list
- Click "Hapus" on a pending testimonial → verify removal

- [ ] **Step 5: Fix any visual or functional issues found**

Address any layout breaks, missing data, or incorrect calculations.

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "fix(admin): polish dashboard overview after manual verification"
```
