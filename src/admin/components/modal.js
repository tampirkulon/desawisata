// Reusable Modal Component for Admin CRUD Forms & Delete Confirmations

export const openAdminModal = ({ title, bodyHtml, onSave, saveText = 'Simpan Data', onOpen = null }) => {
  let modalRoot = document.getElementById('admin-modal-root');
  if (!modalRoot) {
    modalRoot = document.createElement('div');
    modalRoot.id = 'admin-modal-root';
    document.body.appendChild(modalRoot);
  }

  modalRoot.innerHTML = `
    <div class="modal-overlay active" id="admin-modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h3 style="font-size: 1.25rem;">${title}</h3>
          <button id="admin-modal-close" style="font-size: 1.25rem; border: none; background: none; cursor: pointer; color: var(--neutral-600);"><span class="material-symbols-outlined">close</span></button>
        </div>
        <div class="modal-body">
          ${bodyHtml}
        </div>
        <div class="modal-footer">
          <button id="admin-modal-cancel" class="btn btn-secondary">Batal</button>
          <button id="admin-modal-save" class="btn btn-primary">${saveText}</button>
        </div>
      </div>
    </div>
  `;

  if (typeof onOpen === 'function') {
    onOpen();
  }

  modalRoot.querySelector('form')?.addEventListener('submit', (e) => e.preventDefault());

  let handleEsc;

  const closeModal = () => {
    modalRoot.innerHTML = '';
    document.removeEventListener('keydown', handleEsc);
  };

  handleEsc = (e) => {
    if (e.key === 'Escape') closeModal();
  };
  document.addEventListener('keydown', handleEsc);

  modalRoot.querySelector('#admin-modal-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'admin-modal-overlay') closeModal();
  });

  modalRoot.querySelector('#admin-modal-close')?.addEventListener('click', closeModal);
  modalRoot.querySelector('#admin-modal-cancel')?.addEventListener('click', closeModal);
  
  modalRoot.querySelector('#admin-modal-save')?.addEventListener('click', async (e) => {
    e.preventDefault();
    const saveBtn = modalRoot.querySelector('#admin-modal-save');
    saveBtn.disabled = true;
    saveBtn.innerText = 'Menyimpan...';

    const success = await onSave();
    if (success !== false) {
      closeModal();
    } else {
      saveBtn.disabled = false;
      saveBtn.innerText = saveText;
    }
  });
};

export const openConfirmModal = ({ title = 'Konfirmasi Hapus', message, onConfirm }) => {
  openAdminModal({
    title,
    bodyHtml: `<p style="font-size: 1rem; color: var(--neutral-800);">${message}</p>`,
    saveText: 'Ya, Hapus Data',
    onSave: async () => {
      await onConfirm();
      return true;
    }
  });
};
