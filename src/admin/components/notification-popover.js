import { supabase, isSupabaseConfigured } from '../../lib/supabase.js';
import { mockData } from '../../data/seed.js';

const STORAGE_KEY = 'desa_wisata_read_notifs';

const getReadNotifIds = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn(`Failed to read notification IDs from localStorage (${STORAGE_KEY}):`, e);
    return [];
  }
};

const saveReadNotifId = (id) => {
  const current = getReadNotifIds();

  if (!current.includes(id)) {
    current.push(id);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    } catch (e) {
      console.error(`Failed to save notification ID (${id}) to localStorage (${STORAGE_KEY}):`, e);
    }
  }
};

const saveAllReadNotifIds = (ids) => {
  const current = getReadNotifIds();
  const updated = Array.from(new Set([...current, ...ids]));

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error(`Failed to save notification IDs to localStorage (${STORAGE_KEY}):`, e);
  }
};

/**
 * Fetch all notifications (Pending Reservations + Pending Testimonials)
 */
export const fetchNotificationData = async () => {
  let notifications = [];

  if (isSupabaseConfigured() && supabase) {
    try {
      const [resResult, testResult] = await Promise.all([
        supabase.from('reservasi')
          .select('*, paket_wisata(nama)')
          .or('status.eq.baru,status.eq.pending')
          .order('created_at', { ascending: false }),
        supabase.from('testimoni')
          .select('*')
          .eq('is_shown', false)
          .order('created_at', { ascending: false })
      ]);

      if (resResult.data) {
        resResult.data.forEach(r => {
          notifications.push({
            id: `res-${r.id}`,
            type: 'reservasi',
            title: 'Reservasi Perlu Konfirmasi',
            detail: `${r.nama || 'Tamu'} • ${r.paket_wisata?.nama || 'Kunjungan Wisata'}`,
            timestamp: r.tanggal_kunjungan ? `Tanggal Kunjungan: ${r.tanggal_kunjungan}` : 'Baru saja',
            rawDate: r.created_at || r.tanggal_kunjungan || '',
            link: '#/admin/reservasi',
            icon: 'confirmation_number',
            iconBg: 'bg-emerald-100 text-[#316342]'
          });
        });
      }

      if (testResult.data) {
        testResult.data.forEach(t => {
          notifications.push({
            id: `test-${t.id}`,
            type: 'testimoni',
            title: 'Ulasan Menunggu Moderasi',
            detail: `"${t.pesan.substring(0, 45)}..." — ${t.nama}`,
            timestamp: `Rating ★${t.rating || 5}`,
            rawDate: t.created_at || '',
            link: '#/admin/overview',
            icon: 'rate_review',
            iconBg: 'bg-amber-100 text-amber-800'
          });
        });
      }
    } catch (e) {
      console.warn('Notification fetch error, using mock fallback:', e);
      notifications = _getMockNotifications();
    }
  } else {
    notifications = _getMockNotifications();
  }

  const readIds = getReadNotifIds();
  notifications.forEach(n => {
    n.isRead = readIds.includes(n.id);
  });

  // Sort unread first, then by date
  notifications.sort((a, b) => {
    if (a.isRead === b.isRead) return 0;
    return a.isRead ? 1 : -1;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return { notifications, unreadCount };
};

const _getMockNotifications = () => {
  const notifs = [];
  const pendingRes = mockData.reservasi.filter(r => r.status === 'baru' || r.status === 'pending');
  pendingRes.forEach(r => {
    const pkt = mockData.paket_wisata.find(p => p.id === r.paket_id);
    notifs.push({
      id: `res-${r.id}`,
      type: 'reservasi',
      title: 'Reservasi Perlu Konfirmasi',
      detail: `${r.nama || r.nama_pemesan || 'Tamu'} • ${pkt ? pkt.nama : 'Kunjungan Wisata'}`,
      timestamp: `Tanggal: ${r.tanggal_kunjungan}`,
      rawDate: r.tanggal_kunjungan,
      link: '#/admin/reservasi',
      icon: 'confirmation_number',
      iconBg: 'bg-emerald-100 text-[#316342]'
    });
  });

  const pendingTest = mockData.testimoni.filter(t => !t.is_shown);
  pendingTest.forEach(t => {
    notifs.push({
      id: `test-${t.id}`,
      type: 'testimoni',
      title: 'Ulasan Menunggu Moderasi',
      detail: `"${t.pesan.substring(0, 45)}..." — ${t.nama}`,
      timestamp: `Rating ★${t.rating || 5}`,
      rawDate: '',
      link: '#/admin/overview',
      icon: 'rate_review',
      iconBg: 'bg-amber-100 text-amber-800'
    });
  });

  return notifs;
};

/**
 * Update the badge DOM in header
 */
export const updateHeaderNotifBadge = (unreadCount) => {
  const notifBadge = document.getElementById('admin-notif-badge');
  const notifBtn = document.getElementById('admin-notif-btn');

  if (notifBadge) {
    if (unreadCount > 0) {
      notifBadge.innerText = unreadCount > 9 ? '9+' : unreadCount;
      notifBadge.classList.remove('hidden');
      notifBadge.classList.add('flex');
    } else {
      notifBadge.classList.add('hidden');
      notifBadge.classList.remove('flex');
    }
  }

  if (notifBtn) {
    notifBtn.title = unreadCount > 0
      ? `${unreadCount} Notifikasi Baru`
      : 'Tidak ada notifikasi baru';
  }
};

/**
 * Toggle or Render Notification Dropdown Panel
 */
export const toggleNotificationPopover = async () => {
  let popover = document.getElementById('admin-notif-popover');

  if (popover) {
    popover.remove();
    return;
  }

  const notifBtn = document.getElementById('admin-notif-btn');
  if (!notifBtn) return;

  const { notifications, unreadCount } = await fetchNotificationData();
  updateHeaderNotifBadge(unreadCount);

  popover = document.createElement('div');
  popover.id = 'admin-notif-popover';
  popover.className = 'fixed right-8 top-16 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden animate-in fade-in zoom-in-95 duration-200';

  popover.innerHTML = `
    <!-- Header -->
    <div class="px-5 py-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <h4 class="text-sm font-bold text-slate-800 m-0">Notifikasi</h4>
        ${unreadCount > 0 ? `<span class="px-2 py-0.5 rounded-full bg-emerald-100 text-[#316342] text-[10px] font-extrabold">${unreadCount} Baru</span>` : ''}
      </div>
      ${unreadCount > 0 ? `
        <button id="mark-all-read-btn" class="text-[11px] font-bold text-[#316342] hover:text-[#254d33] transition-colors cursor-pointer">
          Tandai semua dibaca
        </button>
      ` : ''}
    </div>

    <!-- Body / List -->
    <div class="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
      ${notifications.length === 0 ? `
        <div class="py-10 text-center px-4">
          <span class="material-symbols-outlined text-4xl text-slate-300 mb-2">notifications_off</span>
          <p class="text-xs text-slate-400 font-medium m-0">Tidak ada notifikasi saat ini.</p>
        </div>
      ` : notifications.map(n => `
        <div class="notif-item-row p-4 flex items-start gap-3 hover:bg-slate-50/90 transition-colors cursor-pointer ${n.isRead ? 'opacity-70' : 'bg-emerald-50/20'}" data-id="${n.id}" data-link="${n.link}">
          <div class="w-9 h-9 rounded-xl ${n.iconBg} flex items-center justify-center shrink-0 font-bold">
            <span class="material-symbols-outlined text-lg">${n.icon}</span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-1">
              <h5 class="text-xs font-bold text-slate-800 m-0 truncate">${n.title}</h5>
              ${!n.isRead ? `<span class="w-2 h-2 rounded-full bg-[#316342] shrink-0"></span>` : ''}
            </div>
            <p class="text-xs text-slate-600 m-0 mt-1 line-clamp-2 leading-relaxed">${n.detail}</p>
            <span class="text-[10px] text-slate-400 font-medium block mt-1.5">${n.timestamp}</span>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Footer -->
    <div class="p-3 bg-slate-50/50 border-t border-slate-100 text-center">
      <a href="#/admin/reservasi" class="text-xs font-bold text-[#316342] hover:underline inline-flex items-center gap-1">
        Kelola Semua Reservasi <span class="material-symbols-outlined text-sm">arrow_forward</span>
      </a>
    </div>
  `;

  document.body.appendChild(popover);

  // Bind click items
  // Bind click items
  popover.querySelectorAll('.notif-item-row').forEach(row => {
    row.addEventListener('click', (e) => {
      const { id, link } = e.currentTarget.dataset;

      if (id) {
        saveReadNotifId(id);
      }

      popover.remove();

      if (link) {
        window.location.hash = link;
      }
    });
  });

  // Bind mark all as read button

  // Bind mark all as read button
  popover.querySelector('#mark-all-read-btn')?.addEventListener('click', () => {
    const allIds = notifications.map(n => n.id);
    saveAllReadNotifIds(allIds);
    popover.remove();
    updateHeaderNotifBadge(0);
  });

  // Close when clicking outside
  const onOutsideClick = (e) => {
    if (!popover.contains(e.target) && !notifBtn.contains(e.target)) {
      popover.remove();
      document.removeEventListener('click', onOutsideClick);
    }
  };
  setTimeout(() => {
    document.addEventListener('click', onOutsideClick);
  }, 50);
};
