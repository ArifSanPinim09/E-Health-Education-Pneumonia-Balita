# Requirements Document

## Introduction

Sistem E-Health Education Pneumonia Balita adalah platform edukasi kesehatan berbasis web yang dirancang untuk meningkatkan pengetahuan ibu tentang pneumonia pada balita melalui program pembelajaran 5 hari yang terstruktur. Sistem ini menyediakan dua jalur autentikasi terpisah (pengguna dengan OTP email dan admin dengan email+password), pre-test dan post-test untuk mengukur peningkatan pengetahuan, serta panel admin untuk mengelola data dan mengekspor hasil.

## Glossary

- **System**: Platform E-Health Education Pneumonia Balita
- **User**: Ibu/responden yang menggunakan platform untuk belajar tentang pneumonia balita
- **Admin**: Peneliti yang mengelola data responden dan konten kuis
- **OTP**: One-Time Password yang dikirim melalui email untuk autentikasi pengguna
- **Session**: Modul pembelajaran harian (Day 1-5) yang harus diselesaikan secara berurutan
- **Pre_Test**: Kuis awal 23 pertanyaan yang diambil sebelum pembelajaran dimulai
- **Post_Test**: Kuis akhir 23 pertanyaan yang diambil setelah menyelesaikan semua sesi pembelajaran
- **Profile_Setup**: Proses pengisian data ibu dan anak saat login pertama kali
- **Dashboard**: Halaman utama pengguna yang menampilkan progress dan akses ke sesi pembelajaran
- **Admin_Panel**: Interface khusus admin untuk mengelola data dan konten
- **Landing_Page**: Halaman awal yang menjelaskan program sebelum login
- **Session_Lock**: Mekanisme yang mencegah akses ke sesi berikutnya sebelum 24 jam berlalu
- **Progress_Ring**: Visualisasi animasi melingkar yang menampilkan persentase penyelesaian pembelajaran
- **Result_Screen**: Halaman yang menampilkan perbandingan skor pre-test dan post-test
- **Supabase**: Platform backend yang menyediakan autentikasi, database PostgreSQL, dan storage
- **Token**: Kredensial autentikasi yang valid selama 1 bulan untuk pengguna
- **Quiz_Question**: Pertanyaan True/False tentang pneumonia balita
- **Media_Asset**: File gambar atau video yang digunakan dalam konten pembelajaran
- **Export_Function**: Fitur untuk mengekspor data responden ke format spreadsheet

## Requirements

### Requirement 1: Dual Authentication System

**User Story:** Sebagai pengguna sistem, saya ingin memiliki jalur login yang terpisah untuk responden dan admin, sehingga setiap peran memiliki akses yang sesuai dengan kebutuhannya.

#### Acceptance Criteria

1. WHEN a User requests login, THE System SHALL send an OTP to the provided email address
2. WHEN a User enters a valid OTP, THE System SHALL create a Token valid for 30 days
3. WHEN an Admin accesses the admin login page, THE System SHALL display email and password input fields
4. WHEN an Admin submits valid credentials, THE System SHALL grant access to the Admin_Panel
5. THE System SHALL maintain completely separate authentication flows for User and Admin
6. WHEN a Token expires after 30 days, THE System SHALL require the User to login again with OTP
7. THE System SHALL store User authentication state in Supabase Auth
8. THE System SHALL store Admin authentication state separately from User authentication

### Requirement 2: Profile Setup on First Login

**User Story:** Sebagai pengguna baru, saya ingin mengisi profil ibu dan anak saya saat login pertama kali, sehingga data saya tersimpan untuk keperluan penelitian.

#### Acceptance Criteria

1. WHEN a User completes OTP login for the first time, THE System SHALL redirect to Profile_Setup page
2. THE Profile_Setup SHALL collect mother's name, age, religion, occupation, address, and phone number
3. THE Profile_Setup SHALL collect child's name, birth date, and gender
4. WHEN the User submits Profile_Setup, THE System SHALL calculate assessment date as current date
5. WHEN the User submits Profile_Setup, THE System SHALL calculate child's age in years, months, and days format from birth date
6. THE System SHALL store all profile data in Supabase PostgreSQL database
7. WHEN Profile_Setup is completed, THE System SHALL redirect User to Dashboard
8. WHEN a User with existing profile logs in, THE System SHALL skip Profile_Setup and redirect to Dashboard

