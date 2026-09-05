-- Migration: Add extra columns to profil_desa (Bilingual support & Customizable Footer)
-- Timestamp: 2026-09-05

ALTER TABLE profil_desa ADD COLUMN IF NOT EXISTS tagline_en TEXT;
ALTER TABLE profil_desa ADD COLUMN IF NOT EXISTS sejarah_en TEXT;
ALTER TABLE profil_desa ADD COLUMN IF NOT EXISTS visi_en TEXT;
ALTER TABLE profil_desa ADD COLUMN IF NOT EXISTS misi_en TEXT;

ALTER TABLE profil_desa ADD COLUMN IF NOT EXISTS footer_deskripsi TEXT;
ALTER TABLE profil_desa ADD COLUMN IF NOT EXISTS footer_deskripsi_en TEXT;
ALTER TABLE profil_desa ADD COLUMN IF NOT EXISTS footer_copyright TEXT;
ALTER TABLE profil_desa ADD COLUMN IF NOT EXISTS footer_show_social BOOLEAN DEFAULT true;
ALTER TABLE profil_desa ADD COLUMN IF NOT EXISTS footer_quick_links JSONB DEFAULT '["beranda", "destinasi", "paket", "profil", "galeri", "blog"]'::jsonb;
