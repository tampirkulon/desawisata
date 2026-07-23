import { auth } from '../../utils/auth.js';
import { renderAdminSidebar, initAdminSidebarEvents } from '../components/sidebar.js';
import { renderAdminHeader } from '../components/header.js';
import { openAdminModal, openConfirmModal } from '../components/modal.js';
import { renderImageUploader, initImageUploaderEvents } from '../components/image-upload.js';
import { showToast } from '../../components/toast.js';
import { supabase, isSupabaseConfigured } from '../../lib/supabase.js';
import { mockData } from '../../data/seed.js';

export const renderAdminGaleri = async () => {
  const isAuthed = await auth.requireAuth();
  if (!isAuthed) return document.createElement('div');

  let galeriList = mockData.galeri;

  const loadData = async () => {
    if (isSupabaseConfigured()) {
      try {
        const { data } = await supabase.from('galeri').select('*').order('created_at', { ascending: false });
        if (data) galeriList = data;
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
      ${renderAdminSidebar('#/admin/galeri')}

      <main class="admin-main">
        ${renderAdminHeader('Kelola Galeri Foto & Video')}

        <div class="admin-body">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
            <h3 style="font-size: 1.2rem;">Daftar Foto & Video</h3>
            <button class="btn btn-primary" id="upload-galeri-btn">📤 Upload Media Baru</button>
          </div>

          <!-- Grid Thumbnail View -->
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px;">
            ${galeriList.length === 0 ? `
              <p style="grid-column: 1/-1; text-align: center; color: var(--neutral-600); padding: 40px;">Belum ada media di galeri.</p>
            ` : galeriList.map(item => `
              <div class="card" style="padding: 0; overflow: hidden; position: relative;">
                <img src="${item.url}" style="width: 100%; height: 160px; object-fit: cover;" />
                <div style="padding: 12px;">
                  <strong style="font-size: 0.95rem; display: block;">${item.judul || 'Foto'}</strong>
                  <span class="badge badge-primary" style="margin-top: 4px;">${item.kategori || 'Umum'}</span>
                </div>
                <div style="padding: 8px 12px; border-top: 1px solid var(--neutral-200); display: flex; justify-content: flex-end; gap: 8px;">
                  <button class="btn btn-sm btn-secondary action-edit-gal" data-id="${item.id}">Edit</button>
                  <button class="btn btn-sm btn-outline action-del-gal" data-id="${item.id}" style="color: var(--status-error); border-color: var(--status-error);">Hapus</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </main>
    `;

    bindEvents();
  };

  const bindEvents = () => {
    initAdminSidebarEvents();

    container.querySelector('#upload-galeri-btn')?.addEventListener('click', () => openUploadModal());

    container.querySelectorAll('.action-edit-gal').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const item = galeriList.find(g => g.id === id);
        if (item) openUploadModal(item);
      });
    });

    container.querySelectorAll('.action-del-gal').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        openConfirmModal({
          message: 'Apakah Anda yakin ingin menghapus media ini dari galeri?',
          onConfirm: async () => {
            if (isSupabaseConfigured()) {
              await supabase.from('galeri').delete().eq('id', id);
            }
            showToast('Media berhasil dihapus.', 'success');
            await loadData();
            renderPage();
          }
        });
      });
    });
  };

  const openUploadModal = (galeri = null) => {
    const isEdit = !!galeri;
    const bodyHtml = `
      <form id="galeri-form">
        <div class="form-group">
          <label class="form-label">Judul / Caption *</label>
          <input type="text" id="gal-judul" class="form-control" value="${galeri?.judul || ''}" required />
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div class="form-group">
            <label class="form-label">Kategori Galeri</label>
            <input type="text" id="gal-kategori" class="form-control" placeholder="Alam / Kuliner / Budaya" value="${galeri?.kategori || 'Alam'}" />
          </div>
          <div class="form-group">
            <label class="form-label">Tipe Media</label>
            <select id="gal-tipe" class="form-control">
              <option value="foto" ${galeri?.tipe === 'foto' ? 'selected' : ''}>Foto</option>
              <option value="video" ${galeri?.tipe === 'video' ? 'selected' : ''}>Video</option>
            </select>
          </div>
        </div>

        ${renderImageUploader('gal-url', galeri?.url || '')}
      </form>
    `;

    openAdminModal({
      title: isEdit ? 'Edit Caption Media' : 'Upload Media Galeri',
      bodyHtml,
      saveText: isEdit ? 'Perbarui' : 'Upload & Simpan',
      onSave: async () => {
        const payload = {
          judul: document.getElementById('gal-judul').value.trim(),
          kategori: document.getElementById('gal-kategori').value.trim(),
          tipe: document.getElementById('gal-tipe').value,
          url: document.getElementById('gal-url').value,
        };

        if (!payload.judul || !payload.url) {
          showToast('Judul dan URL media wajib diisi', 'error');
          return false;
        }

        if (isSupabaseConfigured()) {
          if (isEdit) {
            await supabase.from('galeri').update(payload).eq('id', galeri.id);
          } else {
            await supabase.from('galeri').insert([payload]);
          }
        } else {
          if (isEdit) {
            Object.assign(galeri, payload);
          } else {
            galeriList.unshift({ id: 'gal-' + Date.now(), ...payload });
          }
        }

        showToast(isEdit ? 'Media diperbarui!' : 'Media ditambahkan ke galeri!', 'success');
        await loadData();
        renderPage();
        return true;
      }
    });

    setTimeout(() => initImageUploaderEvents('gal-url', 'galeri'), 100);
  };

  renderPage();
  return container;
};
