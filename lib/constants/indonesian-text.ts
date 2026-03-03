/**
 * Indonesian Language Constants
 * Centralized text content for the E-Health Education Pneumonia Balita application
 */

// ============================================================================
// ERROR MESSAGES
// ============================================================================

export const ERROR_MESSAGES = {
  // Authentication errors
  INVALID_EMAIL: 'Format email tidak valid',
  INVALID_CREDENTIALS: 'Email atau password salah',
  UNAUTHORIZED: 'Anda tidak memiliki akses',
  TOKEN_EXPIRED: 'Sesi Anda telah berakhir, silakan login kembali',
  TOKEN_INVALID: 'Token tidak valid',
  
  // Profile errors
  PROFILE_NOT_FOUND: 'Profil tidak ditemukan',
  PROFILE_ALREADY_EXISTS: 'Profil sudah ada',
  INVALID_PROFILE_DATA: 'Data profil tidak valid',
  
  // Test errors
  TEST_ALREADY_COMPLETED: 'Tes sudah diselesaikan sebelumnya',
  INVALID_ANSWERS: 'Jawaban tidak valid',
  INCOMPLETE_ANSWERS: 'Harap jawab semua pertanyaan',
  PRE_TEST_REQUIRED: 'Harap selesaikan pre-test terlebih dahulu',
  
  // Session errors
  SESSION_LOCKED: 'Sesi masih terkunci',
  SESSION_NOT_FOUND: 'Sesi tidak ditemukan',
  INVALID_SESSION_DAY: 'Nomor hari sesi tidak valid',
  PREVIOUS_SESSION_INCOMPLETE: 'Harap selesaikan sesi sebelumnya',
  SESSION_ALREADY_COMPLETED: 'Sesi sudah diselesaikan sebelumnya',
  
  // Admin errors
  ADMIN_NOT_FOUND: 'Admin tidak ditemukan',
  INSUFFICIENT_PERMISSIONS: 'Anda tidak memiliki izin untuk aksi ini',
  
  // Network errors
  NETWORK_ERROR: 'Koneksi gagal, silakan coba lagi',
  SERVER_ERROR: 'Terjadi kesalahan server',
  TIMEOUT: 'Permintaan timeout, silakan coba lagi',
  UNKNOWN_ERROR: 'Terjadi kesalahan yang tidak diketahui',
  
  // Form validation
  FORM_VALIDATION: 'Harap periksa kembali form Anda',
  REQUIRED_FIELD: 'Field ini wajib diisi',
  INVALID_FORMAT: 'Format tidak valid',
} as const

// ============================================================================
// SUCCESS MESSAGES
// ============================================================================

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login berhasil',
  PROFILE_CREATED: 'Profil berhasil dibuat',
  PROFILE_UPDATED: 'Profil berhasil diperbarui',
  PRE_TEST_COMPLETED: 'Pre-test berhasil diselesaikan',
  POST_TEST_COMPLETED: 'Post-test berhasil diselesaikan',
  SESSION_COMPLETED: 'Sesi berhasil diselesaikan',
  ALL_SESSIONS_COMPLETED: 'Selamat! Anda telah menyelesaikan semua sesi pembelajaran. Post-test sekarang tersedia.',
} as const

// ============================================================================
// BUTTON LABELS
// ============================================================================

export const BUTTON_LABELS = {
  // Navigation
  BACK: 'Kembali',
  BACK_TO_DASHBOARD: 'Kembali ke Dashboard',
  NEXT: 'Lanjutkan',
  CONTINUE: 'Lanjutkan',
  START: 'Mulai',
  FINISH: 'Selesai',
  COMPLETE: 'Selesaikan',
  
  // Actions
  SUBMIT: 'Kirim',
  SUBMIT_ANSWERS: 'Kirim Jawaban',
  SAVE: 'Simpan',
  CANCEL: 'Batal',
  DELETE: 'Hapus',
  EDIT: 'Edit',
  EXPORT: 'Ekspor',
  DOWNLOAD: 'Unduh',
  
  // Authentication
  LOGIN: 'Masuk',
  LOGOUT: 'Keluar',
  
  // Tests
  START_PRE_TEST: 'Mulai Pre-Test',
  START_POST_TEST: 'Mulai Post-Test',
  
  // Sessions
  START_SESSION: 'Mulai Sesi',
  CONTINUE_SESSION: 'Lanjutkan Sesi',
  COMPLETE_SESSION: 'Selesaikan Sesi',
} as const

