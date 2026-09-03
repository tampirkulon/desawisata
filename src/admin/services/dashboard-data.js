import { supabase, isSupabaseConfigured } from '../../lib/supabase.js';
import { mockData } from '../../data/seed.js';

/** Formats a Date object to YYYY-MM-DD string in local timezone @private */
const _formatLocalDate = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Calculate start/end ISO date strings for a given period.
 * @param {'hari'|'minggu'|'bulan'|'tahun'|'semua'} period
 * @returns {{ startDate: string|null, endDate: string, label: string }}
 */
export const getDateRange = (period) => {
  const now = new Date();
  const endDate = _formatLocalDate(now);

  switch (period) {
    case 'hari': {
      return { startDate: endDate, endDate, label: 'Hari Ini' };
    }
    case 'minggu': {
      const start = new Date(now);
      start.setDate(now.getDate() - 6);
      return { startDate: _formatLocalDate(start), endDate, label: '7 Hari Terakhir' };
    }
    case 'bulan': {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return { startDate: _formatLocalDate(start), endDate, label: 'Bulan Ini' };
    }
    case 'tahun': {
      const start = new Date(now.getFullYear(), 0, 1);
      return { startDate: _formatLocalDate(start), endDate, label: 'Tahun Ini' };
    }
    case 'semua':
    default:
      return { startDate: null, endDate, label: 'Semua Waktu' };
  }
};

/**
 * Fetch all dashboard statistics filtered by date range and calculate previous period growth.
 * @param {string|null} startDate - ISO date string (YYYY-MM-DD) or null for all time
 * @param {string} endDate - ISO date string (YYYY-MM-DD)
 * @param {'hari'|'minggu'|'bulan'|'tahun'|'semua'} [period='minggu']
 * @returns {Promise<object>} DashboardStats
 */
