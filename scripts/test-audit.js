/**
 * Systematic Project Test & Audit Suite
 */

import { mockData } from '../src/data/seed.js';
import { renderPagination } from '../src/components/pagination.js';

let passed = 0;
let failed = 0;

function assert(condition, testName, extraInfo = '') {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName} ${extraInfo}`);
    failed++;
  }
}

console.log('🧪 RUNNING SYSTEMATIC TESTS & AUDIT...');
console.log('==============================================');

// Test Suite 1: Mock Data Integrity
console.log('\n📦 Suite 1: Mock Data Integrity & Relational Consistency');
assert(Boolean(mockData.profil_desa), 'profil_desa exists in seed');
assert(Array.isArray(mockData.destinasi) && mockData.destinasi.length > 0, 'destinasi exists and is array');
assert(Array.isArray(mockData.kategori_wisata) && mockData.kategori_wisata.length > 0, 'kategori_wisata exists and is array');
assert(Array.isArray(mockData.paket_wisata) && mockData.paket_wisata.length > 0, 'paket_wisata exists and is array');
assert(Array.isArray(mockData.artikel) && mockData.artikel.length > 0, 'artikel exists and is array');
assert(Array.isArray(mockData.galeri) && mockData.galeri.length > 0, 'galeri exists and is array');
assert(Array.isArray(mockData.testimoni) && mockData.testimoni.length > 0, 'testimoni exists and is array');
assert(Array.isArray(mockData.reservasi) && mockData.reservasi.length > 0, 'reservasi exists and is array');

// Check foreign key references in mockData
const categoryIds = new Set(mockData.kategori_wisata.map(k => k.id));
const invalidDestCategories = mockData.destinasi.filter(d => !categoryIds.has(d.kategori_id));
assert(invalidDestCategories.length === 0, 'All destinasi have valid category_id', JSON.stringify(invalidDestCategories));

const paketIds = new Set(mockData.paket_wisata.map(p => p.id));
const invalidReservations = mockData.reservasi.filter(r => r.paket_id && !paketIds.has(r.paket_id));
assert(invalidReservations.length === 0, 'All reservasi have valid paket_id or null', JSON.stringify(invalidReservations));

// Test Suite 2: Pagination Component Logic
console.log('\n📄 Suite 2: Reusable Pagination Logic');
// When totalItems <= itemsPerPage, return empty
assert(renderPagination({ totalItems: 5, itemsPerPage: 12, currentPage: 1 }) === '', 'Pagination hidden when totalItems <= itemsPerPage');
assert(renderPagination({ totalItems: 0, itemsPerPage: 12, currentPage: 1 }) === '', 'Pagination hidden when totalItems === 0');

// When totalItems > itemsPerPage, return HTML with buttons
const pagHtml = renderPagination({ totalItems: 25, itemsPerPage: 12, currentPage: 1, labelItem: 'Foto' });
assert(pagHtml.includes('Menampilkan') && pagHtml.includes('1-12') && pagHtml.includes('Foto'), 'Pagination renders correct range on page 1');
assert(pagHtml.includes('data-page="1"') && pagHtml.includes('data-page="2"') && pagHtml.includes('data-page="3"'), 'Pagination renders correct page buttons');
assert(pagHtml.includes('disabled') && pagHtml.includes('chevron_left'), 'Prev button is disabled on page 1');

// When on page 2
const pagHtml2 = renderPagination({ totalItems: 25, itemsPerPage: 12, currentPage: 2, labelItem: 'Foto' });
assert(pagHtml2.includes('13-24'), 'Pagination renders correct range on page 2');

// When on last page
const pagHtml3 = renderPagination({ totalItems: 25, itemsPerPage: 12, currentPage: 3, labelItem: 'Foto' });
assert(pagHtml3.includes('25-25'), 'Pagination renders correct range on last page');
assert(pagHtml3.includes('data-page="4"') && pagHtml3.includes('disabled') && pagHtml3.includes('chevron_right'), 'Next button is disabled on last page');

// Ellipsis windowing for large page count (e.g. 100 items / 10 itemsPerPage = 10 pages)
const pagLarge = renderPagination({ totalItems: 100, itemsPerPage: 10, currentPage: 5, labelItem: 'Item' });
assert(pagLarge.includes('...'), 'Pagination renders ellipsis for > 7 pages');

// Test Suite 3: Date & Currency Formatting
console.log('\n💰 Suite 3: Utilities & Formatting');
const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
assert(formatRupiah(150000).replace(/\s/g, '').includes('150.000'), 'Currency formatter formats IDR correctly');

// Test Suite 4: Custom Footer Component
console.log('\n🦶 Suite 4: Customizable Footer Rendering');
import { renderFooter } from '../src/components/footer.js';

// Default rendering
const defaultFooter = renderFooter(mockData.profil_desa);
assert(defaultFooter.includes('Desa Wisata Tampirkulon'), 'Default footer renders village name');
assert(defaultFooter.includes('Tautan Cepat'), 'Default footer renders quick links title');
assert(defaultFooter.includes('Hak Cipta Dilindungi'), 'Default footer renders copyright text');
assert(defaultFooter.includes('Portal Pengelola Desa'), 'Default footer renders admin portal link');

// Custom description & custom copyright & dynamic contact
const customFooter = renderFooter({
  nama_desa: 'Desa Mandiri',
  alamat: 'Jl. Merdeka No. 99, Dusun Mandiri',
  whatsapp: '081299998888',
  telepon: '+62 293 123456',
  email: 'kontak@desamandiri.id',
  jam_operasional: 'Senin - Sabtu: 09:00 - 16:00 WIB',
  footer_deskripsi: 'Deskripsi kustom footer pengelola.',
  footer_copyright: '© {year} Desa Mandiri & Pokdarwis. All rights reserved.',
  footer_show_social: true,
  instagram: 'https://instagram.com/custom',
  footer_quick_links: ['beranda', 'galeri']
});

assert(customFooter.includes('Deskripsi kustom footer pengelola.'), 'Footer renders custom description');
assert(customFooter.includes('Desa Mandiri & Pokdarwis.'), 'Footer renders custom copyright');
assert(customFooter.includes('instagram.com/custom'), 'Footer renders custom instagram link');
assert(customFooter.includes('Galeri Foto') && !customFooter.includes('Paket Tour'), 'Footer filters quick links accurately');
assert(customFooter.includes('Jl. Merdeka No. 99, Dusun Mandiri'), 'Footer renders dynamic custom address');
assert(customFooter.includes('wa.me/6281299998888'), 'Footer renders formatted WhatsApp link');
assert(customFooter.includes('mailto:kontak@desamandiri.id'), 'Footer renders dynamic email mailto link');
assert(customFooter.includes('Senin - Sabtu: 09:00 - 16:00 WIB'), 'Footer renders dynamic operational hours');

// Hidden social links
const noSocialFooter = renderFooter({
  footer_show_social: false,
  instagram: 'https://instagram.com/custom'
});
assert(!noSocialFooter.includes('instagram.com/custom'), 'Footer hides social links when footer_show_social is false');

// Test Suite 5: Auth Recovery Service & Password Validation
console.log('\n🔑 Suite 5: Auth Password Recovery Logic');
import { auth } from '../src/utils/auth.js';

// Forgot password empty email validation
const resEmpty = await auth.forgotPassword('');
assert(resEmpty.success === false, 'forgotPassword rejects empty email');
assert(resEmpty.error.includes('wajib diisi'), 'forgotPassword returns appropriate error message on empty email');

// Forgot password valid email
const resValid = await auth.forgotPassword('admin@tampirkulon.desa.id');
assert(resValid.success === true, 'forgotPassword succeeds with valid email');
assert(Boolean(resValid.message), 'forgotPassword returns success message');

// Reset password validation (< 6 chars)
const resShort = await auth.resetPassword('12345');
assert(resShort.success === false, 'resetPassword rejects password shorter than 6 characters');

// Reset password valid
const resValidPwd = await auth.resetPassword('securePassword123');
assert(resValidPwd.success === true, 'resetPassword accepts valid password');

// Logout execution
let logoutRan = false;
try {
  await auth.logout();
  logoutRan = true;
} catch (e) {
  logoutRan = false;
}
assert(logoutRan === true, 'auth.logout executes safely without throwing unhandled exceptions');

// Test Suite 6: SPA Hash Router & Supabase Auth Fragment Parsing
console.log('\n🧭 Suite 6: SPA Hash Router & Supabase Auth Fragment Parsing');
import { router } from '../src/utils/router.js';

const r1 = router._extractRouteAndParams('#/admin/reset-password#access_token=eyJhbGciOi...&type=recovery');
assert(r1.path === '#/admin/reset-password', 'Router correctly extracts base route path from double-hash URL');
assert(r1.queryParams.get('type') === 'recovery', 'Router parses type=recovery from double-hash URL');
assert(r1.queryParams.get('access_token') === 'eyJhbGciOi...', 'Router parses access_token from double-hash URL');

const r2 = router._extractRouteAndParams('#/admin/destinasi?cat=alam');
assert(r2.path === '#/admin/destinasi', 'Router correctly extracts base route from query string URL');
assert(r2.queryParams.get('cat') === 'alam', 'Router parses query string parameters');

const r3 = router._extractRouteAndParams('#access_token=abc123xyz&type=recovery');
assert(r3.path === '#/admin/reset-password', 'Router automatically redirects recovery tokens on root to #/admin/reset-password');

console.log('\n==============================================');
console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
if (failed > 0) {
  process.exit(1);
}
