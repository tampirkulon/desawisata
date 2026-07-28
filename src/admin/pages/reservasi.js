import { auth } from '../../utils/auth.js';
import { renderAdminSidebar, initAdminSidebarEvents } from '../components/sidebar.js';
import { renderAdminHeader } from '../components/header.js';
import { renderDataTable } from '../components/data-table.js';
import { openAdminModal } from '../components/modal.js';
import { showToast } from '../../components/toast.js';
import { supabase, isSupabaseConfigured } from '../../lib/supabase.js';
import { mockData } from '../../data/seed.js';

export const renderAdminReservasi = async () => {
  const isAuthed = await auth.requireAuth();
  if (!isAuthed) return document.createElement('div');

  let reservasiList = mockData.reservasi;
  let paketList = mockData.paket_wisata;
  let activeFilter = 'all';

  const loadData = async () => {
    if (isSupabaseConfigured()) {
      try {
        const { data } = await supabase.from('reservasi').select('*').order('created_at', { ascending: false });
        if (data) reservasiList = data;

        const { data: pkt } = await supabase.from('paket_wisata').select('id, nama');
        if (pkt) paketList = pkt;
      } catch (e) {
        console.warn('Fallback:', e);
      }
    }
  };

  await loadData();

  const container = document.createElement('div');
  container.className = 'dashboard-wrapper';

  const renderPage = () => {
    const filteredReservasi = activeFilter === 'all' 
      ? reservasiList 
      : reservasiList.filter(r => r.status === activeFilter);

    container.innerHTML = `
      ${renderAdminSidebar('#/admin/reservasi')}

      <main class="admin-main">
        ${renderAdminHeader('Kelola Reservasi Wisatawan')}

        <div class="admin-body">
          <!-- Status Filter Tabs -->
          <div style="display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap;">
            ${['all', 'baru', 'dikonfirmasi', 'selesai', 'dibatalkan'].map(st => `
              <button class="btn ${activeFilter === st ? 'btn-primary' : 'btn-secondary'} filter-rsv-btn" data-status="${st}">
                ${st === 'all' ? 'Semua Status' : st.toUpperCase()}
              </button>
            `).join('')}
          </div>

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
      </main>
    `;

    bindEvents(filteredReservasi);
  };

  const bindEvents = (dataToRender) => {
    initAdminSidebarEvents();

    container.querySelectorAll('.filter-rsv-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        activeFilter = e.currentTarget.getAttribute('data-status');
        renderPage();
      });
    });

    const tbody = container.querySelector('#table-body-element');
    if (tbody && dataToRender.length > 0) {
      tbody.innerHTML = dataToRender.map(item => {
        const pkt = paketList.find(p => p.id === item.paket_id);
        const badgeClass = item.status === 'baru' ? 'badge-primary' : item.status === 'dikonfirmasi' ? 'badge-warning' : item.status === 'selesai' ? 'badge-success' : 'badge-danger';
        
        return `
          <tr>
            <td>
              <strong>${item.nama}</strong>
              <div style="font-size: 0.8rem; color: var(--neutral-600);">${item.email} | ${item.telepon}</div>
            </td>
            <td>${item.tanggal_kunjungan}</td>
            <td>${item.jumlah_orang} Orang</td>
            <td>${pkt ? pkt.nama : 'Kunjungan Mandiri'}</td>
            <td><span class="badge ${badgeClass}">${item.status}</span></td>
            <td style="text-align: right;">
              <button class="btn btn-sm btn-primary action-detail-rsv" data-id="${item.id}">Detail & Status</button>
            </td>
          </tr>
        `;
      }).join('');
    }

    container.querySelectorAll('.action-detail-rsv').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const item = reservasiList.find(r => r.id === id);
        if (item) openDetailModal(item);
      });
    });
  };

  const openDetailModal = (item) => {
    const pkt = paketList.find(p => p.id === item.paket_id);

    const bodyHtml = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="background: var(--neutral-50); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--neutral-200);">
          <h4 style="margin-bottom: 8px; font-size: 1.1rem;">Detail Pemesan</h4>
          <p><strong>Nama:</strong> ${item.nama}</p>
          <p><strong>Email:</strong> ${item.email}</p>
          <p><strong>Telepon / WA:</strong> <a href="https://wa.me/${item.telepon?.replace(/[^0-9]/g,'')}" target="_blank" style="color: var(--primary); font-weight: 600;">${item.telepon} (Chat WA)</a></p>
        </div>

        <div style="background: var(--neutral-50); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--neutral-200);">
          <h4 style="margin-bottom: 8px; font-size: 1.1rem;">Informasi Kunjungan</h4>
          <p><strong>Tanggal Kunjungan:</strong> ${item.tanggal_kunjungan}</p>
          <p><strong>Jumlah Peserta:</strong> ${item.jumlah_orang} Orang</p>
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
      </div>
    `;

    openAdminModal({
      title: `Detail Reservasi #${item.id.substring(0, 8)}`,
      bodyHtml,
      saveText: 'Update Status Reservasi',
      onSave: async () => {
        const newStatus = document.getElementById('update-rsv-status').value;

        if (isSupabaseConfigured()) {
          await supabase.from('reservasi').update({ status: newStatus }).eq('id', item.id);
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
