import {
  ScheduleItem,
  DissertationChapter,
  DissertationTask,
  VideoChecklistItem,
  RoutineItem,
  RouteItem,
  AppSettings,
  ChatMessage,
  TabType,
  BetterSpeakProfile,
} from '../types';

const STORAGE_KEYS = {
  ITEMS: 'laura_schedule_items',
  DISSERTATION_CHAPTERS: 'laura_dissertation_chapters',
  DISSERTATION_TASKS: 'laura_dissertation_tasks',
  VIDEO_CHECKLIST: 'laura_video_checklist',
  ROUTINES: 'laura_routines',
  ROUTES: 'laura_routes',
  SETTINGS: 'laura_settings',
  CHAT_HISTORY: 'laura_chat_history',
  ASSISTANT_MODE: 'laura_assistant_mode',
  LAST_ROUTINE_RESET: 'laura_last_routine_reset',
  BETTER_SPEAK_PROFILE: 'laura_betterspeak_profile',
};

export const DEFAULT_CHAPTERS: DissertationChapter[] = [
  {
    id: 1,
    name: 'Bab I: Pendahuluan',
    subtitle: 'Latar Belakang, Rumusan Masalah, Tujuan & Signifikansi Penelitian',
    progress: 85,
    notes: 'Revisi latar belakang sudah disetujui Promotor 1. Tambah data statistik mutakhir.',
  },
  {
    id: 2,
    name: 'Bab II: Kajian Teori',
    subtitle: 'Kajian Pustaka, Landasan Konseptual Pendidikan Islam, & Kerangka Berpikir',
    progress: 70,
    notes: 'Perkuat sintesis teori pedagogi transformatif dengan nilai-nilai tarbiyah Islamiyah.',
  },
  {
    id: 3,
    name: 'Bab III: Metode Penelitian',
    subtitle: 'Desain Kualitatif Fenomenologis, Teknik Observasi & Analisis Data',
    progress: 60,
    notes: 'Siapkan instrumen wawancara mendalam untuk para kyai dan pimpinan ma\'had.',
  },
  {
    id: 4,
    name: 'Bab IV: Hasil dan Pembahasan',
    subtitle: 'Temuan Empiris Lapangan, Analisis Tematik & Pembahasan Kritis',
    progress: 35,
    notes: 'Transkrip wawancara informan 1-5 selesai. Perlu triangulasi dokumen kurikulum.',
  },
  {
    id: 5,
    name: 'Bab V: Penutup',
    subtitle: 'Kesimpulan Menyeluruh, Implikasi Teoretis-Praktis & Saran/Rekomendasi',
    progress: 15,
    notes: 'Rancang poin rekomendasi kebijakan untuk Kementerian Agama & perguruan tinggi.',
  },
];

export const DEFAULT_VIDEO_CHECKLIST: VideoChecklistItem[] = [
  { id: 'vc-1', label: 'Rough cut & pemilahan footage', checked: false },
  { id: 'vc-2', label: 'Subtitle dan caption bilingual (ID/EN)', checked: false },
  { id: 'vc-3', label: 'Audio balancing & latar musik islami lembut', checked: false },
  { id: 'vc-4', label: 'Color grading & penyesuaian kontras', checked: false },
  { id: 'vc-5', label: 'Export 1080p / 4K 60fps format H.264', checked: false },
  { id: 'vc-6', label: 'Desain thumbnail menarik & judul SEO-friendly', checked: false },
];

export const DEFAULT_SETTINGS: AppSettings = {
  profile: {
    name: 'Pak Abdul',
    role: 'Dosen & Mahasiswa Doktoral Pendidikan Islam',
    institution: 'Institut PTIQ Jakarta',
    city: 'Jakarta (WIB)',
    latitude: -6.2088,
    longitude: 106.8456,
    timezone: 7,
  },
  geminiApiKey: '',
  selectedModel: 'gemini-3.8-flash',
  discoveredModels: ['gemini-3.8-flash', 'gemini-3.1-flash-lite'],
  autoVoiceEnabled: true,
  preferredIdVoice: '',
  preferredEnVoice: '',
  speechRate: 0.98,
  speechPitch: 1.0,
  useGeminiTTS: false,
  prayerRemindersEnabled: true,
  agendaRemindersEnabled: true,
  darkMode: false,
};

