import { auth } from '../../utils/auth.js';
import { renderAdminSidebar, initAdminSidebarEvents } from '../components/sidebar.js';
import { renderAdminHeader } from '../components/header.js';
import { renderDataTable, initTableSearch } from '../components/data-table.js';
import { openAdminModal, openConfirmModal } from '../components/modal.js';
import { showToast } from '../../components/toast.js';
import { supabase, isSupabaseConfigured } from '../../lib/supabase.js';
import { mockData } from '../../data/seed.js';
import { buildWhatsAppUrl } from '../../utils/whatsapp.js';

export const renderAdminReservasi = async () => {
  const isAuthed = await auth.requireAuth();
  if (!isAuthed) return document.createElement('div');

  let reservasiList = mockData.reservasi;
  let paketList = mockData.paket_wisata;
  let activeFilter = 'all';

  const loadData = async () => {
    reservasiList = mockData.reservasi;
    paketList = mockData.paket_wisata;

    if (isSupabaseConfigured()) {
      try {
        const { data } = await supabase.from('reservasi').select('*').order('created_at', { ascending: false });
        if (data && data.length > 0) reservasiList = data;

        const { data: pkt } = await supabase.from('paket_wisata').select('id, nama');
        if (pkt && pkt.length > 0) paketList = pkt;
      } catch (e) {
        console.warn('Fallback:', e);
      }
    }
  };

  await loadData();

  const container = document.createElement('div');
  container.className = 'dashboard-wrapper donezo-bg';

  const renderPage = () => {
    const filteredReservasi = activeFilter === 'all'
      ? reservasiList
      : reservasiList.filter(r => r.status === activeFilter);

    container.innerHTML = `
      ${renderAdminSidebar('#/admin/reservasi')}

      <main class="admin-main donezo-bg h-full overflow-hidden flex flex-col">
        ${renderAdminHeader('Kelola Reservasi Wisatawan')}

        <div class="flex-1 overflow-y-auto p-8 w-full">
          <div class="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <h1 class="font-display-lg text-2xl font-bold text-slate-800 m-0">Reservasi Wisatawan</h1>
              <p class="text-xs font-medium text-slate-400 m-0 mt-1">Kelola transaksi booking, status konfirmasi, dan kontak pengunjung.</p>
            </div>
          </div>

          <!-- Status Filter Tabs -->
          <div class="flex items-center gap-2 mb-6 flex-wrap">
            ${['all', 'baru', 'dikonfirmasi', 'selesai', 'dibatalkan'].map(st => `
              <button class="px-4 py-2 rounded-full font-bold text-xs transition-colors filter-rsv-btn ${activeFilter === st ? 'bg-[#316342] text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}" data-status="${st}">
                ${st === 'all' ? 'Semua Status' : st.toUpperCase()}
              </button>
            `).join('')}
          </div>

          <div class="donezo-card p-6">
            ${renderDataTable({
      columns: [
        { label: 'Pemesan' },
        { label: 'Tanggal Kunjungan' },
        { label: 'Jumlah Orang' },
        { label: 'Paket / Jenis' },
        { label: 'Status' }
      ],
      data: filteredReservasi,
      searchPlaceholder: 'Cari nama pemesan / email...'
    })}
          </div>
        </div>
      </main>
    `;

    bindEvents(filteredReservasi);
  };

  const handleFilterClick = (e) => {
    activeFilter = e.currentTarget.dataset.status;
    renderPage();
  };

  const handleDetailClick = (e) => {
    const id = e.currentTarget.dataset.id;
    const item = reservasiList.find(r => String(r.id) === String(id));

    if (item) {
      openDetailModal(item);
    }
  };

  const handleDeleteReservasi = (item) => {
    const pkt = paketList.find(p => p.id === item.paket_id);
    const paketName = pkt ? pkt.nama : 'Kunjungan Mandiri';
    const pemesanName = item.nama || item.nama_pemesan || 'Tamu';

    openConfirmModal({
      title: 'Konfirmasi Hapus Reservasi',
      message: `Apakah Anda yakin ingin menghapus data reservasi atas nama "<strong>${pemesanName}</strong>" (${paketName})? Tindakan ini tidak dapat dibatalkan.`,
      onConfirm: async () => {
        if (isSupabaseConfigured() && supabase) {
          try {
            const { error } = await supabase.from('reservasi').delete().eq('id', item.id);
            if (error) throw error;
          } catch (err) {
            showToast('Gagal menghapus reservasi: ' + err.message, 'error');
            return;
          }
        } else {
          reservasiList = reservasiList.filter(r => String(r.id) !== String(item.id));
          const idx = mockData.reservasi.findIndex(r => String(r.id) === String(item.id));
          if (idx !== -1) mockData.reservasi.splice(idx, 1);
        }

        showToast('Reservasi berhasil dihapus.', 'success');
        await loadData();
        renderPage();
      }
    });
  };

  const bindEvents = (dataToRender) => {
    initAdminSidebarEvents();
    initTableSearch(container);

    container.querySelectorAll('.filter-rsv-btn').forEach(btn => {
      btn.addEventListener('click', handleFilterClick);
    });

    const tbody = container.querySelector('#table-body-element');
    if (tbody && dataToRender.length > 0) {
      tbody.innerHTML = dataToRender.map(item => {
        const pkt = paketList.find(p => p.id === item.paket_id);
        const badgeClass = item.status === 'baru' ? 'badge-primary' : item.status === 'dikonfirmasi' ? 'badge-warning' : item.status === 'selesai' ? 'badge-success' : 'badge-danger';

        return `
          <tr>
            <td>
              <strong>${item.nama || item.nama_pemesan || 'Tamu'}</strong>
              <div style="font-size: 0.8rem; color: var(--neutral-600);">${item.email || '-'} | ${item.telepon || '-'}</div>
            </td>
            <td>${item.tanggal_kunjungan || '-'}</td>
            <td>${item.jumlah_orang || item.jumlah_peserta || 1} Orang</td>
            <td>${pkt ? pkt.nama : 'Kunjungan Mandiri'}</td>
            <td><span class="badge ${badgeClass}">${item.status || 'baru'}</span></td>
            <td style="text-align: right; white-space: nowrap;">
              <div style="display: flex; gap: 8px; justify-content: flex-end;">
                <button class="btn btn-sm btn-primary action-detail-rsv" data-id="${item.id}">Detail & Status</button>
                <button class="btn btn-sm btn-outline action-delete-rsv" data-id="${item.id}" style="color: var(--status-error); border-color: var(--status-error);">Hapus</button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    container.querySelectorAll('.action-detail-rsv').forEach(btn => {
      btn.addEventListener('click', handleDetailClick);
    });

    container.querySelectorAll('.action-delete-rsv').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        const item = reservasiList.find(r => String(r.id) === String(id));
        if (item) {
          handleDeleteReservasi(item);
        }
      });
    });
  };

  const openDetailModal = (item) => {
    const pkt = paketList.find(p => p.id === item.paket_id);

    const waHref = item.telepon ? buildWhatsAppUrl(item.telepon) : '#';

    const bodyHtml = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="background: var(--neutral-50); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--neutral-200);">
          <h4 style="margin-bottom: 8px; font-size: 1.1rem;">Detail Pemesan</h4>
          <p><strong>Nama:</strong> ${item.nama || item.nama_pemesan || 'Tamu'}</p>
          <p><strong>Email:</strong> ${item.email || '-'}</p>
          <p><strong>Telepon / WA:</strong> <a href="${waHref}" target="_blank" rel="noopener noreferrer" style="color: var(--primary); font-weight: 600;">${item.telepon || '-'} (Chat WA)</a></p>
        </div>

        <div style="background: var(--neutral-50); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--neutral-200);">
          <h4 style="margin-bottom: 8px; font-size: 1.1rem;">Informasi Kunjungan</h4>
          <p><strong>Tanggal Kunjungan:</strong> ${item.tanggal_kunjungan || '-'}</p>
          <p><strong>Jumlah Peserta:</strong> ${item.jumlah_orang || item.jumlah_peserta || 1} Orang</p>
          <p><strong>Paket Wisata:</strong> ${pkt ? pkt.nama : 'Kunjungan Mandiri'}</p>
          <p><strong>Pesan Tambahan:</strong> ${item.pesan || '-'}</p>
        </div>

        <div class="form-group">
          <label class="form-label" style="font-weight: 700; color: var(--primary-500);">Update Status Reservasi</label>
          <select id="update-rsv-status" class="form-control" style="font-size: 1rem; font-weight: 600;">
            <option value="baru" ${item.status === 'baru' ? 'selected' : ''}>Baru (Menunggu Konfirmasi)</option>
            <option value="dikonfirmasi" ${item.status === 'dikonfirmasi' ? 'selected' : ''}>Dikonfirmasi (DP/Disetujui)</option>
            <option value="selesai" ${item.status === 'selesai' ? 'selected' : ''}>Selesai (Kunjungan Usai)</option>
            <option value="dibatalkan" ${item.status === 'dibatalkan' ? 'selected' : ''}>Dibatalkan</option>
          </select>
        </div>

        <div style="padding-top: 16px; margin-top: 8px; border-top: 1px solid var(--neutral-200); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
          <button type="button" id="btn-delete-from-modal" class="btn btn-sm btn-outline" style="color: var(--status-error); border-color: var(--status-error); display: flex; align-items: center; gap: 4px;">
            <span class="material-symbols-outlined" style="font-size: 16px;">delete</span>
            Hapus Reservasi Ini
          </button>
          <span style="font-size: 11px; color: var(--neutral-500);">Data yang dihapus tidak dapat dipulihkan</span>
        </div>
      </div>
    `;

    openAdminModal({
      title: `Detail Reservasi #${String(item.id).substring(0, 8)}`,
      bodyHtml,
      saveText: 'Update Status Reservasi',
      onOpen: () => {
        const modalDeleteBtn = document.getElementById('btn-delete-from-modal');
        if (modalDeleteBtn) {
          modalDeleteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('admin-modal-close')?.click();
            handleDeleteReservasi(item);
          });
        }
      },
      onSave: async () => {
        const newStatus = document.getElementById('update-rsv-status').value;

        if (isSupabaseConfigured() && supabase) {
          try {
            const { error } = await supabase.from('reservasi').update({ status: newStatus }).eq('id', item.id);
            if (error) throw error;
          } catch (err) {
            showToast('Gagal update status reservasi: ' + err.message, 'error');
            return false;
          }
        } else {
          item.status = newStatus;
        }

        showToast(`Status reservasi diperbarui menjadi '${newStatus}'`, 'success');
        await loadData();
        renderPage();
        return true;
      }
    });
  };

  renderPage();
  return container;
};
