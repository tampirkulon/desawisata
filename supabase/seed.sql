-- ==========================================
-- SEED DATA: DESA WISATA TAMPIRKULON
-- Execute this script after running schema.sql
-- ==========================================

-- Clean existing seed data (optional)
TRUNCATE TABLE reservasi, testimoni, galeri, artikel, paket_wisata, destinasi, kategori_wisata, profil_desa CASCADE;

-- 1. Profil Desa
INSERT INTO profil_desa (
    id, nama_desa, tagline, sejarah, visi, misi, alamat, telepon, email, whatsapp, google_maps_embed, jam_operasional, luas_wilayah, populasi, instagram, facebook, youtube
) VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Desa Wisata Tampirkulon',
    'Keindahan Alam & Pesona Budaya Candimulyo',
    'Desa Tampirkulon terletak di Kecamatan Candimulyo, Kabupaten Magelang, Jawa Tengah. Dikenal dengan hamparan sawah terasering yang asri, kebun durian khas Candimulyo, serta seni budaya tradisional yang masih terjaga kelestariannya. Desa ini berkembang menjadi destinasi wisata berbasis pemberdayaan masyarakat lokal.',
    'Mewujudkan Desa Wisata Tampirkulon sebagai destinasi berdaya saing tinggi, berkelanjutan, dan berorientasi pada pelestarian alam serta kearifan lokal.',
    '1. Mengembangkan destinasi wisata berbasis potensi lokal (kebun durian, perairan asri, dan seni budaya).\n2. Meningkatkan kesejahteraan ekonomi masyarakat desa melalui sektor pariwisata.\n3. Memberikan pelayanan dan pengalaman terbaik bagi wisatawan.',
    'Jl. Raya Candimulyo No. 12, Tampirkulon, Candimulyo, Kabupaten Magelang, Jawa Tengah 56191',
    '+62 812-3456-7890',
    'info@tampirkulon.desawisata.id',
    '6281234567890',
    '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15818.123456789!2d110.234567!3d-7.456789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a8e123456789%3A0x123456789abcdef!2sTampirkulon%2C%20Candimulyo%2C%20Magelang!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>',
    'Senin - Minggu: 08:00 - 17:00 WIB',
    '3.45 km²',
    '2.850 Jiwa',
    'https://instagram.com/desawisatatampirkulon',
    'https://facebook.com/desawisatatampirkulon',
    'https://youtube.com/c/DesaWisataTampirkulon'
);

-- 2. Kategori Wisata
INSERT INTO kategori_wisata (id, nama, deskripsi, icon, urutan) VALUES
('b0000000-0000-0000-0000-000000000001', 'Wisata Alam', 'Menikmati hamparan sawah, perbukitan, dan udara sejuk pegunungan.', '🌱', 1),
('b0000000-0000-0000-0000-000000000002', 'Wisata Kuliner', 'Mengeksplorasi cita rasa durian lokal Candimulyo dan olahan olahan tradisional.', '🍲', 2),
('b0000000-0000-0000-0000-000000000003', 'Wisata Budaya', 'Pertunjukan tarian rakyat, kerajinan lokal, dan adat istiadat khas pedesaan.', '🎭', 3),
('b0000000-0000-0000-0000-000000000004', 'Aktivitas Outdoor', 'Susur sungai, outbound desa, dan edukasi bercocok tanam.', '🚴', 4);

-- 3. Destinasi Wisata
INSERT INTO destinasi (id, nama, deskripsi, kategori_id, gambar_url, gambar_urls, lokasi, jam_buka, harga_tiket, is_unggulan, is_published) VALUES
(
    'c0000000-0000-0000-0000-000000000001',
    'Kebun Durian Candimulyo Tampir',
    'Nikmati pengalaman langsung memetik dan mencicipi durian khas Candimulyo yang terkenal dengan rasa manis legit dan daging yang tebal.',
    'b0000000-0000-0000-0000-000000000002',
    'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=80',
    ARRAY['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=80'],
    'Dusun Tampir 1, Tampirkulon',
    '08:00 - 16:00 WIB',
    'Rp 10.000 (Tiket Masuk)',
    TRUE,
    TRUE
),
(
    'c0000000-0000-0000-0000-000000000002',
    'Terasering Sawah Asri Tampir',
    'Pemandangan terasering sawah hijau berlatar belakang Gunung Merbabu dan Merapi. Tempat yang sangat fotogenik dan menenangkan jiwa.',
    'b0000000-0000-0000-0000-000000000001',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80',
    ARRAY['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80'],
    'Dusun Tampir 2, Tampirkulon',
    '06:00 - 18:00 WIB',
    'Gratis',
    TRUE,
    TRUE
),
(
    'c0000000-0000-0000-0000-000000000003',
    'Sanggar Seni Tarian Dayakan',
    'Sanggar kebudayaan lokal tempat wisatawan dapat menyaksikan dan belajar tarian tradisional seperti Kesenian Dayakan dan Kubro Siswo.',
    'b0000000-0000-0000-0000-000000000003',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80',
    ARRAY['https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80'],
    'Balai Desa Tampirkulon',
    '13:00 - 17:00 WIB (Akhir Pekan)',
    'Rp 15.000',
    TRUE,
    TRUE
),
(
    'c0000000-0000-0000-0000-000000000004',
    'Susur Sungai Kali Progo Branch',
    'Aktivitas petualangan menyusuri alur sungai berair jernih dengan suasana pedesaan yang rindang dan alami.',
    'b0000000-0000-0000-0000-000000000004',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80',
    ARRAY['https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80'],
    'Aliran Sungai Tampirkulon',
    '08:00 - 15:00 WIB',
    'Rp 25.000',
    FALSE,
    TRUE
);

