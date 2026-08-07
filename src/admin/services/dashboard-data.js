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
      return { startDate: start.toISOString().split('T')[0], endDate, label: '7 Hari Terakhir' };
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

  // Agenda hari ini (always today, regardless of period filter)
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

/** @private */
const _fetchFromSupabase = async (stats, startDate, endDate) => {
  const today = new Date().toISOString().split('T')[0];

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
    .select('tanggal_kunjungan, jumlah_orang');
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
    // 'Semua Waktu' — group by month, last 7 months
    return _groupByMonth(records, 7);
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

  if (diffDays <= 31) {
    // Hari / Minggu / Bulan — group by day
    return _groupByDay(records, start, end);
  } else {
    // Tahun — group by month
    return _groupByMonth(records, 12);
  }
};

/** Group records by day between two dates. @private */
const _groupByDay = (records, startDate, endDate) => {
  const result = [];
  const current = new Date(startDate);
  while (current <= endDate) {
    const dateStr = current.toISOString().split('T')[0];
    const dayRecords = records.filter(r => {
      const d = r.tanggal_kunjungan;
      return d && (typeof d === 'string' ? d.split('T')[0] : d) === dateStr;
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

/** Group records by month for the last N months. @private */
const _groupByMonth = (records, maxMonths) => {
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
    result.push({
      label: monthDate.toLocaleDateString('id-ID', { month: 'short' }),
      value: totalPax,
      date: monthStr,
    });
  }
  return result;
};