### Requirement 3: Pre-Test Assessment

**User Story:** Sebagai pengguna, saya ingin mengikuti pre-test sebelum memulai pembelajaran, sehingga pengetahuan awal saya dapat diukur.

#### Acceptance Criteria

1. WHEN a User accesses Dashboard for the first time after Profile_Setup, THE System SHALL display Pre_Test access button
2. THE Pre_Test SHALL contain 23 Quiz_Questions about pneumonia balita
3. THE Pre_Test SHALL display one Quiz_Question per screen with True/False options
4. WHEN a User answers a Quiz_Question, THE System SHALL transition to next question with slide animation
5. THE System SHALL allow Pre_Test to be taken only once per User
6. WHEN Pre_Test is completed, THE System SHALL store all answers in Supabase database
7. WHEN Pre_Test is completed, THE System SHALL calculate and store the total score
8. WHEN Pre_Test is completed, THE System SHALL unlock Day 1 Session

### Requirement 4: Five-Day Learning Module System

**User Story:** Sebagai pengguna, saya ingin mengikuti program pembelajaran 5 hari yang terstruktur, sehingga saya dapat memahami pneumonia balita secara bertahap.

#### Acceptance Criteria

1. THE System SHALL provide 5 Sessions with content: Day 1 (Pneumonia Basics), Day 2 (Recognizing Symptoms), Day 3 (Treatment & Complications), Day 4 (Home Practice), Day 5 (Evaluation)
2. WHEN Pre_Test is completed, THE System SHALL unlock Day 1 Session immediately
3. WHEN a User completes a Session, THE System SHALL record completion timestamp in database
4. WHEN a User completes a Session, THE System SHALL lock the next Session for 24 hours
5. WHEN 24 hours have passed since Session completion, THE System SHALL unlock the next Session
6. THE System SHALL display Session status as Active, Completed, or Locked on Dashboard
7. WHILE a Session is Locked, THE System SHALL display countdown timer showing remaining time
8. THE System SHALL display Media_Assets (images and videos) within each Session content
9. WHEN all 5 Sessions are completed, THE System SHALL unlock Post_Test access

### Requirement 5: Post-Test Assessment

**User Story:** Sebagai pengguna, saya ingin mengikuti post-test setelah menyelesaikan semua pembelajaran, sehingga peningkatan pengetahuan saya dapat diukur.

#### Acceptance Criteria

1. WHEN all 5 Sessions are completed, THE System SHALL display Post_Test access button on Dashboard
2. THE Post_Test SHALL contain the same 23 Quiz_Questions as Pre_Test
3. THE Post_Test SHALL display one Quiz_Question per screen with True/False options
4. WHEN a User answers a Quiz_Question in Post_Test, THE System SHALL transition to next question with slide animation
5. WHEN Post_Test is completed, THE System SHALL store all answers in Supabase database
6. WHEN Post_Test is completed, THE System SHALL calculate and store the total score
7. WHEN Post_Test is completed, THE System SHALL redirect User to Result_Screen

### Requirement 6: Result Visualization

**User Story:** Sebagai pengguna, saya ingin melihat perbandingan hasil pre-test dan post-test saya, sehingga saya dapat mengetahui peningkatan pengetahuan saya.

#### Acceptance Criteria

1. THE Result_Screen SHALL display Pre_Test score and Post_Test score side by side
2. THE Result_Screen SHALL calculate and display knowledge improvement percentage
3. THE Result_Screen SHALL visualize score comparison with charts or graphics
4. WHEN Result_Screen is displayed, THE System SHALL trigger confetti animation
5. THE Result_Screen SHALL provide option to return to Dashboard

### Requirement 7: User Dashboard

**User Story:** Sebagai pengguna, saya ingin melihat progress pembelajaran saya di dashboard, sehingga saya dapat melanjutkan dari mana saya berhenti.

#### Acceptance Criteria

