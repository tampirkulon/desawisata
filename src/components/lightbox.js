// Lightbox Component for Gallery Fullscreen Preview

let currentIndex = 0;
let itemsList = [];

export const openLightbox = (items, index) => {
  itemsList = items;
  currentIndex = index;

  let overlay = document.getElementById('lightbox-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'lightbox-overlay';
    overlay.style.cssText = `
      position: fixed; inset: 0; background: rgba(0, 0, 0, 0.9);
      z-index: 3000; display: flex; align-items: center; justify-content: center;
      flex-direction: column; color: #fff; padding: 20px; animation: fadeIn 0.25s ease;
    `;
    document.body.appendChild(overlay);
  }

  updateLightboxContent();

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextLightboxItem();
    if (e.key === 'ArrowLeft') prevLightboxItem();
  };

  window.removeEventListener('keydown', handleKeyDown);
  window.addEventListener('keydown', handleKeyDown);
};

const updateLightboxContent = () => {
  const overlay = document.getElementById('lightbox-overlay');
  if (!overlay || itemsList.length === 0) return;

  const item = itemsList[currentIndex];

  overlay.innerHTML = `
    <button id="lightbox-close" style="position: absolute; top: 20px; right: 20px; font-size: 2rem; color: #fff; background: none; border: none; cursor: pointer;">✕</button>

    <div style="position: relative; max-width: 90vw; max-height: 80vh; display: flex; align-items: center; justify-content: center;">
      ${item.tipe === 'video' ? `
        <video src="${item.url}" controls autoplay style="max-width: 100%; max-height: 75vh; border-radius: 8px;"></video>
      ` : `
        <img src="${item.url}" alt="${item.judul || 'Foto'}" style="max-width: 100%; max-height: 75vh; object-fit: contain; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);" />
      `}
    </div>

    <div style="margin-top: 16px; text-align: center;">
      <h4 style="color: #fff; font-size: 1.2rem;">${item.judul || 'Foto Galeri'}</h4>
      <p style="color: rgba(255,255,255,0.7); font-size: 0.9rem;">${item.kategori || ''} (${currentIndex + 1} / ${itemsList.length})</p>
    </div>

    ${itemsList.length > 1 ? `
      <button id="lightbox-prev" style="position: absolute; left: 20px; font-size: 2.5rem; color: #fff; background: none; border: none; cursor: pointer; padding: 10px;">❮</button>
      <button id="lightbox-next" style="position: absolute; right: 20px; font-size: 2.5rem; color: #fff; background: none; border: none; cursor: pointer; padding: 10px;">❯</button>
    ` : ''}
  `;

  document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
  document.getElementById('lightbox-prev')?.addEventListener('click', prevLightboxItem);
  document.getElementById('lightbox-next')?.addEventListener('click', nextLightboxItem);
};

const nextLightboxItem = () => {
  if (itemsList.length <= 1) return;
  currentIndex = (currentIndex + 1) % itemsList.length;
  updateLightboxContent();
};

const prevLightboxItem = () => {
  if (itemsList.length <= 1) return;
  currentIndex = (currentIndex - 1 + itemsList.length) % itemsList.length;
  updateLightboxContent();
};

export const closeLightbox = () => {
  const overlay = document.getElementById('lightbox-overlay');
  if (overlay) overlay.remove();
};
