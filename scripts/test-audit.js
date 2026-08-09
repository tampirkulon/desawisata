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

console.log('\n==============================================');
console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
if (failed > 0) {
  process.exit(1);
}