1. THE Dashboard SHALL display greeting card with User's name
2. THE Dashboard SHALL display Progress_Ring showing completion percentage with animation
3. THE Dashboard SHALL display all 5 Session cards with current status (Active, Completed, Locked)
4. WHILE a Session is Active, THE Dashboard SHALL display "Mulai" or "Lanjutkan" button
5. WHILE a Session is Completed, THE Dashboard SHALL display completion checkmark
6. WHILE a Session is Locked, THE Dashboard SHALL display countdown timer
7. THE Dashboard SHALL display Pre_Test access button before Pre_Test completion
8. THE Dashboard SHALL display Post_Test access button after all Sessions are completed
9. THE Dashboard SHALL be responsive for mobile devices starting from 375px width

### Requirement 8: Admin Panel Dashboard

**User Story:** Sebagai admin, saya ingin melihat ringkasan data responden di dashboard, sehingga saya dapat memantau progress penelitian.

#### Acceptance Criteria

1. THE Admin_Panel SHALL display total number of registered Users
2. THE Admin_Panel SHALL display total number of completed Pre_Tests
3. THE Admin_Panel SHALL display total number of completed Post_Tests
4. THE Admin_Panel SHALL display average Pre_Test score across all Users
5. THE Admin_Panel SHALL display average Post_Test score across all Users
6. THE Admin_Panel SHALL display analytics charts for data visualization
7. THE Admin_Panel SHALL provide sidebar navigation to other admin features

### Requirement 9: Admin Respondent Data Management

**User Story:** Sebagai admin, saya ingin melihat dan mengelola data semua responden, sehingga saya dapat mengakses informasi untuk keperluan penelitian.

#### Acceptance Criteria

1. THE Admin_Panel SHALL display list of all Users with profile information
2. THE Admin_Panel SHALL display each User's consent form status
3. THE Admin_Panel SHALL display each User's Pre_Test results
4. THE Admin_Panel SHALL display each User's Post_Test results
5. THE Admin_Panel SHALL display each User's Session completion status
6. THE Admin_Panel SHALL provide search and filter functionality for User data
7. THE Admin_Panel SHALL allow Admin to view detailed profile of individual User

### Requirement 10: Data Export Functionality

**User Story:** Sebagai admin, saya ingin mengekspor semua data responden ke spreadsheet, sehingga saya dapat melakukan analisis lebih lanjut.

#### Acceptance Criteria

1. THE Admin_Panel SHALL provide Export_Function button
2. WHEN Admin clicks Export_Function, THE System SHALL generate spreadsheet file containing all User data
3. THE Export_Function SHALL include profile data (mother and child information)
4. THE Export_Function SHALL include Pre_Test scores and answers
5. THE Export_Function SHALL include Post_Test scores and answers
6. THE Export_Function SHALL include Session completion timestamps
7. THE Export_Function SHALL support Excel format (.xlsx)
8. WHEN export is complete, THE System SHALL download the file to Admin's device

### Requirement 11: Quiz Question Management

**User Story:** Sebagai admin, saya ingin mengelola pertanyaan kuis, sehingga saya dapat memperbarui atau menambah konten assessment.

#### Acceptance Criteria

1. THE Admin_Panel SHALL display list of all Quiz_Questions
2. THE Admin_Panel SHALL allow Admin to create new Quiz_Question with text and correct answer
3. THE Admin_Panel SHALL allow Admin to edit existing Quiz_Question
4. THE Admin_Panel SHALL allow Admin to delete Quiz_Question
5. THE Admin_Panel SHALL display Quiz_Question in Indonesian language
6. WHEN Admin modifies Quiz_Question, THE System SHALL update database immediately
7. THE System SHALL validate that Quiz_Question has True or False as correct answer

### Requirement 12: Landing Page

**User Story:** Sebagai pengunjung website, saya ingin memahami program pembelajaran sebelum login, sehingga saya dapat memutuskan untuk bergabung.

#### Acceptance Criteria

1. THE Landing_Page SHALL display hero section with animated illustration
2. THE Landing_Page SHALL display trust indicators section
3. THE Landing_Page SHALL display "How it works" section explaining the 5-day program
4. THE Landing_Page SHALL display benefits section
5. THE Landing_Page SHALL display learning preview section
6. THE Landing_Page SHALL display call-to-action section with login button
7. THE Landing_Page SHALL display footer with contact information
8. THE Landing_Page SHALL be displayed in Indonesian language
9. THE Landing_Page SHALL be responsive for mobile devices starting from 375px width

