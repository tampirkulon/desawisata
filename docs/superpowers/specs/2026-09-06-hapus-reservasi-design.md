# Design Spesifikasi: Fitur Hapus Reservasi Admin

**Tanggal:** 2026-09-06  
**Status:** Disetujui  
**Target Komponen:** Admin Portal - Kelola Reservasi (`src/admin/pages/reservasi.js`)

---

## 1. Latar Belakang & Masalah
Halaman Kelola Reservasi Wisatawan ([src/admin/pages/reservasi.js](file:///home/aniiporangbaik/development/projects/desawisata/src/admin/pages/reservasi.js)) saat ini hanya menyediakan opsi untuk memperbarui status pemesanan (`baru`, `dikonfirmasi`, `selesai`, `dibatalkan`). Pengelola desa membutuhkan kemampuan untuk menghapus rekaman reservasi, misalnya untuk:
- Menghapus pemesanan spam / uji coba pengunjung.
- Membersihkan data reservasi yang dibatalkan atau tidak valid.
- Menjaga keteraturan daftar transaksi booking wisatawan.

---

## 2. Ruang Lingkup & Kebutuhan Fitur

### 2.1 Titik Akses (Dual Entry Points)
Fitur hapus dapat diakses melalui dua lokasi:
1. **Baris Tabel Reservasi Utama:**
   - Menambahkan tombol *"Hapus"* dengan gaya outline merah di samping tombol *"Detail & Status"* pada kolom aksi.
   - Menggunakan atribut `data-id="${item.id}"` dan selector `.action-delete-rsv`.
2. **Modal Detail Reservasi:**
   - Menambahkan tombol sekunder bahaya *"Hapus Reservasi Ini"* di dalam modal detail reservasi (di bawah kontrol update status).
   - Memungkinkan admin menghapus reservasi secara langsung saat sedang meninjau detail pemesan tanpa harus menutup modal terlebih dahulu.

### 2.2 Konfirmasi Penghapusan
- Menggunakan komponen utilitas modal standar yang sudah ada: `openConfirmModal` dari [src/admin/components/modal.js](file:///home/aniiporangbaik/development/projects/desawisata/src/admin/components/modal.js).
- Dialog konfirmasi menampilkan:
  - Judul: `Konfirmasi Hapus Reservasi`
  - Pesan peringatan yang mencantumkan nama pemesan dan nama paket untuk menghindari kesalahan hapus:
    `"Apakah Anda yakin ingin menghapus data reservasi atas nama \"${item.nama}\" (${pkt ? pkt.nama : 'Kunjungan Mandiri'})? Tindakan ini bersifat permanen."`
  - Tombol persetujuan: `"Ya, Hapus Data"`
  - Tombol pembatalan: `"Batal"`

### 2.3 Mekanisme Penghapusan Data (Dual-Mode)
- **Mode Terhubung Supabase:**
  - Menjalankan kueri:
    ```javascript
    const { error } = await supabase.from('reservasi').delete().eq('id', id);
    ```
  - Jika terjadi error (misal kendala jaringan/akses), sistem menampilkan `showToast('Gagal menghapus reservasi: ' + error.message, 'error')`.
- **Mode Demo / Fallback Mock Data:**
  - Menghapus item dari array lokal `reservasiList` dan `mockData.reservasi`:
    ```javascript
    reservasiList = reservasiList.filter(r => String(r.id) !== String(id));
    const idx = mockData.reservasi.findIndex(r => String(r.id) === String(id));
    if (idx !== -1) mockData.reservasi.splice(idx, 1);
    ```
- **Feedback & Refresh:**
  - Menampilkan toast sukses: `showToast('Reservasi berhasil dihapus.', 'success')`.
  - Jika penghapusan dipicu dari dalam modal detail, modal detail ditutup secara otomatis (`document.getElementById('admin-modal-close')?.click()`).
  - Memanggil `await loadData()` dan `renderPage()` agar tabel langsung terbarui tanpa refresh halaman browser.

---

## 3. Komponen dan File yang Terpengaruh

| File | Perubahan |
|---|---|
| [src/admin/pages/reservasi.js](file:///home/aniiporangbaik/development/projects/desawisata/src/admin/pages/reservasi.js) | Impor `openConfirmModal`, penambahan tombol hapus di tabel dan modal detail, implementasi event handler `action-delete-rsv`. |
| [scripts/test-audit.js](file:///home/aniiporangbaik/development/projects/desawisata/scripts/test-audit.js) | Penambahan pengujian unit otomatis untuk fungsionalitas hapus reservasi pada dataset. |

---

## 4. Strategi Pengujian (Verification Strategy)
1. **Pengujian Unit Otomatis:**
   - Menjalankan `node scripts/test-audit.js`.
   - Menguji bahwa penghapusan reservasi mengurangi jumlah data dan menghapus item yang bersangkutan secara permanen dari memory state `mockData.reservasi`.
2. **Pengujian Manual:**
   - Buka portal admin `#/admin/reservasi`.
   - Klik tombol "Hapus" pada salah satu reservasi -> verifikasi modal konfirmasi muncul.
   - Klik "Batal" -> pastikan data tidak terhapus.
   - Klik "Ya, Hapus Data" -> pastikan notifikasi sukses muncul dan data hilang dari tabel.
   - Buka "Detail & Status" reservasi lain -> klik tombol "Hapus Reservasi" di dalam modal -> pastikan konfirmasi bekerja dan data terhapus.
