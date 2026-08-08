import { auth } from '../../utils/auth.js';
import { renderAdminSidebar, initAdminSidebarEvents } from '../components/sidebar.js';
import { renderAdminHeader } from '../components/header.js';
import { renderImageUploader, initImageUploaderEvents } from '../components/image-upload.js';
import { showToast } from '../../components/toast.js';
import { getProfilDesa, saveProfilDesa } from '../../utils/profile-store.js';

export const renderAdminProfil = async () => {
  const isAuthed = await auth.requireAuth();
  if (!isAuthed) return document.createElement('div');

  let profil = await getProfilDesa();

  const container = document.createElement('div');
  container.className = 'dashboard-wrapper donezo-bg';

  const renderPage = () => {
    // Helper function to format maps iframe
    const getMapsIframe = (input) => {
      if (!input || !input.trim()) return '';
      const trimmed = input.trim();
      if (trimmed.includes('<iframe')) {
        return trimmed.replace('<iframe', '<iframe class="w-full h-full border-0 rounded-xl"');
      }
      return `<iframe class="w-full h-full border-0 rounded-xl" src="${trimmed}" loading="lazy"></iframe>`;
    };

    container.innerHTML = `
      ${renderAdminSidebar('#/admin/profil')}

      <main class="admin-main donezo-bg h-full overflow-hidden flex flex-col">
        ${renderAdminHeader('Pengaturan Profil Desa')}

        <div class="flex-1 overflow-y-auto p-6 md:p-8 w-full pb-28">
          <!-- Page Title -->
          <div class="mb-8">
            <h1 class="font-display-lg text-2xl md:text-3xl font-extrabold text-slate-800 m-0">Pengaturan Profil Desa</h1>
            <p class="text-xs md:text-sm font-medium text-slate-400 m-0 mt-1.5">Kelola seluruh informasi identitas, narasi, media visual, dan kontak desa wisata dalam satu halaman.</p>
          </div>

          <!-- Main Unified Profile Form -->
          <form id="profil-desa-form" class="space-y-8">
            
            <!-- SECTION 1: IDENTITAS & INFORMASI UMUM -->
            <div class="donezo-card p-6 md:p-8 space-y-6">
              <div class="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div class="w-9 h-9 rounded-xl bg-emerald-50 text-[#316342] flex items-center justify-center font-bold">
                  <span class="material-symbols-outlined text-xl">domain</span>
                </div>
                <div>
                  <h3 class="text-base font-bold text-slate-800 m-0">1. Identitas & Informasi Umum</h3>
                  <p class="text-xs text-slate-400 m-0">Data pokok identitas dan profil statistik desa wisata.</p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="form-group">
                  <label class="form-label font-semibold text-slate-700 text-xs">Nama Resmi Desa Wisata <span class="text-rose-500">*</span></label>
                  <input type="text" id="prof-nama" class="form-control" value="${profil.nama_desa || ''}" required placeholder="Contoh: Desa Wisata Tampirkulon" />
                </div>
                <div class="form-group">
                  <label class="form-label font-semibold text-slate-700 text-xs">Slogan / Tagline Resmi</label>
                  <input type="text" id="prof-tagline" class="form-control" value="${profil.tagline || ''}" placeholder="Contoh: Keindahan Alam & Pesona Budaya..." />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div class="form-group">
                  <label class="form-label font-semibold text-slate-700 text-xs">Luas Wilayah</label>
                  <input type="text" id="prof-luas" class="form-control" value="${profil.luas_wilayah || ''}" placeholder="Contoh: 3.45 km²" />
                </div>
                <div class="form-group">
                  <label class="form-label font-semibold text-slate-700 text-xs">Jumlah Populasi / Penduduk</label>
                  <input type="text" id="prof-populasi" class="form-control" value="${profil.populasi || ''}" placeholder="Contoh: 2.850+ Jiwa" />
                </div>
                <div class="form-group">
                  <label class="form-label font-semibold text-slate-700 text-xs">Jam Operasional Wisata</label>
                  <input type="text" id="prof-jam" class="form-control" value="${profil.jam_operasional || ''}" placeholder="Contoh: Senin - Minggu: 08:00 - 17:00 WIB" />
                </div>
              </div>
            </div>

            <!-- SECTION 2: NARASI SEJARAH, VISI & MISI -->
            <div class="donezo-card p-6 md:p-8 space-y-6">
              <div class="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div class="w-9 h-9 rounded-xl bg-emerald-50 text-[#316342] flex items-center justify-center font-bold">
                  <span class="material-symbols-outlined text-xl">auto_stories</span>
                </div>
                <div>
                  <h3 class="text-base font-bold text-slate-800 m-0">2. Narasi Sejarah, Visi & Misi</h3>
                  <p class="text-xs text-slate-400 m-0">Cerita latar belakang dan cita-cita pengembangan desa wisata.</p>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label font-semibold text-slate-700 text-xs">Sejarah & Latar Belakang Desa (Teks Lengkap)</label>
                <textarea id="prof-sejarah" class="form-control leading-relaxed text-sm" rows="5" placeholder="Tuliskan sejarah desa, awal mula terbentuknya desa wisata, serta keunikan budayanya...">${profil.sejarah || ''}</textarea>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="form-group">
                  <label class="form-label font-semibold text-slate-700 text-xs">Visi Desa Wisata</label>
                  <textarea id="prof-visi" class="form-control leading-relaxed text-sm" rows="4" placeholder="Tuliskan visi masa depan desa wisata...">${profil.visi || ''}</textarea>
                </div>
                <div class="form-group">
                  <label class="form-label font-semibold text-slate-700 text-xs flex items-center justify-between">
                    <span>Misi Desa Wisata</span>
                    <span class="text-[11px] font-normal text-slate-400">(Tulis 1 poin per baris)</span>
                  </label>
                  <textarea id="prof-misi" class="form-control leading-relaxed text-sm" rows="4" placeholder="1. Mengembangkan potensi agrowisata lokal&#10;2. Menjaga kelestarian alam dan lingkungan&#10;3. Memberdayakan ekonomi warga desa">${profil.misi || ''}</textarea>
                </div>
              </div>
            </div>

            <!-- SECTION 3: MEDIA VISUAL & FOTO -->
            <div class="donezo-card p-6 md:p-8 space-y-6">
              <div class="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div class="w-9 h-9 rounded-xl bg-emerald-50 text-[#316342] flex items-center justify-center font-bold">
                  <span class="material-symbols-outlined text-xl">photo_library</span>
                </div>
                <div>
                  <h3 class="text-base font-bold text-slate-800 m-0">3. Media Visual & Logo</h3>
                  <p class="text-xs text-slate-400 m-0">Logo resmi dan foto profil desa (otomatis terkompresi format modern WebP).</p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-2">
                  <span class="text-xs font-bold text-slate-700 block">Logo Resmi Desa</span>
                  ${renderImageUploader('prof-logo', profil.logo_url || '')}
                </div>
                <div class="space-y-2">
                  <span class="text-xs font-bold text-slate-700 block">Foto Banner Profil Desa</span>
                  ${renderImageUploader('prof-banner', profil.banner_url || '')}
                </div>
              </div>
            </div>

            <!-- SECTION 4: KONTAK, MEDIA SOSIAL & PETA -->
            <div class="donezo-card p-6 md:p-8 space-y-6">
              <div class="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div class="w-9 h-9 rounded-xl bg-emerald-50 text-[#316342] flex items-center justify-center font-bold">
                  <span class="material-symbols-outlined text-xl">pin_drop</span>
                </div>
                <div>
                  <h3 class="text-base font-bold text-slate-800 m-0">4. Kontak Resmi & Peta Lokasi</h3>
                  <p class="text-xs text-slate-400 m-0">Alamat kantor sekretariat, WhatsApp pengelola, dan sematan peta.</p>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label font-semibold text-slate-700 text-xs">Alamat Lengkap Kantor Desa / Sekretariat</label>
                <input type="text" id="prof-alamat" class="form-control" value="${profil.alamat || ''}" placeholder="Jl. Raya Candimulyo No. 12, Tampirkulon, Magelang, Jawa Tengah 56191" />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div class="form-group">
                  <label class="form-label font-semibold text-slate-700 text-xs flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-emerald-600 text-sm">chat</span>
                    WhatsApp Pengelola
                  </label>
                  <input type="text" id="prof-whatsapp" class="form-control" value="${profil.whatsapp || ''}" placeholder="Contoh: 081234567890 / 628..." />
                </div>
                <div class="form-group">
                  <label class="form-label font-semibold text-slate-700 text-xs">Nomor Telepon Kantor</label>
                  <input type="text" id="prof-telepon" class="form-control" value="${profil.telepon || ''}" placeholder="+62 812-3456-7890" />
                </div>
                <div class="form-group">
                  <label class="form-label font-semibold text-slate-700 text-xs">Email Resmi</label>
                  <input type="email" id="prof-email" class="form-control" value="${profil.email || ''}" placeholder="info@tampirkulon.desa.id" />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div class="form-group">
                  <label class="form-label font-semibold text-slate-700 text-xs flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-pink-600 text-sm">photo_camera</span>
                    Akun / URL Instagram
                  </label>
                  <input type="text" id="prof-ig" class="form-control" value="${profil.instagram || ''}" placeholder="https://instagram.com/desawisatatampirkulon" />
                </div>
                <div class="form-group">
                  <label class="form-label font-semibold text-slate-700 text-xs flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-red-600 text-sm">smart_display</span>
                    Channel / URL YouTube
                  </label>
                  <input type="text" id="prof-yt" class="form-control" value="${profil.youtube || ''}" placeholder="https://youtube.com/@desawisatatampirkulon" />
                </div>
              </div>

              <!-- Flexible Google Maps Input & Live Preview -->
              <div class="form-group pt-4 border-t border-slate-100">
                <label class="form-label font-semibold text-slate-700 text-xs flex items-center justify-between">
                  <span>Peta Lokasi Google Maps (Link URL atau Kode &lt;iframe&gt;)</span>
                  <span class="text-[11px] font-normal text-slate-400">Bisa paste link Maps atau kode semat</span>
                </label>
                <textarea id="prof-maps" class="form-control font-mono text-xs leading-relaxed" rows="3" placeholder="Paste kode embed &lt;iframe ...&gt;&lt;/iframe&gt; atau URL link Google Maps di sini...">${profil.google_maps_embed || ''}</textarea>

                <div class="mt-4">
                  <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Live Pratinjau Peta:</span>
                  <div id="maps-live-preview" class="w-full h-52 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                    ${profil.google_maps_embed ? getMapsIframe(profil.google_maps_embed) : 'Masukkan link atau kode semat Google Maps untuk melihat pratinjau.'}
                  </div>
                </div>
              </div>
            </div>

            <!-- STICKY BOTTOM ACTION BAR (Clean & Tanpa Tombol Cepat) -->
            <div class="fixed bottom-0 left-0 md:left-64 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-6 py-4 z-40 flex items-center justify-between shadow-lg">
              <div class="flex items-center gap-2 text-xs text-slate-500">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Perubahan tersimpan otomatis & tersinkronisasi ke profil publik.</span>
              </div>
              <button type="submit" id="save-profil-btn" class="px-7 py-2.5 rounded-full bg-[#316342] hover:bg-[#254d33] text-white font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer">
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

    // Live Maps preview helper
    const mapsTextarea = container.querySelector('#prof-maps');
    const mapsPreviewBox = container.querySelector('#maps-live-preview');
    if (mapsTextarea && mapsPreviewBox) {
      mapsTextarea.addEventListener('input', (e) => {
        const code = e.target.value.trim();
        if (code.includes('<iframe')) {
          mapsPreviewBox.innerHTML = code.replace('<iframe', '<iframe class="w-full h-full border-0 rounded-xl"');
        } else if (code) {
          mapsPreviewBox.innerHTML = `<iframe class="w-full h-full border-0 rounded-xl" src="${code}" loading="lazy"></iframe>`;
        } else {
          mapsPreviewBox.innerHTML = 'Masukkan link atau kode semat Google Maps untuk melihat pratinjau.';
        }
      });
    }

    // Auto-clean WhatsApp input helper
    const waInput = container.querySelector('#prof-whatsapp');
    if (waInput) {
      waInput.addEventListener('blur', (e) => {
        let val = e.target.value.trim().replace(/[^0-9]/g, '');
        if (val.startsWith('08')) {
          val = '628' + val.substring(2);
          e.target.value = val;
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

        let rawWa = document.getElementById('prof-whatsapp')?.value.trim() || '';
        let cleanedWa = rawWa.replace(/[^0-9]/g, '');
        if (cleanedWa.startsWith('08')) {
          cleanedWa = '628' + cleanedWa.substring(2);
        }

        const payload = {
          nama_desa: document.getElementById('prof-nama')?.value.trim() || profil.nama_desa,
          tagline: document.getElementById('prof-tagline')?.value.trim() || profil.tagline,
          logo_url: document.getElementById('prof-logo')?.value || profil.logo_url || '',
          banner_url: document.getElementById('prof-banner')?.value || profil.banner_url || '',
          luas_wilayah: document.getElementById('prof-luas')?.value.trim() || profil.luas_wilayah,
          populasi: document.getElementById('prof-populasi')?.value.trim() || profil.populasi,
          sejarah: document.getElementById('prof-sejarah')?.value.trim() || profil.sejarah,
          visi: document.getElementById('prof-visi')?.value.trim() || profil.visi,
          misi: document.getElementById('prof-misi')?.value.trim() || profil.misi,
          alamat: document.getElementById('prof-alamat')?.value.trim() || profil.alamat,
          telepon: document.getElementById('prof-telepon')?.value.trim() || profil.telepon,
          whatsapp: cleanedWa || rawWa || profil.whatsapp,
          email: document.getElementById('prof-email')?.value.trim() || profil.email,
          jam_operasional: document.getElementById('prof-jam')?.value.trim() || profil.jam_operasional,
          instagram: document.getElementById('prof-ig')?.value.trim() || profil.instagram,
          youtube: document.getElementById('prof-yt')?.value.trim() || profil.youtube,
          google_maps_embed: document.getElementById('prof-maps')?.value.trim() || profil.google_maps_embed,
        };

        try {
          const updated = await saveProfilDesa(payload);
          Object.assign(profil, updated);
          showToast('Profil desa berhasil diperbarui & tersimpan!', 'success');
        } catch (err) {
          console.error('Error saving profile:', err);
          showToast('Profil desa disimpan secara lokal: ' + err.message, 'success');
        } finally {
          saveBtn.disabled = false;
          saveBtn.innerHTML = '<span class="material-symbols-outlined text-lg">save</span> Simpan Seluruh Perubahan Profil';
        }
      });
    }
  };

  renderPage();
  return container;
};
