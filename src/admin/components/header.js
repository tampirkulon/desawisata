// Admin Top Header Component

export const renderAdminHeader = (pageTitle = 'Dashboard') => {
  return `
    <header class="h-20 flex-shrink-0 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between z-30 shadow-sm">
      <!-- Left: Search Pill Input -->
      <div class="flex items-center gap-4 flex-1 max-w-md">
        <div class="relative w-full">
          <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
          <input 
            type="text" 
            placeholder="Cari di admin..." 
            class="w-full bg-slate-100/80 hover:bg-slate-100 text-slate-700 placeholder-slate-400 text-xs font-medium pl-10 pr-12 py-2.5 rounded-full outline-none border border-transparent focus:border-[#316342] focus:bg-white transition-all shadow-inner"
          />
          <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 bg-white px-1.5 py-0.5 rounded-md border border-slate-200 shadow-2xs">⌘F</span>
        </div>
      </div>

      <!-- Right: Action Buttons, Notifications & User Profile -->
      <div class="flex items-center gap-5">
        <!-- Notification Icons -->
        <div class="flex items-center gap-2 border-r border-slate-200 pr-5">
          <button title="Pesan" class="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors relative">
            <span class="material-symbols-outlined text-lg">mail</span>
          </button>
          <button title="Notifikasi" class="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors relative">
            <span class="material-symbols-outlined text-lg">notifications</span>
            <span class="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
          </button>
        </div>

        <!-- User Profile Card -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-[#316342] text-white flex items-center justify-center font-bold text-sm shadow-md ring-2 ring-emerald-100">
            P
          </div>
          <div class="hidden sm:flex flex-col">
            <span class="text-xs font-bold text-slate-800 leading-tight">Pengelola Desa</span>
            <span class="text-[11px] font-medium text-slate-400">admin@tampirkulon.id</span>
          </div>
        </div>
      </div>
    </header>
  `;
};