// Seed initial items for Pak Abdul
function getInitialItems(): ScheduleItem[] {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const in3Days = new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];
  const in7Days = new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0];
  const in12Days = new Date(Date.now() + 86400000 * 12).toISOString().split('T')[0];

  return [
    {
      id: 'item-1',
      category: 'mengajar',
      title: 'Kuliah Metodologi Studi Islam (Kelas A)',
      date: today,
      time: '09:00',
      note: 'Ruang Teater 302 / Diskusi bab Pendekatan Hermeneutika Al-Quran',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'item-2',
      category: 'mengajar',
      title: 'Bimbingan Akademik Mahasiswa S1',
      date: today,
      time: '13:30',
      note: 'Ruang Dosen Lt. 2 - Review 4 judul skripsi mahasiswa bimbingan',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'item-3',
      category: 'hari_ini',
      title: 'Konsultasi Disertasi dengan Promotor Utama',
      date: today,
      time: '16:00',
      note: 'Membahas bab IV dan instrumen triangulasi data kualitatif',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'item-4',
      category: 'mengajar',
      title: 'Seminar Proposal Skripsi Angkatan 2023',
      date: tomorrow,
      time: '10:00',
      note: 'Penguji pendamping untuk 3 mahasiswa',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'item-5',
      category: 'beasiswa',
      title: 'Beasiswa Indonesia Bangkit (BIB) Kemenag - Riset Doktoral',
      date: in7Days,
      time: '23:59',
      note: 'Submit proposal final, LoA promotor, dan rencana anggaran riset lapangan',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'item-6',
      category: 'beasiswa',
      title: 'LPDP Doktoral Completion Grant',
      date: in12Days,
      time: '17:00',
      note: 'Lengkapi surat keterangan progres disertasi dari Direktur Pascasarjana',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'item-7',
      category: 'upload',
      title: 'Kajian Pendek: Etika Belajar Mahasiswa Modern',
      date: in3Days,
      time: '19:30',
      note: 'Platform: YouTube & Instagram Reels #PendidikanIslam #KajianMahasiswa',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'item-8',
      category: 'referensi',
      title: 'Abdul Muhit (2026) - Communicative English for Muslim University Students: Semester 1 (Integrated Skills)',
      note: 'Buku Ajar Acuan English I PTIQ Jakarta (CEFR A1-A2, 8 Unit). Memadukan 4 keterampilan bahasa Inggris dengan nilai-nilai Qurani dan adab Ma’had.',
      createdAt: new Date().toISOString(),
      extra: {
        author: 'Abdul Muhit, M.Pd',
        year: '2026',
        link: '/assets/aistudio/ENGLISH-01_REVISED_d91bdfc6.pdf',
      },
    },
    {
      id: 'item-8b',
      category: 'referensi',
      title: 'Abdul Muhit (2026) - Communicative English for Muslim University Students: Semester 2 (Productive Skills)',
      note: 'Buku Ajar Acuan English II PTIQ Jakarta (CEFR A2, 8 Unit). Fokus pada Speaking & Academic Writing, strategi PREP, Shura, dan AI-assisted learning.',
      createdAt: new Date().toISOString(),
      extra: {
        author: 'Abdul Muhit, M.Pd',
        year: '2026',
        link: '/assets/aistudio/ENGLISH-02_REVISED_38467a48.pdf',
      },
    },
    {
      id: 'item-8c',
      category: 'referensi',
      title: 'Al-Attas, Syed Muhammad Naquib (1980) - The Concept of Education in Islam',
      note: 'Kutipan kunci: Konsep Ta\'dib sebagai fondasi epistemologi pendidikan holistik Islam.',
      createdAt: new Date().toISOString(),
      extra: {
        author: 'Syed Muhammad Naquib Al-Attas',
        year: '1980',
        link: 'https://scholar.google.com',
      },
    },
    {
      id: 'item-9',
      category: 'referensi',
      title: 'Fazlur Rahman (1982) - Islam and Modernity: Transformation of an Intellectual Tradition',
      note: 'Penting untuk kerangka berpikir Bab II: integrasi ilmu sains dan tradisi wahyu.',
      createdAt: new Date().toISOString(),
      extra: {
        author: 'Fazlur Rahman',
        year: '1982',
        link: 'https://press.uchicago.edu',
      },
    },
    {
      id: 'item-10',
      category: 'produk_digital',
      title: 'E-Book & Template Penulisan Skripsi/Tesis Cepat Selesai',
      note: 'Berisi panduan struktur bab, contoh sitasi APA 7th, dan tips wawancara riset.',
      completed: false,
      createdAt: new Date().toISOString(),
      extra: {
        stage: 'Penyusunan Konten (Draft 40%)',
      },
    },
  ];
}

