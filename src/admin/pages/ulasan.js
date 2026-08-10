import { auth } from '../../utils/auth.js';
import { renderAdminSidebar, initAdminSidebarEvents } from '../components/sidebar.js';
import { renderAdminHeader } from '../components/header.js';
import { renderDataTable, initTableSearch } from '../components/data-table.js';
import { openAdminModal } from '../components/modal.js';
import { showToast } from '../../components/toast.js';
import { supabase, isSupabaseConfigured } from '../../lib/supabase.js';
import { mockData } from '../../data/seed.js';

<<<<<<< HEAD



=======
/**
 * Admin - Kelola Ulasan & Testimoni
 */
>>>>>>> 6f2a4f201738aa7684e482448d675b788d3c7c7e
export const renderAdminUlasan = async () => {
  const isAuthed = await auth.requireAuth();
  if (!isAuthed) return document.createElement('div');

<<<<<<< HEAD
 
=======
  let ulasanList = mockData.testimoni || [];
  let activeFilter = 'all';
>>>>>>> 6f2a4f201738aa7684e482448d675b788d3c7c7e

  const loadData = async () => {
    ulasanList = mockData.testimoni || [];

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('testimoni')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) ulasanList = data;
      } catch (error) {
        console.warn('Gagal mengambil data ulasan dari Supabase, menggunakan mockData:', error);
      }
    }
  };

<<<<<<< HEAD
    let ulasanList = mockData.ulasan || [];
    let activeFilter = 'all';
=======
  await loadData();

  const container = document.createElement('div');
  container.className = 'dashboard-wrapper donezo-bg';

  const getFilteredUlasan = () => {
    if (activeFilter === 'published') {
      return ulasanList.filter(item => item.is_shown === true);
    }
    if (activeFilter === 'draft') {
      return ulasanList.filter(item => item.is_shown !== true);
    }
    return ulasanList;
  };
