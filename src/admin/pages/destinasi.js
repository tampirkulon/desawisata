import { auth } from '../../utils/auth.js';
import { renderAdminSidebar, initAdminSidebarEvents } from '../components/sidebar.js';
import { renderAdminHeader } from '../components/header.js';
import { renderDataTable, initTableSearch } from '../components/data-table.js';
import { openAdminModal, openConfirmModal } from '../components/modal.js';
import { renderImageUploader, initImageUploaderEvents } from '../components/image-upload.js';
import { showToast } from '../../components/toast.js';
import { supabase, isSupabaseConfigured } from '../../lib/supabase.js';
import { mockData } from '../../data/seed.js';

export const renderAdminDestinasi = async () => {
  const isAuthed = await auth.requireAuth();
  if (!isAuthed) return document.createElement('div');

  let destinasiList = mockData.destinasi;
  let kategoriList = mockData.kategori_wisata;

  const loadData = async () => {
    if (isSupabaseConfigured()) {
      try {
        const { data: dest } = await supabase.from('destinasi').select('*').order('created_at', { ascending: false });
        if (dest) destinasiList = dest;

        const { data: kat } = await supabase.from('kategori_wisata').select('*');
        if (kat) kategoriList = kat;
      } catch (e) {
        console.warn('Fallback:', e);
      }
    }
  };

  await loadData();

  const container = document.createElement('div');
  container.className = 'dashboard-wrapper donezo-bg';

  const renderPage = () => {
    container.innerHTML = `
      ${renderAdminSidebar('#/admin/destinasi')}

      <main class="admin-main donezo-bg h-full overflow-hidden flex flex-col">
        ${renderAdminHeader('Kelola Destinasi Wisata')}

        <div class="flex-1 overflow-y-auto p-8 w-full">
          <div class="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <h1 class="font-display-lg text-2xl font-bold text-slate-800 m-0">Destinasi Wisata</h1>
              <p class="text-xs font-medium text-slate-400 m-0 mt-1">Kelola daya tarik & objek wisata Desa Wisata Tampirkulon (Mendukung ID & EN).</p>
            </div>
            <button class="px-5 py-2.5 rounded-full bg-[#316342] text-white font-bold text-xs hover:bg-[#254d33] transition-colors shadow-md flex items-center gap-2 cursor-pointer" id="add-destinasi-btn">
              <span class="material-symbols-outlined text-sm">add</span>
              Tambah Destinasi Baru
            </button>
          </div>

          <div class="donezo-card p-6">
            ${renderDataTable({
              columns: [
                { label: 'Destinasi' },
                { label: 'Kategori' },
                { label: 'Tiket' },
                { label: 'Status' }
              ],
              data: destinasiList,
              searchPlaceholder: 'Cari destinasi...'
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
    if (tbody && destinasiList.length > 0) {
      tbody.innerHTML = destinasiList.map(item => {
        const kat = kategoriList.find(k => k.id === item.kategori_id);
        const hasEn = !!item.nama_en;
        return `
          <tr>
            <td>
              <div style="display: flex; align-items: center; gap: 12px;">
                <img src="${item.gambar_url || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=100&q=80'}" style="width: 44px; height: 44px; border-radius: var(--radius-sm); object-fit: cover;" />
                <div>
                  <div style="display: flex; items-center; gap: 6px;">
                    <strong>${item.nama}</strong>
                    ${hasEn ? '<span style="font-size: 10px; background: #e0e7ff; color: #3730a3; padding: 1px 6px; border-radius: 4px; font-weight: bold;">EN</span>' : ''}
                  </div>
                  <div style="font-size: 0.8rem; color: var(--neutral-600);">${item.lokasi || '-'}</div>
                </div>
              </div>
            </td>
            <td><span class="badge badge-primary">${kat ? kat.nama : 'Umum'}</span></td>
            <td>${item.harga_tiket || 'Gratis'}</td>
            <td>
              <span class="badge ${item.is_published ? 'badge-success' : 'badge-danger'}" style="cursor: pointer;" data-action="toggle" data-id="${item.id}">
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

    container.querySelector('#add-destinasi-btn')?.addEventListener('click', () => openFormModal());

    container.querySelectorAll('.action-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        const item = destinasiList.find(d => String(d.id) === String(id));
        if (item) openFormModal(item);
      });
    });

    container.querySelectorAll('.action-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        openConfirmModal({
          message: 'Apakah Anda yakin ingin menghapus destinasi wisata ini?',
          onConfirm: async () => {
            if (isSupabaseConfigured() && supabase) {
              const { error } = await supabase.from('destinasi').delete().eq('id', id);
              if (error) {
                showToast('Gagal menghapus destinasi: ' + error.message, 'error');
                return;
              }
            } else {
              destinasiList = destinasiList.filter(d => String(d.id) !== String(id));
              const idx = mockData.destinasi.findIndex(d => String(d.id) === String(id));
              if (idx !== -1) mockData.destinasi.splice(idx, 1);
            }
            showToast('Destinasi berhasil dihapus.', 'success');
            await loadData();
            renderPage();
          }
        });
      });
    });

    container.querySelectorAll('[data-action="toggle"]').forEach(badge => {
      badge.addEventListener('click', async (e) => {
        const id = e.currentTarget.dataset.id;
        const item = destinasiList.find(d => String(d.id) === String(id));
        if (!item) return;

        const newStatus = !item.is_published;

        if (isSupabaseConfigured() && supabase) {
          await supabase.from('destinasi').update({ is_published: newStatus }).eq('id', id);
        } else {
          item.is_published = newStatus;
        }

        showToast(newStatus ? 'Destinasi dipublikasikan!' : 'Destinasi dijadikan draft.', 'success');
        await loadData();
        renderPage();
      });
    });
  };

  const openFormModal = (destinasi = null) => {
    const isEdit = !!destinasi;
    const bodyHtml = `
      <form id="destinasi-form">
        <!-- Language Switch Tabs -->
        <div style="display: flex; gap: 8px; margin-bottom: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">
          <button type="button" id="tab-btn-id" class="btn btn-sm btn-primary" style="padding: 6px 14px; border-radius: 9999px;">🇮🇩 Bahasa Indonesia</button>
          <button type="button" id="tab-btn-en" class="btn btn-sm btn-outline" style="padding: 6px 14px; border-radius: 9999px;">🇬🇧 English (Opsional)</button>
        </div>

        <!-- Section ID -->
        <div id="section-dest-id">
          <div class="form-group">
            <label class="form-label">Nama Destinasi Wisata (ID) *</label>
            <input type="text" id="dest-nama" class="form-control" value="${destinasi?.nama || ''}" required placeholder="Contoh: Kebun Durian Candimulyo" />
          </div>
          <div class="form-group">
            <label class="form-label">Lokasi / Dusun (ID)</label>
            <input type="text" id="dest-lokasi" class="form-control" placeholder="Dusun Tampir 1, Tampirkulon" value="${destinasi?.lokasi || ''}" />
          </div>
          <div class="form-group">
            <label class="form-label">Deskripsi Lengkap (ID)</label>
            <textarea id="dest-deskripsi" class="form-control" rows="3" placeholder="Deskripsi destinasi dalam bahasa Indonesia...">${destinasi?.deskripsi || ''}</textarea>
          </div>
        </div>

        <!-- Section EN -->
        <div id="section-dest-en" style="display: none;">
          <div class="form-group">
            <label class="form-label">Destination Name (EN)</label>
            <input type="text" id="dest-nama-en" class="form-control" value="${destinasi?.nama_en || ''}" placeholder="E.g. Candimulyo Durian Orchard" />
          </div>
          <div class="form-group">
            <label class="form-label">Location / Hamlet (EN)</label>
            <input type="text" id="dest-lokasi-en" class="form-control" placeholder="E.g. Tampir 1 Hamlet, Tampirkulon" value="${destinasi?.lokasi_en || ''}" />
          </div>
          <div class="form-group">
            <label class="form-label">Full Description (EN)</label>
            <textarea id="dest-deskripsi-en" class="form-control" rows="3" placeholder="Destination description in English...">${destinasi?.deskripsi_en || ''}</textarea>
          </div>
        </div>

        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 16px 0;" />

        <!-- Common Fields -->
        <div class="form-group">
          <label class="form-label">Kategori Wisata *</label>
          <select id="dest-kategori" class="form-control" required>
            ${kategoriList.map(k => `
              <option value="${k.id}" ${String(destinasi?.kategori_id) === String(k.id) ? 'selected' : ''}>${k.nama}</option>
            `).join('')}
          </select>
        </div>

        ${renderImageUploader('dest-gambar', destinasi?.gambar_url || '')}

        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Harga Tiket Masuk</label>
            <input type="text" id="dest-harga" class="form-control" placeholder="Misal: Rp 10.000 / Gratis" value="${destinasi?.harga_tiket || ''}" />
          </div>
          <div class="form-group">
            <label class="form-label">Jam Buka / Operasional</label>
            <input type="text" id="dest-jambuka" class="form-control" placeholder="Misal: 08:00 - 16:00 WIB" value="${destinasi?.jam_buka || ''}" />
          </div>
        </div>

        <div style="display: flex; gap: 24px; margin-top: 16px;">
          <label style="display: flex; align-items: center; gap: 8px; font-weight: 500; cursor: pointer;">
            <input type="checkbox" id="dest-unggulan" ${destinasi?.is_unggulan ? 'checked' : ''} />
            Tampilkan di Beranda (Unggulan)
          </label>
          <label style="display: flex; align-items: center; gap: 8px; font-weight: 500; cursor: pointer;">
            <input type="checkbox" id="dest-published" ${destinasi?.is_published !== false ? 'checked' : ''} />
            Publikasikan (Visible)
          </label>
        </div>
      </form>
    `;

    openAdminModal({
      title: isEdit ? 'Edit Destinasi Wisata' : 'Tambah Destinasi Baru',
      bodyHtml,
      saveText: isEdit ? 'Perbarui Destinasi' : 'Simpan Destinasi',
      onOpen: () => {
        initImageUploaderEvents('dest-gambar', 'destinasi');
        const tabId = document.getElementById('tab-btn-id');
        const tabEn = document.getElementById('tab-btn-en');
        const secId = document.getElementById('section-dest-id');
        const secEn = document.getElementById('section-dest-en');

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
        const rawKategoriId = document.getElementById('dest-kategori').value;
        const isValidUuid = (str) => typeof str === 'string' && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(str);

        const payload = {
          nama: document.getElementById('dest-nama').value.trim(),
          nama_en: document.getElementById('dest-nama-en')?.value.trim() || '',
          lokasi: document.getElementById('dest-lokasi').value.trim(),
          lokasi_en: document.getElementById('dest-lokasi-en')?.value.trim() || '',
          deskripsi: document.getElementById('dest-deskripsi').value.trim(),
          deskripsi_en: document.getElementById('dest-deskripsi-en')?.value.trim() || '',
          kategori_id: isValidUuid(rawKategoriId) ? rawKategoriId : null,
          gambar_url: document.getElementById('dest-gambar').value,
          harga_tiket: document.getElementById('dest-harga').value.trim(),
          jam_buka: document.getElementById('dest-jambuka').value.trim(),
          is_unggulan: document.getElementById('dest-unggulan').checked,
          is_published: document.getElementById('dest-published').checked,
        };

        if (!payload.nama) {
          showToast('Nama destinasi wajib diisi', 'error');
          return false;
        }

        let saveSuccess = true;

        if (isSupabaseConfigured() && supabase) {
          try {
            if (isEdit) {
              const { error } = await supabase.from('destinasi').update(payload).eq('id', destinasi.id);
              if (error) {
                console.error('Error update destinasi:', error);
                showToast('Gagal memperbarui ke Supabase: ' + error.message, 'error');
                saveSuccess = false;
              }
            } else {
              const { data, error } = await supabase.from('destinasi').insert([payload]).select();
              if (error) {
                console.error('Error insert destinasi:', error);
                showToast('Gagal menyimpan ke Supabase: ' + error.message, 'error');
                saveSuccess = false;
              } else if (data && data[0]) {
                destinasiList.unshift(data[0]);
              }
            }
          } catch (err) {
            console.error('Exception saving destinasi:', err);
            showToast('Terjadi kesalahan simpan: ' + err.message, 'error');
            saveSuccess = false;
          }
        }

        if (!saveSuccess || !isSupabaseConfigured() || !supabase) {
          if (isEdit) {
            Object.assign(destinasi, payload);
          } else if (!isSupabaseConfigured() || !supabase) {
            destinasiList.unshift({ id: 'dest-' + Date.now(), ...payload });
          }
        }

        if (saveSuccess) {
          showToast(isEdit ? 'Destinasi berhasil diperbarui!' : 'Destinasi berhasil ditambahkan!', 'success');
        }

        await loadData();
        renderPage();
        return saveSuccess;
      }
    });
  };

  renderPage();
  return container;
};
