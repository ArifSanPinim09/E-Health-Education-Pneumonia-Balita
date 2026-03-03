# Implementation Plan: E-Health Education Pneumonia Balita

## Overview

This implementation plan breaks down the Next.js 14 application into discrete coding tasks. The application features dual authentication (OTP for users, email+password for admin), a 5-day progressive learning system with 24-hour unlock intervals, pre/post-test assessments, and a comprehensive admin panel. All tasks build incrementally to ensure working functionality at each checkpoint.

## Tasks

- [x] 1. Project initialization and core configuration
  - Initialize Next.js 14 project with TypeScript and App Router
  - Install dependencies: Supabase client, Tailwind CSS, shadcn/ui, framer-motion, xlsx, canvas-confetti
  - Configure tailwind.config.js with custom colors (Medical Blue #2563EB, Health Green #10B981)
  - Configure next.config.js for Supabase image domains and optimization
  - Set up environment variables structure (.env.local template)
  - Create globals.css with glassmorphism utilities and custom animations
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8, 13.9, 13.10, 13.11_

- [x] 2. Supabase setup and database schema
  - [x] 2.1 Create Supabase client configuration
    - Create lib/supabase/client.ts for client-side Supabase instance
    - Create lib/supabase/server.ts for server-side Supabase instance
    - Create lib/supabase/types.ts with TypeScript interfaces for all database tables
    - _Requirements: 1.7, 20.4, 20.5_
  
  - [x] 2.2 Create database migration file
    - Create supabase/migrations/001_initial_schema.sql with complete schema
    - Include tables: mother_profiles, child_profiles, quiz_questions, test_submissions, session_progress, session_content, admin_users
    - Add all indexes for performance optimization
    - Add Row Level Security (RLS) policies for user data isolation
    - _Requirements: 1.7, 2.6, 3.6, 4.3, 5.5, 8.1, 9.1, 10.3, 11.1_

- [x] 3. Authentication system implementation
  - [x] 3.1 Create OTP authentication flow
    - Create app/api/auth/send-otp/route.ts to generate and send OTP via Supabase Auth
    - Create app/api/auth/verify-otp/route.ts to verify OTP and create 30-day token
    - Implement rate limiting (3 attempts per hour per email)
    - _Requirements: 1.1, 1.2, 1.6, 1.7, 19.2_
  
  - [x] 3.2 Create admin authentication flow
    - Create app/api/auth/admin-login/route.ts with bcrypt password verification
    - Create separate admin JWT token with 7-day expiry
    - Store admin credentials in admin_users table
    - _Requirements: 1.3, 1.4, 1.8_
  
  - [x] 3.3 Implement authentication middleware
    - Create middleware.ts to protect user and admin routes
    - Implement token verification for both user and admin tokens
    - Add automatic redirects for unauthenticated access
    - _Requirements: 1.5, 22.2, 22.5_
  
  - [ ]* 3.4 Write unit tests for authentication
    - Test OTP generation and expiry logic
    - Test token creation and verification
    - Test middleware route protection
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 4. User profile setup system
  - [x] 4.1 Create profile API endpoints
    - Create app/api/profile/create/route.ts to store mother and child data
    - Create app/api/profile/get/route.ts to fetch user profile
    - Implement age calculation utility (years, months, days from birth date)
    - _Requirements: 2.2, 2.3, 2.4, 2.5, 2.6_
  
  - [x] 4.2 Build profile setup page
    - Create app/(auth)/profile-setup/page.tsx with two-section form
    - Create components/profile/MotherInfoForm.tsx for mother data fields
    - Create components/profile/ChildInfoForm.tsx for child data fields
    - Implement form validation with Zod schema
    - _Requirements: 2.1, 2.2, 2.3, 19.4_
  
  - [x] 4.3 Implement profile completion check
    - Add profile existence check in verify-otp API
    - Redirect to profile-setup if profile doesn't exist
    - Redirect to dashboard if profile exists
    - _Requirements: 2.7, 2.8_

- [x] 5. Landing page with animations
  - [x] 5.1 Create landing page structure
    - Create app/page.tsx as landing page
    - Create components/landing/HeroSection.tsx with animated illustration
    - Create components/landing/HowItWorksSection.tsx explaining 5-day program
    - Create components/landing/BenefitsSection.tsx with value propositions
    - Create components/landing/CTASection.tsx with login button
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_
  
  - [x] 5.2 Implement scroll animations
    - Add framer-motion variants for fade-in, slide-up, stagger effects
    - Integrate react-intersection-observer for scroll triggers
    - Add floating shapes as decorative elements
    - Ensure mobile responsiveness (375px+)
    - _Requirements: 12.7, 12.9, 13.8, 13.10, 18.1_
  
  - [ ]* 5.3 Test landing page animations
    - Verify animations trigger on scroll
    - Test reduced motion preference support
    - Validate mobile responsiveness
    - _Requirements: 23.4, 23.8_

- [x] 6. User authentication pages
  - [x] 6.1 Create user login page
    - Create app/(auth)/login/page.tsx with email input
    - Create components/auth/OTPForm.tsx for OTP entry
    - Implement two-step flow: email → OTP verification
    - Add loading states and error messages in Indonesian
    - _Requirements: 1.1, 1.2, 19.1, 19.2, 21.2_
  
  - [x] 6.2 Create admin login page
    - Create app/(auth)/admin-login/page.tsx with email+password form
    - Create components/auth/AdminLoginForm.tsx
    - Add validation and error handling
    - _Requirements: 1.3, 1.4, 19.1, 21.2_

- [x] 7. Checkpoint - Ensure authentication and profile setup work end-to-end
  - Test user OTP login flow from email to dashboard
  - Test admin login flow to admin panel
  - Test profile setup for new users
  - Verify middleware protection on all routes
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Quiz question management
  - [x] 8.1 Seed initial quiz questions
    - Create seed script to insert 23 quiz questions into database
    - Questions in Indonesian about pneumonia balita (True/False format)
    - Set correct answers and order numbers
    - _Requirements: 3.2, 5.2, 11.5, 21.3_
  
  - [x] 8.2 Create quiz question API endpoints
    - Create app/api/admin/questions/route.ts for GET (list) and POST (create)
    - Create app/api/admin/questions/[id]/route.ts for PUT (update) and DELETE
    - Add admin token verification
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.6, 11.7_
  
  - [x] 8.3 Build admin question management UI
    - Create app/(admin)/admin/questions/page.tsx
    - Create components/admin/QuestionManager.tsx with CRUD interface
    - Add question list, create form, edit form, delete confirmation
    - _Requirements: 11.1, 11.2, 11.3, 11.4_

- [x] 9. Pre-test assessment system
  - [x] 9.1 Create pre-test API endpoint
    - Create app/api/test/submit-pre/route.ts
    - Implement answer validation (23 questions)
    - Calculate score against correct answers
    - Store submission in test_submissions table
    - Unlock Day 1 session in session_progress
    - _Requirements: 3.5, 3.6, 3.7, 3.8_
  
  - [x] 9.2 Build pre-test page
    - Create app/(user)/pre-test/page.tsx
    - Create components/test/QuestionCard.tsx for single question display
    - Create components/test/QuestionNavigator.tsx for progress indicator
    - Implement one question per screen with True/False buttons
    - Add slide animation between questions using framer-motion
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 23.2_
  
  - [x] 9.3 Write unit tests for pre-test
    - Test score calculation logic
    - Test answer submission validation
    - Test session unlock after completion
    - _Requirements: 3.6, 3.7, 3.8_

- [x] 10. User dashboard with progress tracking
  - [x] 10.1 Create dashboard API endpoints
    - Create app/api/progress/get/route.ts to fetch user progress
    - Calculate overall completion percentage
    - Fetch pre-test status, session statuses, post-test status
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6_
  
  - [x] 10.2 Build dashboard page
    - Create app/(user)/dashboard/page.tsx
    - Create components/dashboard/GreetingCard.tsx with user name
    - Create components/dashboard/ProgressRing.tsx with animated SVG circle
    - Create components/dashboard/SessionCard.tsx for each day (x5)
    - Display session status: Active, Completed, or Locked
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 23.1_
  
  - [x] 10.3 Implement conditional button display
    - Show Pre-Test button if not completed
    - Show Post-Test button if all sessions completed
    - Show "Mulai" or "Lanjutkan" for active sessions
    - Show checkmark for completed sessions
    - _Requirements: 7.7, 7.8, 22.1, 22.2_
  
  - [x] 10.4 Ensure mobile responsiveness
    - Test dashboard layout on 375px, 768px, 1024px screens
    - Optimize touch targets (44x44px minimum)
    - _Requirements: 7.9, 18.1, 18.2, 18.3, 18.4_

- [x] 11. Session unlocking and countdown timer
  - [x] 11.1 Create session unlock API
    - Create app/api/session/check-unlock/route.ts
    - Calculate if 24 hours have passed since previous session completion
    - Return unlock status and remaining time in milliseconds
    - Use server time to prevent client manipulation
    - _Requirements: 4.4, 4.5, 17.1, 17.6_
  
  - [x] 11.2 Build countdown timer component
    - Create components/dashboard/CountdownTimer.tsx
    - Display remaining time in "XX jam XX menit" format
    - Update every minute
    - Auto-refresh dashboard when countdown reaches zero
    - _Requirements: 4.7, 17.2, 17.3, 17.4, 17.5_
  
  - [x] 11.3 Integrate timer into session cards
    - Show countdown timer on locked session cards
    - Hide timer and show "Mulai" button when unlocked
    - _Requirements: 7.6, 22.2_

- [x] 12. Session content system
  - [x] 12.1 Create session content data
    - Create lib/constants/session-content.ts with 5-day content structure
    - Day 1: Pneumonia Basics
    - Day 2: Recognizing Symptoms
    - Day 3: Treatment & Complications
    - Day 4: Home Practice
    - Day 5: Evaluation
    - Include headings, paragraphs, lists, and media references
    - _Requirements: 4.1, 15.1, 21.4_
  
  - [x] 12.2 Create session completion API
    - Create app/api/session/complete/route.ts
    - Mark session as completed with timestamp
    - Create next session record with unlocked_at = NOW() + 24h
    - If Day 5 completed, enable post-test access
    - _Requirements: 4.3, 4.4, 4.9_
  
  - [x] 12.3 Build session page
    - Create app/(user)/session/[day]/page.tsx with dynamic routing
    - Create components/session/ContentRenderer.tsx to parse and display content
    - Create components/session/SessionProgress.tsx for in-session progress bar
    - Add "Selesai" button at end of session
    - _Requirements: 4.8, 15.2, 15.3, 15.4, 15.5_
  
  - [ ]* 12.4 Test session flow
    - Verify content renders correctly for all 5 days
    - Test session completion and next session unlock
    - Validate 24-hour lock mechanism
    - _Requirements: 4.3, 4.4, 4.5_

- [x] 13. Media asset integration
  - [x] 13.1 Set up Supabase Storage
    - Create media-assets bucket in Supabase
    - Set public access and configure CORS
    - Upload all images: gambar-ibu.png, gambar-paru.png, anatomi-paru.png, virus-bakteri.png, tanda-gejala.png, penatalaksanaan.png
    - Upload all videos: video-suhu.mp4, video-hitung-napas.mp4, video-napas-tambahan.mp4, video-retraksi.mp4, video-saturasi.mp4, video-inhalasi.mp4, video-nebulizer.mp4, video-obat.mp4, video-tepid-sponge.mp4, video-fisioterapi.mp4
    - _Requirements: 14.1, 14.2, 14.3_
  
  - [x] 13.2 Create media embed components
    - Create components/session/MediaEmbed.tsx for images and videos
    - Use Next.js Image component for optimized image loading
    - Add video controls (play, pause, volume)
    - Implement loading indicators and error messages
    - _Requirements: 14.4, 14.5, 14.6, 14.7_
  
  - [x] 13.3 Integrate media into content renderer
    - Update ContentRenderer to embed images and videos inline
    - Ensure mobile-friendly video playback
    - _Requirements: 15.5, 15.6_

- [x] 14. Post-test assessment system
  - [x] 14.1 Create post-test API endpoint
    - Create app/api/test/submit-post/route.ts
    - Validate answers (same 23 questions as pre-test)
    - Calculate post-test score
    - Fetch pre-test score for comparison
    - Store submission in test_submissions table
    - _Requirements: 5.5, 5.6_
  
  - [x] 14.2 Build post-test page
    - Create app/(user)/post-test/page.tsx
    - Reuse QuestionCard and QuestionNavigator components
    - Same one-question-per-screen flow as pre-test
    - Redirect to results page after completion
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.7_
  
  - [ ]* 14.3 Write unit tests for post-test
    - Test score calculation
    - Test pre-test score retrieval
    - Test results page redirect
    - _Requirements: 5.5, 5.6, 5.7_

- [x] 15. Results visualization with confetti
  - [x] 15.1 Build results page
    - Create app/(user)/results/page.tsx
    - Create components/results/ScoreComparison.tsx for pre vs post display
    - Calculate and display knowledge improvement percentage
    - Add visual chart or graphics for score comparison
    - _Requirements: 6.1, 6.2, 6.3_
  
  - [x] 15.2 Implement confetti animation
    - Create components/results/ConfettiEffect.tsx using canvas-confetti
    - Trigger confetti on page load
    - Use brand colors (#2563EB, #10B981, #F59E0B)
    - Add "Kembali ke Dashboard" button
    - _Requirements: 6.4, 6.5, 23.3_

- [x] 16. Checkpoint - Ensure complete user flow works end-to-end
  - Test full user journey: login → profile → pre-test → 5 sessions → post-test → results
  - Verify 24-hour session locks work correctly
  - Test countdown timers and auto-unlock
  - Validate all animations and transitions
  - Ensure all tests pass, ask the user if questions arise.

- [x] 17. Admin dashboard with analytics
  - [x] 17.1 Create admin statistics API
    - Create app/api/admin/stats/route.ts
    - Calculate total users, completed pre-tests, completed post-tests
    - Calculate average pre-test and post-test scores
    - Add admin token verification
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  
  - [x] 17.2 Build admin dashboard page
    - Create app/(admin)/admin/dashboard/page.tsx
    - Create components/admin/StatsCard.tsx for metric display
    - Display all 5 statistics with visual cards
    - Add analytics charts for data visualization
    - Create sidebar navigation for admin features
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_

- [x] 18. Admin respondent data management
  - [x] 18.1 Create respondent data API
    - Create app/api/admin/respondents/route.ts
    - Join mother_profiles, child_profiles, test_submissions, session_progress
    - Return complete respondent data with scores and progress
    - Add search and filter query parameters
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
  
  - [x] 18.2 Build respondent management page
    - Create app/(admin)/admin/respondents/page.tsx
    - Create components/admin/RespondentTable.tsx with data table
    - Add search and filter functionality
    - Display profile data, test scores, session completion status
    - Add detail view for individual respondents
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_

- [x] 19. Data export functionality
  - [x] 19.1 Create export API endpoint
    - Create app/api/admin/export/route.ts
    - Fetch all respondent data with joins
    - Format data for Excel export (profile, pre-test, post-test, sessions)
    - Generate .xlsx file using xlsx library
    - Set response headers for file download
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8_
  
  - [x] 19.2 Build export button component
    - Create components/admin/ExportButton.tsx
    - Trigger export API call on click
    - Show loading state during export generation
    - Auto-download file when ready
    - _Requirements: 10.1, 10.8_
  
  - [ ]* 19.3 Test export functionality
    - Verify all data fields are included in export
    - Test with multiple respondents
    - Validate Excel file format
    - _Requirements: 10.3, 10.4, 10.5, 10.6, 10.7_

- [x] 20. Shared components and utilities
  - [x] 20.1 Create reusable UI components
    - Create components/shared/LoadingSpinner.tsx with framer-motion
    - Create components/shared/ErrorMessage.tsx for error display
    - Create components/shared/FloatingShapes.tsx for decorative elements
    - _Requirements: 19.7, 23.6_
  
  - [x] 20.2 Create utility functions
    - Create lib/utils/age-calculator.ts for child age calculation
    - Create lib/utils/date-formatter.ts for Indonesian date format (DD/MM/YYYY)
    - Create lib/utils/session-unlock.ts for unlock eligibility check
    - Create lib/utils/score-calculator.ts for test score calculation
    - _Requirements: 2.5, 21.5_
  
  - [x] 20.3 Create custom hooks
    - Create lib/hooks/useAuth.ts for authentication state
    - Create lib/hooks/useProfile.ts for user profile data
    - Create lib/hooks/useProgress.ts for learning progress
    - Create lib/hooks/useCountdown.ts for countdown timer logic
    - Create lib/hooks/useReducedMotion.ts for animation preferences
    - _Requirements: 16.6, 16.7, 23.8_

- [x] 21. Form validation and error handling
  - [x] 21.1 Create validation schemas
    - Create lib/validations/profile-schema.ts with Zod for profile forms
    - Create lib/validations/auth-schema.ts with Zod for auth forms
    - Add Indonesian error messages
    - _Requirements: 19.1, 19.4, 21.2_
  
  - [x] 21.2 Implement comprehensive error handling
    - Add try-catch blocks in all API routes
    - Display user-friendly error messages in Indonesian
    - Add network error handling with retry logic
    - Log errors for debugging
    - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5, 21.2_

- [x] 22. Indonesian language implementation
  - [x] 22.1 Create language constants
    - Create lib/constants/indonesian-text.ts with all UI text
    - Include error messages, button labels, instructions
    - Use throughout all components
    - _Requirements: 21.1, 21.2, 21.3, 21.4_
  
  - [x] 22.2 Implement Indonesian formatting
    - Apply DD/MM/YYYY date format in all date displays
    - Use comma as decimal separator for numbers
    - Ensure all content is in Indonesian
    - _Requirements: 21.5, 21.6_

- [x] 23. Guided user experience enhancements
  - [x] 23.1 Add navigation guidance
    - Display clear "Lanjutkan" and "Mulai" buttons
    - Add progress indicators on multi-step flows
    - Show instructional text for major actions
    - _Requirements: 22.1, 22.3, 22.4_
  
  - [x] 23.2 Implement confirmation messages
    - Add success messages after profile creation
    - Add success messages after test completion
    - Add success messages after session completion
    - Display in Indonesian
    - _Requirements: 22.7_
  
  - [x] 23.3 Add visual feedback for interactions
    - Implement hover effects on all interactive elements
    - Add button press animations (scale down on tap)
    - Show loading spinners during async operations
    - _Requirements: 23.5, 23.6, 23.7_

- [x] 24. Responsive design implementation
  - [x] 24.1 Implement mobile-first layouts
    - Ensure all pages work at 375px width
    - Test on actual iOS and Android devices
    - Optimize images for mobile bandwidth
    - _Requirements: 18.1, 18.5, 18.6, 18.7_
  
  - [x] 24.2 Add tablet and desktop breakpoints
    - Adjust layouts for 768px (tablet)
    - Adjust layouts for 1024px (desktop)
    - Ensure touch-friendly button sizes (44x44px minimum)
    - _Requirements: 18.2, 18.3, 18.4_

- [x] 25. Checkpoint - Complete testing and polish
  - Test all user flows on mobile, tablet, and desktop
  - Verify all animations work smoothly
  - Test reduced motion preferences
  - Validate all Indonesian text and formatting
  - Check all error messages display correctly
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 26. Production deployment preparation
  - [ ] 26.1 Configure environment variables
    - Set up Vercel environment variables
    - Configure Supabase production instance
    - Set up custom domain DNS records
    - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5_
  
  - [ ] 26.2 Run database migrations
    - Execute migration SQL on production Supabase
    - Seed quiz questions (23 questions)
    - Create initial admin user
    - Populate session content (5 days)
    - _Requirements: 20.4_
  
  - [ ] 26.3 Upload media assets
    - Upload all images to Supabase Storage production
    - Upload all videos to Supabase Storage production
    - Verify public access and CDN caching
    - _Requirements: 14.1, 14.2, 14.3_
  
  - [ ] 26.4 Deploy to Vercel
    - Connect GitHub repository to Vercel
    - Configure build settings
    - Deploy to production
    - Verify custom domain and HTTPS
    - _Requirements: 20.1, 20.3, 20.6_

- [ ] 27. Final production validation
  - [ ] 27.1 End-to-end testing on production
    - Test complete user flow from registration to results
    - Test admin panel access and all features
    - Test data export functionality
    - Verify OTP email delivery
    - Test on multiple devices and browsers
    - _Requirements: 20.7_
  
  - [ ] 27.2 Performance optimization
    - Run Lighthouse audit (target score > 90)
    - Optimize images and videos if needed
    - Verify page load times
    - Check mobile performance
    - _Requirements: 18.5_
  
  - [ ] 27.3 Security verification
    - Verify RLS policies are active
    - Test unauthorized access attempts
    - Verify HTTPS is enforced
    - Check environment variables are secure
    - _Requirements: 1.5, 20.3, 20.5_

- [ ] 28. Final checkpoint - Production ready
  - All features deployed and functional
  - Zero critical errors in production
  - Performance metrics meet targets
  - Security measures verified
  - Documentation complete
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional testing tasks and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at major milestones
- All code should be in TypeScript with proper type safety
- All UI text must be in Indonesian language
- Mobile-first approach: test at 375px width first, then scale up
- Use shadcn/ui components for consistent design system
- Implement framer-motion animations with reduced motion support
- Follow Next.js 14 App Router conventions and best practices
