import { auth } from '../../utils/auth.js';
import { renderAdminSidebar, initAdminSidebarEvents } from '../components/sidebar.js';
import { renderAdminHeader } from '../components/header.js';
import { renderDataTable, initTableSearch } from '../components/data-table.js';
import { openAdminModal, openConfirmModal } from '../components/modal.js';
import { renderImageUploader, initImageUploaderEvents } from '../components/image-upload.js';
import { showToast } from '../../components/toast.js';
import { supabase, isSupabaseConfigured } from '../../lib/supabase.js';
import { mockData } from '../../data/seed.js';

export const renderAdminPaket = async () => {
  const isAuthed = await auth.requireAuth();
  if (!isAuthed) return document.createElement('div');

  let paketList = mockData.paket_wisata;

  const loadData = async () => {
    if (isSupabaseConfigured()) {
      try {
        const { data } = await supabase.from('paket_wisata').select('*').order('created_at', { ascending: false });
        if (data) paketList = data;
      } catch (e) {
        console.warn('Fallback:', e);
      }
    }
  };

  await loadData();

  const container = document.createElement('div');
  container.className = 'dashboard-wrapper donezo-bg';

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  const renderPage = () => {
    container.innerHTML = `
      ${renderAdminSidebar('#/admin/paket')}

      <main class="admin-main donezo-bg h-full overflow-hidden flex flex-col">
        ${renderAdminHeader('Kelola Paket Wisata')}

        <div class="flex-1 overflow-y-auto p-8 w-full">
          <div class="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <h1 class="font-display-lg text-2xl font-bold text-slate-800 m-0">Paket Wisata</h1>
              <p class="text-xs font-medium text-slate-400 m-0 mt-1">Kelola tawaran paket tur, edukasi, dan jelajah desa.</p>
            </div>
            <button class="px-5 py-2.5 rounded-full bg-[#316342] text-white font-bold text-xs hover:bg-[#254d33] transition-colors shadow-md flex items-center gap-2" id="add-paket-btn">
              <span class="material-symbols-outlined text-sm">add</span>
              Tambah Paket Baru
            </button>
          </div>

          <div class="donezo-card p-6">
            ${renderDataTable({
              columns: [
                { label: 'Nama Paket' },
                { label: 'Harga / Orang' },
                { label: 'Durasi' },
                { label: 'Status' }
              ],
              data: paketList,
              searchPlaceholder: 'Cari paket...'
            })}
          </div>
        </div>
      </main>
    `;

    bindEvents();
  };

  const bindEvents = () => {
    initAdminSidebarEvents();
    initTableSearch(container);

    const tbody = container.querySelector('#table-body-element');
    if (tbody && paketList.length > 0) {
      tbody.innerHTML = paketList.map(item => `
        <tr>
          <td>
            <strong>${item.nama}</strong>
            <div style="font-size: 0.8rem; color: var(--neutral-600);">${(item.fasilitas || []).length} Fasilitas termasuk</div>
          </td>
          <td style="font-weight: 700; color: var(--primary-500);">${formatRupiah(item.harga)}</td>
          <td>${item.durasi || '-'}</td>
          <td>
            <span class="badge ${item.is_published ? 'badge-success' : 'badge-danger'}">
              ${item.is_published ? 'Published' : 'Draft'}
            </span>
          </td>
          <td style="text-align: right;">
            <button class="btn btn-sm btn-secondary action-edit" data-id="${item.id}">Edit</button>
            <button class="btn btn-sm btn-outline action-delete" data-id="${item.id}" style="color: var(--status-error); border-color: var(--status-error);">Hapus</button>
          </td>
        </tr>
      `).join('');
    }

    container.querySelector('#add-paket-btn')?.addEventListener('click', () => openFormModal());

    container.querySelectorAll('.action-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const item = paketList.find(p => p.id === id);
        if (item) openFormModal(item);
      });
    });

    container.querySelectorAll('.action-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        openConfirmModal({
          message: 'Apakah Anda yakin ingin menghapus paket wisata ini?',
          onConfirm: async () => {
            if (isSupabaseConfigured() && supabase) {
              const { error } = await supabase.from('paket_wisata').delete().eq('id', id);
              if (error) {
                showToast('Gagal menghapus paket: ' + error.message, 'error');
                return;
              }
            }
            showToast('Paket berhasil dihapus.', 'success');
            await loadData();
            renderPage();
          }
        });
      });
    });
  };

  const openFormModal = (paket = null) => {
    const isEdit = !!paket;
    const fasilitasStr = (paket?.fasilitas || []).join('\n');

    const bodyHtml = `
      <form id="paket-form">
        <div class="form-group">
          <label class="form-label">Nama Paket Wisata *</label>
          <input type="text" id="pkt-nama" class="form-control" value="${paket?.nama || ''}" required />
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div class="form-group">
            <label class="form-label">Harga (Rupiah) *</label>
            <input type="number" id="pkt-harga" class="form-control" placeholder="150000" value="${paket?.harga || ''}" required />
          </div>
          <div class="form-group">
            <label class="form-label">Durasi</label>
            <input type="text" id="pkt-durasi" class="form-control" placeholder="1 Hari (09:00 - 15:00)" value="${paket?.durasi || ''}" />
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div class="form-group">
            <label class="form-label">Kapasitas Minimal (Orang)</label>
            <input type="number" id="pkt-min" class="form-control" value="${paket?.kapasitas_min || 1}" />
          </div>
          <div class="form-group">
            <label class="form-label">Kapasitas Maksimal (Orang)</label>
            <input type="number" id="pkt-max" class="form-control" value="${paket?.kapasitas_max || 30}" />
          </div>
        </div>

        ${renderImageUploader('pkt-gambar', paket?.gambar_url || '')}

        <div class="form-group">
          <label class="form-label">Fasilitas Termasuk (1 per baris)</label>
          <textarea id="pkt-fasilitas" class="form-control" rows="4" placeholder="1 Buah Durian Pilihan&#10;Makan Siang Tradisional&#10;Pemandu Lokal">${fasilitasStr}</textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Deskripsi Ringkas</label>
          <textarea id="pkt-deskripsi" class="form-control" rows="3">${paket?.deskripsi || ''}</textarea>
        </div>

        <div style="margin-top: 16px;">
          <label style="display: flex; align-items: center; gap: 8px; font-weight: 500; cursor: pointer;">
            <input type="checkbox" id="pkt-published" ${paket?.is_published !== false ? 'checked' : ''} />
            Publikasikan Paket Ini
          </label>
        </div>
      </form>
    `;

    openAdminModal({
      title: isEdit ? 'Edit Paket Wisata' : 'Tambah Paket Wisata Baru',
      bodyHtml,
      saveText: isEdit ? 'Perbarui' : 'Simpan',
      onSave: async () => {
        const payload = {
          nama: document.getElementById('pkt-nama').value.trim(),
          harga: Number.parseInt(document.getElementById('pkt-harga').value) || 0,
          durasi: document.getElementById('pkt-durasi').value.trim(),
          kapasitas_min: Number.parseInt(document.getElementById('pkt-min').value) || 1,
          kapasitas_max: Number.parseInt(document.getElementById('pkt-max').value) || 30,
          gambar_url: document.getElementById('pkt-gambar').value,
          fasilitas: document.getElementById('pkt-fasilitas').value.split('\n').map(s => s.trim()).filter(Boolean),
          deskripsi: document.getElementById('pkt-deskripsi').value.trim(),
          is_published: document.getElementById('pkt-published').checked
        };

        if (!payload.nama || !payload.harga) {
          showToast('Nama dan harga paket wajib diisi', 'error');
          return false;
        }

        if (isSupabaseConfigured() && supabase) {
          try {
            if (isEdit) {
              const { error } = await supabase.from('paket_wisata').update(payload).eq('id', paket.id);
              if (error) throw error;
            } else {
              const { error } = await supabase.from('paket_wisata').insert([payload]).select();
              if (error) throw error;
            }
          } catch (err) {
            showToast('Gagal menyimpan paket: ' + err.message, 'error');
            return false;
          }
        } else {
          if (isEdit) {
            Object.assign(paket, payload);
          } else {
            paketList.unshift({ id: 'pkt-' + Date.now(), ...payload });
          }
        }

        showToast(isEdit ? 'Paket diperbarui!' : 'Paket ditambahkan!', 'success');
        await loadData();
        renderPage();
        return true;
      }
    });

    setTimeout(() => initImageUploaderEvents('pkt-gambar', 'paket'), 100);
  };

  renderPage();
  return container;
};
