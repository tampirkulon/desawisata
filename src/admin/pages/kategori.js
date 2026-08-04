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
  container.className = 'dashboard-wrapper donezo-bg';

  const renderPage = () => {
    container.innerHTML = `
      ${renderAdminSidebar('#/admin/kategori')}

      <main class="admin-main donezo-bg h-full overflow-hidden flex flex-col">
        ${renderAdminHeader('Kelola Kategori Wisata')}

        <div class="flex-1 overflow-y-auto p-8 w-full">
          <div class="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <h1 class="font-display-lg text-2xl font-bold text-slate-800 m-0">Kategori Wisata</h1>
              <p class="text-xs font-medium text-slate-400 m-0 mt-1">Kelola pengelompokan jenis atraksi & destinasi desa.</p>
            </div>
            <button class="px-5 py-2.5 rounded-full bg-[#316342] text-white font-bold text-xs hover:bg-[#254d33] transition-colors shadow-md flex items-center gap-2" id="add-kat-btn">
              <span class="material-symbols-outlined text-sm">add</span>
              Tambah Kategori
            </button>
          </div>

          <div class="donezo-card p-6">
            ${renderDataTable({
              columns: [
                { label: 'Nama Kategori' },
                { label: 'Deskripsi' },
                { label: 'Urutan' },
                { label: 'Jumlah Destinasi' }
              ],
              data: kategoriList,
              searchPlaceholder: 'Cari kategori...'
            })}
          </div>
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
            if (isSupabaseConfigured() && supabase) {
              const { error } = await supabase.from('kategori_wisata').delete().eq('id', id);
              if (error) {
                showToast('Gagal menghapus kategori: ' + error.message, 'error');
                return;
              }
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
        <div class="form-group">
          <label class="form-label">Nama Kategori *</label>
          <input type="text" id="kat-nama" class="form-control" placeholder="Misal: Wisata Kuliner" value="${kategori?.nama || ''}" required />
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
          urutan: parseInt(document.getElementById('kat-urutan').value) || 1,
          deskripsi: document.getElementById('kat-deskripsi').value.trim(),
        };

        if (!payload.nama) {
          showToast('Nama kategori wajib diisi', 'error');
          return false;
        }

        if (isSupabaseConfigured() && supabase) {
          try {
            if (isEdit) {
              const { error } = await supabase.from('kategori_wisata').update(payload).eq('id', kategori.id);
              if (error) throw error;
            } else {
              const { error } = await supabase.from('kategori_wisata').insert([payload]).select();
              if (error) throw error;
            }
          } catch (err) {
            showToast('Gagal menyimpan kategori: ' + err.message, 'error');
            return false;
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