### Requirement 13: Design System Implementation

**User Story:** Sebagai pengguna, saya ingin menggunakan aplikasi dengan desain yang modern dan profesional, sehingga pengalaman belajar saya menyenangkan.

#### Acceptance Criteria

1. THE System SHALL use Medical Blue (#2563EB) as primary color
2. THE System SHALL use Health Green (#10B981) as secondary color
3. THE System SHALL use Plus Jakarta Sans font for headings
4. THE System SHALL use Inter font for body text
5. THE System SHALL implement glassmorphism effects on cards and panels
6. THE System SHALL implement soft gradients on backgrounds
7. THE System SHALL implement floating shapes as decorative elements
8. THE System SHALL use framer-motion library for animations
9. THE System SHALL use tailwindcss-animate for CSS animations
10. THE System SHALL use react-intersection-observer for scroll animations
11. THE System SHALL follow mobile-first responsive design approach

### Requirement 14: Media Asset Management

**User Story:** Sebagai pengguna, saya ingin melihat gambar dan video edukatif dalam pembelajaran, sehingga saya dapat memahami materi dengan lebih baik.

#### Acceptance Criteria

1. THE System SHALL store all Media_Assets in Supabase Storage
2. THE System SHALL display images: gambar-ibu.png, gambar-paru.png, anatomi-paru.png, virus-bakteri.png, tanda-gejala.png, penatalaksanaan.png in appropriate Sessions
3. THE System SHALL display videos: video-suhu.mp4, video-hitung-napas.mp4, video-napas-tambahan.mp4, video-retraksi.mp4, video-saturasi.mp4, video-inhalasi.mp4, video-nebulizer.mp4, video-obat.mp4, video-tepid-sponge.mp4, video-fisioterapi.mp4 in appropriate Sessions
4. THE System SHALL load Media_Assets with optimized performance
5. THE System SHALL display loading indicators while Media_Assets are loading
6. WHEN a Media_Asset fails to load, THE System SHALL display error message
7. THE System SHALL support video playback controls (play, pause, volume)

### Requirement 15: Session Content Parser

**User Story:** Sebagai sistem, saya perlu mem-parsing dan menampilkan konten pembelajaran dengan format yang konsisten, sehingga pengguna mendapat pengalaman yang baik.

#### Acceptance Criteria

1. THE System SHALL parse Session content from database or markdown files
2. THE System SHALL render headings, paragraphs, lists, and media embeds correctly
3. THE System SHALL apply consistent styling to all content elements
4. THE System SHALL support Indonesian language characters and formatting
5. WHEN Session content contains Media_Asset references, THE System SHALL embed them inline
6. THE System SHALL maintain content readability on mobile devices

### Requirement 16: Progress Tracking

**User Story:** Sebagai pengguna, saya ingin sistem melacak progress saya secara otomatis, sehingga saya tidak perlu mengingat di mana saya berhenti.

#### Acceptance Criteria

1. THE System SHALL track Pre_Test completion status for each User
2. THE System SHALL track completion timestamp for each Session
3. THE System SHALL track Post_Test completion status for each User
4. THE System SHALL calculate overall completion percentage based on completed activities
5. THE System SHALL persist progress data in Supabase database
6. WHEN a User logs in, THE System SHALL load and display current progress
7. THE System SHALL update progress in real-time as User completes activities

### Requirement 17: Session Unlocking Timer

**User Story:** Sebagai pengguna, saya ingin melihat berapa lama lagi sesi berikutnya akan terbuka, sehingga saya tahu kapan harus kembali.

#### Acceptance Criteria

1. WHEN a Session is Locked, THE System SHALL calculate remaining time until unlock
2. THE System SHALL display countdown timer in format "XX jam XX menit"
3. THE System SHALL update countdown timer every minute
4. WHEN countdown reaches zero, THE System SHALL automatically unlock the Session
5. THE System SHALL refresh Dashboard to show updated Session status
6. THE System SHALL use server time for countdown calculation to prevent client-side manipulation

### Requirement 18: Responsive Mobile Design

**User Story:** Sebagai pengguna mobile, saya ingin mengakses aplikasi dengan nyaman di smartphone, sehingga saya dapat belajar kapan saja.

#### Acceptance Criteria

1. THE System SHALL support screen widths starting from 375px
2. THE System SHALL adapt layout for tablet devices (768px and above)
3. THE System SHALL adapt layout for desktop devices (1024px and above)
4. THE System SHALL use touch-friendly button sizes (minimum 44x44px)
5. THE System SHALL optimize images for mobile bandwidth
6. THE System SHALL ensure text remains readable without horizontal scrolling
7. THE System SHALL test responsive design on iOS and Android devices

### Requirement 19: Error Handling and Validation

**User Story:** Sebagai pengguna, saya ingin mendapat feedback yang jelas ketika terjadi error, sehingga saya tahu apa yang harus dilakukan.

#### Acceptance Criteria

1. WHEN a User enters invalid email format, THE System SHALL display error message "Format email tidak valid"
2. WHEN OTP verification fails, THE System SHALL display error message "Kode OTP salah atau kadaluarsa"
3. WHEN network request fails, THE System SHALL display error message "Koneksi gagal, silakan coba lagi"
4. WHEN Profile_Setup has empty required fields, THE System SHALL display error message for each field
5. WHEN database operation fails, THE System SHALL log error and display user-friendly message
6. THE System SHALL validate all form inputs before submission
7. THE System SHALL display loading states during asynchronous operations

### Requirement 20: Deployment and Production

**User Story:** Sebagai stakeholder, saya ingin aplikasi di-deploy ke production dengan custom domain, sehingga pengguna dapat mengaksesnya dengan mudah.

#### Acceptance Criteria

1. THE System SHALL be deployed on Vercel platform
2. THE System SHALL be connected to custom domain
3. THE System SHALL use HTTPS for all connections
4. THE System SHALL be connected to Supabase production instance
5. THE System SHALL have environment variables configured securely
6. THE System SHALL implement error tracking for production issues
7. THE System SHALL have zero critical errors from setup to production deployment

### Requirement 21: Indonesian Language Support

**User Story:** Sebagai pengguna Indonesia, saya ingin semua konten dalam Bahasa Indonesia, sehingga saya dapat memahami dengan mudah.

#### Acceptance Criteria

1. THE System SHALL display all UI text in Indonesian language
2. THE System SHALL display all error messages in Indonesian language
3. THE System SHALL display all Quiz_Questions in Indonesian language
4. THE System SHALL display all Session content in Indonesian language
5. THE System SHALL use Indonesian date and time format (DD/MM/YYYY)
6. THE System SHALL use Indonesian number formatting (comma as decimal separator)

### Requirement 22: Guided User Experience

**User Story:** Sebagai pengguna, saya ingin mengikuti alur yang jelas tanpa kebingungan, sehingga saya dapat fokus pada pembelajaran.

#### Acceptance Criteria

1. THE System SHALL display clear "Next" or "Lanjutkan" buttons for navigation
2. THE System SHALL disable access to locked features with visual indicators
3. THE System SHALL provide progress indicators showing current step
4. THE System SHALL display instructional text for each major action
5. THE System SHALL prevent Users from skipping required steps
6. THE System SHALL automatically redirect Users to next appropriate page after completing actions
7. THE System SHALL display confirmation messages after successful actions

### Requirement 23: Animation and Visual Feedback

**User Story:** Sebagai pengguna, saya ingin melihat animasi yang smooth dan feedback visual, sehingga interaksi terasa responsif dan menyenangkan.

#### Acceptance Criteria

1. THE Progress_Ring SHALL animate smoothly when displaying completion percentage
2. THE System SHALL use slide transitions between Quiz_Questions
3. THE System SHALL display confetti animation on Result_Screen
4. THE System SHALL use fade-in animations for page loads
5. THE System SHALL use hover effects on interactive elements
6. THE System SHALL use loading spinners during data fetching
7. THE System SHALL complete all animations within 500ms for optimal UX
8. THE System SHALL reduce animations on devices with prefers-reduced-motion setting
