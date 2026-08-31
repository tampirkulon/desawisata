// Fallback Seed Data for Offline / Preview Mode

export const mockData = {
  profil_desa: {
    id: 'a0000000-0000-0000-0000-000000000001',
    nama_desa: 'Desa Wisata Tampirkulon',
    tagline: 'Keindahan Alam & Pesona Budaya Candimulyo',
    tagline_en: 'Natural Splendor & Cultural Charm of Candimulyo',
    logo_url: '',
    banner_url: '/images/hero-tampirkulon.webp',
    sejarah: 'Desa Tampirkulon terletak di Kecamatan Candimulyo, Kabupaten Magelang, Jawa Tengah. Dikenal dengan hamparan sawah terasering yang asri, kebun durian khas Candimulyo, serta seni budaya tradisional yang masih terjaga kelestariannya.',
    sejarah_en: 'Tampirkulon Village is located in Candimulyo District, Magelang Regency, Central Java. Renowned for its lush terraced rice fields, signature Candimulyo durian orchards, and preserved traditional performing arts.',
    visi: 'Mewujudkan Desa Wisata Tampirkulon sebagai destinasi berdaya saing tinggi, berkelanjutan, dan berorientasi pada pelestarian alam serta kearifan lokal.',
    visi_en: 'Establishing Tampirkulon Tourism Village as a highly competitive, sustainable destination oriented towards nature conservation and local wisdom.',
    misi: '1. Mengembangkan destinasi wisata berbasis potensi lokal.\n2. Meningkatkan kesejahteraan ekonomi masyarakat desa.\n3. Memberikan pelayanan terbaik bagi wisatawan.',
    misi_en: '1. Developing tourism destinations based on local potential.\n2. Enhancing the economic prosperity of the village community.\n3. Providing top-tier hospitality for all visitors.',
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
    youtube: 'https://youtube.com/c/DesaWisataTampirkulon',
    footer_deskripsi: 'Desa Wisata Tampirkulon adalah destinasi yang memadukan keindahan alam pegunungan dengan kearifan lokal yang kental. Kami berkomitmen untuk melestarikan warisan budaya dan alam demi masa depan yang berkelanjutan.',
    footer_deskripsi_en: 'Tampirkulon Tourism Village is a destination combining scenic mountain beauty with authentic local heritage. We are dedicated to preserving our natural and cultural legacy for a sustainable future.',
    footer_copyright: '© {year} Desa Wisata Tampirkulon. Hak Cipta Dilindungi.',
    footer_show_social: true,
    footer_quick_links: ['beranda', 'destinasi', 'paket', 'profil', 'galeri', 'blog']
  },
  kategori_wisata: [
    { id: 'cat-1', nama: 'Wisata Alam', nama_en: 'Nature Tourism', deskripsi: 'Hamparan sawah dan udara sejuk pegunungan.', deskripsi_en: 'Scenic rice fields and fresh mountain air.', icon: '🌱', urutan: 1 },
    { id: 'cat-2', nama: 'Wisata Kuliner', nama_en: 'Culinary Tourism', icon: '🍲', deskripsi: 'Durian Candimulyo & masakan desa.', deskripsi_en: 'Candimulyo Durian & authentic village cuisine.', urutan: 2 },
    { id: 'cat-3', nama: 'Wisata Budaya', nama_en: 'Cultural Tourism', icon: '🎭', deskripsi: 'Tarian tradisional & adat istiadat.', deskripsi_en: 'Traditional dance and cultural heritage.', urutan: 3 },
    { id: 'cat-4', nama: 'Aktivitas Outdoor', nama_en: 'Outdoor Activities', icon: '🚴', deskripsi: 'Susur sungai & trekking sawah.', deskripsi_en: 'River trekking & countryside trails.', urutan: 4 }
  ],
  destinasi: [
    {
      id: 'dest-1',
      nama: 'Kebun Durian Candimulyo Tampir',
      nama_en: 'Candimulyo Durian Orchard Tampir',
      deskripsi: 'Nikmati pengalaman langsung memetik dan mencicipi durian khas Candimulyo yang terkenal manis legit.',
      deskripsi_en: 'Enjoy the direct experience of picking and tasting signature Candimulyo durians famous for their rich sweet flavor.',
      kategori_id: 'cat-2',
      gambar_url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=80&fm=webp',
      lokasi: 'Dusun Tampir 1, Tampirkulon',
      lokasi_en: 'Tampir 1 Hamlet, Tampirkulon',
      jam_buka: '08:00 - 16:00 WIB',
      harga_tiket: 'Rp 10.000',
      is_unggulan: true,
      is_published: true
    },
    {
      id: 'dest-2',
      nama: 'Terasering Sawah Asri Tampir',
      nama_en: 'Tampir Scenic Rice Terraces',
      deskripsi: 'Pemandangan terasering sawah hijau berlatar belakang Gunung Merbabu & Merapi.',
      deskripsi_en: 'Scenic lush green terraced rice fields set against the backdrop of Mount Merbabu & Merapi.',
      kategori_id: 'cat-1',
      gambar_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80&fm=webp',
      lokasi: 'Dusun Tampir 2, Tampirkulon',
      lokasi_en: 'Tampir 2 Hamlet, Tampirkulon',
      jam_buka: '06:00 - 18:00 WIB',
      harga_tiket: 'Gratis',
      is_unggulan: true,
      is_published: true
    },
    {
      id: 'dest-3',
      nama: 'Sanggar Seni Tarian Dayakan',
      nama_en: 'Dayakan Traditional Dance Art Studio',
      deskripsi: 'Sanggar kebudayaan tempat menyaksikan tarian tradisional seperti Kesenian Dayakan.',
      deskripsi_en: 'Cultural art studio to witness and learn traditional folk dances like Dayakan art.',
      kategori_id: 'cat-3',
      gambar_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80&fm=webp',
      lokasi: 'Balai Desa Tampirkulon',
      lokasi_en: 'Tampirkulon Village Hall',
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
      nama_en: 'Durian Discovery & Village Culinary Package',
      deskripsi: 'Paket mengelilingi kebun durian, memetik buah durian segar, plus makan siang masakan khas desa.',
      deskripsi_en: 'Touring lush durian orchards, harvesting fresh fruit, plus authentic traditional village lunch.',
      harga: 150000,
      durasi: '1 Hari (09:00 - 15:00)',
      kapasitas_min: 4,
      kapasitas_max: 20,
      fasilitas: ['Tiket Masuk Kebun', '1 Buah Durian Pilihan', 'Makan Siang Tradisional', 'Pemandu Lokal'],
      fasilitas_en: ['Orchard Admission Ticket', '1 Selected Fresh Durian', 'Traditional Village Lunch', 'Local Tour Guide'],
      gambar_url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=80&fm=webp',
      is_published: true
    },
    {
      id: 'pkt-2',
      nama: 'Paket Full Day Budaya & Alam Tampir',
      nama_en: 'Tampir Full Day Nature & Culture Package',
      deskripsi: 'Petualangan menyusuri terasering sawah, belajar tarian tradisional di sanggar, dan susur sungai.',
      deskripsi_en: 'Adventure exploring terraced fields, learning traditional folk dance, and guided river walk.',
      harga: 225000,
      durasi: '1 Hari Full',
      kapasitas_min: 5,
      kapasitas_max: 30,
      fasilitas: ['Trekking Sawah', 'Workshop Tarian Tradisional', 'Susur Sungai Guide', 'Makan Siang & Snack'],
      fasilitas_en: ['Rice Terraces Trekking', 'Traditional Dance Workshop', 'Guided River Walk', 'Lunch & Traditional Snacks'],
      gambar_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80&fm=webp',
      is_published: true
    }
  ],
  artikel: [
    {
      id: 'art-1',
      judul: 'Menyusuri Keindahan Alam & Pesona Wisata Tampirkulon',
      judul_en: 'Exploring the Natural Beauty and Tourism Charms of Tampirkulon',
      konten: `Tersembunyi di balik perbukitan hijau dan persawahan terasering yang membentang luas di Candimulyo, terdapat sebuah permata alam yang menawarkan ketenangan dan keasrian sejati. Desa Wisata Tampirkulon mengajak setiap pengunjung untuk merasakan harmoni kehidupan desa yang ramah dan alami.

## Menyusuri Jalur Setapak Menuju Ketenangan

Perjalanan menyusuri pedesaan ini bukanlah sekadar berwisata biasa, melainkan sebuah petualangan kecil menyusuri jalan setapak berbatu yang diapit oleh rimbunnya pepohonan bambu dan kebun buah milik warga. Udara pagi yang masih menyisakan embun berpadu dengan aroma tanah basah menciptakan kesegaran alami.

![Jalur setapak hijau yang rimbun dan asri di pelosok desa](https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1000&q=80)

## Pesona Alam yang Menyejukkan Jiwa

Begitu tiba di kawasan persawahan dan aliran sungai jernih, rasa lelah seketika terbayar lunas. Suara gemericik air berpadu dengan hembusan angin sepoi-sepoi yang membelah pepohonan rindang.

> "Bukan hanya keindahan pemandangan yang membuatnya istimewa, melainkan simfoni suara alam yang berpadu dengan ketenangan hutan dan kehangatan warga desa. Ini adalah tempat di mana kita bisa benar-benar mendengarkan alam."
> — Mbah Karyo, Sesepuh Desa Tampirkulon

::gallery
![Lanskap persawahan hijau membentang](https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80)
![Kebun durian subur Candimulyo](https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80)
::

## Tips Berkunjung
- Datanglah di pagi hari sekitar pukul 06.30 - 09.00 WIB untuk mendapatkan cahaya matahari terbaik dan suasana paling tenang.
- Gunakan alas kaki yang nyaman dan anti-slip untuk berjalan di pematang sawah dan bebatuan.
- Bawa kantong sampah sendiri; mari bersama menjaga kelestarian dan kebersihan alam Tampirkulon.
- Sempatkan mencicipi kuliner khas dan durian Candimulyo langsung dari pohonnya.`,
      konten_en: `Tucked away behind lush green hills and sprawling terraced rice paddies in Candimulyo lies a natural gem offering true peace and unspoiled serenity. Tampirkulon Tourism Village invites every traveler to experience authentic village harmony.

## Strolling Along the Path to Serenity

Walking through this village is far from ordinary sightseeing—it is a gentle adventure along stony trails lined with bamboo groves and fruitful local orchards. Crisp morning air blended with wet earth scent delivers pure natural rejuvenation.

![Lush and serene pathway winding through the countryside](https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1000&q=80)

## Enchanting Scenery That Calms the Soul

Arriving by the clear river streams and terraced fields instantly dissolves all fatigue. Gentle water ripples blend with rustling leaves to soothe every thought.

> "It is not merely the scenic panorama that makes this special, but the peaceful harmony of nature and warm local hospitality. This is where you truly listen to nature."
> — Mbah Karyo, Tampirkulon Village Elder

::gallery
![Vast emerald green rice terraces](https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80)
![Thriving durian orchards in Candimulyo](https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80)
::

## Visiting Tips
- Visit between 6:30 AM and 9:00 AM for soft morning light and peaceful quietness.
- Wear comfortable, non-slip shoes for walking along trails and terrain.
- Bring a reusable trash bag; help us preserve the pristine environment of Tampirkulon.
- Do not miss tasting local authentic treats and tree-ripened Candimulyo durians.`,
      ringkasan: 'Jelajahi keasrian alam persawahan terasering, rimbunnya kebun buah, dan ketenangan suasana pedesaan di Desa Wisata Tampirkulon Candimulyo.',
      ringkasan_en: 'Discover the natural serenity of terraced rice fields, lush fruit orchards, and authentic countryside peace in Tampirkulon Candimulyo.',
      gambar_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80&fm=webp',
      kategori: 'Wisata Alam',
      status: 'published',
      published_at: '2026-07-20T10:00:00Z'
    }
  ],
  galeri: [
    { id: 'gal-1', judul: 'Kebun Durian Candimulyo', judul_en: 'Candimulyo Durian Orchard', url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=80&fm=webp', tipe: 'foto', kategori: 'Kuliner' },
    { id: 'gal-2', judul: 'Pemandangan Terasering Sawah', judul_en: 'Scenic Rice Terraces Landscape', url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80&fm=webp', tipe: 'foto', kategori: 'Alam' }
  ],
  testimoni: [
    { id: 'test-1', nama: 'Budi Santoso', asal: 'Semarang', pesan: 'Durian Candimulyo di Tampirkulon luar biasa manis dan legit! Pengalaman memetik langsung dari pohon sangat berkesan bagi keluarga.', pesan_en: 'Candimulyo durian in Tampirkulon is exceptionally sweet and delicious! Harvesting right from the tree was unforgettable.', rating: 5, is_shown: true },
    { id: 'test-2', nama: 'Siti Rahmawati', asal: 'Yogyakarta', pesan: 'Sangat senang bisa menyusuri terasering sawah bersama anak-anak. Udaranya sejuk dan warga desanya sangat ramah menyambut kami.', pesan_en: 'Loved walking along the rice terraces with my children. Fresh cool air and hospitable locals.', rating: 5, is_shown: true },
    { id: 'test-3', nama: 'Hendrawan Pratama', asal: 'Jakarta', pesan: 'Paket wisatanya sangat teratur dan lengkap. Masakan tradisional khas desa dan pertunjukan tari Dayakan membuat liburan sangat bermakna.', pesan_en: 'Well-organized tour packages. Authentic food and traditional Dayakan dance made our holiday very special.', rating: 5, is_shown: true },
    { id: 'test-4', nama: 'Dewi Lestari', asal: 'Surabaya', pesan: 'Tempat yang sangat tepat untuk refreshing dari hiruk pikuk kota. Suasana sawah hijau dan kopi desanya juara!', pesan_en: 'The perfect place to recharge away from city bustle. The green landscapes and village coffee are superb!', rating: 5, is_shown: true },
    { id: 'test-5', nama: 'Rian Kurniawan', asal: 'Solo', pesan: 'Spot foto terasering sawah luar biasa estetik saat matahari terbit. Fasilitas homestay nyaman dan bersih.', pesan_en: 'The rice terrace photo spots are stunning at sunrise. Homestay amenities are cozy and clean.', rating: 5, is_shown: true }
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
