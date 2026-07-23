import { renderNavbar, initNavbarEvents } from '../components/navbar.js';
import { renderFooter } from '../components/footer.js';
import { showToast } from '../components/toast.js';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { mockData } from '../data/seed.js';

export const renderKontak = async (queryParams) => {
  const selectedPaketId = queryParams.get('paket_id');

  let profil = mockData.profil_desa;
  let paketList = mockData.paket_wisata;

  if (isSupabaseConfigured()) {
    try {
      const { data: prof } = await supabase.from('profil_desa').select('*').single();
      if (prof) profil = prof;

      const { data: pkt } = await supabase.from('paket_wisata').select('*').eq('is_published', true);
      if (pkt) paketList = pkt;
    } catch (e) {
      console.warn('Fallback seed:', e);
    }
  }

  // Calculate tomorrow's date for date picker min
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split('T')[0];

  const container = document.createElement('div');
  container.innerHTML = `
    ${renderNavbar()}

    <div style="background: var(--dark-navy); color: #fff; padding: 120px 0 50px; text-align: center;">
      <div class="container">
        <span class="badge badge-gold" style="margin-bottom: 12px;">Hubungi Kami</span>
        <h1 style="color: #fff; font-size: 2.5rem; margin-bottom: 12px;">Kontak & Formulir Reservasi</h1>
        <p style="color: rgba(255,255,255,0.85); font-size: 1.1rem;">Isi formulir reservasi online di bawah ini untuk memesan paket kunjungan Anda.</p>
      </div>
    </div>

    <div class="container section">
      <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 40px;" class="kontak-grid-layout">
        <!-- Form Reservasi -->
        <div class="card" style="padding: 36px;">
          <h2 style="font-size: 1.75rem; margin-bottom: 8px;">Formulir Reservasi Kunjungan</h2>
          <p style="color: var(--neutral-600); margin-bottom: 28px;">Silakan lengkapi data Anda. Tim pengelola desa wisata akan segera menghubungi Anda untuk konfirmasi.</p>

          <form id="reservation-form">
            <div class="form-group">
              <label class="form-label" for="nama">Nama Lengkap *</label>
              <input type="text" id="nama" class="form-control" placeholder="Masukkan nama Anda" required />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div class="form-group">
                <label class="form-label" for="email">Alamat Email *</label>
                <input type="email" id="email" class="form-control" placeholder="nama@email.com" required />
              </div>
              <div class="form-group">
                <label class="form-label" for="telepon">Nomor Telepon / WhatsApp *</label>
                <input type="tel" id="telepon" class="form-control" placeholder="0812xxxxxxx" required />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div class="form-group">
                <label class="form-label" for="tanggal_kunjungan">Tanggal Rencana Kunjungan *</label>
                <input type="date" id="tanggal_kunjungan" class="form-control" min="${minDateStr}" required />
              </div>
              <div class="form-group">
                <label class="form-label" for="jumlah_orang">Jumlah Orang *</label>
                <input type="number" id="jumlah_orang" class="form-control" min="1" value="2" required />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="paket_id">Pilih Paket Wisata (Opsional)</label>
              <select id="paket_id" class="form-control">
                <option value="">-- Tanpa Paket (Kunjungan Mandiri) --</option>
                ${paketList.map(p => `
                  <option value="${p.id}" ${selectedPaketId === p.id ? 'selected' : ''}>
                    ${p.nama} (${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(p.harga)}/orang)
                  </option>
                `).join('')}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="pesan">Pesan / Catatan Khusus</label>
              <textarea id="pesan" class="form-control" rows="4" placeholder="Misal: Permintaan khusus durian super, riwayat alergi, dll."></textarea>
            </div>

            <button type="submit" class="btn btn-primary btn-lg" style="width: 100%; padding: 14px; font-size: 1.05rem;" id="submit-rsv-btn">
              Kirim Reservasi Sekarang
            </button>
          </form>
        </div>

        <!-- Info Kontak -->
        <div>
          <div class="card" style="padding: 28px; margin-bottom: 24px;">
            <h3 style="font-size: 1.3rem; margin-bottom: 20px; border-bottom: 1px solid var(--neutral-200); padding-bottom: 10px;">📞 Informasi Kontak</h3>
            
            <div style="display: flex; flex-direction: column; gap: 20px;">
              <div>
                <span style="display: block; font-size: 0.85rem; color: var(--neutral-600);">Alamat Lengkap</span>
                <p style="font-weight: 500; font-size: 0.95rem;">${profil.alamat || 'Tampirkulon, Candimulyo, Magelang'}</p>
              </div>

              <div>
                <span style="display: block; font-size: 0.85rem; color: var(--neutral-600);">Telepon / Hotline</span>
                <p style="font-weight: 600; color: var(--primary-500); font-size: 1.05rem;">${profil.telepon || '+62 812-3456-7890'}</p>
              </div>

              <div>
                <span style="display: block; font-size: 0.85rem; color: var(--neutral-600);">Email Resmi</span>
                <p style="font-weight: 500;">${profil.email || 'info@tampirkulon.desawisata.id'}</p>
              </div>

              <div style="padding-top: 10px;">
                <a href="https://wa.me/${profil.whatsapp || '6281234567890'}?text=Halo%20Pengelola%20Desa%20Wisata%20Tampirkulon,%20saya%20ingin%20bertanya%20mengenai%20paket%20wisata." target="_blank" class="btn btn-accent" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;">
                  💬 Chat WhatsApp Langsung
                </a>
              </div>
            </div>
          </div>

          <div class="card" style="padding: 28px;">
            <h3 style="font-size: 1.2rem; margin-bottom: 16px;">🗺️ Peta Lokasi Desa</h3>
            <div style="border-radius: var(--radius-md); overflow: hidden; height: 260px;">
              ${profil.google_maps_embed || '<div style="background:#eee; height:100%; display:flex; align-items:center; justify-content:center;">Google Maps Embed</div>'}
            </div>
          </div>
        </div>
      </div>
    </div>

    ${renderFooter(profil)}
  `;

  const bindEvents = () => {
    initNavbarEvents();

    const form = container.querySelector('#reservation-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = container.querySelector('#submit-rsv-btn');
        submitBtn.disabled = true;
        submitBtn.innerText = 'Mengirim Reservasi...';

        const payload = {
          nama: container.querySelector('#nama').value.trim(),
          email: container.querySelector('#email').value.trim(),
          telepon: container.querySelector('#telepon').value.trim(),
          tanggal_kunjungan: container.querySelector('#tanggal_kunjungan').value,
          jumlah_orang: parseInt(container.querySelector('#jumlah_orang').value),
          paket_id: container.querySelector('#paket_id').value || null,
          pesan: container.querySelector('#pesan').value.trim(),
          status: 'baru'
        };

        if (isSupabaseConfigured()) {
          try {
            const { error } = await supabase.from('reservasi').insert([payload]);
            if (error) throw error;
            showToast('Reservasi Anda berhasil terkirim! Tim kami akan menghubungi Anda.', 'success');
            form.reset();
          } catch (err) {
            console.error('Error submitting reservation:', err);
            showToast('Gagal mengirim reservasi: ' + err.message, 'error');
          }
        } else {
          // Mock submit
          setTimeout(() => {
            showToast('[Demo Mode] Reservasi berhasil dikirim!', 'success');
            form.reset();
          }, 800);
        }

        submitBtn.disabled = false;
        submitBtn.innerText = 'Kirim Reservasi Sekarang';
      });
    }
  };

  setTimeout(() => bindEvents(), 0);
  return container;
};