// ============================================================================
// FORM LABELS
// ============================================================================

export const FORM_LABELS = {
  // Authentication
  EMAIL: 'Email',
  PASSWORD: 'Password',
  
  // Mother Profile
  MOTHER_NAME: 'Nama Ibu',
  MOTHER_AGE: 'Usia Ibu',
  MOTHER_RELIGION: 'Agama',
  MOTHER_OCCUPATION: 'Pekerjaan',
  MOTHER_ADDRESS: 'Alamat',
  MOTHER_PHONE: 'Nomor Telepon',
  
  // Child Profile
  CHILD_NAME: 'Nama Anak',
  CHILD_BIRTH_DATE: 'Tanggal Lahir Anak',
  CHILD_GENDER: 'Jenis Kelamin',
  CHILD_GENDER_MALE: 'Laki-laki',
  CHILD_GENDER_FEMALE: 'Perempuan',
} as const

// ============================================================================
// FORM PLACEHOLDERS
// ============================================================================

export const FORM_PLACEHOLDERS = {
  EMAIL: 'nama@email.com',
  PASSWORD: 'Masukkan password',
  MOTHER_NAME: 'Masukkan nama ibu',
  MOTHER_AGE: 'Masukkan usia',
  MOTHER_RELIGION: 'Pilih agama',
  MOTHER_OCCUPATION: 'Masukkan pekerjaan',
  MOTHER_ADDRESS: 'Masukkan alamat lengkap',
  MOTHER_PHONE: 'Contoh: 081234567890',
  CHILD_NAME: 'Masukkan nama anak',
  CHILD_BIRTH_DATE: 'DD/MM/YYYY',
} as const

// ============================================================================
// VALIDATION MESSAGES
// ============================================================================

export const VALIDATION_MESSAGES = {
  // Email
  EMAIL_REQUIRED: 'Email wajib diisi',
  EMAIL_INVALID: 'Format email tidak valid',
  EMAIL_TOO_LONG: 'Email terlalu panjang',
  
  // Password
  PASSWORD_REQUIRED: 'Password wajib diisi',
  PASSWORD_TOO_SHORT: 'Password minimal 8 karakter',
  PASSWORD_TOO_LONG: 'Password maksimal 100 karakter',
  
  // Mother Profile
  MOTHER_NAME_REQUIRED: 'Nama ibu wajib diisi',
  MOTHER_NAME_TOO_SHORT: 'Nama ibu minimal 2 karakter',
  MOTHER_NAME_TOO_LONG: 'Nama ibu maksimal 255 karakter',
  MOTHER_AGE_REQUIRED: 'Usia ibu wajib diisi',
  MOTHER_AGE_MIN: 'Usia ibu minimal 15 tahun',
  MOTHER_AGE_MAX: 'Usia ibu maksimal 100 tahun',
  MOTHER_RELIGION_REQUIRED: 'Agama wajib diisi',
  MOTHER_OCCUPATION_REQUIRED: 'Pekerjaan wajib diisi',
  MOTHER_ADDRESS_REQUIRED: 'Alamat wajib diisi',
  MOTHER_PHONE_REQUIRED: 'Nomor telepon wajib diisi',
  MOTHER_PHONE_INVALID: 'Format nomor telepon tidak valid',
  
  // Child Profile
  CHILD_NAME_REQUIRED: 'Nama anak wajib diisi',
  CHILD_NAME_TOO_SHORT: 'Nama anak minimal 2 karakter',
  CHILD_NAME_TOO_LONG: 'Nama anak maksimal 255 karakter',
  CHILD_BIRTH_DATE_REQUIRED: 'Tanggal lahir anak wajib diisi',
  CHILD_BIRTH_DATE_INVALID: 'Format tanggal tidak valid',
  CHILD_BIRTH_DATE_FUTURE: 'Tanggal lahir tidak boleh di masa depan',
  CHILD_BIRTH_DATE_TOO_OLD: 'Anak harus berusia maksimal 5 tahun',
  CHILD_GENDER_REQUIRED: 'Jenis kelamin wajib diisi',
} as const