const DEFAULT_ROUTINES: RoutineItem[] = [
  {
    id: 'rou-1',
    title: 'Zikir Pagi & Tilawah 1 Juz',
    time: '05:30',
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    note: 'Ketenangan batin dan berkah sebelum aktivitas akademik dimulai',
  },
  {
    id: 'rou-2',
    title: 'Membaca 2 Jurnal Scopus / Q1 Pendidikan',
    time: '07:30',
    daysOfWeek: [1, 2, 3, 4, 5],
    note: 'Mencari sintesis mutakhir untuk penguatan Bab II disertasi',
  },
  {
    id: 'rou-3',
    title: 'Olahraga Ringan / Jalan Kaki 20 Menit',
    time: '17:15',
    daysOfWeek: [1, 3, 5],
    note: 'Menjaga stamina tubuh di tengah padatnya riset dan mengajar',
  },
  {
    id: 'rou-4',
    title: 'Menulis Disertasi Minimal 500 Kata',
    time: '20:30',
    daysOfWeek: [0, 1, 2, 3, 4, 6],
    note: 'Konsistensi harian: jangan lewatkan satu hari tanpa menulis draft',
  },
  {
    id: 'rou-5',
    title: 'Latihan Percakapan Bahasa Inggris bersama Laura',
    time: '21:30',
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    note: 'Persiapan konferensi internasional & artikel prosiding Scopus',
  },
];

const DEFAULT_ROUTES: RouteItem[] = [
  {
    id: 'rute-1',
    label: 'Rumah ke Kampus Pascasarjana PTIQ',
    origin: '', // lokasi saat ini
    destination: 'Institut PTIQ Jakarta, Jl. Batan I No.2, Lebak Bulus, Jakarta Selatan',
    via: 'Jl. TB Simatupang',
    note: 'Cek kondisi ganjil-genap dan kemacetan jam 07:30 pagi',
  },
  {
    id: 'rute-2',
    label: 'Kampus ke Perpustakaan Nasional RI (Salemba/Merdeka Barat)',
    origin: 'Institut PTIQ Jakarta',
    destination: 'Perpustakaan Nasional Republik Indonesia, Jl. Medan Merdeka Barat No.11, Jakarta',
    note: 'Mencari manuskrip langka dan buku teks rujukan disertasi',
  },
  {
    id: 'rute-3',
    label: 'Kampus ke Kantor Kementerian Agama RI',
    origin: '',
    destination: 'Kementerian Agama RI, Jl. Lapangan Banteng Barat No.3-4, Jakarta Pusat',
    note: 'Koordinasi program beasiswa doktoral dan litbang dikti',
  },
];

