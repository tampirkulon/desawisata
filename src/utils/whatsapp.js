/**
 * Utilitas untuk membuat tautan WhatsApp yang aman dan kompatibel.
 * Menggunakan endpoint langsung `api.whatsapp.com/send/` untuk menghindari
 * bug HTTP 302 redirect pada `wa.me` yang merusak karakter emoji UTF-8 (4-byte) menjadi '%EF%BF%BD' (?).
 */

/**
 * Membersihkan dan menormalisasi nomor telepon ke format internasional (misal 08xx -> 628xx).
 * @param {string|number} phone - Nomor telepon mentah
 * @returns {string} Nomor telepon yang telah dibersihkan
 */
export const cleanPhoneNumber = (phone) => {
  if (!phone) return '';
  const digitsOnly = String(phone).replace(/\D/g, '');
  if (digitsOnly.startsWith('0')) {
    return '62' + digitsOnly.slice(1);
  }
  return digitsOnly;
};

/**
 * Membuat URL WhatsApp yang langsung mengarah ke api.whatsapp.com.
 * @param {string|number} [phone] - Nomor telepon penerima
 * @param {string} [text] - Teks pesan awal (bisa mengandung emoji UTF-8)
 * @returns {string} URL WhatsApp yang siap dibuka
 */
export const buildWhatsAppUrl = (phone = '', text = '') => {
  const cleanPhone = cleanPhoneNumber(phone);
  const trimmedText = typeof text === 'string' ? text.trim() : '';

  if (!cleanPhone && !trimmedText) {
    return '#';
  }

  const params = [];
  if (cleanPhone) {
    params.push(`phone=${cleanPhone}`);
  }
  if (trimmedText) {
    params.push(`text=${encodeURIComponent(trimmedText)}`);
  }

  return `https://api.whatsapp.com/send/?${params.join('&')}`;
};
