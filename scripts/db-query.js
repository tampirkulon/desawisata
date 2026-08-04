import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env manually
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...valueParts] = trimmed.split('=');
      process.env[key.trim()] = valueParts.join('=').trim();
    }
  });
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY harus terpasang di file .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDatabase() {
  console.log(`\n🔍 Pengecekan Database Supabase Live: ${supabaseUrl}`);
  console.log('====================================================');

  const tables = [
    'kategori_wisata',
    'destinasi',
    'paket_wisata',
    'artikel',
    'galeri',
    'profil_desa',
    'reservasi',
    'testimoni'
  ];

  for (const table of tables) {
    try {
      const { data, count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: false })
        .limit(3);

      if (error) {
        console.log(`❌ Tabel '${table}': Gagal / Belum dibuat (${error.message})`);
      } else {
        console.log(`✅ Tabel '${table}': ${count ?? (data ? data.length : 0)} baris data ditemukan`);
      }
    } catch (err) {
      console.log(`⚠️ Tabel '${table}': ${err.message}`);
    }
  }

  console.log('====================================================\n');
}

checkDatabase();
