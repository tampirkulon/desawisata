import { router } from './utils/router.js';

// Public Pages
import { renderBeranda } from './pages/beranda.js';
import { renderProfil } from './pages/profil.js';
import { renderDestinasi } from './pages/destinasi.js';
import { renderPaket } from './pages/paket.js';
import { renderGaleri } from './pages/galeri.js';
import { renderBlog } from './pages/blog.js';
import { renderBlogDetail } from './pages/blog-detail.js';
import { renderKontak } from './pages/kontak.js';

// Admin Dashboard Pages
import { renderAdminLogin } from './admin/pages/login.js';
import { renderAdminForgotPassword } from './admin/pages/forgot-password.js';
import { renderAdminResetPassword } from './admin/pages/reset-password.js';
import { renderAdminOverview } from './admin/pages/overview.js';
import { renderAdminDestinasi } from './admin/pages/destinasi.js';
import { renderAdminKategori } from './admin/pages/kategori.js';
import { renderAdminPaket } from './admin/pages/paket.js';
import { renderAdminArtikel } from './admin/pages/artikel.js';
import { renderAdminProfil } from './admin/pages/profil.js';
import { renderAdminGaleri } from './admin/pages/galeri.js';
import { renderAdminReservasi } from './admin/pages/reservasi.js';
import { renderAdminUlasan } from './admin/pages/ulasan.js';

// Register Public Routes
router.addRoute('#/', (params) => renderBeranda(params));
router.addRoute('#/profil', (params) => renderProfil(params));
router.addRoute('#/destinasi', (params) => renderDestinasi(params));
router.addRoute('#/paket', (params) => renderPaket(params));
router.addRoute('#/galeri', (params) => renderGaleri(params));
router.addRoute('#/blog', (params) => renderBlog(params));
router.addRoute('#/blog-detail', (params) => renderBlogDetail(params));
router.addRoute('#/artikel', (params) => renderBlogDetail(params));
router.addRoute('#/kontak', (params) => renderKontak(params));

// Register Admin Routes
router.addRoute('#/admin/login', (params) => renderAdminLogin(params));
router.addRoute('#/admin/forgot-password', (params) => renderAdminForgotPassword(params));
router.addRoute('#/admin/reset-password', (params) => renderAdminResetPassword(params));
router.addRoute('#/admin/overview', (params) => renderAdminOverview(params));
router.addRoute('#/admin/dashboard', (params) => renderAdminOverview(params));
router.addRoute('#/admin/destinasi', (params) => renderAdminDestinasi(params));
router.addRoute('#/admin/kategori', (params) => renderAdminKategori(params));
router.addRoute('#/admin/paket', (params) => renderAdminPaket(params));
router.addRoute('#/admin/artikel', (params) => renderAdminArtikel(params));
router.addRoute('#/admin/profil', (params) => renderAdminProfil(params));
router.addRoute('#/admin/galeri', (params) => renderAdminGaleri(params));
router.addRoute('#/admin/reservasi', (params) => renderAdminReservasi(params));
router.addRoute('#/admin/ulasan', (params) => renderAdminUlasan(params));

// Initialize Router on app container
router.init('app');
