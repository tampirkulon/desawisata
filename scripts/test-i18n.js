import assert from 'node:assert';
import { getLanguage, setLanguage, t, getLocalizedField } from '../src/utils/i18n.js';
import idLocale from '../src/locales/id.js';
import enLocale from '../src/locales/en.js';

console.log('🧪 Running i18n Engine & Locale Parity Tests...\n');

// 1. Key Parity Check
function getKeys(obj, prefix = '') {
  return Object.keys(obj).reduce((res, el) => {
    if (Array.isArray(obj[el])) {
      return [...res, prefix + el];
    } else if (typeof obj[el] === 'object' && obj[el] !== null) {
      return [...res, ...getKeys(obj[el], prefix + el + '.')];
    }
    return [...res, prefix + el];
  }, []);
}

const idKeys = getKeys(idLocale).sort();
const enKeys = getKeys(enLocale).sort();

const missingInEn = idKeys.filter(k => !enKeys.includes(k));
const missingInId = enKeys.filter(k => !idKeys.includes(k));

if (missingInEn.length > 0) {
  console.error('❌ Keys in ID but missing in EN:', missingInEn);
}
if (missingInId.length > 0) {
  console.error('❌ Keys in EN but missing in ID:', missingInId);
}

assert.strictEqual(missingInEn.length, 0, 'No keys should be missing in EN');
assert.strictEqual(missingInId.length, 0, 'No keys should be missing in ID');
assert.deepStrictEqual(idKeys, enKeys, 'ID and EN locale dictionary keys must match exactly!');
console.log(`✅ Dictionary keys parity verified (${idKeys.length} keys).`);

// 2. Translation & Fallback Test
setLanguage('id');
assert.strictEqual(getLanguage(), 'id');
assert.strictEqual(t('nav.beranda'), idLocale.nav.beranda);

setLanguage('en');
assert.strictEqual(getLanguage(), 'en');
assert.strictEqual(t('nav.beranda'), enLocale.nav.beranda);

// Fallback to ID for unknown key in EN or fallback to key
assert.strictEqual(t('non.existent.key'), 'non.existent.key');

// Param substitution test
assert.strictEqual(t('footer.copyright', { year: '2026' }), enLocale.footer.copyright.replace('{year}', '2026'));

// 3. Dynamic Field Fallback Test
const mockItem = {
  nama: 'Kebun Durian',
  nama_en: 'Durian Orchard',
  deskripsi: 'Deskripsi lokal',
  deskripsi_en: '',
  fasilitas: ['Pemandu', 'Makan Siang'],
  fasilitas_en: ['Tour Guide', 'Lunch']
};

setLanguage('en');
assert.strictEqual(getLocalizedField(mockItem, 'nama'), 'Durian Orchard');
assert.strictEqual(getLocalizedField(mockItem, 'deskripsi'), 'Deskripsi lokal', 'Fallback to ID when EN is empty string');
assert.deepStrictEqual(getLocalizedField(mockItem, 'fasilitas'), ['Tour Guide', 'Lunch']);

setLanguage('id');
assert.strictEqual(getLocalizedField(mockItem, 'nama'), 'Kebun Durian');
assert.strictEqual(getLocalizedField(mockItem, 'deskripsi'), 'Deskripsi lokal');
assert.deepStrictEqual(getLocalizedField(mockItem, 'fasilitas'), ['Pemandu', 'Makan Siang']);

console.log('\n🎉 All i18n unit tests passed successfully!\n');
