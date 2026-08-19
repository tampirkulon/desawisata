import { auth } from '../../utils/auth.js';
import { renderAdminSidebar, initAdminSidebarEvents } from '../components/sidebar.js';
import { renderAdminHeader } from '../components/header.js';
import { renderDataTable, initTableSearch } from '../components/data-table.js';
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

      <main class="admin-main donezo-bg h-full overflow-hidden flex flex-col">
        ${renderAdminHeader('Kelola Artikel Blog')}

        <div class="flex-1 overflow-y-auto p-8 w-full">
          <div class="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <h1 class="font-display-lg text-2xl font-bold text-slate-800 m-0">Artikel & Berita</h1>
              <p class="text-xs font-medium text-slate-400 m-0 mt-1">Kelola berita, kabar desa, dan promosi wisata desa (Mendukung ID & EN).</p>
            </div>
            <button class="px-5 py-2.5 rounded-full bg-[#316342] text-white font-bold text-xs hover:bg-[#254d33] transition-colors shadow-md flex items-center gap-2 cursor-pointer" id="add-art-btn">
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
    initTableSearch(container);

    const tbody = container.querySelector('#table-body-element');
    if (tbody && artikelList.length > 0) {
      tbody.innerHTML = artikelList.map(item => {
        const hasEn = !!item.judul_en;
        return `
          <tr>
            <td>
              <div style="display: flex; align-items: center; gap: 6px;">
                <strong>${item.judul}</strong>
                ${hasEn ? '<span style="font-size: 10px; background: #e0e7ff; color: #3730a3; padding: 1px 6px; border-radius: 4px; font-weight: bold;">EN</span>' : ''}
              </div>
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
        `;
      }).join('');
    }

    container.querySelector('#add-art-btn')?.addEventListener('click', () => openFormModal());

    container.querySelectorAll('.action-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        const item = artikelList.find(a => String(a.id) === String(id));
        if (item) openFormModal(item);
      });
    });

    container.querySelectorAll('.action-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        openConfirmModal({
          message: 'Apakah Anda yakin ingin menghapus artikel ini?',
          onConfirm: async () => {
            if (isSupabaseConfigured() && supabase) {
              const { error } = await supabase.from('artikel').delete().eq('id', id);
              if (error) {
                showToast('Gagal menghapus artikel: ' + error.message, 'error');
                return;
              }
            } else {
              artikelList = artikelList.filter(a => String(a.id) !== String(id));
              const idx = mockData.artikel.findIndex(a => String(a.id) === String(id));
              if (idx !== -1) mockData.artikel.splice(idx, 1);
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
        <!-- Language Switch Tabs -->
        <div style="display: flex; gap: 8px; margin-bottom: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">
          <button type="button" id="tab-art-id" class="btn btn-sm btn-primary" style="padding: 6px 14px; border-radius: 9999px;">🇮🇩 Bahasa Indonesia</button>
          <button type="button" id="tab-art-en" class="btn btn-sm btn-outline" style="padding: 6px 14px; border-radius: 9999px;">🇬🇧 English (Opsional)</button>
        </div>

        <!-- Section ID -->
        <div id="section-art-id">
          <div class="form-group">
            <label class="form-label">Judul Artikel (ID) *</label>
            <input type="text" id="art-judul" class="form-control" value="${artikel?.judul || ''}" required placeholder="Contoh: Festival Durian Candimulyo..." />
          </div>
          <div class="form-group">
            <label class="form-label">Ringkasan / Excerpt (ID) (Max 200 Karakter)</label>
            <textarea id="art-ringkasan" class="form-control" rows="2" placeholder="Ringkasan artikel dalam bahasa Indonesia...">${artikel?.ringkasan || ''}</textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Konten Artikel (ID) (Markdown Format)</label>
            <div style="margin-bottom: 6px; display: flex; gap: 8px;">
              <button type="button" class="btn btn-sm btn-secondary" onclick="document.getElementById('art-konten').value += '## Subjudul\\n'">+ Subjudul</button>
              <button type="button" class="btn btn-sm btn-secondary" onclick="document.getElementById('art-konten').value += '**teks tebal**'"><b>B</b></button>
              <button type="button" class="btn btn-sm btn-secondary" onclick="document.getElementById('art-konten').value += '*teks miring*'"><i>I</i></button>
            </div>
            <textarea id="art-konten" class="form-control" rows="6" placeholder="Tulis konten artikel di sini...">${artikel?.konten || ''}</textarea>
          </div>
        </div>

        <!-- Section EN -->
        <div id="section-art-en" style="display: none;">
          <div class="form-group">
            <label class="form-label">Article Title (EN)</label>
            <input type="text" id="art-judul-en" class="form-control" value="${artikel?.judul_en || ''}" placeholder="E.g. Candimulyo Durian Festival..." />
          </div>
          <div class="form-group">
            <label class="form-label">Summary / Excerpt (EN)</label>
            <textarea id="art-ringkasan-en" class="form-control" rows="2" placeholder="Article summary in English...">${artikel?.ringkasan_en || ''}</textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Article Content (EN) (Markdown Format)</label>
            <textarea id="art-konten-en" class="form-control" rows="6" placeholder="Write article content in English...">${artikel?.konten_en || ''}</textarea>
          </div>
        </div>

        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 16px 0;" />

        <!-- Common Fields -->
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
      </form>
    `;

    openAdminModal({
      title: isEdit ? 'Edit Artikel' : 'Tulis Artikel Baru',
      bodyHtml,
      saveText: isEdit ? 'Perbarui Artikel' : 'Simpan Artikel',
      onOpen: () => {
        initImageUploaderEvents('art-gambar', 'artikel');
        const tabId = document.getElementById('tab-art-id');
        const tabEn = document.getElementById('tab-art-en');
        const secId = document.getElementById('section-art-id');
        const secEn = document.getElementById('section-art-en');

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
        const statusVal = document.getElementById('art-status').value;
        const payload = {
          judul: document.getElementById('art-judul').value.trim(),
          judul_en: document.getElementById('art-judul-en')?.value.trim() || '',
          ringkasan: document.getElementById('art-ringkasan').value.trim(),
          ringkasan_en: document.getElementById('art-ringkasan-en')?.value.trim() || '',
          konten: document.getElementById('art-konten').value.trim(),
          konten_en: document.getElementById('art-konten-en')?.value.trim() || '',
          kategori: document.getElementById('art-kategori').value.trim(),
          status: statusVal,
          gambar_url: document.getElementById('art-gambar').value,
          published_at: statusVal === 'published' ? (artikel?.published_at || new Date().toISOString()) : null
        };

        if (!payload.judul) {
          showToast('Judul artikel wajib diisi', 'error');
          return false;
        }

        if (isSupabaseConfigured() && supabase) {
          try {
            if (isEdit) {
              const { error } = await supabase.from('artikel').update(payload).eq('id', artikel.id);
              if (error) throw error;
            } else {
              const { error } = await supabase.from('artikel').insert([payload]).select();
              if (error) throw error;
            }
          } catch (err) {
            showToast('Gagal menyimpan artikel: ' + err.message, 'error');
            return false;
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
  };

  renderPage();
  return container;
};
