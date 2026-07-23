import { auth } from '../../utils/auth.js';
import { renderAdminSidebar, initAdminSidebarEvents } from '../components/sidebar.js';
import { renderAdminHeader } from '../components/header.js';
import { showToast } from '../../components/toast.js';
import { supabase, isSupabaseConfigured } from '../../lib/supabase.js';
import { mockData } from '../../data/seed.js';

export const renderAdminProfil = async () => {
  const isAuthed = await auth.requireAuth();
  if (!isAuthed) return document.createElement('div');

  let profil = mockData.profil_desa;

  const loadData = async () => {
    if (isSupabaseConfigured()) {
      try {
        const { data } = await supabase.from('profil_desa').select('*').single();
        if (data) profil = data;
      } catch (e) {
        console.warn('Fallback:', e);
      }
    }
  };

  await loadData();

  const container = document.createElement('div');
  container.className = 'dashboard-wrapper';

  container.innerHTML = `
    ${renderAdminSidebar('#/admin/profil')}

    <main class="admin-main">
      ${renderAdminHeader('Edit Profil Desa Wisata')}

      <div class="admin-body">
        <form id="profil-desa-form" class="card" style="padding: 36px; max-width: 900px; margin: 0 auto;">
          <h3 style="font-size: 1.3rem; margin-bottom: 20px; border-bottom: 2px solid var(--primary-500); padding-bottom: 8px;">
            🏛️ Identitas & Tagline Desa
          </h3>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div class="form-group">
              <label class="form-label">Nama Resmi Desa Wisata</label>
              <input type="text" id="prof-nama" class="form-control" value="${profil.nama_desa || ''}" required />
            </div>
            <div class="form-group">
              <label class="form-label">Slogan / Tagline</label>
              <input type="text" id="prof-tagline" class="form-control" value="${profil.tagline || ''}" />
            </div>
          </div>

          <h3 style="font-size: 1.3rem; margin: 28px 0 20px; border-bottom: 2px solid var(--primary-500); padding-bottom: 8px;">
            📖 Sejarah, Visi, & Misi
          </h3>

          <div class="form-group">
            <label class="form-label">Sejarah Desa (Markdown)</label>
            <textarea id="prof-sejarah" class="form-control" rows="4">${profil.sejarah || ''}</textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Visi Desa</label>
            <textarea id="prof-visi" class="form-control" rows="2">${profil.visi || ''}</textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Misi Desa (1 per baris)</label>
            <textarea id="prof-misi" class="form-control" rows="3">${profil.misi || ''}</textarea>
          </div>

          <h3 style="font-size: 1.3rem; margin: 28px 0 20px; border-bottom: 2px solid var(--primary-500); padding-bottom: 8px;">
            📞 Informasi Kontak & Operasional
          </h3>

          <div class="form-group">
            <label class="form-label">Alamat Lengkap</label>
            <input type="text" id="prof-alamat" class="form-control" value="${profil.alamat || ''}" />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
            <div class="form-group">
              <label class="form-label">Nomor Telepon</label>
              <input type="text" id="prof-telepon" class="form-control" value="${profil.telepon || ''}" />
            </div>
            <div class="form-group">
              <label class="form-label">Email Resmi</label>
              <input type="email" id="prof-email" class="form-control" value="${profil.email || ''}" />
            </div>
            <div class="form-group">
              <label class="form-label">Nomor WhatsApp (Ex: 62812...)</label>
              <input type="text" id="prof-whatsapp" class="form-control" value="${profil.whatsapp || ''}" />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
            <div class="form-group">
              <label class="form-label">Jam Operasional</label>
              <input type="text" id="prof-jam" class="form-control" value="${profil.jam_operasional || ''}" />
            </div>
            <div class="form-group">
              <label class="form-label">Luas Wilayah</label>
              <input type="text" id="prof-luas" class="form-control" value="${profil.luas_wilayah || ''}" />
            </div>
            <div class="form-group">
              <label class="form-label">Jumlah Populasi</label>
              <input type="text" id="prof-populasi" class="form-control" value="${profil.populasi || ''}" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Embed Code Google Maps (&lt;iframe...&gt;)</label>
            <textarea id="prof-maps" class="form-control" rows="3">${profil.google_maps_embed || ''}</textarea>
          </div>

          <h3 style="font-size: 1.3rem; margin: 28px 0 20px; border-bottom: 2px solid var(--primary-500); padding-bottom: 8px;">
            🌐 Media Sosial
          </h3>

          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
            <div class="form-group">
              <label class="form-label">URL Instagram</label>
              <input type="text" id="prof-ig" class="form-control" value="${profil.instagram || ''}" />
            </div>
            <div class="form-group">
              <label class="form-label">URL Facebook</label>
              <input type="text" id="prof-fb" class="form-control" value="${profil.facebook || ''}" />
            </div>
            <div class="form-group">
              <label class="form-label">URL YouTube</label>
              <input type="text" id="prof-yt" class="form-control" value="${profil.youtube || ''}" />
            </div>
          </div>

          <div style="margin-top: 32px;">
            <button type="submit" class="btn btn-primary btn-lg" style="width: 100%; padding: 14px; font-size: 1.05rem;" id="save-profil-btn">
              💾 Simpan Seluruh Perubahan Profil
            </button>
          </div>
        </form>
      </div>
    </main>
  `;

  setTimeout(() => {
    initAdminSidebarEvents();

    const form = container.querySelector('#profil-desa-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const saveBtn = container.querySelector('#save-profil-btn');
        saveBtn.disabled = true;
        saveBtn.innerText = 'Menyimpan...';

        const payload = {
          nama_desa: document.getElementById('prof-nama').value.trim(),
          tagline: document.getElementById('prof-tagline').value.trim(),
          sejarah: document.getElementById('prof-sejarah').value.trim(),
          visi: document.getElementById('prof-visi').value.trim(),
          misi: document.getElementById('prof-misi').value.trim(),
          alamat: document.getElementById('prof-alamat').value.trim(),
          telepon: document.getElementById('prof-telepon').value.trim(),
          email: document.getElementById('prof-email').value.trim(),
          whatsapp: document.getElementById('prof-whatsapp').value.trim(),
          jam_operasional: document.getElementById('prof-jam').value.trim(),
          luas_wilayah: document.getElementById('prof-luas').value.trim(),
          populasi: document.getElementById('prof-populasi').value.trim(),
          google_maps_embed: document.getElementById('prof-maps').value.trim(),
          instagram: document.getElementById('prof-ig').value.trim(),
          facebook: document.getElementById('prof-fb').value.trim(),
          youtube: document.getElementById('prof-yt').value.trim(),
        };

        if (isSupabaseConfigured()) {
          try {
            const { error } = await supabase.from('profil_desa').update(payload).eq('id', profil.id);
            if (error) throw error;
            showToast('Profil desa berhasil diperbarui!', 'success');
          } catch (err) {
            showToast('Gagal simpan profil: ' + err.message, 'error');
          }
        } else {
          Object.assign(profil, payload);
          showToast('Profil diperbarui (Demo mode)!', 'success');
        }

        saveBtn.disabled = false;
        saveBtn.innerText = '💾 Simpan Seluruh Perubahan Profil';
      });
    }
  }, 0);

  return container;
};
