import { auth } from '../../utils/auth.js';
import { renderAdminSidebar, initAdminSidebarEvents } from '../components/sidebar.js';
import { renderAdminHeader } from '../components/header.js';
import { renderDataTable } from '../components/data-table.js';
import { openAdminModal, openConfirmModal } from '../components/modal.js';
import { showToast } from '../../components/toast.js';
import { supabase, isSupabaseConfigured } from '../../lib/supabase.js';
import { mockData } from '../../data/seed.js';

export const renderAdminKategori = async () => {
  const isAuthed = await auth.requireAuth();
  if (!isAuthed) return document.createElement('div');

  let kategoriList = mockData.kategori_wisata;
  let destinasiList = mockData.destinasi;

  const loadData = async () => {
    if (isSupabaseConfigured()) {
      try {
        const { data: kat } = await supabase.from('kategori_wisata').select('*').order('urutan', { ascending: true });
        if (kat) kategoriList = kat;

        const { data: dest } = await supabase.from('destinasi').select('id, kategori_id');
        if (dest) destinasiList = dest;
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
      ${renderAdminSidebar('#/admin/kategori')}

      <main class="admin-main">
        ${renderAdminHeader('Kelola Kategori Wisata')}

        <div class="admin-body">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3 style="font-size: 1.2rem;">Daftar Kategori Wisata</h3>
            <button class="btn btn-primary" id="add-kat-btn">➕ Tambah Kategori</button>
          </div>

          ${renderDataTable({
            columns: [
              { label: 'Icon & Nama Kategori' },
              { label: 'Deskripsi' },
              { label: 'Urutan' },
              { label: 'Jumlah Destinasi' }
            ],
            data: kategoriList,
            searchPlaceholder: 'Cari kategori...'
          })}
        </div>
      </main>
    `;

    bindEvents();
  };

  const bindEvents = () => {
    initAdminSidebarEvents();

    const tbody = container.querySelector('#table-body-element');
    if (tbody && kategoriList.length > 0) {
      tbody.innerHTML = kategoriList.map(item => {
        const count = destinasiList.filter(d => d.kategori_id === item.id).length;
        return `
          <tr>
            <td>
              <span style="font-size: 1.5rem; margin-right: 8px;">${item.icon || '🍃'}</span>
              <strong>${item.nama}</strong>
            </td>
            <td style="color: var(--neutral-600);">${item.deskripsi || '-'}</td>
            <td>${item.urutan || 0}</td>
            <td><span class="badge badge-primary">${count} Destinasi</span></td>
            <td style="text-align: right;">
              <button class="btn btn-sm btn-secondary action-edit" data-id="${item.id}">Edit</button>
              <button class="btn btn-sm btn-outline action-delete" data-id="${item.id}" style="color: var(--status-error); border-color: var(--status-error);">Hapus</button>
            </td>
          </tr>
        `;
      }).join('');
    }

    container.querySelector('#add-kat-btn')?.addEventListener('click', () => openFormModal());

    container.querySelectorAll('.action-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const item = kategoriList.find(k => k.id === id);
        if (item) openFormModal(item);
      });
    });

    container.querySelectorAll('.action-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const count = destinasiList.filter(d => d.kategori_id === id).length;

        if (count > 0) {
          showToast(`Gagal hapus: Kategori masih digunakan oleh ${count} destinasi.`, 'error');
          return;
        }

        openConfirmModal({
          message: 'Apakah Anda yakin ingin menghapus kategori ini?',
          onConfirm: async () => {
            if (isSupabaseConfigured()) {
              await supabase.from('kategori_wisata').delete().eq('id', id);
            }
            showToast('Kategori berhasil dihapus.', 'success');
            await loadData();
            renderPage();
          }
        });
      });
    });
  };

  const openFormModal = (kategori = null) => {
    const isEdit = !!kategori;
    const bodyHtml = `
      <form id="kategori-form">
        <div style="display: grid; grid-template-columns: 1fr 3fr; gap: 16px;">
          <div class="form-group">
            <label class="form-label">Emoji Icon</label>
            <input type="text" id="kat-icon" class="form-control" placeholder="🌱" value="${kategori?.icon || '🌱'}" />
          </div>
          <div class="form-group">
            <label class="form-label">Nama Kategori *</label>
            <input type="text" id="kat-nama" class="form-control" placeholder="Misal: Wisata Kuliner" value="${kategori?.nama || ''}" required />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Urutan Tampil</label>
          <input type="number" id="kat-urutan" class="form-control" value="${kategori?.urutan || 1}" />
        </div>

        <div class="form-group">
          <label class="form-label">Deskripsi Singkat</label>
          <textarea id="kat-deskripsi" class="form-control" rows="3">${kategori?.deskripsi || ''}</textarea>
        </div>
      </form>
    `;

    openAdminModal({
      title: isEdit ? 'Edit Kategori Wisata' : 'Tambah Kategori Wisata',
      bodyHtml,
      saveText: isEdit ? 'Perbarui' : 'Simpan',
      onSave: async () => {
        const payload = {
          nama: document.getElementById('kat-nama').value.trim(),
          icon: document.getElementById('kat-icon').value.trim() || '🌱',
          urutan: parseInt(document.getElementById('kat-urutan').value) || 1,
          deskripsi: document.getElementById('kat-deskripsi').value.trim(),
        };

        if (!payload.nama) {
          showToast('Nama kategori wajib diisi', 'error');
          return false;
        }

        if (isSupabaseConfigured()) {
          if (isEdit) {
            await supabase.from('kategori_wisata').update(payload).eq('id', kategori.id);
          } else {
            await supabase.from('kategori_wisata').insert([payload]);
          }
        } else {
          if (isEdit) {
            Object.assign(kategori, payload);
          } else {
            kategoriList.push({ id: 'cat-' + Date.now(), ...payload });
          }
        }

        showToast(isEdit ? 'Kategori diperbarui!' : 'Kategori ditambahkan!', 'success');
        await loadData();
        renderPage();
        return true;
      }
    });
  };

  renderPage();
  return container;
};
