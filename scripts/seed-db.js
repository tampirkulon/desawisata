import { createClient } from '@supabase/supabase-js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import readline from 'node:readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY harus ada di .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Prompt for admin credentials
function prompt(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(question, ans => { rl.close(); resolve(ans); }));
}

// ============================================
// SEED DATA
// ============================================

const profilDesa = {
  id: 'a0000000-0000-0000-0000-000000000001',
  nama_desa: 'Desa Wisata Tampirkulon',
  tagline: 'Keindahan Alam & Pesona Budaya Candimulyo',
  sejarah: 'Desa Tampirkulon terletak di Kecamatan Candimulyo, Kabupaten Magelang, Jawa Tengah. Dikenal dengan hamparan sawah terasering yang asri, kebun durian khas Candimulyo, serta seni budaya tradisional yang masih terjaga kelestariannya. Desa ini berkembang menjadi destinasi wisata berbasis pemberdayaan masyarakat lokal.',
  visi: 'Mewujudkan Desa Wisata Tampirkulon sebagai destinasi berdaya saing tinggi, berkelanjutan, dan berorientasi pada pelestarian alam serta kearifan lokal.',
  misi: '1. Mengembangkan destinasi wisata berbasis potensi lokal (kebun durian, perairan asri, dan seni budaya).\n2. Meningkatkan kesejahteraan ekonomi masyarakat desa melalui sektor pariwisata.\n3. Memberikan pelayanan dan pengalaman terbaik bagi wisatawan.',
  alamat: 'Jl. Raya Candimulyo No. 12, Tampirkulon, Candimulyo, Kabupaten Magelang, Jawa Tengah 56191',
  telepon: '+62 812-3456-7890',
  email: 'info@tampirkulon.desawisata.id',
  whatsapp: '6281234567890',
  google_maps_embed: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15818.123456789!2d110.234567!3d-7.456789" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>',
  jam_operasional: 'Senin - Minggu: 08:00 - 17:00 WIB',
  luas_wilayah: '3.45 km²',
  populasi: '2.850 Jiwa',
  instagram: 'https://instagram.com/desawisatatampirkulon',
  facebook: 'https://facebook.com/desawisatatampirkulon',
  youtube: 'https://youtube.com/c/DesaWisataTampirkulon'
};

const kategoriWisata = [
  { id: 'b0000000-0000-0000-0000-000000000001', nama: 'Wisata Alam', deskripsi: 'Menikmati hamparan sawah, perbukitan, dan udara sejuk pegunungan.', icon: '🌱', urutan: 1 },
  { id: 'b0000000-0000-0000-0000-000000000002', nama: 'Wisata Kuliner', deskripsi: 'Mengeksplorasi cita rasa durian lokal Candimulyo dan olahan tradisional.', icon: '🍲', urutan: 2 },
  { id: 'b0000000-0000-0000-0000-000000000003', nama: 'Wisata Budaya', deskripsi: 'Pertunjukan tarian rakyat, kerajinan lokal, dan adat istiadat khas pedesaan.', icon: '🎭', urutan: 3 },
  { id: 'b0000000-0000-0000-0000-000000000004', nama: 'Aktivitas Outdoor', deskripsi: 'Susur sungai, outbound desa, dan edukasi bercocok tanam.', icon: '🚴', urutan: 4 },
];

