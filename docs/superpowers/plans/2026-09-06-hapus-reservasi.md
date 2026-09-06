# Fitur Hapus Reservasi Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menambahkan fitur hapus reservasi wisatawan pada portal admin (`src/admin/pages/reservasi.js`) baik melalui baris tabel utama maupun dari dalam modal detail reservasi, lengkap dengan modal konfirmasi dan dukungan dual-mode (Supabase & demo mock data).

**Architecture:** Menggunakan komponen modal konfirmasi yang sudah ada (`openConfirmModal` dari `src/admin/components/modal.js`). Menambahkan tombol aksi hapus pada baris tabel dan modal detail yang memicu dialog konfirmasi. Menghapus data dari Supabase jika terkonfigurasi atau dari memori lokal jika dalam mode demo, menampilkan toast notifikasi, lalu memuat ulang tabel.

**Tech Stack:** JavaScript (ES Modules), Supabase Client, DOM Manipulation, Custom Modal & Toast components.

## Global Constraints
- Menggunakan komponen `openConfirmModal` dari `src/admin/components/modal.js` untuk konfirmasi sebelum penghapusan.
- Mempertahankan konsistensi gaya UI dengan halaman admin lain (`paket.js`, `destinasi.js`).
- Menangani penghapusan data secara aman baik pada database Supabase maupun fallback `mockData.reservasi`.
- Seluruh 74 pengujian lama pada `scripts/test-audit.js` harus tetap lulus 100%.

---

### Task 1: Tambahkan Pengujian Otomatis Hapus Reservasi di `scripts/test-audit.js`

**Files:**
- Modify: `scripts/test-audit.js`

**Interfaces:**
- Consumes: `mockData.reservasi` dari `src/data/seed.js`
- Produces: Suite 9 assertion untuk penghapusan reservasi

- [ ] **Step 1: Tulis tes penghapusan reservasi di `scripts/test-audit.js`**

Tambahkan Suite 9 di `scripts/test-audit.js`:
```javascript
// ==============================================
// 🗑️ Suite 9: Reservasi Deletion Logic
// ==============================================
console.log('\n🗑️ Suite 9: Reservasi Deletion Logic');
const initialRsvCount = mockData.reservasi.length;
assert(initialRsvCount > 0, 'mockData.reservasi has items to delete');

const testRsvItem = {
  id: 'rsv-test-del-999',
  nama: 'Pengunjung Uji Hapus',
  email: 'testdel@example.com',
  telepon: '081299990000',
  status: 'dibatalkan',
  tanggal_kunjungan: '2026-09-30'
};
mockData.reservasi.unshift(testRsvItem);
assert(mockData.reservasi.some(r => r.id === 'rsv-test-del-999'), 'Test reservation successfully seeded');

// Delete test reservation
const delIdx = mockData.reservasi.findIndex(r => r.id === 'rsv-test-del-999');
if (delIdx !== -1) mockData.reservasi.splice(delIdx, 1);

assert(!mockData.reservasi.some(r => r.id === 'rsv-test-del-999'), 'Reservation successfully removed from mockData');
assert(mockData.reservasi.length === initialRsvCount, 'mockData.reservasi count restored to initial');
```

- [ ] **Step 2: Jalankan tes untuk memverifikasi suite berhasil dieksekusi**

Run: `node scripts/test-audit.js`  
Expected: PASS dengan total pengujian bertambah.

---

### Task 2: Implementasi Tombol Hapus pada Tabel Reservasi (`src/admin/pages/reservasi.js`)

**Files:**
- Modify: `src/admin/pages/reservasi.js:5-15,115-140`

**Interfaces:**
- Consumes: `openConfirmModal` dari `../components/modal.js`
- Produces: Tombol `.action-delete-rsv` dan click event handler untuk penghapusan reservasi

- [ ] **Step 1: Impor `openConfirmModal` di `src/admin/pages/reservasi.js`**

Ubah import di baris 5:
```javascript
import { openAdminModal, openConfirmModal } from '../components/modal.js';
```

- [ ] **Step 2: Tambahkan tombol Hapus pada kolom aksi tabel**

