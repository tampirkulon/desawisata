import { renderNavbar, initNavbarEvents } from '../components/navbar.js';
import { renderFooter } from '../components/footer.js';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { mockData } from '../data/seed.js';

export const renderKontak = async (queryParams) => {
  const selectedPaketId = queryParams ? queryParams.get('paket_id') : null;
  const selectedDestinasiId = queryParams ? queryParams.get('destinasi_id') : null;

  let profil = mockData.profil_desa;
  let paketList = mockData.paket_wisata;
  let prefilledNotes = '';

  if (isSupabaseConfigured()) {
    try {
      const { data: prof } = await supabase.from('profil_desa').select('*').single();
      if (prof) profil = prof;

      const { data: pak } = await supabase.from('paket_wisata').select('*').eq('is_published', true);
      if (pak && pak.length > 0) paketList = pak;

      if (selectedDestinasiId) {
        const { data: dest } = await supabase.from('destinasi').select('nama').eq('id', selectedDestinasiId).single();
        if (dest) prefilledNotes = `Rencana kunjungan ke destinasi: ${dest.nama}`;
      }
    } catch (e) {
      console.warn('Fallback seed:', e);
    }
  }

  if (!prefilledNotes && selectedDestinasiId) {
    const localDest = mockData.destinasi.find(d => d.id === selectedDestinasiId);
    if (localDest) prefilledNotes = `Rencana kunjungan ke destinasi: ${localDest.nama}`;
  }

  const container = document.createElement('div');
  container.className = 'w-full min-h-screen flex flex-col bg-background text-on-background pt-20';

  container.innerHTML = `
    ${renderNavbar(true)}

    <main class="pt-8 pb-16 px-4 md:px-16 max-w-container-max mx-auto w-full flex-grow flex flex-col justify-center">
      <div class="mb-12 text-center md:text-left">
        <h1 class="font-display-lg text-3xl md:text-5xl font-bold text-primary mb-3">Kontak & Reservasi</h1>
        <p class="font-body-md text-base text-on-surface-variant max-w-2xl">Rencanakan kunjungan Anda atau hubungi kami untuk informasi lebih lanjut. Kami siap menyambut Anda di Tampirkulon.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Left Column: Reservation Form -->
        <div class="lg:col-span-7 bg-surface-container-lowest rounded-2xl p-6 md:p-10 shadow-level-1 border border-outline-variant/30">
          <h2 class="font-display-lg text-2xl font-bold text-primary mb-8">Formulir Reservasi</h2>
          
          <div id="form-alert" class="hidden mb-6 p-4 rounded-xl text-sm font-semibold"></div>

          <form id="reservasi-form" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block font-body-sm text-sm text-on-surface-variant font-semibold mb-2" for="nama_pemesan">Nama Lengkap *</label>
                <input class="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" id="nama_pemesan" placeholder="John Doe" type="text" required />
              </div>
              <div>
                <label class="block font-body-sm text-sm text-on-surface-variant font-semibold mb-2" for="email">Alamat Email *</label>
                <input class="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" id="email" placeholder="john@example.com" type="email" required />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block font-body-sm text-sm text-on-surface-variant font-semibold mb-2" for="telepon">Nomor WhatsApp *</label>
                <input class="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" id="telepon" placeholder="+62 812-3456-7890" type="tel" required />
              </div>
              <div>
                <label class="block font-body-sm text-sm text-on-surface-variant font-semibold mb-2" for="tanggal_kunjungan">Tanggal Kunjungan *</label>
                <input class="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" id="tanggal_kunjungan" type="date" required />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block font-body-sm text-sm text-on-surface-variant font-semibold mb-2" for="jumlah_peserta">Jumlah Peserta *</label>
                <input class="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" id="jumlah_peserta" min="1" placeholder="2" type="number" required />
              </div>
              <div>
                <label class="block font-body-sm text-sm text-on-surface-variant font-semibold mb-2" for="paket_id">Pilih Paket Wisata</label>
                <select class="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" id="paket_id">
                  <option value="">-- Pilih Paket (Opsional) --</option>
                  ${paketList.map(p => `
                    <option value="${p.id}" ${selectedPaketId === p.id ? 'selected' : ''}>${p.nama} - Rp ${p.harga?.toLocaleString('id-ID')}</option>
                  `).join('')}
                </select>
              </div>
            </div>

            <div>
              <label class="block font-body-sm text-sm text-on-surface-variant font-semibold mb-2" for="catatan">Catatan / Pesan Tambahan</label>
              <textarea class="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none" id="catatan" placeholder="Permintaan khusus atau pertanyaan..." rows="4">${prefilledNotes}</textarea>
            </div>

            <button class="w-full md:w-auto bg-primary text-white px-8 py-3.5 rounded-full font-bold text-sm hover:bg-primary-container transition-all shadow-level-1" type="submit">
              Kirim Reservasi Now
            </button>
          </form>
        </div>

        <!-- Right Column: Contact Info & Map -->
        <div class="lg:col-span-5 flex flex-col gap-6">
          <div class="bg-primary-container text-on-primary rounded-2xl p-8 shadow-level-1">
            <h3 class="font-display-lg text-xl font-bold mb-6 text-tertiary-fixed">Informasi Kontak</h3>
            <ul class="space-y-6 list-none p-0">
              <li class="flex items-start gap-4">
                <span class="material-symbols-outlined text-tertiary-fixed text-2xl">location_on</span>
                <div>
                  <span class="block font-label-caps text-xs text-on-primary-container font-bold uppercase mb-1">ALAMAT DESA</span>
                  <span class="font-body-md text-sm text-white/90 leading-relaxed">${profil.alamat || 'Jl. Raya Tampirkulon No. 123, Candimulyo, Magelang, Jawa Tengah'}</span>
                </div>
              </li>
              <li class="flex items-center gap-4">
                <span class="material-symbols-outlined text-tertiary-fixed text-2xl">call</span>
                <div>
                  <span class="block font-label-caps text-xs text-on-primary-container font-bold uppercase mb-1">WHATSAPP / TELP</span>
                  <span class="font-body-md text-sm text-white/90">${profil.telepon || '+62 812-3456-7890'}</span>
                </div>
              </li>
              <li class="flex items-center gap-4">
                <span class="material-symbols-outlined text-tertiary-fixed text-2xl">mail</span>
                <div>
                  <span class="block font-label-caps text-xs text-on-primary-container font-bold uppercase mb-1">EMAIL RESMI</span>
                  <span class="font-body-md text-sm text-white/90">${profil.email || 'info@tampirkulon.desa.id'}</span>
                </div>
              </li>
            </ul>
            <div class="mt-8 pt-6 border-t border-white/20">
              <h4 class="font-label-caps text-xs text-tertiary-fixed font-bold uppercase mb-2">JAM OPERASIONAL</h4>
              <div class="flex justify-between items-center text-sm">
                <span>Senin - Minggu</span>
                <span class="font-bold text-tertiary-fixed">08:00 - 17:00 WIB</span>
              </div>
            </div>
          </div>

          <!-- Map Box -->
          <div class="bg-surface-variant rounded-2xl h-64 w-full relative overflow-hidden shadow-level-1 border border-outline-variant/50 flex items-center justify-center">
            ${profil.google_maps_embed
      ? profil.google_maps_embed.replace('<iframe', '<iframe class="w-full h-full border-0"')
      : `<iframe class="w-full h-full border-0" src="https://maps.google.com/maps?q=-7.4728,110.2642&z=14&output=embed" allowfullscreen="" loading="lazy"></iframe>`
    }
          </div>
        </div>
      </div>
    </main>

    ${renderFooter(profil)}
  `;


  const bindEvents = () => {
    initNavbarEvents(true);

    const form = container.querySelector('#reservasi-form');
    const alertBox = container.querySelector('#form-alert');

    if (!form || !alertBox) return;

    const WHATSAPP_NUMBER = (profil.whatsapp || profil.telepon || '6285727163035').replace(/[^0-9]/g, '').replace(/^0/, '62');

    const isValidUuid = (value) => {
      return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        value
      );
    };

    const formatTanggal = (date) => {
      if (!date) return '-';

      const parsedDate = new Date(date);

      if (Number.isNaN(parsedDate.getTime())) {
        return date;
      }

      return parsedDate.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    };

    const formatWaktu = () => {
      return new Date().toLocaleString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const showAlert = (type, message) => {
      if (type === 'success') {
        alertBox.className =
          'mb-6 p-4 rounded-xl text-sm font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300';
      } else {
        alertBox.className =
          'mb-6 p-4 rounded-xl text-sm font-semibold bg-rose-100 text-rose-800 border border-rose-300';
      }

      alertBox.innerHTML = message;
      alertBox.classList.remove('hidden');
    };

    const createWhatsAppMessage = ({
      nama,
      email,
      telepon,
      tanggal,
      jumlahOrang,
      paketNama,
      catatan
    }) => {
      return `
Halo Admin Desa Wisata Tampirkulon 👋

Saya ingin melakukan reservasi.

📋 *DETAIL RESERVASI*
━━━━━━━━━━━━━━━━━━
👤 Nama: ${nama}
📧 Email: ${email}
📱 WhatsApp: ${telepon}
📅 Tanggal kunjungan: ${formatTanggal(tanggal)}
👥 Jumlah peserta: ${jumlahOrang} orang
🎫 Paket: ${paketNama || 'Kunjungan Mandiri'}
📝 Catatan: ${catatan || '-'}

🕐 Waktu pengajuan: ${formatWaktu()}

Mohon informasi terkait ketersediaan dan proses selanjutnya.

Terima kasih 🙏
    `.trim();
    };

    const openWhatsApp = (reservationData) => {
      if (!WHATSAPP_NUMBER) {
        console.warn('Nomor WhatsApp belum dikonfigurasi.');
        return false;
      }

      const message = createWhatsAppMessage(reservationData);

      const whatsappUrl =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

      return true;
    };


    form.addEventListener('submit', async (e) => {
      e.preventDefault();



      const namaInput =
        container.querySelector('#nama_pemesan')?.value.trim() || '';

      const emailInput =
        container.querySelector('#email')?.value.trim() || '';

      const teleponInput =
        container.querySelector('#telepon')?.value.trim() || '';

      const tglInput =
        container.querySelector('#tanggal_kunjungan')?.value || '';

      const paxInput =
        Number.parseInt(
          container.querySelector('#jumlah_peserta')?.value,
          10
        ) || 1;

      const rawPaketId =
        container.querySelector('#paket_id')?.value || '';

      const paketIdInput =
        isValidUuid(rawPaketId)
          ? rawPaketId
          : null;

      const catatanInput =
        container.querySelector('#catatan')?.value.trim() || '';



      const newResObj = {
        id: `rsv-${Date.now()}`,
        nama: namaInput,
        email: emailInput,
        telepon: teleponInput,
        tanggal_kunjungan: tglInput,
        jumlah_orang: paxInput,
        paket_id: paketIdInput,
        pesan: catatanInput,
        status: 'baru',
        created_at: new Date().toISOString()
      };

      mockData.reservasi.unshift(newResObj);

      const selectedPaket = paketList.find(p => p.id === rawPaketId);

      const reservationData = {
        nama: namaInput,
        email: emailInput,
        telepon: teleponInput,
        tanggal: tglInput,
        jumlahOrang: paxInput,
        paketNama: selectedPaket ? selectedPaket.nama : 'Kunjungan Mandiri',
        catatan: catatanInput
      };

      if (isSupabaseConfigured() && supabase) {
        try {
          const { error } = await supabase
            .from('reservasi')
            .insert([
              {
                nama: namaInput,
                email: emailInput,
                telepon: teleponInput,
                tanggal_kunjungan: tglInput,
                jumlah_orang: paxInput,
                paket_id: paketIdInput,
                pesan: catatanInput,
                status: 'baru'
              }
            ]);

          if (error) {
            throw error;
          }

          openWhatsApp(reservationData);

          showAlert(
            'success',
            '✅ Reservasi berhasil dikirim! WhatsApp akan dibuka dengan detail reservasi Anda.'
          );

          form.reset();

        } catch (error) {
          console.error(
            'Gagal menyimpan reservasi:',
            error
          );

          showAlert(
            'error',
            `❌ Gagal mengirim reservasi: ${error.message}`
          );
        }

        return;
      }

      openWhatsApp(reservationData);

      showAlert(
        'success',
        '✅ Reservasi berhasil disimpan (Mode Demo)! WhatsApp akan dibuka dengan detail reservasi Anda.'
      );

      form.reset();
    });
  };

  setTimeout(() => bindEvents(), 0);
  return container;
};