-- 4. Paket Wisata
INSERT INTO paket_wisata (id, nama, deskripsi, harga, durasi, kapasitas_min, kapasitas_max, fasilitas, destinasi_ids, gambar_url, is_published) VALUES
(
    'd0000000-0000-0000-0000-000000000001',
    'Paket Jelajah Durian & Kuliner Desa',
    'Paket seru mengelilingi kebun durian, memetik buah durian segar, plus makan siang prasmanan masakan khas desa.',
    150000,
    '1 Hari (09:00 - 15:00)',
    4,
    20,
    ARRAY['Tiket Masuk Kebun', '1 Buah Durian Pilihan', 'Makan Siang Tradisional', 'Pemandu Lokal', 'Welcome Drink Es Kelapa'],
    ARRAY['c0000000-0000-0000-0000-000000000001'::uuid],
    'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=80',
    TRUE
),
(
    'd0000000-0000-0000-0000-000000000002',
    'Paket Full Day Budaya & Alam Tampir',
    'Petualangan lengkap menyusuri terasering sawah, belajar tarian tradisional di sanggar, dan susur sungai.',
    225000,
    '1 Hari Full',
    5,
    30,
    ARRAY['Trekking Sawah', 'Workshop Tarian Tradisional', 'Susur Sungai Guide', 'Makan Siang & Snack', 'Dokumentasi Foto'],
    ARRAY['c0000000-0000-0000-0000-000000000002'::uuid, 'c0000000-0000-0000-0000-000000000003'::uuid],
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80',
    TRUE
);

-- 5. Artikel Blog
INSERT INTO artikel (id, judul, konten, ringkasan, gambar_url, kategori, status, published_at) VALUES
(
    'e0000000-0000-0000-0000-000000000001',
    'Festival Durian Candimulyo 2026 Segera Digelar di Tampirkulon',
    '## Festival Durian Candimulyo 2026\n\nDesa Tampirkulon bersiap menjadi tuan rumah pesta panen durian tahunan. Pengunjung dapat menikmati aneka ragam jenis durian lokal favorit dengan harga langsung dari petani.\n\n### Agenda Acara:\n- Lomba Durian Terlezat\n- Makan Durian Bersama\n- Bazar UMKM Olahan Durian',
    'Sambut kelezatan panen durian tahunan di Desa Tampirkulon Candimulyo dengan aneka promo dan bazar UMKM.',
    'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=80',
    'Berita Desa',
    'published',
    NOW()
),
(
    'e0000000-0000-0000-0000-000000000002',
    'Pesona Terasering Tampirkulon: Spot Foto Favorit Wisatawan',
    '## Keindahan Terasering Sawah Tampirkulon\n\nKeasrian alam Tampirkulon menjadi daya tarik tersendiri bagi pecinta fotografi landscape dan wisatawan yang mencari ketenangan dari hiruk pikuk kota.',
    'Ulasan keindahan terasering sawah khas Magelang yang memanjakan mata dan cocok untuk fotografi.',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80',
    'Wisata',
    'published',
    NOW()
);

-- 6. Galeri
INSERT INTO galeri (id, judul, url, tipe, kategori, urutan) VALUES
('f0000000-0000-0000-0000-000000000001', 'Kebun Durian Candimulyo', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=80', 'foto', 'Kuliner', 1),
('f0000000-0000-0000-0000-000000000002', 'Pemandangan Terasering Sawah', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80', 'foto', 'Alam', 2),
('f0000000-0000-0000-0000-000000000003', 'Tarian Seni Tradisional', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80', 'foto', 'Budaya', 3);

-- 7. Testimoni
INSERT INTO testimoni (id, nama, asal, pesan, rating, is_shown) VALUES
('g0000000-0000-0000-0000-000000000001', 'Budi Santoso', 'Semarang', 'Durian Candimulyo di Tampirkulon luar biasa manis dan gurih! Udara desanya juga sangat sejuk.', 5, TRUE),
('g0000000-0000-0000-0000-000000000002', 'Siti Rahmawati', 'Yogyakarta', 'Sangat senang bisa menyusuri terasering sawah bersama keluarga. Anak-anak sangat menikmati tarian budayanya.', 5, TRUE);