Di fungsi `bindEvents` bagian rendering baris tabel:
```javascript
<td style="text-align: right; white-space: nowrap;">
  <div style="display: flex; gap: 8px; justify-content: flex-end;">
    <button class="btn btn-sm btn-primary action-detail-rsv" data-id="${item.id}">Detail & Status</button>
    <button class="btn btn-sm btn-outline action-delete-rsv" data-id="${item.id}" style="color: var(--status-error); border-color: var(--status-error);">Hapus</button>
  </div>
</td>
```

- [ ] **Step 3: Tambahkan event listener untuk `.action-delete-rsv`**

Buat fungsi pembantu `handleDeleteReservasi(item)` dan pasang listener pada semua tombol `.action-delete-rsv`:
```javascript
const handleDeleteReservasi = (item) => {
  const pkt = paketList.find(p => p.id === item.paket_id);
  const paketName = pkt ? pkt.nama : 'Kunjungan Mandiri';

  openConfirmModal({
    title: 'Konfirmasi Hapus Reservasi',
    message: `Apakah Anda yakin ingin menghapus data reservasi atas nama "${item.nama || item.nama_pemesan || 'Tamu'}" (${paketName})? Tindakan ini tidak dapat dibatalkan.`,
    onConfirm: async () => {
      if (isSupabaseConfigured() && supabase) {
        try {
          const { error } = await supabase.from('reservasi').delete().eq('id', item.id);
          if (error) throw error;
        } catch (err) {
          showToast('Gagal menghapus reservasi: ' + err.message, 'error');
          return;
        }
      } else {
        reservasiList = reservasiList.filter(r => String(r.id) !== String(item.id));
        const idx = mockData.reservasi.findIndex(r => String(r.id) === String(item.id));
        if (idx !== -1) mockData.reservasi.splice(idx, 1);
      }

      showToast('Reservasi berhasil dihapus.', 'success');
      await loadData();
      renderPage();
    }
  });
};
```

---

### Task 3: Implementasi Tombol Hapus di dalam Modal Detail Reservasi (`src/admin/pages/reservasi.js`)

**Files:**
- Modify: `src/admin/pages/reservasi.js:150-195`

**Interfaces:**
- Consumes: `openDetailModal` dan `handleDeleteReservasi`
- Produces: Tombol aksi bahaya di dalam modal detail untuk menghapus reservasi yang sedang dibuka

- [ ] **Step 1: Tambahkan tombol "Hapus Reservasi Ini" di dalam HTML modal detail**

Di dalam `openDetailModal`, tambahkan section aksi hapus di bawah kontrol status:
```html
<div class="pt-4 mt-2 border-t border-slate-200 flex justify-between items-center">
  <button type="button" id="btn-delete-from-modal" class="btn btn-sm btn-outline" style="color: var(--status-error); border-color: var(--status-error); display: flex; items-center gap: 4px;">
    <span class="material-symbols-outlined" style="font-size: 16px;">delete</span>
    Hapus Reservasi Ini
  </button>
  <span class="text-[11px] text-slate-400">Data yang dihapus tidak dapat dipulihkan</span>
</div>
```

- [ ] **Step 2: Sambungkan event click pada `btn-delete-from-modal`**

Pada opsi `onOpen` di `openAdminModal`:
```javascript
onOpen: () => {
  const modalDeleteBtn = document.getElementById('btn-delete-from-modal');
  if (modalDeleteBtn) {
    modalDeleteBtn.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('admin-modal-close')?.click();
      handleDeleteReservasi(item);
    });
  }
}
```

---

### Task 4: Verifikasi Menyeluruh, Audit & Git Commit

**Files:**
- Test: `scripts/test-audit.js`
- Build: `dist/`

- [ ] **Step 1: Jalankan audit tes otomatis**

Run: `node scripts/test-audit.js`  
Expected: Seluruh test (Suite 1 hingga Suite 9) PASS 100%.

- [ ] **Step 2: Jalankan build Vite untuk memastikan sintaks bersih**

Run: `npm run build`  
Expected: Build sukses tanpa error kompilasi.

- [ ] **Step 3: Lakukan git commit**

Run:
```bash
git add src/admin/pages/reservasi.js scripts/test-audit.js docs/superpowers/plans/2026-09-06-hapus-reservasi.md
git commit -m "feat(admin): add delete reservation functionality with confirm modal"
```