const destinasi = [
  {
    id: 'c0000000-0000-0000-0000-000000000001',
    nama: 'Kebun Durian Candimulyo Tampir',
    deskripsi: 'Nikmati pengalaman langsung memetik dan mencicipi durian khas Candimulyo yang terkenal dengan rasa manis legit dan daging yang tebal.',
    kategori_id: 'b0000000-0000-0000-0000-000000000002',
    gambar_url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=80',
    gambar_urls: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=80'],
    lokasi: 'Dusun Tampir 1, Tampirkulon',
    jam_buka: '08:00 - 16:00 WIB',
    harga_tiket: 'Rp 10.000 (Tiket Masuk)',
    is_unggulan: true,
    is_published: true
  },
  {
    id: 'c0000000-0000-0000-0000-000000000002',
    nama: 'Terasering Sawah Asri Tampir',
    deskripsi: 'Pemandangan terasering sawah hijau berlatar belakang Gunung Merbabu dan Merapi. Tempat yang sangat fotogenik dan menenangkan jiwa.',
    kategori_id: 'b0000000-0000-0000-0000-000000000001',
    gambar_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80',
    gambar_urls: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80'],
    lokasi: 'Dusun Tampir 2, Tampirkulon',
    jam_buka: '06:00 - 18:00 WIB',
    harga_tiket: 'Gratis',
    is_unggulan: true,
    is_published: true
  },
  {
    id: 'c0000000-0000-0000-0000-000000000003',
    nama: 'Sanggar Seni Tarian Dayakan',
    deskripsi: 'Sanggar kebudayaan lokal tempat wisatawan dapat menyaksikan dan belajar tarian tradisional seperti Kesenian Dayakan dan Kubro Siswo.',
    kategori_id: 'b0000000-0000-0000-0000-000000000003',
    gambar_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80',
    gambar_urls: ['https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80'],
    lokasi: 'Balai Desa Tampirkulon',
    jam_buka: '13:00 - 17:00 WIB (Akhir Pekan)',
    harga_tiket: 'Rp 15.000',
    is_unggulan: true,
    is_published: true
  },
  {
    id: 'c0000000-0000-0000-0000-000000000004',
    nama: 'Susur Sungai Kali Progo Branch',
    deskripsi: 'Aktivitas petualangan menyusuri alur sungai berair jernih dengan suasana pedesaan yang rindang dan alami.',
    kategori_id: 'b0000000-0000-0000-0000-000000000004',
    gambar_url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80',
    gambar_urls: ['https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80'],
    lokasi: 'Aliran Sungai Tampirkulon',
    jam_buka: '08:00 - 15:00 WIB',
    harga_tiket: 'Rp 25.000',
    is_unggulan: false,
    is_published: true
  }
];

const paketWisata = [
  {
    id: 'd0000000-0000-0000-0000-000000000001',
    nama: 'Paket Jelajah Durian & Kuliner Desa',
    deskripsi: 'Paket seru mengelilingi kebun durian, memetik buah durian segar, plus makan siang prasmanan masakan khas desa.',
    harga: 150000,
    durasi: '1 Hari (09:00 - 15:00)',
    kapasitas_min: 4,
    kapasitas_max: 20,
    fasilitas: ['Tiket Masuk Kebun', '1 Buah Durian Pilihan', 'Makan Siang Tradisional', 'Pemandu Lokal', 'Welcome Drink Es Kelapa'],
    destinasi_ids: ['c0000000-0000-0000-0000-000000000001'],
    gambar_url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=80',
    is_published: true
  },
  {
    id: 'd0000000-0000-0000-0000-000000000002',
    nama: 'Paket Full Day Budaya & Alam Tampir',
    deskripsi: 'Petualangan lengkap menyusuri terasering sawah, belajar tarian tradisional di sanggar, dan susur sungai.',
    harga: 225000,
    durasi: '1 Hari Full',
    kapasitas_min: 5,
    kapasitas_max: 30,
    fasilitas: ['Trekking Sawah', 'Workshop Tarian Tradisional', 'Susur Sungai Guide', 'Makan Siang & Snack', 'Dokumentasi Foto'],
    destinasi_ids: ['c0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000003'],
    gambar_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80',
    is_published: true
  }
];

