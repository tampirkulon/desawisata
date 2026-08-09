# Design Spec: Pagination Galeri dan Blog

## Ringkasan
Menambahkan sistem pagination dinamis modern berbasis client-side pada halaman publik **Galeri** (`src/pages/galeri.js`) dan **Blog** (`src/pages/blog.js`), dengan tata letak visual elegan yang selaras dengan tema Desa Wisata Tampirkulon (warna `#123524`, `#3E7B27`, `#85A947`, `#EFE3C2`).

---

## 1. Halaman Galeri (`src/pages/galeri.js`)

### Spesifikasi:
- **Items Per Page**: 12 foto per halaman.
- **State Management**:
  - `activeFilter`: Kategori aktif (default: `'all'`).
  - `currentPage`: Halaman aktif (default: `1`).
  - Reset `currentPage = 1` setiap kali user mengganti filter kategori.
- **Perhitungan Slice**:
  - `filteredGaleri = activeFilter === 'all' ? galeriList : galeriList.filter(...)`
  - `totalPages = Math.ceil(filteredGaleri.length / itemsPerPage)`
  - `paginatedGaleri = filteredGaleri.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)`
- **Interaksi Lightbox**:
  - Saat item foto diklik, lightbox menerima `filteredGaleri` dan indeks item yang sebenarnya dalam list yang terfilter agar navigasi lightbox tetap mencakup seluruh foto dalam kategori tersebut.
- **Tampilan Navigasi Pagination**:
  - Teks info: *"Menampilkan X - Y dari Total Z Foto"*
  - Tombol Navigasi:
    - Tombol Prev (`chevron_left` / `Sebelumnya`)
    - Deretan tombol nomor halaman (1, 2, 3...)
    - Tombol Next (`chevron_right` / `Berikutnya`)
  - Status aktif: `bg-primary text-white font-bold`
  - Status disabled: `opacity-40 cursor-not-allowed` jika di halaman pertama/terakhir.
  - Jika total data <= 12 (hanya 1 halaman), kontrol pagination tidak perlu ditampilkan.
  - Smooth scroll ke atas grid saat berpindah halaman.

---

## 2. Halaman Blog (`src/pages/blog.js`)

### Spesifikasi:
- **Items Per Page**: 9 artikel per halaman pada grid artikel.
- **Struktur Halaman**:
  - **Featured Article Hero**: Ditampilkan di bagian atas hanya pada halaman 1 (`currentPage === 1`).
  - **Recent Articles Grid**:
    - `allRecent = artikelList.slice(1)` (atau `artikelList` jika tidak ada featured).
    - `totalPages = Math.ceil(allRecent.length / 9)`
    - `paginatedArticles = allRecent.slice((currentPage - 1) * 9, currentPage * 9)`
- **Tampilan Navigasi Pagination**:
  - Teks info: *"Menampilkan X - Y dari Total Z Artikel"*
  - Tombol Prev, Nomor Halaman (1, 2, ...), dan Tombol Next.
  - Smooth scroll ke atas bagian "Artikel Terbaru" saat berpindah halaman.
  - Modal baca artikel tetap berfungsi normal dengan `read-article-btn`.

---

## 3. Komponen Pagination yang Konsisten (Reusable Utility/Helper)

Membuat fungsi helper kecil/komponen render pagination yang modular untuk menghasilkan HTML dan logika navigasi halaman dengan pagination styling terstandar.

### Styling & Token:
- Container: Flex responsif (`flex-col md:flex-row justify-between items-center gap-4 py-8 border-t border-outline-variant/30 mt-12`)
- Info counter: `text-xs text-on-surface-variant font-medium`
- Buttons: Rounded-full / rounded-xl, hover effects, transisi halus.

---

## 4. Rencana Verifikasi
- Uji filtering kategori galeri dan pastikan pagination me-reset ke halaman 1.
- Uji navigasi halaman next, prev, dan tombol angka di galeri & blog.
- Uji lightbox foto galeri pada halaman 2+ untuk memastikan foto yang terbuka sesuai.
- Uji pembukaan modal artikel blog pada halaman 2+.
- Jalankan `npm run build` untuk memverifikasi tidak ada error sintaks.