>>>>>>> 6f2a4f201738aa7684e482448d675b788d3c7c7e

  const renderRating = (rating) => {
    const value = Number(rating) || 5;
    const stars = Array.from({ length: 5 }, (_, i) => i < value ? '★' : '☆').join('');
    return `
      <span class="text-amber-500 text-sm tracking-wide font-mono">${stars}</span>
      <span class="ml-1 text-xs font-semibold text-slate-500">${value}/5</span>
    `;
  };

  const renderPublicationBadge = (item) => {
    if (item.is_shown === true) {
      return `
        <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Dipublikasikan
        </span>
      `;
    }
    return `
      <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200 inline-flex items-center gap-1">
        <span class="w-1.5 h-1.5 rounded-full bg-amber-600"></span> Draft / Menunggu
      </span>
    `;
  };

  const formatDate = (date) => {
    if (!date) return '-';
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return date;
    return parsed.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const updatePublicationStatus = async (item, newStatus) => {
    try {
      if (isSupabaseConfigured() && supabase) {
        const { error } = await supabase
          .from('testimoni')
          .update({ is_shown: newStatus })
          .eq('id', item.id);

        if (error) throw error;
      }

      item.is_shown = newStatus;
      showToast(
        newStatus ? 'Ulasan berhasil dipublikasikan ke halaman utama.' : 'Ulasan berhasil dialihkan ke draft.',
        'success'
      );

      await loadData();
      renderPage();
    } catch (error) {
      console.error('Gagal mengubah status publikasi ulasan:', error);
      showToast('Gagal mengubah status: ' + error.message, 'error');
    }
  };

  const deleteUlasan = async (item) => {
    if (!confirm(`Hapus ulasan dari "${item.nama || 'Pengunjung'}"?`)) return;

    try {
      if (isSupabaseConfigured() && supabase) {
        const { error } = await supabase.from('testimoni').delete().eq('id', item.id);
        if (error) throw error;
      }

      const idx = mockData.testimoni.findIndex(t => t.id === item.id);
      if (idx !== -1) mockData.testimoni.splice(idx, 1);

      showToast('Ulasan berhasil dihapus.', 'info');
      await loadData();
      renderPage();
    } catch (error) {
      console.error('Gagal menghapus ulasan:', error);
      showToast('Gagal menghapus ulasan: ' + error.message, 'error');
    }
  };

  const openDetailModal = (item) => {
    const nama = item.nama || item.name || 'Wisatawan';
    const asal = item.asal || '-';
    const pesan = item.pesan || item.komentar || item.ulasan || '-';
    const rating = Number(item.rating) || 5;
    const isPublished = item.is_shown === true;

    const bodyHtml = `
      <div class="space-y-4">
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Informasi Pengulas</h4>
          <p class="text-sm font-bold text-slate-800 m-0">${nama}</p>
          <p class="text-xs text-slate-500 m-0 mt-0.5">Asal / Kota: ${asal}</p>
          <p class="text-xs text-slate-400 m-0 mt-1">Tanggal: ${formatDate(item.created_at)}</p>
        </div>

        <div class="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Rating</h4>
          <div class="flex items-center">${renderRating(rating)}</div>
        </div>

        <div class="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Isi Ulasan</h4>
          <p class="text-sm text-slate-700 italic leading-relaxed m-0 whitespace-pre-wrap">"${pesan}"</p>
        </div>

        <div class="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex items-center justify-between">
          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Status Publikasi</h4>
            <div>${renderPublicationBadge(item)}</div>
          </div>
        </div>
      </div>
    `;

    openAdminModal({
      title: `Detail Ulasan #${String(item.id).substring(0, 8)}`,
      bodyHtml,
      saveText: isPublished ? 'Tarik dari Beranda (Draft)' : 'Setujui & Publikasikan',
      onSave: async () => {
        await updatePublicationStatus(item, !isPublished);
        return true;
      }
    });
  };

  const renderPage = () => {
    const filteredUlasan = getFilteredUlasan();

    container.innerHTML = `
      ${renderAdminSidebar('#/admin/ulasan')}

      <main class="admin-main donezo-bg h-full overflow-hidden flex flex-col">
        ${renderAdminHeader('Kelola Ulasan & Testimoni')}

        <div class="flex-1 overflow-y-auto p-8 w-full">
          <div class="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <h1 class="font-display-lg text-2xl font-bold text-slate-800 m-0">Ulasan Wisatawan</h1>
              <p class="text-xs font-medium text-slate-400 m-0 mt-1">Moderasi dan kelola testimoni pengunjung yang tampil pada beranda website.</p>
            </div>
          </div>

          <!-- Filter Tabs -->
          <div class="flex items-center gap-2 mb-6 flex-wrap">
            ${[
              { value: 'all', label: 'Semua Ulasan' },
              { value: 'published', label: 'Dipublikasikan' },
              { value: 'draft', label: 'Draft / Menunggu' }
            ].map(filter => {
              const isActive = activeFilter === filter.value;
              return `
                <button class="filter-ulasan-btn px-4 py-2 rounded-full font-bold text-xs transition-colors cursor-pointer ${
                  isActive ? 'bg-[#316342] text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }" data-filter="${filter.value}">
                  ${filter.label}
                </button>
              `;
            }).join('')}
          </div>

          <!-- Table Container -->
          <div class="donezo-card p-6">
            ${renderDataTable({
              columns: [
                { label: 'Pengulas' },
                { label: 'Rating' },
                { label: 'Ulasan' },
                { label: 'Tanggal' },
                { label: 'Status' }
              ],
              data: filteredUlasan,
              searchPlaceholder: 'Cari nama atau isi ulasan...'
            })}
          </div>
        </div>
      </main>
    `;

    bindEvents(filteredUlasan);
  };

  const bindEvents = (dataToRender) => {
    initAdminSidebarEvents();
    initTableSearch(container);

    container.querySelectorAll('.filter-ulasan-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        activeFilter = e.currentTarget.getAttribute('data-filter');
        renderPage();
      });
    });

    const tbody = container.querySelector('#table-body-element');
    if (tbody) {
      if (!dataToRender.length) {
        tbody.innerHTML = `
          <tr>
            <td colspan="6" class="py-10 text-center text-slate-400 text-xs font-medium">
              Belum ada ulasan yang sesuai dengan filter.
            </td>
          </tr>
        `;
      } else {
        tbody.innerHTML = dataToRender.map(item => {
          const nama = item.nama || item.name || 'Wisatawan';
          const asal = item.asal || '-';
          const pesan = item.pesan || item.komentar || item.ulasan || '-';
          const rating = Number(item.rating) || 5;
          const isPublished = item.is_shown === true;

<<<<<<< HEAD
    // =======================================================
    // BIND EVENTS
    // =======================================================

  
const handleDetailClick = (event) => {
  const { id } = event.currentTarget.dataset;

  const item = ulasanList.find(
    (review) => String(review.id) === String(id)
  );

  if (item) {
    openDetailModal(item);
  }
};

const bindEvents = (dataToRender) => {
  initAdminSidebarEvents();
  initTableSearch(container);

  container
    .querySelectorAll('.action-detail-ulasan')
    .forEach((button) => {
      button.addEventListener('click', handleDetailClick);
    });



        // =====================================================
        // TABLE BODY
        // =====================================================

        const tbody =
            container.querySelector(
                '#table-body-element'
            );


        if (!tbody) {
            return;
        }


        if (!dataToRender.length) {

            tbody.innerHTML = `
        <tr>

          <td
            colspan="6"
            style="
              text-align: center;
              padding: 40px;
              color: var(--neutral-500);
            "
          >
            Belum ada ulasan.

          </td>

        </tr>
      `;

            return;
        }


        tbody.innerHTML =
            dataToRender
                .map((item) => {

                    const nama =
                        item.nama ||
                        item.name ||
                        item.customer_name ||
                        'Wisatawan';


                    const komentar =
                        item.komentar ||
                        item.ulasan ||
                        item.review ||
                        item.comment ||
                        item.pesan ||
                        '-';


                    const rating =
                        Number(item.rating) || 0;


                    const isPublished =
                        item.is_shown === true;


                    const actionText =
                        isPublished
                            ? 'Unpublish'
                            : 'Publikasikan';


                 


                   

                    const actionClass = isPublished
                        ? 'px-4 py-2 text-sm font-semibold rounded-lg bg-red-100 text-red-700 hover:bg-red-200 border border-red-300 transition-colors'
                        : 'px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-300 transition-colors';


                    return `
            <tr>

              <!-- PENGULAS -->
              <td>

                <strong>
                  ${nama}
                </strong>

                ${item.email
                            ? `
                      <div
                        style="
                          font-size: 0.8rem;
                          color: var(--neutral-600);
                        "
                      >
                        ${item.email}
                      </div>
                    `
                            : ''
                        }

=======
          return `
            <tr class="hover:bg-slate-50/80 transition-colors">
              <td class="py-3 px-3">
                <div class="font-bold text-slate-800 text-xs">${nama}</div>
                <div class="text-[10px] text-slate-400">${asal}</div>
>>>>>>> 6f2a4f201738aa7684e482448d675b788d3c7c7e
              </td>
              <td class="py-3 px-3 whitespace-nowrap">
                ${renderRating(rating)}
              </td>
              <td class="py-3 px-3 max-w-[320px]">
                <div class="text-xs text-slate-600 truncate" title="${pesan}">
                  "${pesan}"
                </div>
              </td>
              <td class="py-3 px-3 text-xs text-slate-500 whitespace-nowrap">
                ${formatDate(item.created_at)}
              </td>
              <td class="py-3 px-3">
                ${renderPublicationBadge(item)}
              </td>
              <td class="py-3 px-3 text-right whitespace-nowrap">
                <div class="flex items-center justify-end gap-1.5">
                  <button class="action-detail-ulasan px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer" data-id="${item.id}">
                    Detail
                  </button>
                  <button class="action-toggle-ulasan px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    isPublished 
                      ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200' 
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                  }" data-id="${item.id}" data-shown="${isPublished}">
                    ${isPublished ? 'Unpublish' : 'Publikasikan'}
                  </button>
                  <button class="action-delete-ulasan px-2 py-1 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer" data-id="${item.id}" title="Hapus Ulasan">
                    <span class="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>
              </td>
            </tr>
          `;
<<<<<<< HEAD

                })
                .join('');






       
        container.querySelectorAll('.btn-toggle-publish').forEach((button) => {
  button.addEventListener('click', async (e) => {
    const btn = e.currentTarget;
    const id = btn.dataset('data-id');
    const currentStatus = btn.dataset('data-published') === 'true';
    const newStatus = !currentStatus; // Balikkan nilai (true <-> false)

    try {
     
      btn.disabled = true;

      const { error } = await supabase
        .from('testimoni')
        .update({ is_shown: newStatus })
        .eq('id', id);

      if (error) throw error;

      

      // Re-render halaman admin untuk memperbarui UI
      renderPage(); // Ganti nama fungsi ini sesuai fungsi render admin Anda
    } catch (err) {
      console.error('Gagal mengubah status:', err);
      alert('Gagal mengubah status: ' + err.message);
      btn.disabled = false;
    }
  });
});

        container
            .querySelectorAll('.action-detail-ulasan')
            .forEach((button) => {

                button.addEventListener(
                    'click',
                    (event) => {

                        const id =
                            event.currentTarget
                                .dataset('data-id');


                        const item =
                            ulasanList.find(
                                (review) =>
                                    String(review.id) === String(id)
                            );


                        if (item) {
                            openDetailModal(item);
                        }

                    }
                );

            });

        container
            .querySelectorAll('.action-toggle-ulasan')
            .forEach((button) => {

                button.addEventListener(
                    'click',
                    async (event) => {

                        const target =
                            event.currentTarget;


                        const id =
                            target.dataset('data-id');


                        const currentPublished =
                            target.dataset(
                                'data-published'
                            ) === 'true';


                        const item =
                            ulasanList.find(
                                (review) =>
                                    String(review.id) === String(id)
                            );


                        if (!item) {
                            return;
                        }


                        const newPublished =
                            !currentPublished;


                        await updatePublicationStatus(
                            item,
                            newPublished
                        );

                    }
                );

            });

    };


    const updatePublicationStatus =
        async (item, isPublished) => {

            try {

                // -------------------------------------------------
                // SUPABASE
                // -------------------------------------------------

                if (
                    isSupabaseConfigured() &&
                    supabase
                ) {

                    const { error } =
                        await supabase
                            .from('testimoni')
                            .update({
                                is_shown: true
                            })
                            .eq('id', item.id);


                    if (error) {
                        throw error;
                    }

                }



                item.is_published =
                    isPublished;



                showToast(
                    isPublished
                        ? 'Ulasan berhasil dipublikasikan.'
                        : 'Ulasan berhasil di-unpublish.',
                    'success'
                );


                await loadData();

                renderPage();


            } catch (error) {

                console.error(
                    'Gagal mengubah status publikasi:',
                    error
                );


                showToast(
                    'Gagal mengubah status ulasan: ' +
                    error.message,
                    'error'
                );

            }

        };


    const openDetailModal = (item) => {

        const nama =
            item.nama ||
            item.name ||
            item.customer_name ||
            'Wisatawan';


        const komentar =
            item.komentar ||
            item.ulasan ||
            item.review ||
            item.comment ||
            '-';


        const rating =
            Number(item.rating) || 0;


        const isPublished =
            item.is_shown === true;


        const bodyHtml = `

      <div
        style="
          display: flex;
          flex-direction: column;
          gap: 16px;
        "
      >

        <!-- DATA PENGULAS -->
        <div
          style="
            background: var(--neutral-50);
            padding: 16px;
            border-radius: var(--radius-md);
            border: 1px solid var(--neutral-200);
          "
        >

          <h4
            style="
              margin-bottom: 12px;
              font-size: 1.1rem;
            "
          >
            Informasi Pengulas
          </h4>


          <p>
            <strong>Nama:</strong>
            ${nama}
          </p>


          ${item.email
                ? `
                <p>
                  <strong>Email:</strong>
                  ${item.email}
                </p>
              `
                : ''
            }


          <p>
            <strong>Tanggal:</strong>
            ${formatDate(item.created_at)}
          </p>

        </div>


        <!-- RATING -->
        <div
          style="
            background: var(--neutral-50);
            padding: 16px;
            border-radius: var(--radius-md);
            border: 1px solid var(--neutral-200);
          "
        >

          <h4
            style="
              margin-bottom: 8px;
              font-size: 1.1rem;
            "
          >
            Rating
          </h4>


          <div>
            ${renderRating(rating)}
          </div>

        </div>


        <!-- ULASAN -->
        <div
          style="
            background: var(--neutral-50);
            padding: 16px;
            border-radius: var(--radius-md);
            border: 1px solid var(--neutral-200);
          "
        >

          <h4
            style="
              margin-bottom: 8px;
              font-size: 1.1rem;
            "
          >
            Isi Ulasan
          </h4>


          <p
            style="
              line-height: 1.7;
              color: var(--neutral-700);
              white-space: pre-wrap;
            "
          >
            ${komentar}
          </p>

        </div>


        <!-- STATUS -->
        <div
          style="
            background: var(--neutral-50);
            padding: 16px;
            border-radius: var(--radius-md);
            border: 1px solid var(--neutral-200);
          "
        >

          <h4
            style="
              margin-bottom: 8px;
              font-size: 1.1rem;
            "
          >
            Status Publikasi
          </h4>


          <p>

            ${isPublished
                ? `
                  <span class="badge badge-success">
                    Dipublikasikan
                  </span>
                `
                : `
                  <span class="badge badge-warning">
                    Draft
                  </span>
                `
            }

          </p>

        </div>

      </div>

    `;


        openAdminModal({
            title:
                `Detail Ulasan #${String(item.id).substring(0, 8)}`,

            bodyHtml,

            saveText:
                isPublished
                    ? 'Unpublish Ulasan'
                    : 'Publikasikan Ulasan',

            onSave:
                async () => {

                    await updatePublicationStatus(
                        item,
                        !isPublished
                    );

                    return true;

                }

        });

    };

    renderPage();


    return container;
=======
        }).join('');
      }
    }
>>>>>>> 6f2a4f201738aa7684e482448d675b788d3c7c7e

    container.querySelectorAll('.action-detail-ulasan').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const item = ulasanList.find(u => String(u.id) === String(id));
        if (item) openDetailModal(item);
      });
    });

    container.querySelectorAll('.action-toggle-ulasan').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const item = ulasanList.find(u => String(u.id) === String(id));
        if (!item) return;

        const currentShown = item.is_shown === true;
        btn.disabled = true;
        btn.innerText = 'Memproses...';
        await updatePublicationStatus(item, !currentShown);
      });
    });

    container.querySelectorAll('.action-delete-ulasan').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const item = ulasanList.find(u => String(u.id) === String(id));
        if (item) await deleteUlasan(item);
      });
    });
  };

  renderPage();
  return container;
};