const artikel = [
  {
    id: 'e0000000-0000-0000-0000-000000000001',
    judul: 'Festival Durian Candimulyo 2026 Segera Digelar di Tampirkulon',
    konten: '## Festival Durian Candimulyo 2026\n\nDesa Tampirkulon bersiap menjadi tuan rumah pesta panen durian tahunan. Pengunjung dapat menikmati aneka ragam jenis durian lokal favorit dengan harga langsung dari petani.\n\n### Agenda Acara:\n- Lomba Durian Terlezat\n- Makan Durian Bersama\n- Bazar UMKM Olahan Durian',
    ringkasan: 'Sambut kelezatan panen durian tahunan di Desa Tampirkulon Candimulyo dengan aneka promo dan bazar UMKM.',
    gambar_url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=80',
    kategori: 'Berita Desa',
    status: 'published',
    published_at: new Date().toISOString()
  },
  {
    id: 'e0000000-0000-0000-0000-000000000002',
    judul: 'Pesona Terasering Tampirkulon: Spot Foto Favorit Wisatawan',
    konten: '## Keindahan Terasering Sawah Tampirkulon\n\nKeasrian alam Tampirkulon menjadi daya tarik tersendiri bagi pecinta fotografi landscape dan wisatawan yang mencari ketenangan dari hiruk pikuk kota.',
    ringkasan: 'Ulasan keindahan terasering sawah khas Magelang yang memanjakan mata dan cocok untuk fotografi.',
    gambar_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80',
    kategori: 'Wisata',
    status: 'published',
    published_at: new Date().toISOString()
  }
];

const galeri = [
  { id: 'f0000000-0000-0000-0000-000000000001', judul: 'Kebun Durian Candimulyo', url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=80', tipe: 'foto', kategori: 'Kuliner', urutan: 1 },
  { id: 'f0000000-0000-0000-0000-000000000002', judul: 'Pemandangan Terasering Sawah', url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80', tipe: 'foto', kategori: 'Alam', urutan: 2 },
  { id: 'f0000000-0000-0000-0000-000000000003', judul: 'Tarian Seni Tradisional', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80', tipe: 'foto', kategori: 'Budaya', urutan: 3 },
];

// Fixed UUIDs — 'g' is not valid hex, changed to 'a1' prefix
const testimoni = [
  { id: 'a1000000-0000-0000-0000-000000000001', nama: 'Budi Santoso', asal: 'Semarang', pesan: 'Durian Candimulyo di Tampirkulon luar biasa manis dan gurih! Udara desanya juga sangat sejuk.', rating: 5, is_shown: true },
  { id: 'a1000000-0000-0000-0000-000000000002', nama: 'Siti Rahmawati', asal: 'Yogyakarta', pesan: 'Sangat senang bisa menyusuri terasering sawah bersama keluarga. Anak-anak sangat menikmati tarian budayanya.', rating: 5, is_shown: true },
];

// ============================================
// SEEDING LOGIC (authenticates first to bypass RLS)
// ============================================

async function seed() {
  console.log(`\n🌱 Seeding Database: ${supabaseUrl}`);
  console.log('====================================================\n');

  // Step 1: Authenticate as admin
  const email = await prompt('📧 Email admin Supabase: ');
  const password = await prompt('🔑 Password admin Supabase: ');

  console.log('\n🔐 Authenticating...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password: password.trim()
  });

  if (authError) {
    console.error(`❌ Login gagal: ${authError.message}`);
    process.exit(1);
  }
  console.log(`✅ Login berhasil sebagai ${authData.user.email}\n`);

  // Step 2: Seed each table in dependency order
  const steps = [
    { name: 'profil_desa', data: [profilDesa] },
    { name: 'kategori_wisata', data: kategoriWisata },
    { name: 'destinasi', data: destinasi },
    { name: 'paket_wisata', data: paketWisata },
    { name: 'artikel', data: artikel },
    { name: 'galeri', data: galeri },
    { name: 'testimoni', data: testimoni },
  ];

  for (const step of steps) {
    try {
      const { data, error } = await supabase
        .from(step.name)
        .upsert(step.data, { onConflict: 'id' })
        .select();

      if (error) {
        console.log(`❌ ${step.name}: ${error.message}`);
      } else {
        console.log(`✅ ${step.name}: ${data.length} baris berhasil di-seed`);
      }
    } catch (err) {
      console.log(`⚠️ ${step.name}: ${err.message}`);
    }
  }

  // Step 3: Sign out
  await supabase.auth.signOut();

  console.log('\n====================================================');
  console.log('🎉 Seeding selesai! Logout berhasil.\n');
}

await seed();
