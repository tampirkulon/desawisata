import { supabase, isSupabaseConfigured } from '../../lib/supabase.js';
import { showToast } from '../../components/toast.js';

export const renderImageUploader = (inputId, currentUrl = '') => {
  return `
    <div class="form-group">
      <label class="form-label">Upload Gambar / Media</label>
      <input type="hidden" id="${inputId}" value="${currentUrl}" />
      
      <div class="dropzone" id="${inputId}-dropzone">
        <p style="font-size: 0.9rem; color: var(--neutral-600); margin-bottom: 8px;">
          📁 Drag & Drop file gambar di sini atau <span style="color: var(--primary-500); font-weight: 600;">Pilih File</span>
        </p>
        <span style="font-size: 0.75rem; color: var(--neutral-600);">Maksimal 5MB (JPG, PNG, WebP)</span>
        <input type="file" id="${inputId}-file-input" accept="image/*" style="display: none;" />
      </div>

      <div id="${inputId}-preview" style="margin-top: 12px; ${currentUrl ? '' : 'display: none;'}">
        <img src="${currentUrl}" id="${inputId}-preview-img" style="height: 120px; border-radius: var(--radius-md); object-fit: cover; border: 1px solid var(--neutral-200);" />
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

  dropzone.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Ukuran file maksimal 5MB', 'error');
      return;
    }

    if (isSupabaseConfigured()) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${folderPath}/${fileName}`;

        showToast('Mengunggah gambar ke Supabase Storage...', 'info');

        const { data, error } = await supabase.storage.from('images').upload(filePath, file);

        if (error) throw error;

        const { data: publicUrlData } = supabase.storage.from('images').getPublicUrl(filePath);
        const url = publicUrlData.publicUrl;

        hiddenInput.value = url;
        previewImg.src = url;
        previewContainer.style.display = 'block';
        showToast('Gambar berhasil diunggah!', 'success');
      } catch (err) {
        console.error('Storage error:', err);
        showToast('Gagal upload gambar: ' + err.message, 'error');
      }
    } else {
      // Offline fallback: Use object URL
      const tempUrl = URL.createObjectURL(file);
      hiddenInput.value = tempUrl;
      previewImg.src = tempUrl;
      previewContainer.style.display = 'block';
      showToast('[Demo Mode] Gambar diunggah secara lokal.', 'success');
    }
  });
};
