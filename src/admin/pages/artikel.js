import { auth } from '../../utils/auth.js';
import { renderAdminSidebar, initAdminSidebarEvents } from '../components/sidebar.js';
import { renderAdminHeader } from '../components/header.js';
import { renderDataTable } from '../components/data-table.js';
import { openAdminModal, openConfirmModal } from '../components/modal.js';
import { renderImageUploader, initImageUploaderEvents } from '../components/image-upload.js';
import { showToast } from '../../components/toast.js';
import { supabase, isSupabaseConfigured } from '../../lib/supabase.js';
import { mockData } from '../../data/seed.js';

export const renderAdminArtikel = async () => {
  const isAuthed = await auth.requireAuth();
  if (!isAuthed) return document.createElement('div');

  let artikelList = mockData.artikel;

  const loadData = async () => {
    if (isSupabaseConfigured()) {
      try {
        const { data } = await supabase.from('artikel').select('*').order('created_at', { ascending: false });
        if (data) artikelList = data;
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
      ${renderAdminSidebar('#/admin/artikel')}

      <main class="admin-main donezo-bg min-h-screen">
        ${renderAdminHeader('Kelola Artikel Blog')}

        <div class="p-8 max-w-7xl mx-auto w-full">
          <div class="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <h1 class="font-display-lg text-2xl font-bold text-slate-800 m-0">Artikel & Berita</h1>
              <p class="text-xs font-medium text-slate-400 m-0 mt-1">Kelola berita, kabar desa, dan promosi wisata desa.</p>
            </div>
            <button class="px-5 py-2.5 rounded-full bg-[#316342] text-white font-bold text-xs hover:bg-[#254d33] transition-colors shadow-md flex items-center gap-2" id="add-art-btn">
              <span class="material-symbols-outlined text-sm">add</span>
              Tulis Artikel Baru
            </button>
          </div>

          <div class="donezo-card p-6">
            ${renderDataTable({
              columns: [
                { label: 'Judul Artikel' },
                { label: 'Kategori' },
                { label: 'Tanggal Publish' },
                { label: 'Status' }
              ],
              data: artikelList,
              searchPlaceholder: 'Cari artikel...'
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
    if (tbody && artikelList.length > 0) {
      tbody.innerHTML = artikelList.map(item => `
        <tr>
          <td>
            <strong>${item.judul}</strong>
            <div style="font-size: 0.8rem; color: var(--neutral-600);">${item.ringkasan ? item.ringkasan.substring(0, 60) + '...' : ''}</div>
          </td>
          <td><span class="badge badge-primary">${item.kategori || 'Umum'}</span></td>
          <td>${item.published_at ? new Date(item.published_at).toLocaleDateString('id-ID') : '-'}</td>
          <td>
            <span class="badge ${item.status === 'published' ? 'badge-success' : 'badge-warning'}">
              ${item.status}
            </span>
          </td>
          <td style="text-align: right;">
            <button class="btn btn-sm btn-secondary action-edit" data-id="${item.id}">Edit</button>
            <button class="btn btn-sm btn-outline action-delete" data-id="${item.id}" style="color: var(--status-error); border-color: var(--status-error);">Hapus</button>
          </td>
        </tr>
      `).join('');
    }

    container.querySelector('#add-art-btn')?.addEventListener('click', () => openFormModal());

    container.querySelectorAll('.action-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const item = artikelList.find(a => a.id === id);
        if (item) openFormModal(item);
      });
    });

    container.querySelectorAll('.action-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        openConfirmModal({
          message: 'Apakah Anda yakin ingin menghapus artikel ini?',
          onConfirm: async () => {
            if (isSupabaseConfigured()) {
              await supabase.from('artikel').delete().eq('id', id);
            }
            showToast('Artikel berhasil dihapus.', 'success');
            await loadData();
            renderPage();
          }
        });
      });
    });
  };

  const openFormModal = (artikel = null) => {
    const isEdit = !!artikel;

    const bodyHtml = `
      <form id="artikel-form">
        <div class="form-group">
          <label class="form-label">Judul Artikel *</label>
          <input type="text" id="art-judul" class="form-control" value="${artikel?.judul || ''}" required />
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div class="form-group">
            <label class="form-label">Kategori Artikel</label>
            <input type="text" id="art-kategori" class="form-control" placeholder="Berita Desa / Wisata / Budaya" value="${artikel?.kategori || 'Berita Desa'}" />
          </div>
          <div class="form-group">
            <label class="form-label">Status Publikasi</label>
            <select id="art-status" class="form-control">
              <option value="draft" ${artikel?.status === 'draft' ? 'selected' : ''}>Draft</option>
              <option value="published" ${artikel?.status === 'published' ? 'selected' : ''}>Published</option>
            </select>
          </div>
        </div>

        ${renderImageUploader('art-gambar', artikel?.gambar_url || '')}

        <div class="form-group">
          <label class="form-label">Ringkasan / Excerpt (Max 200 Karakter)</label>
          <textarea id="art-ringkasan" class="form-control" rows="2">${artikel?.ringkasan || ''}</textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Konten Artikel (Markdown Format)</label>
          <div style="margin-bottom: 6px; display: flex; gap: 8px;">
            <button type="button" class="btn btn-sm btn-secondary" onclick="document.getElementById('art-konten').value += '## Subjudul\\n'">+ Subjudul</button>
            <button type="button" class="btn btn-sm btn-secondary" onclick="document.getElementById('art-konten').value += '**teks tebal**'"><b>B</b></button>
            <button type="button" class="btn btn-sm btn-secondary" onclick="document.getElementById('art-konten').value += '*teks miring*'"><i>I</i></button>
          </div>
          <textarea id="art-konten" class="form-control" rows="8" placeholder="Tulis konten artikel di sini...">${artikel?.konten || ''}</textarea>
        </div>
      </form>
    `;

    openAdminModal({
      title: isEdit ? 'Edit Artikel' : 'Tulis Artikel Baru',
      bodyHtml,
      saveText: isEdit ? 'Perbarui Artikel' : 'Simpan Artikel',
      onSave: async () => {
        const statusVal = document.getElementById('art-status').value;
        const payload = {
          judul: document.getElementById('art-judul').value.trim(),
          kategori: document.getElementById('art-kategori').value.trim(),
          status: statusVal,
          gambar_url: document.getElementById('art-gambar').value,
          ringkasan: document.getElementById('art-ringkasan').value.trim(),
          konten: document.getElementById('art-konten').value.trim(),
          published_at: statusVal === 'published' ? (artikel?.published_at || new Date().toISOString()) : null
        };

        if (!payload.judul) {
          showToast('Judul artikel wajib diisi', 'error');
          return false;
        }

        if (isSupabaseConfigured()) {
          if (isEdit) {
            await supabase.from('artikel').update(payload).eq('id', artikel.id);
          } else {
            await supabase.from('artikel').insert([payload]);
          }
        } else {
          if (isEdit) {
            Object.assign(artikel, payload);
          } else {
            artikelList.unshift({ id: 'art-' + Date.now(), ...payload });
          }
        }

        showToast(isEdit ? 'Artikel diperbarui!' : 'Artikel disimpan!', 'success');
        await loadData();
        renderPage();
        return true;
      }
    });

    setTimeout(() => initImageUploaderEvents('art-gambar', 'artikel'), 100);
  };

  renderPage();
  return container;
};
