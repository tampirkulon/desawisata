import { renderNavbar, initNavbarEvents } from '../components/navbar.js';
import { renderFooter } from '../components/footer.js';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { mockData } from '../data/seed.js';
import { getProfilDesa, formatGoogleMapsEmbed } from '../utils/profile-store.js';
import { t, getLanguage, getLocalizedField } from '../utils/i18n.js';

export const renderKontak = async (queryParams) => {
  const selectedPaketId = queryParams ? queryParams.get('paket_id') : null;
  const selectedDestinasiId = queryParams ? queryParams.get('destinasi_id') : null;
  const isEn = getLanguage() === 'en';

  let profil = await getProfilDesa();
  let paketList = mockData.paket_wisata;
  let prefilledNotes = '';

  if (isSupabaseConfigured()) {
    try {
      const { data: pak } = await supabase.from('paket_wisata').select('*').eq('is_published', true);
      if (pak && pak.length > 0) paketList = pak;

      if (selectedDestinasiId) {
        const { data: dest } = await supabase.from('destinasi').select('*').eq('id', selectedDestinasiId).single();
        if (dest) {
          const destName = getLocalizedField(dest, 'nama');
          prefilledNotes = isEn ? `Planned visit to destination: ${destName}` : `Rencana kunjungan ke destinasi: ${destName}`;
        }
      }
    } catch (e) {
      console.warn('Fallback seed:', e);
    }
  }

  if (!prefilledNotes && selectedDestinasiId) {
    const localDest = mockData.destinasi.find(d => d.id === selectedDestinasiId);
    if (localDest) {
      const destName = getLocalizedField(localDest, 'nama');
      prefilledNotes = isEn ? `Planned visit to destination: ${destName}` : `Rencana kunjungan ke destinasi: ${destName}`;
    }
  }

  const container = document.createElement('div');
  container.className = 'w-full min-h-screen flex flex-col bg-background text-on-background pt-20';

  container.innerHTML = `
    ${renderNavbar(true)}

    <main class="pt-8 pb-16 px-4 md:px-16 max-w-container-max mx-auto w-full flex-grow flex flex-col justify-center">
      <div class="mb-12 text-center md:text-left">
        <span class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
          ${t('kontak.hero_badge')}
        </span>
        <h1 class="font-display-lg text-3xl md:text-5xl font-bold text-primary mb-3">${t('kontak.hero_title')}</h1>
        <p class="font-body-md text-base text-on-surface-variant max-w-2xl">${t('kontak.hero_subtitle')}</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Left Column: Reservation Form -->
        <div class="lg:col-span-7 bg-surface-container-lowest rounded-2xl p-6 md:p-10 shadow-level-1 border border-outline-variant/30">
          <h2 class="font-display-lg text-2xl font-bold text-primary mb-8">${t('kontak.form_title')}</h2>
          
          <div id="form-alert" class="hidden mb-6 p-4 rounded-xl text-sm font-semibold"></div>

          <form id="reservasi-form" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block font-body-sm text-sm text-on-surface-variant font-semibold mb-2" for="nama_pemesan">${t('kontak.label_name')} *</label>
                <input class="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" id="nama_pemesan" placeholder="${t('kontak.placeholder_name')}" type="text" required />
              </div>
              <div>
                <label class="block font-body-sm text-sm text-on-surface-variant font-semibold mb-2" for="email">${t('kontak.label_email')} *</label>
                <input class="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" id="email" placeholder="${t('kontak.placeholder_email')}" type="email" required />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block font-body-sm text-sm text-on-surface-variant font-semibold mb-2" for="telepon">${t('kontak.label_phone')} *</label>
                <input class="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" id="telepon" placeholder="${t('kontak.placeholder_phone')}" type="tel" required />
              </div>
              <div>
                <label class="block font-body-sm text-sm text-on-surface-variant font-semibold mb-2" for="tanggal_kunjungan">${t('kontak.label_date')} *</label>
                <input class="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" id="tanggal_kunjungan" type="date" required />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block font-body-sm text-sm text-on-surface-variant font-semibold mb-2" for="jumlah_peserta">${t('kontak.label_visitors')} *</label>
                <input class="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" id="jumlah_peserta" min="1" placeholder="${t('kontak.placeholder_visitors')}" type="number" required />
              </div>
              <div>
                <label class="block font-body-sm text-sm text-on-surface-variant font-semibold mb-2" for="paket_id">${t('kontak.label_package')}</label>
                <select class="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" id="paket_id">
                  <option value="">${t('kontak.select_package_default')}</option>
                  ${paketList.map(p => {
                    const pName = getLocalizedField(p, 'nama');
                    return `
                    <option value="${p.id}" ${selectedPaketId === p.id ? 'selected' : ''}>${pName} - Rp ${p.harga?.toLocaleString(isEn ? 'en-US' : 'id-ID')}</option>
                  `;
                  }).join('')}
                </select>
              </div>
            </div>

            <div>
              <label class="block font-body-sm text-sm text-on-surface-variant font-semibold mb-2" for="catatan">${t('kontak.label_message')}</label>
              <textarea class="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none" id="catatan" placeholder="${t('kontak.placeholder_message')}" rows="4">${prefilledNotes}</textarea>
            </div>

            <button id="submit-reservasi-btn" class="w-full md:w-auto bg-primary text-white px-8 py-3.5 rounded-full font-bold text-sm hover:bg-primary-container transition-all shadow-level-1 cursor-pointer" type="submit">
              ${t('kontak.btn_submit')}
            </button>
          </form>
        </div>

        <!-- Right Column: Contact Info & Map -->
        <div class="lg:col-span-5 flex flex-col gap-6">
          <div class="bg-primary-container text-on-primary rounded-2xl p-8 shadow-level-1">
            <h3 class="font-display-lg text-xl font-bold mb-6 text-tertiary-fixed">${t('kontak.info_title')}</h3>
            <ul class="space-y-6 list-none p-0">
              <li class="flex items-start gap-4">
                <span class="material-symbols-outlined text-tertiary-fixed text-2xl">location_on</span>
                <div>
                  <span class="block font-label-caps text-xs text-on-primary-container font-bold uppercase mb-1">${t('kontak.address_label')}</span>
                  <span class="font-body-md text-sm text-white/90 leading-relaxed">${profil.alamat || 'Jl. Raya Candimulyo No. 12, Tampirkulon, Candimulyo, Magelang'}</span>
                </div>
              </li>
              <li class="flex items-center gap-4">
                <span class="material-symbols-outlined text-tertiary-fixed text-2xl">call</span>
                <div>
                  <span class="block font-label-caps text-xs text-on-primary-container font-bold uppercase mb-1">${t('kontak.whatsapp_label')}</span>
                  <span class="font-body-md text-sm text-white/90">${profil.whatsapp || profil.telepon || '+62 812-3456-7890'}</span>
                </div>
              </li>
              <li class="flex items-center gap-4">
                <span class="material-symbols-outlined text-tertiary-fixed text-2xl">mail</span>
                <div>
                  <span class="block font-label-caps text-xs text-on-primary-container font-bold uppercase mb-1">${t('kontak.email_label')}</span>
                  <span class="font-body-md text-sm text-white/90">${profil.email || 'info@tampirkulon.desawisata.id'}</span>
                </div>
              </li>
            </ul>
            <div class="mt-8 pt-6 border-t border-white/20">
              <h4 class="font-label-caps text-xs text-tertiary-fixed font-bold uppercase mb-2">${t('kontak.hours_label')}</h4>
              <div class="flex justify-between items-center text-sm">
                <span>${isEn ? 'Monday - Sunday' : 'Senin - Minggu'}</span>
                <span class="font-bold text-tertiary-fixed">${profil.jam_operasional || t('footer.operasional_text')}</span>
              </div>
            </div>
          </div>

          <!-- Map Box with Automatic URL / iframe converter -->
          <div class="bg-surface-variant rounded-2xl h-64 w-full relative overflow-hidden shadow-level-1 border border-outline-variant/50 flex items-center justify-center">
            ${profil.google_maps_embed
              ? formatGoogleMapsEmbed(profil.google_maps_embed)
              : `<iframe class="w-full h-full border-0 rounded-xl" src="https://maps.google.com/maps?q=-7.4728,110.2642&z=14&output=embed" allowfullscreen="" loading="lazy"></iframe>`
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

    const rawPhone = String(profil.whatsapp || profil.telepon || '6281234567890');
    const WHATSAPP_NUMBER = rawPhone.replace(/\D/g, '').replace(/^0/, '62');

    const isValidUuid = (value) => {
      return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
    };

    const formatTanggal = (date) => {
      if (!date) return '-';
      const parsedDate = new Date(date);
      if (Number.isNaN(parsedDate.getTime())) return date;
      return parsedDate.toLocaleDateString(isEn ? 'en-US' : 'id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    };

    const formatWaktu = () => {
      return new Date().toLocaleString(isEn ? 'en-US' : 'id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const showAlert = (type, message) => {
      if (type === 'success') {
        alertBox.className = 'mb-6 p-4 rounded-xl text-sm font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300';
      } else {
        alertBox.className = 'mb-6 p-4 rounded-xl text-sm font-semibold bg-rose-100 text-rose-800 border border-rose-300';
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
      if (isEn) {
        return `
Hello Admin Tampirkulon Tourism Village 👋

I would like to make a reservation inquiry.

📋 *RESERVATION DETAILS*
━━━━━━━━━━━━━━━━━━
👤 Name: ${nama}
📧 Email: ${email}
📱 WhatsApp: ${telepon}
📅 Visit Date: ${formatTanggal(tanggal)}
👥 Participants: ${jumlahOrang} persons
🎫 Tour Package: ${paketNama || 'General Visit'}
📝 Notes: ${catatan || '-'}

🕐 Submitted at: ${formatWaktu()}

Please provide information on availability and next steps. Thank you! 🙏
        `.trim();
      }

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
        console.warn('WhatsApp number not configured.');
        return false;
      }
      const message = createWhatsAppMessage(reservationData);
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      return true;
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const namaInput = container.querySelector('#nama_pemesan')?.value.trim() || '';
      const emailInput = container.querySelector('#email')?.value.trim() || '';
      const teleponInput = container.querySelector('#telepon')?.value.trim() || '';
      const tglInput = container.querySelector('#tanggal_kunjungan')?.value || '';
      const paxInput = Number.parseInt(container.querySelector('#jumlah_peserta')?.value, 10) || 1;
      const rawPaketId = container.querySelector('#paket_id')?.value || '';
      const paketIdInput = isValidUuid(rawPaketId) ? rawPaketId : null;
      const catatanInput = container.querySelector('#catatan')?.value.trim() || '';

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
      const selectedPaketName = selectedPaket ? getLocalizedField(selectedPaket, 'nama') : (isEn ? 'General Visit' : 'Kunjungan Mandiri');

      const reservationData = {
        nama: namaInput,
        email: emailInput,
        telepon: teleponInput,
        tanggal: tglInput,
        jumlahOrang: paxInput,
        paketNama: selectedPaketName,
        catatan: catatanInput
      };

      const successMsg = isEn
        ? '✅ Booking submitted successfully! WhatsApp will open with your reservation details.'
        : '✅ Reservasi berhasil dikirim! WhatsApp akan dibuka dengan detail reservasi Anda.';

      const demoMsg = isEn
        ? '✅ Booking saved (Demo Mode)! WhatsApp will open with your reservation details.'
        : '✅ Reservasi berhasil disimpan (Mode Demo)! WhatsApp akan dibuka dengan detail reservasi Anda.';

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

          if (error) throw error;

          openWhatsApp(reservationData);
          showAlert('success', successMsg);
          form.reset();
        } catch (error) {
          console.error('Failed to save reservation:', error);
          showAlert('error', `❌ ${isEn ? 'Failed to submit booking' : 'Gagal mengirim reservasi'}: ${error.message}`);
        }
        return;
      }

      openWhatsApp(reservationData);
      showAlert('success', demoMsg);
      form.reset();
    });
  };

  setTimeout(() => bindEvents(), 0);
  return container;
};