// ============================================================================
// PAGE TITLES
// ============================================================================

export const PAGE_TITLES = {
  LANDING: 'E-Health Education Pneumonia Balita',
  LOGIN: 'Masuk',
  ADMIN_LOGIN: 'Login Admin',
  PROFILE_SETUP: 'Lengkapi Profil',
  DASHBOARD: 'Dashboard',
  PRE_TEST: 'Pre-Test',
  POST_TEST: 'Post-Test',
  SESSION: 'Sesi Pembelajaran',
  RESULTS: 'Hasil Pembelajaran',
  ADMIN_DASHBOARD: 'Dashboard Admin',
  ADMIN_RESPONDENTS: 'Data Responden',
  ADMIN_QUESTIONS: 'Kelola Pertanyaan',
} as const

// ============================================================================
// PAGE DESCRIPTIONS
// ============================================================================

export const PAGE_DESCRIPTIONS = {
  LOGIN: 'Masuk dengan email Anda untuk memulai pembelajaran',
  ADMIN_LOGIN: 'Masuk sebagai admin untuk mengelola data',
  PROFILE_SETUP: 'Isi data diri Anda dan anak untuk melanjutkan pembelajaran',
  DASHBOARD: 'Pantau progress pembelajaran Anda',
  PRE_TEST: 'Ukur pengetahuan awal Anda tentang pneumonia balita',
  POST_TEST: 'Ukur peningkatan pengetahuan Anda setelah pembelajaran',
  SESSION: 'Pelajari materi tentang pneumonia balita',
} as const

// ============================================================================
// INSTRUCTIONS
// ============================================================================

export const INSTRUCTIONS = {
  PROFILE_MOTHER_SECTION: 'Data Ibu',
  PROFILE_CHILD_SECTION: 'Data Anak',
  PROFILE_STEP_1_INSTRUCTION: 'Isi data diri Anda sebagai ibu. Semua informasi bersifat rahasia.',
  PROFILE_STEP_2_INSTRUCTION: 'Isi data anak Anda. Informasi ini digunakan untuk keperluan penelitian.',
  
  TEST_ANSWER_ALL: 'Harap jawab semua pertanyaan sebelum mengirim',
  TEST_ALL_ANSWERED: 'Semua pertanyaan terjawab. Klik "Kirim Jawaban" untuk selesai.',
  TEST_QUESTION_OF: 'Pertanyaan {current} dari {total}',
  TEST_PRE_INSTRUCTION: 'Jawab 23 pertanyaan untuk mengukur pengetahuan awal Anda tentang pneumonia balita. Tidak ada jawaban benar atau salah.',
  TEST_POST_INSTRUCTION: 'Jawab 23 pertanyaan yang sama untuk melihat peningkatan pengetahuan Anda setelah pembelajaran.',
  TEST_NAVIGATE_INSTRUCTION: 'Gunakan tombol navigasi atau klik nomor pertanyaan untuk berpindah antar soal.',
  
  SESSION_LOCKED: 'Sesi ini akan terbuka dalam',
  SESSION_COMPLETE_TO_UNLOCK: 'Selesaikan sesi sebelumnya untuk membuka sesi ini',
  SESSION_READ_INSTRUCTION: 'Baca seluruh materi pembelajaran dengan seksama. Scroll ke bawah untuk melanjutkan.',
  SESSION_COMPLETE_INSTRUCTION: 'Setelah membaca semua materi, klik tombol "Selesaikan Sesi" di bawah.',
  
  DASHBOARD_START_INSTRUCTION: 'Mulai perjalanan pembelajaran Anda dengan mengikuti Pre-Test terlebih dahulu.',
  DASHBOARD_CONTINUE_INSTRUCTION: 'Lanjutkan pembelajaran Anda dengan mengklik sesi yang tersedia.',
  DASHBOARD_LOCKED_INSTRUCTION: 'Sesi berikutnya akan terbuka setelah 24 jam dari penyelesaian sesi sebelumnya.',
  
  GOOGLE_LOGIN: 'Gunakan akun Google Anda untuk melanjutkan',
} as const

