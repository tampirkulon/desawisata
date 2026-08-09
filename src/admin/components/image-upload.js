import { supabase, isSupabaseConfigured } from '../../lib/supabase.js';
import { showToast } from '../../components/toast.js';
import { convertImageToWebP } from '../../utils/image-converter.js';

export const renderImageUploader = (inputId, currentUrl = '') => {
  return `
    <div class="form-group">
      <label class="form-label">Upload Gambar / Media</label>
      <input type="hidden" id="${inputId}" value="${currentUrl}" />
      
      <div class="dropzone" id="${inputId}-dropzone">
        <p style="font-size: 0.9rem; color: var(--neutral-600); margin-bottom: 8px;">
          <span class="material-symbols-outlined text-xl align-middle mr-1">cloud_upload</span>
          Drag & Drop file gambar di sini atau <span style="color: var(--primary); font-weight: 600;">Pilih File</span>
        </p>
        <span style="font-size: 0.75rem; color: var(--neutral-600);">Maksimal 5MB • Otomatis dikonversi ke format <strong>WebP</strong></span>
        <input type="file" id="${inputId}-file-input" accept="image/*" style="display: none;" />
      </div>

      <div id="${inputId}-preview" style="margin-top: 12px; ${currentUrl ? '' : 'display: none;'}">
        <img src="${currentUrl}" id="${inputId}-preview-img" style="height: 120px; border-radius: var(--radius-md); object-fit: cover; border: 1px solid var(--neutral-200);" />
        <div id="${inputId}-webp-badge" style="margin-top: 4px; font-size: 0.75rem; color: #316342; font-weight: 600;">Format: WebP Optimized</div>
      </div>
    </div>
  `;
};

export const initImageUploaderEvents = (inputId, folderPath = 'uploads') => {
  const dropzone = document.getElementById(`${inputId}-dropzone`);
  const fileInput = document.getElementById(`${inputId}-file-input`);
  const hiddenInput = document.getElementById(inputId);
  const previewContainer = document.getElementById(`${inputId}-preview`);
  const previewImg = document.getElementById(`${inputId}-preview-img`);

  if (!dropzone || !fileInput) return;

  const processFile = async (rawFile) => {
    if (!rawFile) return;

    if (rawFile.size > 10 * 1024 * 1024) {
      showToast('Ukuran file maksimal 10MB', 'error');
      return;
    }

    showToast('Mengonversi gambar ke format WebP...', 'info');

    // Automatically convert any image format (JPG, PNG, GIF, BMP) to optimized WebP
    const { file: webpFile, savingsPercent, dataUrl } = await convertImageToWebP(rawFile);

    if (isSupabaseConfigured() && supabase) {
      try {
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.webp`;
        const filePath = `${folderPath}/${fileName}`;

        const { error } = await supabase.storage.from('images').upload(filePath, webpFile, {
          contentType: 'image/webp',
          upsert: true,
        });

        if (error) throw error;

        const { 
         } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);

        const imageUrl = publicUrlData.publicUrl;

        hiddenInput.value = imageUrl;
        previewImg.src = imageUrl;
        previewContainer.style.display = 'block';
        showToast(`Gambar berhasil dikonversi ke WebP${savingsPercent > 0 ? ` (hemat ${savingsPercent}%)` : ''} & diunggah!`, 'success');
      } catch (err) {
        console.error('Storage upload error, using WebP Data URL fallback:', err);
        
        // Fallback to WebP Data URL
        hiddenInput.value = dataUrl;
        previewImg.src = dataUrl;
        previewContainer.style.display = 'block';
        showToast(`Gambar dikonversi ke WebP${savingsPercent > 0 ? ` (hemat ${savingsPercent}%)` : ''} & siap disimpan!`, 'success');
      }
    } else {
      // Demo / offline mode: use WebP Data URL
      hiddenInput.value = dataUrl;
      previewImg.src = dataUrl;
      previewContainer.style.display = 'block';
      showToast(`[Demo] Gambar dikonversi ke format WebP${savingsPercent > 0 ? ` (hemat ${savingsPercent}%)` : ''}.`, 'success');
    }
  };

  dropzone.addEventListener('click', () => fileInput.click());

  // --- DRAG & DROP EVENT LISTENERS ---
  const setDragHighlight = (active) => {
    if (active) {
      dropzone.style.borderColor = '#316342';
      dropzone.style.backgroundColor = '#ecfdf5';
      dropzone.style.transform = 'scale(1.02)';
      dropzone.style.boxShadow = '0 10px 25px -5px rgba(49, 99, 66, 0.15)';
    } else {
      dropzone.style.borderColor = '';
      dropzone.style.backgroundColor = '';
      dropzone.style.transform = '';
      dropzone.style.boxShadow = '';
    }
  };

  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragHighlight(true);
    });
  });

  ['dragleave', 'dragend'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragHighlight(false);
    });
  });

  dropzone.addEventListener('drop', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragHighlight(false);

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  });

  fileInput.addEventListener('change', async (e) => {
    const rawFile = e.target.files[0];
    await processFile(rawFile);
  });
};
