import { auth } from '../../utils/auth.js';
import { renderAdminSidebar, initAdminSidebarEvents } from '../components/sidebar.js';
import { renderAdminHeader } from '../components/header.js';
import { renderImageUploader, initImageUploaderEvents } from '../components/image-upload.js';
import { showToast } from '../../components/toast.js';
import { supabase, isSupabaseConfigured } from '../../lib/supabase.js';
import { mockData } from '../../data/seed.js';

export const renderAdminProfil = async () => {
  const isAuthed = await auth.requireAuth();
  if (!isAuthed) return document.createElement('div');

  let profil = mockData.profil_desa;
  let activeTab = 'tab-identitas';

  const loadData = async () => {
    if (isSupabaseConfigured() && supabase) {
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
  container.className = 'dashboard-wrapper donezo-bg';

  const renderPage = () => {
    container.innerHTML = `
      ${renderAdminSidebar('#/admin/profil')}

      <main class="admin-main donezo-bg h-full overflow-hidden flex flex-col">
        ${renderAdminHeader('Pengaturan Profil Desa')}

        <div class="flex-1 overflow-y-auto p-8 w-full">
          <!-- Page Header -->
          <div class="flex items-center justify-between flex-wrap gap-4 mb-8">
            <div>
              <h1 class="font-display-lg text-3xl font-extrabold text-slate-800 m-0">Pengaturan Profil Desa</h1>
              <p class="text-xs font-medium text-slate-400 m-0 mt-1">Kelola identitas resmi, media visual, visi misi, dan kontak terintegrasi desa wisata.</p>
            </div>
            <a href="#/profil" target="_blank" class="px-4 py-2 rounded-full bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 transition-colors flex items-center gap-1.5 shadow-2xs">
              <span class="material-symbols-outlined text-sm">visibility</span>
              Pratinjau Halaman Profil
            </a>
          </div>

          <!-- Interactive Tab Buttons Group -->
          <div class="flex items-center gap-2 border-b border-slate-200/80 mb-8 pb-3 flex-wrap">
            <button class="prof-tab-btn px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'tab-identitas'
                ? 'bg-[#316342] text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/80'
            }" data-tab="tab-identitas">
              <span class="material-symbols-outlined text-base">badge</span>
              Identitas & Media Visual
            </button>
            <button class="prof-tab-btn px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'tab-narasi'
                ? 'bg-[#316342] text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/80'
            }" data-tab="tab-narasi">
              <span class="material-symbols-outlined text-base">history_edu</span>
              Sejarah & Visi Misi
            </button>
            <button class="prof-tab-btn px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'tab-kontak'
                ? 'bg-[#316342] text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/80'
            }" data-tab="tab-kontak">
              <span class="material-symbols-outlined text-base">contact_mail</span>
              Kontak, Operasional & Peta
            </button>
          </div>

          <!-- Main Profile Form -->
          <form id="profil-desa-form">
            <!-- TAB 1: IDENTITAS & MEDIA VISUAL -->
            <div id="tab-identitas-content" class="${activeTab === 'tab-identitas' ? 'block' : 'hidden'} space-y-6">
              <div class="donezo-card p-6 space-y-6">
                <div class="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <span class="material-symbols-outlined text-[#316342]">domain</span>
                  <h3 class="text-base font-bold text-slate-800 m-0">Identitas Utama Desa</h3>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="form-group">
                    <label class="form-label">Nama Resmi Desa Wisata *</label>
                    <input type="text" id="prof-nama" class="form-control" value="${profil.nama_desa || ''}" required placeholder="Desa Wisata Tampirkulon" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Slogan / Tagline *</label>
                    <input type="text" id="prof-tagline" class="form-control" value="${profil.tagline || ''}" placeholder="Keindahan Alam & Pesona Budaya..." />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="form-group">
                    <label class="form-label">Luas Wilayah</label>
                    <input type="text" id="prof-luas" class="form-control" value="${profil.luas_wilayah || ''}" placeholder="Contoh: 150+ Hektar / 3.45 km²" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Jumlah Populasi / Penduduk</label>
                    <input type="text" id="prof-populasi" class="form-control" value="${profil.populasi || ''}" placeholder="Contoh: 2.850+ Jiwa" />
                  </div>
                </div>
              </div>

              <!-- Media Visual Upload Card -->
              <div class="donezo-card p-6 space-y-6">
                <div class="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <span class="material-symbols-outlined text-[#316342]">photo_library</span>
                  <h3 class="text-base font-bold text-slate-800 m-0">Aset Media Visual (Otomatis Format WebP)</h3>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <span class="text-xs font-bold text-slate-700 block mb-2">1. Logo Resmi Desa Wisata</span>
                    ${renderImageUploader('prof-logo', profil.logo_url || '')}
                  </div>
                  <div>
                    <span class="text-xs font-bold text-slate-700 block mb-2">2. Banner Hero Header Profil</span>
                    ${renderImageUploader('prof-banner', profil.banner_url || '')}
                  </div>
                </div>
              </div>
            </div>

            <!-- TAB 2: SEJARAH & VISI MISI -->
            <div id="tab-narasi-content" class="${activeTab === 'tab-narasi' ? 'block' : 'hidden'} space-y-6">
              <div class="donezo-card p-6 space-y-6">
                <div class="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <span class="material-symbols-outlined text-[#316342]">auto_stories</span>
                  <h3 class="text-base font-bold text-slate-800 m-0">Narasi Sejarah & Budaya Desa</h3>
                </div>

                <div class="form-group">
                  <label class="form-label">Sejarah & Latar Belakang Desa (Teks Lengkap)</label>
                  <textarea id="prof-sejarah" class="form-control" rows="6" placeholder="Tulis sejarah awal mula desa dan transformasinya menjadi desa wisata...">${profil.sejarah || ''}</textarea>
                </div>

                <div class="form-group">
                  <label class="form-label">Visi Desa Wisata</label>
                  <textarea id="prof-visi" class="form-control" rows="3" placeholder="Menjadi Desa Wisata Mandiri Berbasis Kearifan Lokal...">${profil.visi || ''}</textarea>
                </div>

                <div class="form-group">
                  <label class="form-label">Misi Desa Wisata (Tulis 1 Poin per Baris)</label>
                  <textarea id="prof-misi" class="form-control" rows="5" placeholder="1. Mengembangkan potensi lokal&#10;2. Menjaga kelestarian alam&#10;3. Meningkatkan ekonomi warga">${profil.misi || ''}</textarea>
                </div>
              </div>
            </div>

            <!-- TAB 3: KONTAK, OPERASIONAL & PETA -->
            <div id="tab-kontak-content" class="${activeTab === 'tab-kontak' ? 'block' : 'hidden'} space-y-6">
              <div class="donezo-card p-6 space-y-6">
                <div class="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <span class="material-symbols-outlined text-[#316342]">pin_drop</span>
                  <h3 class="text-base font-bold text-slate-800 m-0">Kontak Resmi & Alamat Pengelola</h3>
                </div>

                <div class="form-group">
                  <label class="form-label">Alamat Lengkap Kantor Desa / Sekretariat</label>
                  <input type="text" id="prof-alamat" class="form-control" value="${profil.alamat || ''}" placeholder="Jl. Raya Candimulyo No. 12, Tampirkulon, Magelang" />
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div class="form-group">
                    <label class="form-label">Nomor Telepon</label>
                    <input type="text" id="prof-telepon" class="form-control" value="${profil.telepon || ''}" placeholder="+62 812-3456-7890" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">WhatsApp Pengelola (Format: 628...)</label>
                    <input type="text" id="prof-whatsapp" class="form-control" value="${profil.whatsapp || ''}" placeholder="6281234567890" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Email Resmi</label>
                    <input type="email" id="prof-email" class="form-control" value="${profil.email || ''}" placeholder="info@tampirkulon.desa.id" />
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div class="form-group">
                    <label class="form-label">Jam Operasional Wisata</label>
                    <input type="text" id="prof-jam" class="form-control" value="${profil.jam_operasional || ''}" placeholder="Senin - Minggu: 08:00 - 17:00 WIB" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">URL Instagram</label>
                    <input type="text" id="prof-ig" class="form-control" value="${profil.instagram || ''}" placeholder="https://instagram.com/..." />
                  </div>
                  <div class="form-group">
                    <label class="form-label">URL YouTube</label>
                    <input type="text" id="prof-yt" class="form-control" value="${profil.youtube || ''}" placeholder="https://youtube.com/..." />
                  </div>
                </div>

                <!-- Google Maps Embed & Live Preview -->
                <div class="form-group pt-4 border-t border-slate-100">
                  <label class="form-label">Embed Code Google Maps (&lt;iframe ...&gt;&lt;/iframe&gt;)</label>
                  <textarea id="prof-maps" class="form-control font-mono text-xs" rows="3" placeholder="Salin kode semat peta dari Google Maps...">${profil.google_maps_embed || ''}</textarea>
                  
                  <!-- Live Preview Map Box -->
                  <div class="mt-3">
                    <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Live Pratinjau Peta Google Maps:</span>
                    <div id="maps-live-preview" class="w-full h-48 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                      ${profil.google_maps_embed ? profil.google_maps_embed.replace('<iframe', '<iframe class="w-full h-full border-0"') : 'Masukkan kode iframe Google Maps untuk melihat pratinjau.'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sticky Save Button Bar -->
            <div class="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between flex-wrap gap-4">
              <span class="text-xs text-slate-400 font-medium">Perubahan langsung tersinkronisasi ke seluruh website publik.</span>
              <button type="submit" id="save-profil-btn" class="px-8 py-3 rounded-full bg-[#316342] hover:bg-[#254d33] text-white font-bold text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer">
                <span class="material-symbols-outlined text-lg">save</span>
                Simpan Seluruh Perubahan Profil
              </button>
            </div>
          </form>
        </div>
      </main>
    `;

    bindEvents();
  };

  const bindEvents = () => {
    initAdminSidebarEvents();

    // Init WebP Drag & Drop image uploaders
    setTimeout(() => {
      initImageUploaderEvents('prof-logo', 'profil');
      initImageUploaderEvents('prof-banner', 'profil');
    }, 50);

    // Tab switching
    container.querySelectorAll('.prof-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tabKey = e.currentTarget.getAttribute('data-tab');
        activeTab = tabKey;
        renderPage();
      });
    });

    // Maps live preview updater
    const mapsTextarea = container.querySelector('#prof-maps');
    const mapsPreviewBox = container.querySelector('#maps-live-preview');
    if (mapsTextarea && mapsPreviewBox) {
      mapsTextarea.addEventListener('input', (e) => {
        const code = e.target.value.trim();
        if (code.includes('<iframe')) {
          mapsPreviewBox.innerHTML = code.replace('<iframe', '<iframe class="w-full h-full border-0"');
        } else if (code) {
          mapsPreviewBox.innerHTML = `<iframe class="w-full h-full border-0" src="${code}" loading="lazy"></iframe>`;
        } else {
          mapsPreviewBox.innerHTML = 'Masukkan kode iframe Google Maps untuk melihat pratinjau.';
        }
      });
    }

    // Form submission
    const form = container.querySelector('#profil-desa-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const saveBtn = container.querySelector('#save-profil-btn');
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<span class="material-symbols-outlined text-lg animate-spin">sync</span> Menyimpan...';

        const payload = {
          nama_desa: document.getElementById('prof-nama')?.value.trim() || profil.nama_desa,
          tagline: document.getElementById('prof-tagline')?.value.trim() || profil.tagline,
          logo_url: document.getElementById('prof-logo')?.value || profil.logo_url,
          banner_url: document.getElementById('prof-banner')?.value || profil.banner_url,
          luas_wilayah: document.getElementById('prof-luas')?.value.trim() || profil.luas_wilayah,
          populasi: document.getElementById('prof-populasi')?.value.trim() || profil.populasi,
          sejarah: document.getElementById('prof-sejarah')?.value.trim() || profil.sejarah,
          visi: document.getElementById('prof-visi')?.value.trim() || profil.visi,
          misi: document.getElementById('prof-misi')?.value.trim() || profil.misi,
          alamat: document.getElementById('prof-alamat')?.value.trim() || profil.alamat,
          telepon: document.getElementById('prof-telepon')?.value.trim() || profil.telepon,
          whatsapp: document.getElementById('prof-whatsapp')?.value.trim() || profil.whatsapp,
          email: document.getElementById('prof-email')?.value.trim() || profil.email,
          jam_operasional: document.getElementById('prof-jam')?.value.trim() || profil.jam_operasional,
          instagram: document.getElementById('prof-ig')?.value.trim() || profil.instagram,
          youtube: document.getElementById('prof-yt')?.value.trim() || profil.youtube,
          google_maps_embed: document.getElementById('prof-maps')?.value.trim() || profil.google_maps_embed,
        };

        if (isSupabaseConfigured() && supabase) {
          try {
            if (profil?.id) {
              const { error } = await supabase.from('profil_desa').update(payload).eq('id', profil.id);
              if (error) throw error;
            } else {
              const { error } = await supabase.from('profil_desa').upsert([payload]);
              if (error) throw error;
            }
            showToast('Profil desa berhasil diperbarui & disinkronkan!', 'success');
          } catch (err) {
            console.error('Save profile error:', err);
            showToast('Gagal simpan profil: ' + err.message, 'error');
          }
        } else {
          Object.assign(profil, payload);
          Object.assign(mockData.profil_desa, payload);
          showToast('Profil desa diperbarui & tersinkronisasi (Mode Demo)!', 'success');
        }

        saveBtn.disabled = false;
        saveBtn.innerHTML = '<span class="material-symbols-outlined text-lg">save</span> Simpan Seluruh Perubahan Profil';
      });
    }
  };

  renderPage();
  return container;
};