// ============================================================================
// STATUS LABELS
// ============================================================================

export const STATUS_LABELS = {
  ACTIVE: 'Aktif',
  COMPLETED: 'Selesai',
  LOCKED: 'Terkunci',
  IN_PROGRESS: 'Sedang Berjalan',
  NOT_STARTED: 'Belum Mulai',
  AVAILABLE: 'Tersedia',
} as const

// ============================================================================
// DASHBOARD TEXT
// ============================================================================

export const DASHBOARD_TEXT = {
  GREETING: 'Selamat datang',
  PROGRESS_TITLE: 'Progress Pembelajaran',
  PROGRESS_COMPLETE: 'Selesai',
  
  // Motivational tips
  MOTIVATION_START: 'Mulai perjalanan Anda dengan Pre-Test untuk mengukur pengetahuan awal!',
  MOTIVATION_EARLY: 'Langkah pertama sudah dimulai! Terus semangat belajar untuk kesehatan si kecil.',
  MOTIVATION_MID: 'Hebat! Anda sudah di tengah perjalanan. Konsistensi adalah kunci kesuksesan.',
  MOTIVATION_LATE: 'Luar biasa! Anda hampir menyelesaikan program. Jangan berhenti sekarang!',
  MOTIVATION_ALMOST: 'Tinggal sedikit lagi! Selesaikan Post-Test untuk melihat peningkatan Anda.',
  MOTIVATION_COMPLETE: 'Selamat! Anda telah menyelesaikan seluruh program pembelajaran!',
  
  // Section titles
  PRE_TEST_SECTION: 'Pre-Test',
  PRE_TEST_DESCRIPTION: 'Ukur pengetahuan awal Anda',
  POST_TEST_SECTION: 'Post-Test',
  POST_TEST_DESCRIPTION: 'Ukur peningkatan pengetahuan Anda',
  SESSIONS_SECTION: 'Sesi Pembelajaran',
  
  // Next session card
  CONTINUE_LEARNING: 'Lanjutkan Belajar',
  
  // Completion card
  CONGRATULATIONS: 'Selamat!',
  PROGRAM_COMPLETED: 'Program pembelajaran selesai',
} as const

// ============================================================================
// SESSION TITLES
// ============================================================================

export const SESSION_TITLES = {
  DAY_1: 'Pengenalan Pneumonia',
  DAY_2: 'Mengenali Gejala',
  DAY_3: 'Pengobatan & Komplikasi',
  DAY_4: 'Praktik di Rumah',
  DAY_5: 'Evaluasi',
} as const

// ============================================================================
// RESULTS PAGE TEXT
// ============================================================================