const DEFAULT_DISSERTATION_TASKS: DissertationTask[] = [
  {
    id: 'dt-1',
    title: 'Pengesahan Instrumen Panduan Wawancara Mendalam oleh Promotor',
    targetDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
    completed: true,
    supervisorFeedback: 'Sudah bagus, tambahkan 2 butir pertanyaan terkait evaluasi kurikulum terpadu.',
  },
  {
    id: 'dt-2',
    title: 'Pengumpulan Data Lapangan Tahap II di 3 Pesantren Unggulan',
    targetDate: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
    completed: false,
    supervisorFeedback: 'Pastikan informan kunci (Dewan Masyaikh) bisa diwawancarai langsung.',
  },
  {
    id: 'dt-3',
    title: 'Draft Lengkap Bab IV Siap Uji Kelayakan Seminar Hasil',
    targetDate: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
    completed: false,
    supervisorFeedback: 'Fokuskan pada kebaruan (novelty) temuan model pembelajaran.',
  },
];

// Helper to safely read from localStorage
function safeRead<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Failed to parse ${key}`, e);
    return fallback;
  }
}

// Helper to safely write to localStorage
function safeWrite<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save ${key}`, e);
  }
}

// Storage Manager
export const StorageManager = {
  // Items
  getItems(): ScheduleItem[] {
    const items = safeRead<ScheduleItem[]>(STORAGE_KEYS.ITEMS, []);
    if (items.length === 0) {
      const initial = getInitialItems();
      safeWrite(STORAGE_KEYS.ITEMS, initial);
      return initial;
    }
    // Ensure English-01 and English-02 textbooks are present in references
    const hasEnglish01 = items.some((i) => i.extra?.link?.includes('ENGLISH-01'));
    const hasEnglish02 = items.some((i) => i.extra?.link?.includes('ENGLISH-02'));
    if (!hasEnglish01 || !hasEnglish02) {
      const initial = getInitialItems();
      const booksToAdd = initial.filter(
        (i) => (i.id === 'item-8' && !hasEnglish01) || (i.id === 'item-8b' && !hasEnglish02)
      );
      if (booksToAdd.length > 0) {
        items.unshift(...booksToAdd);
        safeWrite(STORAGE_KEYS.ITEMS, items);
      }
    }
    return items;
  },

  saveItems(items: ScheduleItem[]): void {
    safeWrite(STORAGE_KEYS.ITEMS, items);
  },

  addItem(item: Omit<ScheduleItem, 'id' | 'createdAt'>): ScheduleItem {
    const items = this.getItems();
    const newItem: ScheduleItem = {
      ...item,
      id: 'item-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      createdAt: new Date().toISOString(),
    };
    items.unshift(newItem);
    this.saveItems(items);
    return newItem;
  },

  updateItem(id: string, updates: Partial<ScheduleItem>): ScheduleItem | null {
    const items = this.getItems();
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...updates };
    this.saveItems(items);
    return items[idx];
  },

  deleteItem(id: string): boolean {
    const items = this.getItems();
    const filtered = items.filter((i) => i.id !== id);
    if (filtered.length !== items.length) {
      this.saveItems(filtered);
      return true;
    }
    return false;
  },

  // Dissertation Chapters
  getDissertationChapters(): DissertationChapter[] {
    const chapters = safeRead<DissertationChapter[]>(STORAGE_KEYS.DISSERTATION_CHAPTERS, []);
    if (chapters.length === 0) {
      safeWrite(STORAGE_KEYS.DISSERTATION_CHAPTERS, DEFAULT_CHAPTERS);
      return DEFAULT_CHAPTERS;
    }
    return chapters;
  },

  saveDissertationChapters(chapters: DissertationChapter[]): void {
    safeWrite(STORAGE_KEYS.DISSERTATION_CHAPTERS, chapters);
  },

  updateChapterProgress(id: number, progress: number, notes?: string): void {
    const chapters = this.getDissertationChapters();
    const c = chapters.find((ch) => ch.id === id);
    if (c) {
      c.progress = Math.max(0, Math.min(100, progress));
      if (notes !== undefined) c.notes = notes;
      this.saveDissertationChapters(chapters);
    }
  },

  // Dissertation Tasks
  getDissertationTasks(): DissertationTask[] {
    const tasks = safeRead<DissertationTask[]>(STORAGE_KEYS.DISSERTATION_TASKS, []);
    if (tasks.length === 0) {
      safeWrite(STORAGE_KEYS.DISSERTATION_TASKS, DEFAULT_DISSERTATION_TASKS);
      return DEFAULT_DISSERTATION_TASKS;
    }
    return tasks;
  },

  saveDissertationTasks(tasks: DissertationTask[]): void {
    safeWrite(STORAGE_KEYS.DISSERTATION_TASKS, tasks);
  },

  addDissertationTask(task: Omit<DissertationTask, 'id'>): DissertationTask {
    const tasks = this.getDissertationTasks();
    const newTask: DissertationTask = {
      ...task,
      id: 'dt-' + Date.now(),
    };
    tasks.push(newTask);
    this.saveDissertationTasks(tasks);
    return newTask;
  },

  deleteDissertationTask(id: string): void {
    const tasks = this.getDissertationTasks().filter((t) => t.id !== id);
    this.saveDissertationTasks(tasks);
  },

  // Video Checklist
  getVideoChecklist(): VideoChecklistItem[] {
    const list = safeRead<VideoChecklistItem[]>(STORAGE_KEYS.VIDEO_CHECKLIST, []);
    if (list.length === 0) {
      safeWrite(STORAGE_KEYS.VIDEO_CHECKLIST, DEFAULT_VIDEO_CHECKLIST);
      return DEFAULT_VIDEO_CHECKLIST;
    }
    return list;
  },

  saveVideoChecklist(list: VideoChecklistItem[]): void {
    safeWrite(STORAGE_KEYS.VIDEO_CHECKLIST, list);
  },

  resetVideoChecklist(): VideoChecklistItem[] {
    const reset = DEFAULT_VIDEO_CHECKLIST.map((item) => ({ ...item, checked: false }));
    this.saveVideoChecklist(reset);
    return reset;
  },

  // Routines
  getRoutines(): RoutineItem[] {
    const list = safeRead<RoutineItem[]>(STORAGE_KEYS.ROUTINES, []);
    const today = new Date().toISOString().split('T')[0];
    const lastReset = localStorage.getItem(STORAGE_KEYS.LAST_ROUTINE_RESET);

    // If day changed, uncheck routines
    let currentList = list.length === 0 ? DEFAULT_ROUTINES : list;
    if (lastReset !== today) {
      currentList = currentList.map((r) => {
        if (r.lastDoneDate !== today) {
          return { ...r, lastDoneDate: undefined };
        }
        return r;
      });
      localStorage.setItem(STORAGE_KEYS.LAST_ROUTINE_RESET, today);
      safeWrite(STORAGE_KEYS.ROUTINES, currentList);
    }
    return currentList;
  },

  saveRoutines(routines: RoutineItem[]): void {
    safeWrite(STORAGE_KEYS.ROUTINES, routines);
  },

  toggleRoutineDone(id: string): void {
    const list = this.getRoutines();
    const today = new Date().toISOString().split('T')[0];
    const item = list.find((r) => r.id === id);
    if (item) {
      item.lastDoneDate = item.lastDoneDate === today ? undefined : today;
      this.saveRoutines(list);
    }
  },

  // Routes
  getRoutes(): RouteItem[] {
    const routes = safeRead<RouteItem[]>(STORAGE_KEYS.ROUTES, []);
    if (routes.length === 0) {
      safeWrite(STORAGE_KEYS.ROUTES, DEFAULT_ROUTES);
      return DEFAULT_ROUTES;
    }
    return routes;
  },

  saveRoutes(routes: RouteItem[]): void {
    safeWrite(STORAGE_KEYS.ROUTES, routes);
  },

  addRoute(route: Omit<RouteItem, 'id'>): RouteItem {
    const routes = this.getRoutes();
    const newRoute: RouteItem = {
      ...route,
      id: 'route-' + Date.now(),
    };
    routes.push(newRoute);
    this.saveRoutes(routes);
    return newRoute;
  },

  deleteRoute(id: string): void {
    const routes = this.getRoutes().filter((r) => r.id !== id);
    this.saveRoutes(routes);
  },

  // Settings
  getSettings(): AppSettings {
    const settings = safeRead<AppSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    return { ...DEFAULT_SETTINGS, ...settings, profile: { ...DEFAULT_SETTINGS.profile, ...(settings.profile || {}) } };
  },

  saveSettings(settings: AppSettings): void {
    safeWrite(STORAGE_KEYS.SETTINGS, settings);
  },

  // Chat History
  getChatHistory(): ChatMessage[] {
    return safeRead<ChatMessage[]>(STORAGE_KEYS.CHAT_HISTORY, []);
  },

  saveChatHistory(history: ChatMessage[]): void {
    // Keep last 40 messages in local storage
    const trimmed = history.slice(-40);
    safeWrite(STORAGE_KEYS.CHAT_HISTORY, trimmed);
  },

  clearChatHistory(): void {
    localStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
  },

  // Mode
  getAssistantMode(): 'assistant' | 'tutor' {
    return (localStorage.getItem(STORAGE_KEYS.ASSISTANT_MODE) as 'assistant' | 'tutor') || 'assistant';
  },

  saveAssistantMode(mode: 'assistant' | 'tutor'): void {
    localStorage.setItem(STORAGE_KEYS.ASSISTANT_MODE, mode);
  },

  // BetterSpeak Profile & Quiz Data
  getBetterSpeakProfile(): BetterSpeakProfile | null {
    return safeRead<BetterSpeakProfile | null>(STORAGE_KEYS.BETTER_SPEAK_PROFILE, null);
  },

  saveBetterSpeakProfile(profile: BetterSpeakProfile): void {
    safeWrite(STORAGE_KEYS.BETTER_SPEAK_PROFILE, profile);
  },

  // JSON Export / Import
  exportFullBackup(): string {
    const backupData = {
      version: 1,
      appName: 'Laura-Personal Assistance',
      exportedAt: new Date().toISOString(),
      items: this.getItems(),
      chapters: this.getDissertationChapters(),
      tasks: this.getDissertationTasks(),
      videoChecklist: this.getVideoChecklist(),
      routines: this.getRoutines(),
      routes: this.getRoutes(),
      settings: this.getSettings(),
      chatHistory: this.getChatHistory(),
    };
    return JSON.stringify(backupData, null, 2);
  },

  importFullBackup(jsonString: string): { success: boolean; message: string } {
    try {
      const data = JSON.parse(jsonString);
      if (!data || typeof data !== 'object') {
        return { success: false, message: 'Format file JSON tidak valid' };
      }
      if (Array.isArray(data.items)) this.saveItems(data.items);
      if (Array.isArray(data.chapters)) this.saveDissertationChapters(data.chapters);
      if (Array.isArray(data.tasks)) this.saveDissertationTasks(data.tasks);
      if (Array.isArray(data.videoChecklist)) this.saveVideoChecklist(data.videoChecklist);
      if (Array.isArray(data.routines)) this.saveRoutines(data.routines);
      if (Array.isArray(data.routes)) this.saveRoutes(data.routes);
      if (data.settings && typeof data.settings === 'object') this.saveSettings(data.settings);
      if (Array.isArray(data.chatHistory)) this.saveChatHistory(data.chatHistory);

      return { success: true, message: 'Data cadangan berhasil dipulihkan secara lengkap!' };
    } catch (e: any) {
      return { success: false, message: 'Gagal memproses file backup: ' + (e?.message || 'Error parsing') };
    }
  },
};
