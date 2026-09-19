# Design Spesifikasi: Tombol Link Formulir Kesehatan di Sidebar Admin

**Tanggal:** 2026-09-19  
**Status:** Disetujui  
**Target Komponen:** Admin Sidebar ([src/admin/components/sidebar.js](file:///home/aniiporangbaik/development/projects/desawisata/src/admin/components/sidebar.js))

---

## 1. Latar Belakang & Tujuan
Pengelola Desa Wisata Tampirkulon membutuhkan akses cepat dari panel admin menuju formulir kesehatan eksternal yang di-host di layanan Near.tl (`https://near.tl/wisatatampirkulon`). Tombol/link ini ditempatkan pada menu navigasi utama sidebar admin agar pengurus/admin dapat langsung membuka formulir tersebut tanpa harus mencari tautan secara manual.

---

## 2. Ruang Lingkup & Kebutuhan Fitur

### 2.1 Penempatan & Tampilan Navigasi
- **Grup Menu:** Menu navigasi utama (`MENU`) di [src/admin/components/sidebar.js](file:///home/aniiporangbaik/development/projects/desawisata/src/admin/components/sidebar.js).
- **Label:** `Formulir Kesehatan`
- **Ikon Utama:** `medical_services` (Material Symbols Outlined).
- **Ikon Indikator:** `open_in_new` (Material Symbols Outlined) di sisi kanan item untuk menandakan tautan eksternal.
- **Styling:** Menggunakan kelas standar `.donezo-sidebar-item`, dengan `justify-between` agar teks dan ikon indikator eksternal terpisah secara rapi.
- **Tautan & Target:**
  - `href="https://near.tl/wisatatampirkulon"`
  - `target="_blank"`
  - `rel="noopener noreferrer"` (keamanan terhadap reverse tabnabbing)

### 2.2 Perilaku Interaksi
- **Buka Tab Baru:** Mengklik tombol ini membuka tab baru ke `https://near.tl/wisatatampirkulon` tanpa menutup atau mengganggu dashboard admin yang sedang aktif.
- **Pengecualian Status Aktif:** Karena merupakan link eksternal, item ini tidak diberi class `.active` internal berdasarkan rute hash SPA.
- **Responsivitas Mobile:** Tetap memiliki class `.donezo-sidebar-item`, sehingga saat diklik pada layar perangkat mobile/tablet (lebar <= 1024px), sidebar backdrop otomatis menutup secara elegan.

---

## 3. Komponen dan File yang Terpengaruh

| File | Perubahan |
| --- | --- |
| [src/admin/components/sidebar.js](file:///home/aniiporangbaik/development/projects/desawisata/src/admin/components/sidebar.js) | Menambahkan item `Formulir Kesehatan` ke `mainMenuItems` dengan properti eksternal dan me-render tautan eksternal berikon `open_in_new`. |

---

## 4. Rencana Pengujian & Verifikasi
1. **Verifikasi Tampilan Sidebar:** Memastikan tombol "Formulir Kesehatan" tampil di bawah grup `MENU` dengan ikon `medical_services` dan indikator `open_in_new`.
2. **Verifikasi Navigasi Eksternal:** Memastikan klik pada tombol membuka tautan `https://near.tl/wisatatampirkulon` di tab baru dengan atribut `rel="noopener noreferrer"`.
3. **Verifikasi Mobile Behavior:** Memastikan di viewport mobile, klik pada tombol tetap menutup drawer sidebar.