export const RESULTS_TEXT = {
  TITLE: 'Hasil Pembelajaran Anda',
  CONGRATULATIONS: 'Selamat!',
  COMPLETION_MESSAGE: 'Anda telah menyelesaikan seluruh program pembelajaran',
  
  PRE_TEST_SCORE: 'Skor Pre-Test',
  POST_TEST_SCORE: 'Skor Post-Test',
  IMPROVEMENT: 'Peningkatan',
  SCORE_OUT_OF: 'dari 23',
  
  IMPROVEMENT_POSITIVE: 'Luar biasa! Pengetahuan Anda meningkat',
  IMPROVEMENT_NEUTRAL: 'Anda telah menyelesaikan program dengan baik',
  IMPROVEMENT_NEGATIVE: 'Terus belajar dan tingkatkan pemahaman Anda',
} as const

// ============================================================================
// ADMIN PANEL TEXT
// ============================================================================

export const ADMIN_TEXT = {
  // Dashboard stats
  TOTAL_USERS: 'Total Pengguna',
  PRE_TEST_COMPLETED: 'Pre-Test Selesai',
  POST_TEST_COMPLETED: 'Post-Test Selesai',
  AVG_PRE_SCORE: 'Rata-rata Skor Pre-Test',
  AVG_POST_SCORE: 'Rata-rata Skor Post-Test',
  
  USERS_REGISTERED: 'Pengguna terdaftar',
  PRE_TESTS_COMPLETED: 'Tes awal diselesaikan',
  POST_TESTS_COMPLETED: 'Tes akhir diselesaikan',
  AVERAGE_SCORE: 'Skor rata-rata',
  
  // Respondents page
  RESPONDENTS_TITLE: 'Data Responden',
  SEARCH_PLACEHOLDER: 'Cari nama ibu atau anak...',
  FILTER_ALL: 'Semua',
  FILTER_COMPLETED: 'Selesai',
  FILTER_IN_PROGRESS: 'Sedang Berjalan',
  FILTER_NOT_STARTED: 'Belum Mulai',
  
  EXPORT_DATA: 'Ekspor Data',
  EXPORTING: 'Mengekspor...',
  
  // Table headers
  MOTHER_NAME: 'Nama Ibu',
  CHILD_NAME: 'Nama Anak',
  EMAIL: 'Email',
  PRE_SCORE: 'Skor Pre-Test',
  POST_SCORE: 'Skor Post-Test',
  SESSIONS_COMPLETED: 'Sesi Selesai',
  STATUS: 'Status',
  ACTIONS: 'Aksi',
  
  // Questions page
  QUESTIONS_TITLE: 'Kelola Pertanyaan Kuis',
  ADD_QUESTION: 'Tambah Pertanyaan',
  EDIT_QUESTION: 'Edit Pertanyaan',
  DELETE_QUESTION: 'Hapus Pertanyaan',
  QUESTION_TEXT: 'Teks Pertanyaan',
  CORRECT_ANSWER: 'Jawaban Benar',
  QUESTION_ORDER: 'Urutan',
  
  TRUE: 'Benar',
  FALSE: 'Salah',
} as const

// ============================================================================
// TIME FORMATTING
// ============================================================================

export const TIME_TEXT = {
  HOURS: 'jam',
  MINUTES: 'menit',
  SECONDS: 'detik',
  DAYS: 'hari',
  
  HOURS_SHORT: 'j',
  MINUTES_SHORT: 'm',
  SECONDS_SHORT: 'd',
  
  REMAINING: 'tersisa',
  AGO: 'yang lalu',
} as const

// ============================================================================
// COMMON TEXT
// ============================================================================

export const COMMON_TEXT = {
  YES: 'Ya',
  NO: 'Tidak',
  TRUE: 'Benar',
  FALSE: 'Salah',
  LOADING: 'Memuat...',
  SAVING: 'Menyimpan...',
  SUBMITTING: 'Mengirim...',
  PROCESSING: 'Memproses...',
  PLEASE_WAIT: 'Mohon tunggu...',
  
  OR: 'atau',
  AND: 'dan',
  
  REQUIRED: 'Wajib diisi',
  OPTIONAL: 'Opsional',
  
  SCORE: 'Skor',
  TOTAL: 'Total',
  OF: 'dari',
  
  DATE: 'Tanggal',
  TIME: 'Waktu',
  
  SEARCH: 'Cari',
  FILTER: 'Filter',
  SORT: 'Urutkan',
  
  VIEW_DETAILS: 'Lihat Detail',
  CLOSE: 'Tutup',
  CONFIRM: 'Konfirmasi',
} as const

