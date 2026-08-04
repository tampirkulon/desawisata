-- ==========================================
-- SCHEMA DATABASE: DESA WISATA TAMPIRKULON
-- Execute this script in your Supabase SQL Editor
-- ==========================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function to handle updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. Tabel Kategori Wisata
CREATE TABLE IF NOT EXISTS kategori_wisata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama TEXT NOT NULL UNIQUE,
    deskripsi TEXT,
    icon TEXT,
    urutan INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_kategori_wisata_updated_at
BEFORE UPDATE ON kategori_wisata
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 2. Tabel Destinasi
CREATE TABLE IF NOT EXISTS destinasi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama TEXT NOT NULL,
    deskripsi TEXT,
    kategori_id UUID REFERENCES kategori_wisata(id) ON DELETE SET NULL,
    gambar_url TEXT,
    gambar_urls TEXT[] DEFAULT '{}',
    lokasi TEXT,
    jam_buka TEXT,
    harga_tiket TEXT,
    is_unggulan BOOLEAN NOT NULL DEFAULT FALSE,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_destinasi_updated_at
BEFORE UPDATE ON destinasi
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3. Tabel Paket Wisata
CREATE TABLE IF NOT EXISTS paket_wisata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama TEXT NOT NULL,
    deskripsi TEXT,
    harga INTEGER NOT NULL,
    durasi TEXT,
    kapasitas_min INTEGER DEFAULT 1,
    kapasitas_max INTEGER,
    fasilitas TEXT[] DEFAULT '{}',
    destinasi_ids UUID[] DEFAULT '{}',
    gambar_url TEXT,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
); 

CREATE TRIGGER update_paket_wisata_updated_at
BEFORE UPDATE ON paket_wisata
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. Tabel Artikel
CREATE TABLE IF NOT EXISTS artikel (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    judul TEXT NOT NULL,
    konten TEXT,
    ringkasan TEXT,
    gambar_url TEXT,
    kategori TEXT,
    status TEXT NOT NULL DEFAULT 'draft',
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_artikel_updated_at
BEFORE UPDATE ON artikel
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. Tabel Galeri
CREATE TABLE IF NOT EXISTS galeri (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    judul TEXT,
    url TEXT NOT NULL,
    tipe TEXT NOT NULL DEFAULT 'foto',
    kategori TEXT,
    urutan INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Tabel Profil Desa
CREATE TABLE IF NOT EXISTS profil_desa (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama_desa TEXT DEFAULT 'Desa Wisata Tampirkulon',
    tagline TEXT DEFAULT 'Keindahan Alam & Pesona Budaya Candimulyo',
    sejarah TEXT,
    visi TEXT,
    misi TEXT,
    alamat TEXT,
    telepon TEXT,
    email TEXT,
    whatsapp TEXT,
    google_maps_embed TEXT,
    jam_operasional TEXT,
    luas_wilayah TEXT,
    populasi TEXT,
    instagram TEXT,
    facebook TEXT,
    youtube TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_profil_desa_updated_at
BEFORE UPDATE ON profil_desa
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Tabel Reservasi
CREATE TABLE IF NOT EXISTS reservasi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama TEXT NOT NULL,
    email TEXT NOT NULL,
    telepon TEXT NOT NULL,
    tanggal_kunjungan DATE NOT NULL,
    jumlah_orang INTEGER NOT NULL CHECK (jumlah_orang > 0),
    paket_id UUID REFERENCES paket_wisata(id) ON DELETE SET NULL,
    pesan TEXT,
    status TEXT NOT NULL DEFAULT 'baru',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Tabel Testimoni
CREATE TABLE IF NOT EXISTS testimoni (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama TEXT NOT NULL,
    asal TEXT,
    pesan TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) DEFAULT 5,
    is_shown BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

ALTER TABLE kategori_wisata ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE paket_wisata ENABLE ROW LEVEL SECURITY;
ALTER TABLE artikel ENABLE ROW LEVEL SECURITY;
ALTER TABLE galeri ENABLE ROW LEVEL SECURITY;
ALTER TABLE profil_desa ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimoni ENABLE ROW LEVEL SECURITY;

-- Kategori Wisata Policies
CREATE POLICY "Public Read Kategori" ON kategori_wisata FOR SELECT USING (true);
CREATE POLICY "Admin Full Access Kategori" ON kategori_wisata FOR ALL USING (auth.role() = 'authenticated');

-- Destinasi Policies
CREATE POLICY "Public Read Destinasi" ON destinasi FOR SELECT USING (is_published = true);
CREATE POLICY "Admin Full Access Destinasi" ON destinasi FOR ALL USING (auth.role() = 'authenticated');

-- Paket Wisata Policies
CREATE POLICY "Public Read Paket" ON paket_wisata FOR SELECT USING (is_published = true);
CREATE POLICY "Admin Full Access Paket" ON paket_wisata FOR ALL USING (auth.role() = 'authenticated');

-- Artikel Policies
CREATE POLICY "Public Read Artikel" ON artikel FOR SELECT USING (status = 'published');
CREATE POLICY "Admin Full Access Artikel" ON artikel FOR ALL USING (auth.role() = 'authenticated');

-- Galeri Policies
CREATE POLICY "Public Read Galeri" ON galeri FOR SELECT USING (true);
CREATE POLICY "Admin Full Access Galeri" ON galeri FOR ALL USING (auth.role() = 'authenticated');

-- Profil Desa Policies
CREATE POLICY "Public Read Profil" ON profil_desa FOR SELECT USING (true);
CREATE POLICY "Admin Full Access Profil" ON profil_desa FOR ALL USING (auth.role() = 'authenticated');

-- Reservasi Policies
CREATE POLICY "Public Insert Reservasi" ON reservasi FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin Full Access Reservasi" ON reservasi FOR ALL USING (auth.role() = 'authenticated');

-- Testimoni Policies
CREATE POLICY "Public Read Testimoni" ON testimoni FOR SELECT USING (is_shown = true);
CREATE POLICY "Admin Full Access Testimoni" ON testimoni FOR ALL USING (auth.role() = 'authenticated');

-- ==========================================
-- STORAGE BUCKET CONFIGURATION INSTRUCTIONS
-- Create a bucket named 'images' in Supabase Storage with Public Access enabled.
-- ==========================================
