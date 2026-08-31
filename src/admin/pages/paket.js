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
              <p class="text-xs font-medium text-slate-400 m-0 mt-1">Kelola tawaran paket tur, edukasi, dan jelajah desa (Mendukung ID & EN).</p>
            </div>
            <button class="px-5 py-2.5 rounded-full bg-[#316342] text-white font-bold text-xs hover:bg-[#254d33] transition-colors shadow-md flex items-center gap-2 cursor-pointer" id="add-paket-btn">
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
      tbody.innerHTML = paketList.map(item => {
        const hasEn = !!item.nama_en;
        return `
          <tr>
            <td>
              <div style="display: flex; align-items: center; gap: 6px;">
                <strong>${item.nama}</strong>
                ${hasEn ? '<span style="font-size: 10px; background: #e0e7ff; color: #3730a3; padding: 1px 6px; border-radius: 4px; font-weight: bold;">EN</span>' : ''}
              </div>
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
        `;
      }).join('');
    }

    container.querySelector('#add-paket-btn')?.addEventListener('click', () => openFormModal());

    container.querySelectorAll('.action-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        const item = paketList.find(p => String(p.id) === String(id));
        if (item) openFormModal(item);
      });
    });

    container.querySelectorAll('.action-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        openConfirmModal({
          message: 'Apakah Anda yakin ingin menghapus paket wisata ini?',
          onConfirm: async () => {
            if (isSupabaseConfigured() && supabase) {
              const { error } = await supabase.from('paket_wisata').delete().eq('id', id);
              if (error) {
                showToast('Gagal menghapus paket: ' + error.message, 'error');
                return;
              }
            } else {
              paketList = paketList.filter(p => String(p.id) !== String(id));
              const idx = mockData.paket_wisata.findIndex(p => String(p.id) === String(id));
              if (idx !== -1) mockData.paket_wisata.splice(idx, 1);
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
    const fasilitasEnStr = (paket?.fasilitas_en || []).join('\n');

    const bodyHtml = `
      <form id="paket-form">
        <!-- Language Switch Tabs -->
        <div style="display: flex; gap: 8px; margin-bottom: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">
          <button type="button" id="tab-pkt-id" class="btn btn-sm btn-primary" style="padding: 6px 14px; border-radius: 9999px;">🇮🇩 Bahasa Indonesia</button>
          <button type="button" id="tab-pkt-en" class="btn btn-sm btn-outline" style="padding: 6px 14px; border-radius: 9999px;">🇬🇧 English (Opsional)</button>
        </div>

        <!-- Section ID -->
        <div id="section-pkt-id">
          <div class="form-group">
            <label class="form-label">Nama Paket Wisata (ID) *</label>
            <input type="text" id="pkt-nama" class="form-control" value="${paket?.nama || ''}" required placeholder="Contoh: Paket Jelajah Durian & Kuliner" />
          </div>
          <div class="form-group">
            <label class="form-label">Deskripsi Ringkas (ID)</label>
            <textarea id="pkt-deskripsi" class="form-control" rows="3" placeholder="Deskripsi paket dalam bahasa Indonesia...">${paket?.deskripsi || ''}</textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Fasilitas Termasuk (ID) - (1 per baris)</label>
            <textarea id="pkt-fasilitas" class="form-control" rows="4" placeholder="Tiket Masuk Kebun&#10;1 Buah Durian Pilihan&#10;Makan Siang Tradisional">${fasilitasStr}</textarea>
          </div>
        </div>

        <!-- Section EN -->
        <div id="section-pkt-en" style="display: none;">
          <div class="form-group">
            <label class="form-label">Tour Package Name (EN)</label>
            <input type="text" id="pkt-nama-en" class="form-control" value="${paket?.nama_en || ''}" placeholder="E.g. Durian Discovery & Village Culinary Package" />
          </div>
          <div class="form-group">
            <label class="form-label">Short Description (EN)</label>
            <textarea id="pkt-deskripsi-en" class="form-control" rows="3" placeholder="Package description in English...">${paket?.deskripsi_en || ''}</textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Included Facilities (EN) - (1 per line)</label>
            <textarea id="pkt-fasilitas-en" class="form-control" rows="4" placeholder="Orchard Admission Ticket&#10;1 Selected Fresh Durian&#10;Traditional Village Lunch">${fasilitasEnStr}</textarea>
          </div>
        </div>

        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 16px 0;" />

        <!-- Common Fields -->
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
      onOpen: () => {
        initImageUploaderEvents('pkt-gambar', 'paket');
        const tabId = document.getElementById('tab-pkt-id');
        const tabEn = document.getElementById('tab-pkt-en');
        const secId = document.getElementById('section-pkt-id');
        const secEn = document.getElementById('section-pkt-en');

        if (tabId && tabEn && secId && secEn) {
          tabId.addEventListener('click', () => {
            secId.style.display = 'block';
            secEn.style.display = 'none';
            tabId.className = 'btn btn-sm btn-primary';
            tabEn.className = 'btn btn-sm btn-outline';
          });
          tabEn.addEventListener('click', () => {
            secId.style.display = 'none';
            secEn.style.display = 'block';
            tabEn.className = 'btn btn-sm btn-primary';
            tabId.className = 'btn btn-sm btn-outline';
          });
        }
      },
      onSave: async () => {
        const rawFasilitasEn = document.getElementById('pkt-fasilitas-en')?.value.split('\n').map(s => s.trim()).filter(Boolean) || [];

        const payload = {
          nama: document.getElementById('pkt-nama').value.trim(),
          nama_en: document.getElementById('pkt-nama-en')?.value.trim() || '',
          deskripsi: document.getElementById('pkt-deskripsi').value.trim(),
          deskripsi_en: document.getElementById('pkt-deskripsi-en')?.value.trim() || '',
          fasilitas: document.getElementById('pkt-fasilitas').value.split('\n').map(s => s.trim()).filter(Boolean),
          fasilitas_en: rawFasilitasEn,
          harga: Number.parseInt(document.getElementById('pkt-harga').value) || 0,
          durasi: document.getElementById('pkt-durasi').value.trim(),
          kapasitas_min: Number.parseInt(document.getElementById('pkt-min').value) || 1,
          kapasitas_max: Number.parseInt(document.getElementById('pkt-max').value) || 30,
          gambar_url: document.getElementById('pkt-gambar').value,
          is_published: document.getElementById('pkt-published').checked
        };

        if ((!payload.nama && !payload.nama_en) || !payload.harga) {
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
  };

  renderPage();
  return container;
};