// ============================================================================
// LANDING PAGE TEXT
// ============================================================================

export const LANDING_TEXT = {
  HERO_TITLE: 'Lindungi Si Kecil dari Pneumonia',
  HERO_SUBTITLE: 'Program pembelajaran 5 hari untuk memahami, mencegah, dan menangani pneumonia pada balita',
  HERO_CTA: 'Mulai Belajar Sekarang',
  
  TRUST_TITLE: 'Dipercaya oleh Ribuan Ibu',
  
  HOW_IT_WORKS_TITLE: 'Cara Kerja Program',
  HOW_IT_WORKS_STEP_1: 'Pre-Test',
  HOW_IT_WORKS_STEP_1_DESC: 'Ukur pengetahuan awal Anda',
  HOW_IT_WORKS_STEP_2: 'Pembelajaran 5 Hari',
  HOW_IT_WORKS_STEP_2_DESC: 'Materi terstruktur dengan video dan gambar',
  HOW_IT_WORKS_STEP_3: 'Post-Test',
  HOW_IT_WORKS_STEP_3_DESC: 'Lihat peningkatan pengetahuan Anda',
  
  BENEFITS_TITLE: 'Manfaat Program',
  BENEFIT_1: 'Materi Lengkap',
  BENEFIT_1_DESC: 'Pelajari semua aspek pneumonia balita',
  BENEFIT_2: 'Fleksibel',
  BENEFIT_2_DESC: 'Belajar kapan saja, di mana saja',
  BENEFIT_3: 'Terukur',
  BENEFIT_3_DESC: 'Lihat peningkatan pengetahuan Anda',
  
  CTA_TITLE: 'Siap Melindungi Si Kecil?',
  CTA_SUBTITLE: 'Bergabunglah dengan ribuan ibu yang telah belajar',
  CTA_BUTTON: 'Mulai Sekarang',
  
  FOOTER_CONTACT: 'Kontak',
  FOOTER_ABOUT: 'Tentang',
  FOOTER_PRIVACY: 'Privasi',
  FOOTER_TERMS: 'Syarat & Ketentuan',
} as const

// ============================================================================
// ANSWER OPTIONS
// ============================================================================

export const ANSWER_OPTIONS = {
  TRUE: 'Benar',
  FALSE: 'Salah',
} as const

// ============================================================================
// EXPORT HELPERS
// ============================================================================

// Helper function to get session completion message
export const getSessionCompletionMessage = (day: number): string => {
  if (day === 5) {
    return SUCCESS_MESSAGES.ALL_SESSIONS_COMPLETED
  }
  return `Sesi Day ${day} berhasil diselesaikan. Sesi berikutnya akan terbuka dalam 24 jam.`
}

// Helper function to get motivational tip based on progress
export const getMotivationalTip = (percentage: number): string => {
  if (percentage === 0) return DASHBOARD_TEXT.MOTIVATION_START
  if (percentage < 30) return DASHBOARD_TEXT.MOTIVATION_EARLY
  if (percentage < 60) return DASHBOARD_TEXT.MOTIVATION_MID
  if (percentage < 80) return DASHBOARD_TEXT.MOTIVATION_LATE
  if (percentage < 100) return DASHBOARD_TEXT.MOTIVATION_ALMOST
  return DASHBOARD_TEXT.MOTIVATION_COMPLETE
}

// Helper function to format question counter
export const formatQuestionCounter = (current: number, total: number): string => {
  return INSTRUCTIONS.TEST_QUESTION_OF
    .replace('{current}', current.toString())
    .replace('{total}', total.toString())
}