export const fetchDashboardStats = async (startDate, endDate, period = 'minggu') => {
  const stats = {
    reservasiPending: 0,
    reservasiDikonfirmasi: 0,
    reservasiSelesai: 0,
    totalWisatawan: 0,
    totalDestinasi: 0,
    totalPaket: 0,
    totalArtikel: 0,
    totalGaleri: 0,
    estimasiPendapatan: 0,
    recentReservations: [],
    allReservations: [],
    agendaHariIni: [],
    destinasiPopuler: [],
    chartData: [],
    pendingTestimonials: [],
    growth: {
      growthSelesai: 0,
      growthWisatawan: 0,
      growthPending: 0,
      growthPendapatan: 0,
      periodComparisonLabel: 'vs periode sebelumnya',
    },
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

  // Calculate dynamic growth rate compared to previous period
  const prevRange = _getPreviousPeriodRange(period);
  if (prevRange.startDate && prevRange.endDate) {
    const prevStats = {
      reservasiPending: 0,
      reservasiDikonfirmasi: 0,
      reservasiSelesai: 0,
      totalWisatawan: 0,
      estimasiPendapatan: 0,
    };

    if (isSupabaseConfigured() && supabase) {
    try {
      await _fetchPreviousFromSupabase(prevStats, prevRange.startDate, prevRange.endDate);
    } catch (e) {
      console.warn('Failed to fetch previous statistics from Supabase, falling back to mock data:', e);
      _fetchPreviousFromMock(prevStats, prevRange.startDate, prevRange.endDate);
    }
  } else {
    _fetchPreviousFromMock(prevStats, prevRange.startDate, prevRange.endDate);
  }

  stats.growth.growthSelesai = _calcPctGrowth(stats.reservasiSelesai, prevStats.reservasiSelesai);
  stats.growth.growthWisatawan = _calcPctGrowth(stats.totalWisatawan, prevStats.totalWisatawan);
  stats.growth.growthPending = _calcPctGrowth(stats.reservasiPending, prevStats.reservasiPending);
  stats.growth.growthPendapatan = _calcPctGrowth(stats.estimasiPendapatan, prevStats.estimasiPendapatan);
  stats.growth.periodComparisonLabel = prevRange.comparisonLabel;
  }

  return stats;
};

/**
 * Export dashboard statistics and all period reservations to a CSV file.
 * @param {object} stats 
 * @param {string} periodLabel 
 */
export const exportDashboardReport = (stats, periodLabel) => {
  const reservationList = (stats.allReservations && stats.allReservations.length > 0)
    ? stats.allReservations
    : stats.recentReservations || [];

  const lines = [
    `"LAPORAN RINGKASAN DASHBOARD DESA WISATA TAMPIRKULON"`,
    `"Periode: ${periodLabel}"`,
    `"Tanggal Cetak: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}"`,
    ``,
    `"METRIK UTAMA", "JUMLAH / NILAI"`,
    `"Jumlah Wisatawan", "${stats.totalWisatawan || 0}"`,
    `"Kunjungan Selesai", "${stats.reservasiSelesai}"`,
    `"Reservasi Dalam Proses", "${stats.reservasiDikonfirmasi}"`,
    `"Reservasi Perlu Konfirmasi", "${stats.reservasiPending}"`,
    `"Estimasi Pendapatan", "Rp ${stats.estimasiPendapatan.toLocaleString('id-ID')}"`,
    `"Total Destinasi Aktif", "${stats.totalDestinasi}"`,
    ``,
    `"DAFTAR RESERVASI (${periodLabel.toUpperCase()})"`,
    `"ID", "Tamu", "Email", "Telepon", "Paket Wisata", "Tanggal Kunjungan", "Jumlah Pax", "Status"`,
    ...reservationList.map(r =>
      `"${r.displayId || r.rawId || ''}", "${(r.nama_pemesan || '').replace(/"/g, '""')}", "${(r.email || '').replace(/"/g, '""')}", "${(r.telepon || '').replace(/"/g, '""')}", "${(r.paket || '').replace(/"/g, '""')}", "${r.tanggal || ''}", "${r.jumlah_orang || 1}", "${(r.status || '').toUpperCase()}"`
    ),
  ];

  if (typeof window === 'undefined') return lines.join('\n');

  const csvContent = '\uFEFF' + lines.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Laporan-Dashboard-DesaWisata-${periodLabel.replace(/\s+/g, '_')}.csv`);
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    link.remove();
    URL.revokeObjectURL(url);
  }, 100);
};

/**
 * Opens a print-friendly dialog for the dashboard summary report.
 * @param {object} stats 
 * @param {string} periodLabel 
 */
export const printDashboardReport = (stats, periodLabel) => {
  if (typeof window === 'undefined') return;

  const reservationList = (stats.allReservations && stats.allReservations.length > 0)
    ? stats.allReservations
    : stats.recentReservations || [];

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    window.print();
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="utf-8">
      <title>Laporan Dashboard - ${periodLabel}</title>
      <style>
        body { font-family: system-ui, -apple-system, sans-serif; color: #1e293b; padding: 32px; margin: 0; }
        .header { text-align: center; margin-bottom: 24px; border-bottom: 2px solid #0f172a; padding-bottom: 16px; }
        .header h1 { margin: 0 0 6px 0; font-size: 20px; color: #316342; }
        .header p { margin: 0; font-size: 12px; color: #64748b; }
        .metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
        .metric-card { border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; text-align: center; }
        .metric-card .title { font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; }
        .metric-card .value { font-size: 18px; font-weight: bold; color: #0f172a; margin-top: 4px; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 12px; }
        th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }
        th { background: #f1f5f9; font-weight: bold; color: #334155; }
        .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; text-transform: uppercase; }
        .badge-selesai { background: #dcfce7; color: #166534; }
        .badge-dikonfirmasi { background: #dbeafe; color: #1e40af; }
        .badge-baru, .badge-pending { background: #fef3c7; color: #92400e; }
        @media print {
          body { padding: 0; }
          button { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>DESA WISATA TAMPIRKULON</h1>
        <p>Laporan Ringkasan Operasional & Reservasi • Periode: ${periodLabel} • Dicetak: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      <div class="metrics-grid">
        <div class="metric-card">
          <div class="title">Jumlah Wisatawan</div>
          <div class="value">${(stats.totalWisatawan || 0).toLocaleString('id-ID')} Orang</div>
        </div>
        <div class="metric-card">
          <div class="title">Reservasi Diproses</div>
          <div class="value">${stats.reservasiDikonfirmasi}</div>
        </div>
        <div class="metric-card">
          <div class="title">Perlu Konfirmasi</div>
          <div class="value">${stats.reservasiPending}</div>
        </div>
        <div class="metric-card">
          <div class="title">Estimasi Pendapatan</div>
          <div class="value">Rp ${(stats.estimasiPendapatan || 0).toLocaleString('id-ID')}</div>
        </div>
      </div>

      <h3 style="font-size: 14px; margin: 0 0 8px 0;">Daftar Reservasi (${periodLabel})</h3>
      <table>
        <thead>
          <tr>
            <th>No / ID</th>
            <th>Nama Tamu</th>
            <th>Email</th>
            <th>Telepon</th>
            <th>Paket Wisata</th>
            <th>Tanggal Kunjungan</th>
            <th>Pax</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${reservationList.length === 0 ? '<tr><td colspan="8" style="text-align: center; color: #94a3b8; padding: 20px;">Tidak ada data reservasi pada periode ini.</td></tr>' : reservationList.map((r, i) => `
            <tr>
              <td>${r.displayId || `#RES-${i+1}`}</td>
              <td><strong>${r.nama_pemesan || 'Tamu'}</strong></td>
              <td>${r.email || '-'}</td>
              <td>${r.telepon || '-'}</td>
              <td>${r.paket || 'Kunjungan Mandiri'}</td>
              <td>${r.tanggal || '-'}</td>
              <td>${r.jumlah_orang || 1} Orang</td>
              <td><span class="badge badge-${(r.status || '').toLowerCase()}">${(r.status || '').toUpperCase()}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <script>
        window.onload = () => {
          window.print();
        };
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
};

// ============================================================
// PRIVATE HELPERS
// ============================================================

/** Filter items by a date field within a range. @private */
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

// ============================================================
// MOCK DATA FETCHER
// ============================================================

/** @private */
const _fetchFromMock = (stats, startDate, endDate) => {
  // Filter reservasi by date range
  const filtered = startDate
    ? _filterByDateRange(mockData.reservasi, 'tanggal_kunjungan', startDate, endDate)
    : [...mockData.reservasi];

  stats.reservasiPending = filtered.filter(r => r.status === 'baru' || r.status === 'pending').length;
  stats.reservasiDikonfirmasi = filtered.filter(r => r.status === 'dikonfirmasi').length;
  stats.reservasiSelesai = filtered.filter(r => r.status === 'selesai').length;
  stats.totalWisatawan = filtered
    .filter(r => r.status !== 'dibatalkan')
    .reduce((sum, r) => sum + (r.jumlah_orang || r.jumlah_peserta || 1), 0);

  // Static counts (not date-filtered)
  stats.totalDestinasi = mockData.destinasi.length;
  stats.totalPaket = mockData.paket_wisata.length;
  stats.totalArtikel = mockData.artikel.length;
  stats.totalGaleri = mockData.galeri.length;

  // Revenue from filtered reservasi (ALL matching, no limit)
  stats.estimasiPendapatan = filtered
    .filter(r => r.status === 'selesai' || r.status === 'dikonfirmasi')
    .reduce((sum, r) => {
      const pkt = mockData.paket_wisata.find(p => p.id === r.paket_id);
      const pax = r.jumlah_orang || r.jumlah_peserta || 1;
      const price = pkt ? pkt.harga : 50000;
      return sum + (pax * price);
    }, 0);

  // All reservations matching period filter
  stats.allReservations = filtered.map((r, i) => {
    const pkt = mockData.paket_wisata.find(p => p.id === r.paket_id);
    return {
      rawId: r.id,
      displayId: `#RES-${String(i + 1).padStart(3, '0')}`,
      nama_pemesan: r.nama || r.nama_pemesan || 'Tamu',
      email: r.email || '',
      telepon: r.telepon || '',
      paket: pkt ? pkt.nama : 'Kunjungan Mandiri',
      tanggal: r.tanggal_kunjungan,
      jumlah_orang: r.jumlah_orang || 1,
      status: (r.status || 'baru').toLowerCase(),
    };
  });

  // Recent reservations (top 5 preview)
  stats.recentReservations = stats.allReservations.slice(0, 5);

  // Agenda hari ini (always today, regardless of period filter)
  // Agenda hari ini (always today, regardless of period filter)
  const today = new Date().toISOString().split('T')[0];

  const todayReservations = mockData.reservasi.filter(r => {
    const d = r.tanggal_kunjungan;
    return d?.split('T')[0] === today && r.status !== 'dibatalkan';
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

  // Destinasi populer (ranked by pax count from reservasi in period)
  const paketCount = {};
  filtered.forEach(r => {
    if (r.paket_id) {
      paketCount[r.paket_id] = (paketCount[r.paket_id] || 0) + (r.jumlah_orang || 1);
    }
  });
  stats.destinasiPopuler = mockData.destinasi.map(d => {
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

  // Chart data
  stats.chartData = _buildChartData(filtered, startDate, endDate);

  // Pending testimonials (not date-filtered)
  stats.pendingTestimonials = mockData.testimoni.filter(t => !t.is_shown);
};

// ============================================================
// SUPABASE FETCHER
// ============================================================


/**
 * Constructs a filtered Supabase query for counting reservations.
 * @private
 */
const _buildReservationCountQuery = (startDate, endDate, statusFilter) => {
  let q = supabase.from('reservasi').select('*', { count: 'exact', head: true });

  if (startDate) q = q.gte('tanggal_kunjungan', startDate);
  if (endDate) q = q.lte('tanggal_kunjungan', endDate);

  if (statusFilter === 'pending') {
    return q.or('status.eq.baru,status.eq.pending');
  }
  if (statusFilter) {
    return q.eq('status', statusFilter);
  }

  return q;
};

/** @private */
/** Fetch summary stats from Supabase. @private */
const _fetchFromSupabase = async (stats, startDate, endDate) => {
  const today = new Date().toISOString().split('T')[0];
  const buildCountQuery = (statusFilter) =>
    _buildReservationCountQuery(startDate, endDate || today, statusFilter);

  let revQuery = supabase.from('reservasi')
    .select('jumlah_orang, paket_wisata(harga)')
    .or('status.eq.selesai,status.eq.dikonfirmasi');
  if (startDate) revQuery = revQuery.gte('tanggal_kunjungan', startDate);
  revQuery = revQuery.lte('tanggal_kunjungan', endDate);

  let recQuery = supabase.from('reservasi')
    .select('*, paket_wisata(nama, harga)')
    .order('created_at', { ascending: false })
    .limit(5);
  if (startDate) recQuery = recQuery.gte('tanggal_kunjungan', startDate);
  recQuery = recQuery.lte('tanggal_kunjungan', endDate);

  let popQuery = supabase.from('reservasi')
    .select('paket_id, jumlah_orang');
  if (startDate) popQuery = popQuery.gte('tanggal_kunjungan', startDate);
  popQuery = popQuery.lte('tanggal_kunjungan', endDate);

  let chartQuery = supabase.from('reservasi')
    .select('tanggal_kunjungan, jumlah_orang, status');
  if (startDate) chartQuery = chartQuery.gte('tanggal_kunjungan', startDate);
  chartQuery = chartQuery.lte('tanggal_kunjungan', endDate);

  // Execute ALL 16 Supabase queries in PARALLEL via a single Promise.all
  const [
    resPending,
    resDikonfirmasi,
    resSelesai,
    cDest,
    cPaket,
    cBlog,
    cGal,
    { data: revData },
    { data: recData },
    { data: agendaData },
    { data: popData },
    { data: allDest },
    { data: allPaket },
    { data: allKategori },
    { data: chartRaw },
    { data: pendTest }
  ] = await Promise.all([
    buildCountQuery('pending'),
    buildCountQuery('dikonfirmasi'),
    buildCountQuery('selesai'),
    supabase.from('destinasi').select('*', { count: 'exact', head: true }),
    supabase.from('paket_wisata').select('*', { count: 'exact', head: true }),
    supabase.from('artikel').select('*', { count: 'exact', head: true }),
    supabase.from('galeri').select('*', { count: 'exact', head: true }),
    revQuery,
    recQuery,
    supabase.from('reservasi').select('*, paket_wisata(nama)').eq('tanggal_kunjungan', today).neq('status', 'dibatalkan').order('created_at', { ascending: true }),
    popQuery,
    supabase.from('destinasi').select('id, nama, kategori_id'),
    supabase.from('paket_wisata').select('id, nama, destinasi_ids'),
    supabase.from('kategori_wisata').select('id, nama'),
    chartQuery,
    supabase.from('testimoni').select('*').eq('is_shown', false).order('created_at', { ascending: false })
  ]);

  stats.reservasiPending = resPending.count || 0;
  stats.reservasiDikonfirmasi = resDikonfirmasi.count || 0;
  stats.reservasiSelesai = resSelesai.count || 0;
  if (chartRaw) {
    stats.totalWisatawan = chartRaw
      .filter(r => r.status !== 'dibatalkan')
      .reduce((sum, r) => sum + (r.jumlah_orang || 1), 0);
  }

  stats.totalDestinasi = cDest.count || 0;
  stats.totalPaket = cPaket.count || 0;
  stats.totalArtikel = cBlog.count || 0;
  stats.totalGaleri = cGal.count || 0;

  if (revData) {
    stats.estimasiPendapatan = revData.reduce((sum, r) => {
      const pax = r.jumlah_orang || 1;
      const price = r.paket_wisata?.harga || 50000;
      return sum + (pax * price);
    }, 0);
  }

  if (recData && recData.length > 0) {
    stats.allReservations = recData.map((r, i) => ({
      rawId: r.id,
      displayId: `#RES-${String(i + 1).padStart(3, '0')}`,
      nama_pemesan: r.nama || 'Tamu',
      email: r.email || '',
      telepon: r.telepon || '',
      paket: r.paket_wisata?.nama || 'Kunjungan Mandiri',
      tanggal: r.tanggal_kunjungan
        ? new Date(r.tanggal_kunjungan).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
        : 'Terbaru',
      jumlah_orang: r.jumlah_orang || 1,
      status: (r.status || 'baru').toLowerCase(),
    }));
    stats.recentReservations = stats.allReservations.slice(0, 5);
  }

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

  if (chartRaw) {
    stats.chartData = _buildChartData(chartRaw, startDate, endDate);
  }

  if (pendTest) stats.pendingTestimonials = pendTest;
};

// ============================================================
// CHART DATA BUILDERS
// ============================================================

/**
 * Build chart data array by grouping records into time buckets.
 * @private
 */
const _buildChartData = (records, startDate, endDate) => {
  if (!startDate) {
    // 'Semua Waktu' — group by month with Year, last 7 months
    return _groupByMonthAllTime(records, 7);
  }

  if (startDate === endDate) {
    // 'Hari Ini' — group by operating hours
    return _groupByHour(records);
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

  if (diffDays <= 7) {
    // '7 Hari Terakhir' — group by day with Day of Week (e.g. 'Sen, 1 Agt')
    return _groupByDay(records, start, end, true);
  } else if (diffDays <= 31) {
    // 'Bulan Ini' — group into 4 weeks ('Minggu 1' .. 'Minggu 4')
    return _groupByWeek(records, start, end);
  } else {
    // 'Tahun Ini' — group by 12 months ('Jan' .. 'Des')
    return _groupByMonthYear(records, start.getFullYear());
  }
};

/** Group records by operating hours for today. @private */
const _groupByHour = (records) => {
  const hours = ['08.00', '10.00', '12.00', '14.00', '16.00'];
  const totalPax = records.reduce((sum, r) => sum + (r.jumlah_orang || 1), 0);

  if (totalPax === 0) {
    return hours.map(h => ({ label: h, value: 0 }));
  }

  // Distribute total pax realistically across operating hours for visual representation
  const weights = [0.15, 0.30, 0.25, 0.20, 0.10];
  let distributed = 0;

  return hours.map((h, i) => {
    const val = i === hours.length - 1
      ? Math.max(0, totalPax - distributed)
      : Math.round(totalPax * weights[i]);
    distributed += val;
    return { label: h, value: val };
  });
};

/** Group records by day between two dates. @private */
const _groupByDay = (records, startDate, endDate, includeDayOfWeek = false) => {
  const result = [];
  const current = new Date(startDate);
  while (current <= endDate) {
    const dateStr = current.toISOString().split('T')[0];
    const dayRecords = records.filter(r => {
      const d = r.tanggal_kunjungan;
      return d && (typeof d === 'string' ? d.split('T')[0] : d) === dateStr;
    });
    const totalPax = dayRecords.reduce((sum, r) => sum + (r.jumlah_orang || 1), 0);

    let labelStr = '';
    if (includeDayOfWeek) {
      const dayName = current.toLocaleDateString('id-ID', { weekday: 'short' });
      const dateNum = current.getDate();
      const monthName = current.toLocaleDateString('id-ID', { month: 'short' });
      labelStr = `${dayName}, ${dateNum} ${monthName}`;
    } else {
      labelStr = current.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    }

    result.push({
      label: labelStr,
      value: totalPax,
      date: dateStr,
    });
    current.setDate(current.getDate() + 1);
  }
  return result;
};

/** Group records into 4 weeks for a given month. @private */
const _groupByWeek = (records, startDate, endDate) => {
  const weeks = [
    { label: 'Minggu 1', startDay: 1, endDay: 7 },
    { label: 'Minggu 2', startDay: 8, endDay: 14 },
    { label: 'Minggu 3', startDay: 15, endDay: 21 },
    { label: 'Minggu 4', startDay: 22, endDay: 31 },
  ];

  return weeks.map(w => {
    const weekRecords = records.filter(r => {
      const d = r.tanggal_kunjungan;
      if (!d) return false;
      const dayNum = Number.parseInt((typeof d === 'string' ? d.split('T')[0] : d).split('-')[2], 10);
      return dayNum >= w.startDay && dayNum <= w.endDay;
    });
    const totalPax = weekRecords.reduce((sum, r) => sum + (r.jumlah_orang || 1), 0);
    return {
      label: w.label,
      value: totalPax,
    };
  });
};

/** Group records by 12 months for a full year. @private */
const _groupByMonthYear = (records, year) => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
  return monthNames.map((m, idx) => {
    const monthStr = `${year}-${String(idx + 1).padStart(2, '0')}`;
    const monthRecords = records.filter(r => {
      const d = r.tanggal_kunjungan;
      return d && (typeof d === 'string' ? d : '').startsWith(monthStr);
    });
    const totalPax = monthRecords.reduce((sum, r) => sum + (r.jumlah_orang || 1), 0);
    return {
      label: m,
      value: totalPax,
      date: monthStr,
    };
  });
};

/** Group records by month with short year for all time. @private */
const _groupByMonthAllTime = (records, maxMonths) => {
  const now = new Date();
  const result = [];
  for (let i = maxMonths - 1; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStr = monthDate.toISOString().slice(0, 7); // YYYY-MM
    const monthRecords = records.filter(r => {
      const d = r.tanggal_kunjungan;
      return d && (typeof d === 'string' ? d : '').startsWith(monthStr);
    });
    const totalPax = monthRecords.reduce((sum, r) => sum + (r.jumlah_orang || 1), 0);
    const label = monthDate.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' });
    result.push({
      label: label,
      value: totalPax,
      date: monthStr,
    });
  }
  return result;
};

/** Get date range for previous comparison period. @private */
const _getPreviousPeriodRange = (period) => {
  const now = new Date();
  switch (period) {
    case 'hari': {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      const str = _formatLocalDate(yesterday);
      return { startDate: str, endDate: str, comparisonLabel: 'vs kemarin' };
    }
    case 'minggu': {
      const prevEnd = new Date(now);
      prevEnd.setDate(now.getDate() - 7);
      const prevStart = new Date(prevEnd);
      prevStart.setDate(prevEnd.getDate() - 6);
      return {
        startDate: _formatLocalDate(prevStart),
        endDate: _formatLocalDate(prevEnd),
        comparisonLabel: 'vs 7 hari sebelumnya',
      };
    }
    case 'bulan': {
      const prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const prevEnd = new Date(now.getFullYear(), now.getMonth(), 0);
      return {
        startDate: _formatLocalDate(prevStart),
        endDate: _formatLocalDate(prevEnd),
        comparisonLabel: 'vs bulan lalu',
      };
    }
    case 'tahun': {
      const prevStart = new Date(now.getFullYear() - 1, 0, 1);
      const prevEnd = new Date(now.getFullYear() - 1, 11, 31);
      return {
        startDate: _formatLocalDate(prevStart),
        endDate: _formatLocalDate(prevEnd),
        comparisonLabel: 'vs tahun lalu',
      };
    }
    case 'semua':
    default:
      return { startDate: null, endDate: null, comparisonLabel: 'vs periode lalu' };
  }
};

/** Calculate percentage growth between current and previous values. @private */
const _calcPctGrowth = (currentVal, previousVal) => {
  if (!previousVal || previousVal === 0) {
    return currentVal > 0 ? 100 : 0;
  }
  return Math.round(((currentVal - previousVal) / previousVal) * 100);
};

/** Fetch summary stats for previous period from Supabase. @private */
const _fetchPreviousFromSupabase = async (prevStats, startDate, endDate) => {
  const buildCountQuery = (statusFilter) => {
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

  let revQuery = supabase.from('reservasi')
    .select('jumlah_orang, paket_wisata(harga)')
    .or('status.eq.selesai,status.eq.dikonfirmasi');
  if (startDate) revQuery = revQuery.gte('tanggal_kunjungan', startDate);
  revQuery = revQuery.lte('tanggal_kunjungan', endDate);

  let wisQuery = supabase.from('reservasi')
    .select('jumlah_orang, status');
  if (startDate) wisQuery = wisQuery.gte('tanggal_kunjungan', startDate);
  wisQuery = wisQuery.lte('tanggal_kunjungan', endDate);

  const [resPending, resSelesai, { data: revData }, { data: wisData }] = await Promise.all([
    buildCountQuery('pending'),
    buildCountQuery('selesai'),
    revQuery,
    wisQuery,
  ]);

  prevStats.reservasiPending = resPending.count || 0;
  prevStats.reservasiSelesai = resSelesai.count || 0;
  if (revData) {
    prevStats.estimasiPendapatan = revData.reduce((sum, r) => sum + ((r.jumlah_orang || 1) * (r.paket_wisata?.harga || 50000)), 0);
  }
  if (wisData) {
    prevStats.totalWisatawan = wisData
      .filter(r => r.status !== 'dibatalkan')
      .reduce((sum, r) => sum + (r.jumlah_orang || 1), 0);
  }
};

/** Fetch summary stats for previous period from mock. @private */
const _fetchPreviousFromMock = (prevStats, startDate, endDate) => {
  const filtered = _filterByDateRange(mockData.reservasi, 'tanggal_kunjungan', startDate, endDate);
  prevStats.reservasiPending = filtered.filter(r => r.status === 'baru' || r.status === 'pending').length;
  prevStats.reservasiSelesai = filtered.filter(r => r.status === 'selesai').length;
  prevStats.totalWisatawan = filtered
    .filter(r => r.status !== 'dibatalkan')
    .reduce((sum, r) => sum + (r.jumlah_orang || r.jumlah_peserta || 1), 0);
  prevStats.estimasiPendapatan = filtered
    .filter(r => r.status === 'selesai' || r.status === 'dikonfirmasi')
    .reduce((sum, r) => sum + ((r.jumlah_orang || 1) * 50000), 0);
};
