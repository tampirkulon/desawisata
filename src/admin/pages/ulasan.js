
import { auth } from '../../utils/auth.js';
import {
    renderAdminSidebar,
    initAdminSidebarEvents
} from '../components/sidebar.js';
import { renderAdminHeader } from '../components/header.js';
import {
    renderDataTable,
    initTableSearch
} from '../components/data-table.js';
import { openAdminModal } from '../components/modal.js';
import { showToast } from '../../components/toast.js';
import {
    supabase,
    isSupabaseConfigured
} from '../../lib/supabase.js';
import { mockData } from '../../data/seed.js';




export const renderAdminUlasan = async () => {

 

    const isAuthed = await auth.requireAuth();

    if (!isAuthed) {
        return document.createElement('div');
    }

    let ulasanList = mockData.ulasan || [];
    let activeFilter = 'all';


    // =======================================================
    // LOAD DATA
    // =======================================================

    const loadData = async () => {

        // Default fallback
        ulasanList = mockData.ulasan || [];


        // Jika Supabase tersedia
        if (!isSupabaseConfigured() || !supabase) {
            return;
        }

        try {

            const { data, error } = await supabase
                .from('testimoni')
                .select('*')
                .order('created_at', {
                    ascending: false
                });

            if (error) {
                throw error;
            }

            if (data) {
                ulasanList = data;
            }

        } catch (error) {

            console.warn(
                'Gagal mengambil data ulasan dari Supabase. Menggunakan mockData.',
                error
            );

        }
    };


    // Load data pertama kali
    await loadData();


    // =======================================================
    // CONTAINER
    // =======================================================

    const container = document.createElement('div');

    container.className =
        'dashboard-wrapper donezo-bg';


    // =======================================================
    // FILTER DATA
    // =======================================================

    const getFilteredUlasan = () => {

        if (activeFilter === 'all') {
            return ulasanList;
        }


        if (activeFilter === 'published') {
            return ulasanList.filter(
                (item) => item.is_published === true
            );
        }


        if (activeFilter === 'draft') {
            return ulasanList.filter(
                (item) => item.is_published !== true
            );
        }


        return ulasanList;
    };


    // =======================================================
    // FORMAT RATING
    // =======================================================

    const renderRating = (rating) => {

        const value = Number(rating) || 0;

        const stars = Array.from(
            { length: 5 },
            (_, index) => {
                return index < value ? '★' : '☆';
            }
        ).join('');

        return `
      <span
        style="
          color: #f59e0b;
          font-size: 1rem;
          letter-spacing: 1px;
        "
      >
        ${stars}
      </span>

      <span
        style="
          margin-left: 6px;
          color: var(--neutral-600);
          font-size: 0.8rem;
          font-weight: 600;
        "
      >
        ${value}/5
      </span>
    `;
    };


    // =======================================================
    // STATUS BADGE
    // =======================================================

    const renderPublicationBadge = (item) => {

        if (item.is_shown === true) {

            return `
        <span class="badge badge-success">
          Dipublikasikan
        </span>
      `;
        }


        return `
      <span class="badge badge-warning">
        Draft
      </span>
    `;
    };


    // =======================================================
    // FORMAT DATE
    // =======================================================

    const formatDate = (date) => {

        if (!date) {
            return '-';
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return date;
        }

        return parsedDate.toLocaleDateString(
            'id-ID',
            {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            }
        );
    };


    // =======================================================
    // RENDER PAGE
    // =======================================================

    const renderPage = () => {

        const filteredUlasan =
            getFilteredUlasan();


        container.innerHTML = `
      ${renderAdminSidebar('#/admin/ulasan')}


      <main
        class="
          admin-main
          donezo-bg
          h-full
          overflow-hidden
          flex
          flex-col
        "
      >

        ${renderAdminHeader('Kelola Ulasan')}


        <div
          class="
            flex-1
            overflow-y-auto
            p-8
            w-full
          "
        >

          <!-- HEADER -->
          <div
            class="
              flex
              items-center
              justify-between
              flex-wrap
              gap-4
              mb-6
            "
          >

            <div>

              <h1
                class="
                  font-display-lg
                  text-2xl
                  font-bold
                  text-slate-800
                  m-0
                "
              >
                Ulasan Wisatawan
              </h1>


              <p
                class="
                  text-xs
                  font-medium
                  text-slate-400
                  m-0
                  mt-1
                "
              >
                Kelola ulasan wisatawan yang tampil pada halaman publik.
              </p>

            </div>

          </div>


          <!-- FILTER -->
          <div
            class="
              flex
              items-center
              gap-2
              mb-6
              flex-wrap
            "
          >

            ${[
                {
                    value: 'all',
                    label: 'Semua Ulasan'
                },
                {
                    value: 'published',
                    label: 'Dipublikasikan'
                },
                {
                    value: 'draft',
                    label: 'Draft'
                }
            ]
                .map((filter) => {

                    const isActive =
                        activeFilter === filter.value;

                    return `
                  <button
                    class="
                      px-4
                      py-2
                      rounded-full
                      font-bold
                      text-xs
                      transition-colors
                      filter-ulasan-btn
                      ${isActive
                            ? 'bg-[#316342] text-white shadow-sm'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                        }
                    "
                    data-filter="${filter.value}"
                  >
                    ${filter.label}
                  </button>
                `;

                })
                .join('')}

          </div>


          <!-- TABLE -->
          <div class="donezo-card p-6">

            ${renderDataTable({
                    columns: [
                        {
                            label: 'Pengulas'
                        },
                        {
                            label: 'Rating'
                        },
                        {
                            label: 'Ulasan'
                        },
                        {
                            label: 'Tanggal'
                        },
                        {
                            label: 'Status'
                        }
                    ],

                    data: filteredUlasan,

                    searchPlaceholder:
                        'Cari nama atau isi ulasan...'
                })}

          </div>

        </div>

      </main>
    `;


        bindEvents(filteredUlasan);

    };


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

              </td>


              <!-- RATING -->
              <td>

                ${renderRating(rating)}

              </td>


              <!-- ULASAN -->
              <td>

                <div
                  style="
                    max-width: 420px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  "
                  title="${komentar}"
                >
                  ${komentar}
                </div>

              </td>


              <!-- TANGGAL -->
              <td>

                ${formatDate(item.created_at)}

              </td>


              <!-- STATUS -->
              <td>

                ${renderPublicationBadge(item)}

                

              </td>


              <!-- ACTION -->
              <td
                style="
                  text-align: right;
                  white-space: nowrap;
                "
              >

                <button
                  class="
                    btn
                    btn-sm
                    btn-secondary
                    action-detail-ulasan
                  "
                  data-id="${item.id}"
                >
                  Detail
                </button>


                <button
  class="btn-toggle-publish ${actionClass}"
  data-id="${item.id}"
  data-published="${isPublished}"
>
  ${actionText}
</button>

                

              </td>

            </tr>
          `;

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

};