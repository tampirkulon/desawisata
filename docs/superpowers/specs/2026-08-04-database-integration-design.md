# Desa Wisata Tampirkulon — Full Supabase Database Integration Design Spec

## Goal

Make every Admin CRUD action persist to Supabase live database and every public page read from Supabase, so that changes made in Admin are immediately reflected on the public website.

## Current State

- **Database**: 8 tables exist in Supabase (`lmnaeavawmdqnxejosle`) but all have **0 rows**.
- **Auth**: Login uses demo bypass that sets localStorage flags. Supabase Auth works but bypass still kicks in on failure.
- **Admin CRUD**: All 6 admin pages call `supabase.from().insert/update/delete` but:
  - No error handling (errors silently swallowed)
  - No `.select()` after insert (can't confirm saved row)
  - `kontak.js` sends wrong column names (`nama_pemesan` → schema has `nama`, `jumlah_peserta` → schema has `jumlah_orang`, `catatan` → schema has `pesan`)
- **Public pages**: Already have `if (isSupabaseConfigured())` fetch logic, but fall back to mock data because DB is empty.
- **RLS policies**: Admin writes require `auth.role() = 'authenticated'`. Demo bypass login sets localStorage but has no Supabase session, so writes are blocked by RLS.

## Architecture Decisions

1. **Auth**: Remove demo/bypass mode entirely. Login must succeed via Supabase Auth or the user stays on the login page.
2. **Data seeding**: Create a Node.js script (`scripts/seed-db.js`) that inserts seed data via Supabase JS SDK using the anon key + a known admin account session.
3. **CRUD pattern**: Standardize all admin pages to: (a) check `supabase` is not null, (b) use `.select()` after inserts, (c) check for error in response, (d) show toast on failure.
4. **Column alignment**: Fix `kontak.js` to match the `reservasi` schema exactly.

## Scope

### In Scope
- Seed script to populate all 8 tables
- Fix auth to remove bypass
- Fix all 6 admin CRUD pages for proper error handling
- Fix `kontak.js` column names
- Verify all 7 public pages read live data
- Create Storage bucket policy for image uploads

### Out of Scope
- Real-time subscriptions (Supabase Realtime)
- Image upload to Supabase Storage (existing flow preserved)
- User role management beyond single admin

## File Impact Summary

| File | Change Type | Reason |
|------|------------|--------|
| `scripts/seed-db.js` | NEW | Populate all 8 tables with initial data |
| `src/utils/auth.js` | MODIFY | Remove bypass, pure Supabase Auth |
| `src/admin/pages/login.js` | MODIFY | Remove bypass on failure |
| `src/admin/pages/kategori.js` | MODIFY | Add error handling + `.select()` on insert |
| `src/admin/pages/paket.js` | MODIFY | Same pattern |
| `src/admin/pages/artikel.js` | MODIFY | Same pattern |
| `src/admin/pages/galeri.js` | MODIFY | Same pattern |
| `src/admin/pages/profil.js` | MODIFY | Same pattern |
| `src/admin/pages/reservasi.js` | MODIFY | Same pattern |
| `src/pages/kontak.js` | MODIFY | Fix column names for reservasi insert |

## Success Criteria

1. `npm run db:check` shows >0 rows in all 8 tables after seeding
2. Adding a destinasi in Admin → immediately visible on public `#/destinasi`
3. Editing profil desa in Admin → immediately reflected on `#/` and `#/profil`
4. Submitting reservation on `#/kontak` → appears in Admin `#/admin/reservasi`
5. Login requires valid Supabase credentials (no bypass)
