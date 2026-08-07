// Fallback Seed Data for Offline / Preview Mode

export const mockData = {
  profil_desa: {
    id: 'a0000000-0000-0000-0000-000000000001',
    nama_desa: 'Desa Wisata Tampirkulon',
    tagline: 'Keindahan Alam & Pesona Budaya Candimulyo',
    logo_url: '',
    banner_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80&fm=webp',
    sejarah: 'Desa Tampirkulon terletak di Kecamatan Candimulyo, Kabupaten Magelang, Jawa Tengah. Dikenal dengan hamparan sawah terasering yang asri, kebun durian khas Candimulyo, serta seni budaya tradisional yang masih terjaga kelestariannya.',
    visi: 'Mewujudkan Desa Wisata Tampirkulon sebagai destinasi berdaya saing tinggi, berkelanjutan, dan berorientasi pada pelestarian alam serta kearifan lokal.',
    misi: '1. Mengembangkan destinasi wisata berbasis potensi lokal.\n2. Meningkatkan kesejahteraan ekonomi masyarakat desa.\n3. Memberikan pelayanan terbaik bagi wisatawan.',
    alamat: 'Jl. Raya Candimulyo No. 12, Tampirkulon, Candimulyo, Magelang',
    telepon: '+62 812-3456-7890',
    email: 'info@tampirkulon.desawisata.id',
    whatsapp: '6281234567890',
    google_maps_embed: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15818.123456789!2d110.234567!3d-7.456789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a8e123456789%3A0x123456789abcdef!2sTampirkulon%2C%20Candimulyo%2C%20Magelang!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>',
    jam_operasional: 'Senin - Minggu: 08:00 - 17:00 WIB',
    luas_wilayah: '3.45 km²',
    populasi: '2.850 Jiwa',
    instagram: 'https://instagram.com/desawisatatampirkulon',
    facebook: 'https://facebook.com/desawisatatampirkulon',
    youtube: 'https://youtube.com/c/DesaWisataTampirkulon'
  },
  kategori_wisata: [
    { id: 'cat-1', nama: 'Wisata Alam', deskripsi: 'Hamparan sawah dan udara sejuk pegunungan.', icon: '🌱', urutan: 1 },
    { id: 'cat-2', nama: 'Wisata Kuliner', icon: '🍲', deskripsi: 'Durian Candimulyo & masakan desa.', urutan: 2 },
    { id: 'cat-3', nama: 'Wisata Budaya', icon: '🎭', deskripsi: 'Tarian tradisional & adat istiadat.', urutan: 3 },
    { id: 'cat-4', nama: 'Aktivitas Outdoor', icon: '🚴', deskripsi: 'Susur sungai & trekking sawah.', urutan: 4 }
  ],
  destinasi: [
    {
      id: 'dest-1',
      nama: 'Kebun Durian Candimulyo Tampir',
      deskripsi: 'Nikmati pengalaman langsung memetik dan mencicipi durian khas Candimulyo yang terkenal manis legit.',
      kategori_id: 'cat-2',
      gambar_url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=80&fm=webp',
      lokasi: 'Dusun Tampir 1, Tampirkulon',
      jam_buka: '08:00 - 16:00 WIB',
      harga_tiket: 'Rp 10.000',
      is_unggulan: true,
      is_published: true
    },
    {
      id: 'dest-2',
      nama: 'Terasering Sawah Asri Tampir',
      deskripsi: 'Pemandangan terasering sawah hijau berlatar belakang Gunung Merbabu & Merapi.',
      kategori_id: 'cat-1',
      gambar_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80&fm=webp',
      lokasi: 'Dusun Tampir 2, Tampirkulon',
      jam_buka: '06:00 - 18:00 WIB',
      harga_tiket: 'Gratis',
      is_unggulan: true,
      is_published: true
    },
    {
      id: 'dest-3',
      nama: 'Sanggar Seni Tarian Dayakan',
      deskripsi: 'Sanggar kebudayaan tempat menyaksikan tarian tradisional seperti Kesenian Dayakan.',
      kategori_id: 'cat-3',
      gambar_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80&fm=webp',
      lokasi: 'Balai Desa Tampirkulon',
      jam_buka: '13:00 - 17:00 WIB',
      harga_tiket: 'Rp 15.000',
      is_unggulan: true,
      is_published: true
    }
  ],
  paket_wisata: [
    {
      id: 'pkt-1',
      nama: 'Paket Jelajah Durian & Kuliner Desa',
      deskripsi: 'Paket mengelilingi kebun durian, memetik buah durian segar, plus makan siang masakan khas desa.',
      harga: 150000,
      durasi: '1 Hari (09:00 - 15:00)',
      kapasitas_min: 4,
      kapasitas_max: 20,
      fasilitas: ['Tiket Masuk Kebun', '1 Buah Durian Pilihan', 'Makan Siang Tradisional', 'Pemandu Lokal'],
      gambar_url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=80&fm=webp',
      is_published: true
    },
    {
      id: 'pkt-2',
      nama: 'Paket Full Day Budaya & Alam Tampir',
      deskripsi: 'Petualangan menyusuri terasering sawah, belajar tarian tradisional di sanggar, dan susur sungai.',
      harga: 225000,
      durasi: '1 Hari Full',
      kapasitas_min: 5,
      kapasitas_max: 30,
      fasilitas: ['Trekking Sawah', 'Workshop Tarian Tradisional', 'Susur Sungai Guide', 'Makan Siang & Snack'],
      gambar_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80&fm=webp',
      is_published: true
    }
  ],
  artikel: [
    {
      id: 'art-1',
      judul: 'Festival Durian Candimulyo 2026 Segera Digelar di Tampirkulon',
      konten: 'Desa Tampirkulon bersiap menjadi tuan rumah pesta panen durian tahunan. Pengunjung dapat menikmati aneka ragam jenis durian lokal favorit.',
      ringkasan: 'Sambut kelezatan panen durian tahunan di Desa Tampirkulon Candimulyo dengan aneka promo.',
      gambar_url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=80&fm=webp',
      kategori: 'Berita Desa',
      status: 'published',
      published_at: '2026-07-20T10:00:00Z'
    }
  ],
  galeri: [
    { id: 'gal-1', judul: 'Kebun Durian Candimulyo', url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=80&fm=webp', tipe: 'foto', kategori: 'Kuliner' },
    { id: 'gal-2', judul: 'Pemandangan Terasering Sawah', url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80&fm=webp', tipe: 'foto', kategori: 'Alam' }
  ],
  testimoni: [
    { id: 'test-1', nama: 'Budi Santoso', asal: 'Semarang', pesan: 'Durian Candimulyo di Tampirkulon luar biasa manis dan gurih!', rating: 5, is_shown: true },
    { id: 'test-2', nama: 'Siti Rahmawati', asal: 'Yogyakarta', pesan: 'Sangat senang bisa menyusuri terasering sawah bersama keluarga.', rating: 5, is_shown: true }
  ],
  reservasi: [
    {
      id: 'rsv-1',
      nama: 'Ahmad Dahlan',
      email: 'ahmad@example.com',
      telepon: '081298765432',
      tanggal_kunjungan: '2026-08-01',
      jumlah_orang: 4,
      pesan: 'Mohon siapkan durian kualitas super.',
      status: 'baru',
      created_at: '2026-07-22T08:00:00Z'
    }
  ]
};
