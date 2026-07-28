import { auth } from '../../utils/auth.js';
import { renderAdminSidebar, initAdminSidebarEvents } from '../components/sidebar.js';
import { renderAdminHeader } from '../components/header.js';
import { renderDataTable } from '../components/data-table.js';
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
  container.className = 'dashboard-wrapper';

  const renderPage = () => {
    container.innerHTML = `
      ${renderAdminSidebar('#/admin/destinasi')}

      <main class="admin-main">
        ${renderAdminHeader('Kelola Destinasi Wisata')}

        <div class="admin-body">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3 style="font-size: 1.2rem;">Daftar Destinasi Wisata</h3>
            <button class="btn btn-primary" id="add-destinasi-btn">Tambah Destinasi Baru</button>
          </div>

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
      </main>
    `;

    bindEvents();
  };

  const bindEvents = () => {
    initAdminSidebarEvents();

    const tbody = container.querySelector('#table-body-element');
    if (tbody && destinasiList.length > 0) {
      tbody.innerHTML = destinasiList.map(item => {
        const kat = kategoriList.find(k => k.id === item.kategori_id);
        return `
          <tr>
            <td>
              <div style="display: flex; align-items: center; gap: 12px;">
                <img src="${item.gambar_url || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=100&q=80'}" style="width: 44px; height: 44px; border-radius: var(--radius-sm); object-fit: cover;" />
                <div>
                  <strong>${item.nama}</strong>
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
        const id = e.currentTarget.getAttribute('data-id');
        const item = destinasiList.find(d => d.id === id);
        if (item) openFormModal(item);
      });
    });

    container.querySelectorAll('.action-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        openConfirmModal({
          message: 'Apakah Anda yakin ingin menghapus destinasi wisata ini?',
          onConfirm: async () => {
            if (isSupabaseConfigured()) {
              await supabase.from('destinasi').delete().eq('id', id);
            }
            showToast('Destinasi berhasil dihapus.', 'success');
            await loadData();
            renderPage();
          }
        });
      });
    });
  };

  const openFormModal = (destinasi = null) => {
    const isEdit = !!destinasi;
    const bodyHtml = `
      <form id="destinasi-form">
        <div class="form-group">
          <label class="form-label">Nama Destinasi Wisata *</label>
          <input type="text" id="dest-nama" class="form-control" value="${destinasi?.nama || ''}" required />
        </div>

        <div class="form-group">
          <label class="form-label">Kategori Wisata *</label>
          <select id="dest-kategori" class="form-control" required>
            ${kategoriList.map(k => `
              <option value="${k.id}" ${destinasi?.kategori_id === k.id ? 'selected' : ''}>${k.nama}</option>
            `).join('')}
          </select>
        </div>

        ${renderImageUploader('dest-gambar', destinasi?.gambar_url || '')}

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div class="form-group">
            <label class="form-label">Harga Tiket Masuk</label>
            <input type="text" id="dest-harga" class="form-control" placeholder="Misal: Rp 10.000 / Gratis" value="${destinasi?.harga_tiket || ''}" />
          </div>
          <div class="form-group">
            <label class="form-label">Jam Buka / Operasional</label>
            <input type="text" id="dest-jambuka" class="form-control" placeholder="Misal: 08:00 - 16:00 WIB" value="${destinasi?.jam_buka || ''}" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Lokasi / Dusun</label>
          <input type="text" id="dest-lokasi" class="form-control" placeholder="Dusun Tampir 1, Tampirkulon" value="${destinasi?.lokasi || ''}" />
        </div>

        <div class="form-group">
          <label class="form-label">Deskripsi Lengkap</label>
          <textarea id="dest-deskripsi" class="form-control" rows="4">${destinasi?.deskripsi || ''}</textarea>
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
      onSave: async () => {
        const payload = {
          nama: document.getElementById('dest-nama').value.trim(),
          kategori_id: document.getElementById('dest-kategori').value,
          gambar_url: document.getElementById('dest-gambar').value,
          harga_tiket: document.getElementById('dest-harga').value.trim(),
          jam_buka: document.getElementById('dest-jambuka').value.trim(),
          lokasi: document.getElementById('dest-lokasi').value.trim(),
          deskripsi: document.getElementById('dest-deskripsi').value.trim(),
          is_unggulan: document.getElementById('dest-unggulan').checked,
          is_published: document.getElementById('dest-published').checked,
        };

        if (!payload.nama) {
          showToast('Nama destinasi wajib diisi', 'error');
          return false;
        }

        if (isSupabaseConfigured()) {
          if (isEdit) {
            await supabase.from('destinasi').update(payload).eq('id', destinasi.id);
          } else {
            await supabase.from('destinasi').insert([payload]);
          }
        } else {
          if (isEdit) {
            Object.assign(destinasi, payload);
          } else {
            destinasiList.unshift({ id: 'dest-' + Date.now(), ...payload });
          }
        }

        showToast(isEdit ? 'Destinasi diperbarui!' : 'Destinasi ditambahkan!', 'success');
        await loadData();
        renderPage();
        return true;
      }
    });

    setTimeout(() => initImageUploaderEvents('dest-gambar', 'destinasi'), 100);
  };

  renderPage();
  return container;
};
