# Design Document: E-Health Education Pneumonia Balita

## Overview

The E-Health Education Pneumonia Balita platform is a Next.js-based web application designed to deliver a structured 5-day educational program about childhood pneumonia to mothers in Indonesia. The system implements a dual authentication model (OTP for users, email+password for admin), progressive content unlocking with 24-hour intervals, pre/post-test assessments, and comprehensive admin analytics.

### Core Design Principles

1. **Progressive Disclosure**: Content unlocks sequentially with time-based gates to ensure proper learning pace
2. **Mobile-First**: Optimized for smartphone usage (375px+) as primary access method
3. **Bilingual Architecture**: Indonesian language throughout with extensible i18n structure
4. **Separation of Concerns**: Clear boundaries between user and admin flows
5. **Data Integrity**: Immutable test results and timestamped progress tracking
6. **Visual Engagement**: Glassmorphism, animations, and medical-themed color palette

### Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Backend**: Supabase (Auth, PostgreSQL, Storage)
- **Styling**: Tailwind CSS, tailwindcss-animate
- **Animation**: framer-motion, react-intersection-observer
- **UI Components**: shadcn/ui
- **Data Export**: xlsx library
- **Deployment**: Vercel

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Landing Page │  │ User Portal  │  │ Admin Panel  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js App Router                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ API Routes   │  │ Server       │  │ Middleware   │      │
│  │ /api/*       │  │ Components   │  │ (Auth Guard) │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Supabase Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Auth         │  │ PostgreSQL   │  │ Storage      │      │
│  │ (OTP/Email)  │  │ (User Data)  │  │ (Media)      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Authentication Flow

```
User Flow:
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Enter   │───▶│  Send    │───▶│  Verify  │───▶│  Create  │
│  Email   │    │   OTP    │    │   OTP    │    │  Token   │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                                                       │
                                                       ▼
                                              ┌──────────────┐
                                              │ Profile Setup│
                                              │ (First Time) │
                                              └──────────────┘
                                                       │
                                                       ▼
                                              ┌──────────────┐
                                              │  Dashboard   │
                                              └──────────────┘

Admin Flow:
┌──────────┐    ┌──────────┐    ┌──────────┐
│  Enter   │───▶│  Verify  │───▶│  Admin   │
│Email+Pass│    │  Creds   │    │  Panel   │
└──────────┘    └──────────┘    └──────────┘
```

### Learning Flow State Machine

```
┌─────────────┐
│   Profile   │
│   Setup     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Pre-Test   │
│  (23 Q's)   │
└──────┬──────┘
       │
       ▼
┌─────────────┐     24h      ┌─────────────┐     24h
│   Day 1     │─────wait────▶│   Day 2     │─────wait────▶ ...
│  Unlocked   │              │   Locked    │
└─────────────┘              └─────────────┘
                                                    │
                                                    ▼
                                            ┌─────────────┐
                                            │   Day 5     │
                                            │  Complete   │
                                            └──────┬──────┘
                                                   │
                                                   ▼
                                            ┌─────────────┐
                                            │  Post-Test  │
                                            │  (23 Q's)   │
                                            └──────┬──────┘
                                                   │
                                                   ▼
                                            ┌─────────────┐
                                            │   Results   │
                                            │   Screen    │
                                            └─────────────┘
```

## Components and Interfaces

### File and Folder Structure

```
e-health-pneumonia-balita/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx                 # User OTP login
│   │   ├── admin-login/
│   │   │   └── page.tsx                 # Admin email+password login
│   │   └── profile-setup/
│   │       └── page.tsx                 # First-time profile form
│   ├── (user)/
│   │   ├── dashboard/
│   │   │   └── page.tsx                 # User main dashboard
│   │   ├── pre-test/
│   │   │   └── page.tsx                 # Pre-test assessment
│   │   ├── session/
│   │   │   └── [day]/
│   │   │       └── page.tsx             # Dynamic session content
│   │   ├── post-test/
│   │   │   └── page.tsx                 # Post-test assessment
│   │   └── results/
│   │       └── page.tsx                 # Score comparison screen
│   ├── (admin)/
│   │   └── admin/
│   │       ├── dashboard/
│   │       │   └── page.tsx             # Admin analytics dashboard
│   │       ├── respondents/
│   │       │   └── page.tsx             # Respondent data table
│   │       └── questions/
│   │           └── page.tsx             # Quiz question CRUD
│   ├── api/
│   │   ├── auth/
│   │   │   ├── send-otp/
│   │   │   │   └── route.ts             # Send OTP email
│   │   │   ├── verify-otp/
│   │   │   │   └── route.ts             # Verify OTP code
│   │   │   └── admin-login/
│   │   │       └── route.ts             # Admin authentication
│   │   ├── profile/
│   │   │   ├── create/
│   │   │   │   └── route.ts             # Create user profile
│   │   │   └── get/
│   │   │       └── route.ts             # Fetch user profile
│   │   ├── test/
│   │   │   ├── submit-pre/
│   │   │   │   └── route.ts             # Submit pre-test answers
│   │   │   └── submit-post/
│   │   │       └── route.ts             # Submit post-test answers
│   │   ├── session/
│   │   │   ├── complete/
│   │   │   │   └── route.ts             # Mark session complete
│   │   │   └── check-unlock/
│   │   │       └── route.ts             # Check if session unlocked
│   │   ├── admin/
│   │   │   ├── stats/
│   │   │   │   └── route.ts             # Get dashboard statistics
│   │   │   ├── respondents/
│   │   │   │   └── route.ts             # Get all respondent data
│   │   │   ├── export/
│   │   │   │   └── route.ts             # Export data to Excel
│   │   │   └── questions/
│   │   │       └── route.ts             # CRUD for quiz questions
│   │   └── media/
│   │       └── [filename]/
│   │           └── route.ts             # Serve media from Supabase
│   ├── layout.tsx                       # Root layout
│   ├── page.tsx                         # Landing page
│   └── globals.css                      # Global styles
├── components/
│   ├── ui/                              # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── progress.tsx
│   │   └── ...
│   ├── auth/
│   │   ├── OTPForm.tsx                  # OTP input component
│   │   └── AdminLoginForm.tsx           # Admin login form
│   ├── profile/
│   │   ├── MotherInfoForm.tsx           # Mother data fields
│   │   └── ChildInfoForm.tsx            # Child data fields
│   ├── dashboard/
│   │   ├── ProgressRing.tsx             # Animated progress circle
│   │   ├── SessionCard.tsx              # Individual session card
│   │   ├── CountdownTimer.tsx           # 24h countdown display
│   │   └── GreetingCard.tsx             # Welcome message
│   ├── test/
│   │   ├── QuestionCard.tsx             # Single question display
│   │   └── QuestionNavigator.tsx        # Question progress indicator
│   ├── session/
│   │   ├── ContentRenderer.tsx          # Parse and display content
│   │   ├── MediaEmbed.tsx               # Image/video embed
│   │   └── SessionProgress.tsx          # In-session progress bar
│   ├── results/
│   │   ├── ScoreComparison.tsx          # Pre vs Post chart
│   │   └── ConfettiEffect.tsx           # Celebration animation
│   ├── admin/
│   │   ├── StatsCard.tsx                # Dashboard metric card
│   │   ├── RespondentTable.tsx          # Data table with filters
│   │   ├── ExportButton.tsx             # Excel export trigger
│   │   └── QuestionManager.tsx          # CRUD interface
│   ├── landing/
│   │   ├── HeroSection.tsx              # Landing hero
│   │   ├── HowItWorksSection.tsx        # 5-day explanation
│   │   ├── BenefitsSection.tsx          # Value propositions
│   │   └── CTASection.tsx               # Call to action
│   └── shared/
│       ├── LoadingSpinner.tsx           # Loading state
│       ├── ErrorMessage.tsx             # Error display
│       └── FloatingShapes.tsx           # Decorative elements
├── lib/
│   ├── supabase/
│   │   ├── client.ts                    # Supabase client instance
│   │   ├── server.ts                    # Server-side Supabase
│   │   └── types.ts                     # Database type definitions
│   ├── utils/
│   │   ├── age-calculator.ts            # Calculate child age
│   │   ├── date-formatter.ts            # Indonesian date format
│   │   ├── session-unlock.ts            # Check unlock eligibility
│   │   └── score-calculator.ts          # Calculate test scores
│   ├── hooks/
│   │   ├── useAuth.ts                   # Authentication state
│   │   ├── useProfile.ts                # User profile data
│   │   ├── useProgress.ts               # Learning progress
│   │   └── useCountdown.ts              # Countdown timer logic
│   ├── constants/
│   │   ├── session-content.ts           # 5-day content data
│   │   ├── quiz-questions.ts            # 23 questions array
│   │   └── media-assets.ts              # Media file mappings
│   └── validations/
│       ├── profile-schema.ts            # Zod schema for profile
│       └── auth-schema.ts               # Zod schema for auth
├── middleware.ts                        # Route protection
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql       # Database schema
└── public/
    └── media/                           # Fallback media assets
```

### Component Hierarchy

```
Landing Page
└── LandingLayout
    ├── HeroSection
    │   ├── FloatingShapes
    │   └── AnimatedIllustration
    ├── HowItWorksSection
    ├── BenefitsSection
    ├── LearningPreviewSection
    └── CTASection

User Dashboard
└── DashboardLayout
    ├── GreetingCard
    ├── ProgressRing (framer-motion)
    ├── SessionCard[] (x5)
    │   ├── SessionStatus (Active/Completed/Locked)
    │   └── CountdownTimer (if locked)
    ├── PreTestButton (conditional)
    └── PostTestButton (conditional)

Test Pages (Pre/Post)
└── TestLayout
    ├── QuestionNavigator
    ├── QuestionCard
    │   ├── QuestionText
    │   └── TrueFalseButtons
    └── ProgressIndicator

Session Page
└── SessionLayout
    ├── SessionProgress
    ├── ContentRenderer
    │   ├── Heading
    │   ├── Paragraph
    │   ├── List
    │   └── MediaEmbed
    │       ├── ImageEmbed
    │       └── VideoEmbed
    └── CompleteButton

Results Page
└── ResultsLayout
    ├── ScoreComparison
    │   ├── PreTestScore
    │   ├── PostTestScore
    │   └── ImprovementChart
    ├── ConfettiEffect
    └── BackToDashboardButton

Admin Panel
└── AdminLayout
    ├── Sidebar
    ├── DashboardView
    │   ├── StatsCard[] (x5)
    │   └── AnalyticsChart
    ├── RespondentsView
    │   ├── SearchFilter
    │   ├── RespondentTable
    │   └── ExportButton
    └── QuestionsView
        └── QuestionManager
            ├── QuestionList
            └── QuestionForm (Create/Edit)
```

### Key Interfaces and Types

```typescript
// User and Profile Types
interface User {
  id: string;
  email: string;
  created_at: string;
  token_expires_at: string;
}

interface MotherProfile {
  user_id: string;
  name: string;
  age: number;
  religion: string;
  occupation: string;
  address: string;
  phone: string;
}

interface ChildProfile {
  user_id: string;
  name: string;
  birth_date: string;
  gender: 'male' | 'female';
  age_years: number;
  age_months: number;
  age_days: number;
  assessment_date: string;
}

// Test and Progress Types
interface QuizQuestion {
  id: string;
  question_text: string;
  correct_answer: boolean;
  order: number;
}

interface TestSubmission {
  id: string;
  user_id: string;
  test_type: 'pre' | 'post';
  answers: boolean[];
  score: number;
  completed_at: string;
}

interface SessionProgress {
  user_id: string;
  day: 1 | 2 | 3 | 4 | 5;
  completed: boolean;
  completed_at: string | null;
  unlocked_at: string;
}

interface UserProgress {
  profile_completed: boolean;
  pre_test_completed: boolean;
  sessions_completed: number[];
  post_test_completed: boolean;
  overall_percentage: number;
}

// Session Content Types
interface SessionContent {
  day: number;
  title: string;
  sections: ContentSection[];
}

interface ContentSection {
  type: 'heading' | 'paragraph' | 'list' | 'image' | 'video';
  content: string | string[];
  media_url?: string;
}

// Admin Types
interface AdminStats {
  total_users: number;
  completed_pre_tests: number;
  completed_post_tests: number;
  average_pre_score: number;
  average_post_score: number;
}

interface RespondentData {
  user_id: string;
  mother_name: string;
  child_name: string;
  email: string;
  pre_test_score: number | null;
  post_test_score: number | null;
  sessions_completed: number;
  last_activity: string;
}

// API Response Types
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface OTPResponse {
  message: string;
  email: string;
}

interface AuthResponse {
  token: string;
  user_id: string;
  requires_profile_setup: boolean;
}
```

## Data Models

### Database Schema

```sql
-- Users table (managed by Supabase Auth)
-- Extended with custom fields

-- Mother profiles
CREATE TABLE mother_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 15 AND age <= 100),
  religion VARCHAR(100) NOT NULL,
  occupation VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Child profiles
CREATE TABLE child_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  birth_date DATE NOT NULL,
  gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female')),
  age_years INTEGER NOT NULL,
  age_months INTEGER NOT NULL,
  age_days INTEGER NOT NULL,
  assessment_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz questions
CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_text TEXT NOT NULL,
  correct_answer BOOLEAN NOT NULL,
  order_number INTEGER NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test submissions
CREATE TABLE test_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  test_type VARCHAR(10) NOT NULL CHECK (test_type IN ('pre', 'post')),
  answers JSONB NOT NULL, -- Array of boolean answers
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 23),
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, test_type) -- Each user can only submit once per test type
);

-- Session progress
CREATE TABLE session_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  day INTEGER NOT NULL CHECK (day >= 1 AND day <= 5),
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, day)
);

-- Session content (stored in database for easy admin editing)
CREATE TABLE session_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  day INTEGER NOT NULL UNIQUE CHECK (day >= 1 AND day <= 5),
  title VARCHAR(255) NOT NULL,
  content JSONB NOT NULL, -- Array of content sections
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin users (separate from regular users)
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_mother_profiles_user_id ON mother_profiles(user_id);
CREATE INDEX idx_child_profiles_user_id ON child_profiles(user_id);
CREATE INDEX idx_test_submissions_user_id ON test_submissions(user_id);
CREATE INDEX idx_test_submissions_test_type ON test_submissions(test_type);
CREATE INDEX idx_session_progress_user_id ON session_progress(user_id);
CREATE INDEX idx_session_progress_day ON session_progress(day);
CREATE INDEX idx_quiz_questions_order ON quiz_questions(order_number);

-- Row Level Security (RLS) Policies
ALTER TABLE mother_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_progress ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own mother profile"
  ON mother_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mother profile"
  ON mother_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own child profile"
  ON child_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own child profile"
  ON child_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own test submissions"
  ON test_submissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own test submissions"
  ON test_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own session progress"
  ON session_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own session progress"
  ON session_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Quiz questions and session content are readable by all authenticated users
CREATE POLICY "Authenticated users can view quiz questions"
  ON quiz_questions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view session content"
  ON session_content FOR SELECT
  TO authenticated
  USING (true);
```

### Supabase Storage Buckets

```
media-assets/
├── images/
│   ├── gambar-ibu.png
│   ├── gambar-paru.png
│   ├── anatomi-paru.png
│   ├── virus-bakteri.png
│   ├── tanda-gejala.png
│   └── penatalaksanaan.png
└── videos/
    ├── video-suhu.mp4
    ├── video-hitung-napas.mp4
    ├── video-napas-tambahan.mp4
    ├── video-retraksi.mp4
    ├── video-saturasi.mp4
    ├── video-inhalasi.mp4
    ├── video-nebulizer.mp4
    ├── video-obat.mp4
    ├── video-tepid-sponge.mp4
    └── video-fisioterapi.mp4
```

Storage policies:
- Public read access for all media assets
- Admin-only write access
- Automatic image optimization enabled
- Video streaming enabled

### State Management Strategy

The application uses a hybrid state management approach:

1. **Server State** (Supabase + React Query/SWR):
   - User authentication status
   - Profile data
   - Test submissions
   - Session progress
   - Admin data

2. **Client State** (React Context + useState):
   - Current quiz question index
   - Form input values
   - UI state (modals, dropdowns)
   - Animation triggers

3. **URL State** (Next.js routing):
   - Current session day
   - Admin panel active view
   - Navigation history

4. **Local Storage**:
   - Auth token (managed by Supabase)
   - Draft form data (auto-save)
   - User preferences (reduced motion)

No global state management library (Redux/Zustand) is needed due to:
- Server-centric data flow
- Limited client-side state
- Next.js built-in caching



## API Routes and Data Flow

### Authentication Endpoints

**POST /api/auth/send-otp**
```typescript
Request: { email: string }
Response: { success: boolean, message: string }
Flow:
1. Validate email format
2. Generate 6-digit OTP
3. Store OTP in Supabase with 10-minute expiry
4. Send email via Supabase Auth
5. Return success message
```

**POST /api/auth/verify-otp**
```typescript
Request: { email: string, otp: string }
Response: { success: boolean, token: string, user_id: string, requires_profile_setup: boolean }
Flow:
1. Verify OTP against stored value
2. Check OTP expiry
3. Create/retrieve user in Supabase Auth
4. Generate 30-day session token
5. Check if profile exists
6. Return auth response
```

**POST /api/auth/admin-login**
```typescript
Request: { email: string, password: string }
Response: { success: boolean, token: string, admin_id: string }
Flow:
1. Validate credentials against admin_users table
2. Hash password and compare
3. Generate admin session token
4. Return auth response
```

### Profile Endpoints

**POST /api/profile/create**
```typescript
Request: {
  mother: { name, age, religion, occupation, address, phone },
  child: { name, birth_date, gender }
}
Response: { success: boolean, profile_id: string }
Flow:
1. Validate all required fields
2. Calculate child age (years, months, days)
3. Set assessment_date to current date
4. Insert mother_profile record
5. Insert child_profile record
6. Create initial session_progress record (Day 1 unlocked)
7. Return success
```

**GET /api/profile/get**
```typescript
Request: Headers { Authorization: Bearer <token> }
Response: { success: boolean, mother: MotherProfile, child: ChildProfile }
Flow:
1. Extract user_id from token
2. Query mother_profiles table
3. Query child_profiles table
4. Return combined profile data
```

### Test Endpoints

**POST /api/test/submit-pre**
```typescript
Request: { answers: boolean[] }
Response: { success: boolean, score: number }
Flow:
1. Validate answers array length (23)
2. Fetch correct answers from quiz_questions
3. Calculate score
4. Insert test_submission record (type: 'pre')
5. Unlock Day 1 session in session_progress
6. Return score
```

**POST /api/test/submit-post**
```typescript
Request: { answers: boolean[] }
Response: { success: boolean, score: number, pre_score: number }
Flow:
1. Validate answers array length (23)
2. Fetch correct answers from quiz_questions
3. Calculate score
4. Insert test_submission record (type: 'post')
5. Fetch pre-test score for comparison
6. Return both scores
```

### Session Endpoints

**POST /api/session/complete**
```typescript
Request: { day: number }
Response: { success: boolean, next_unlock_time: string }
Flow:
1. Validate day number (1-5)
2. Update session_progress (completed: true, completed_at: NOW())
3. If day < 5: Create next session record with unlocked_at = NOW() + 24h
4. If day === 5: Enable post-test access
5. Return next unlock time
```

**GET /api/session/check-unlock**
```typescript
Request: Query { day: number }
Response: { success: boolean, unlocked: boolean, unlock_time: string, remaining_ms: number }
Flow:
1. Query session_progress for specified day
2. Compare unlocked_at with current server time
3. Calculate remaining milliseconds if locked
4. Return unlock status
```

### Admin Endpoints

**GET /api/admin/stats**
```typescript
Request: Headers { Authorization: Bearer <admin_token> }
Response: { success: boolean, stats: AdminStats }
Flow:
1. Verify admin token
2. Count total users from auth.users
3. Count completed pre-tests
4. Count completed post-tests
5. Calculate average pre-test score
6. Calculate average post-test score
7. Return aggregated stats
```

**GET /api/admin/respondents**
```typescript
Request: Query { search?: string, filter?: string }
Response: { success: boolean, respondents: RespondentData[] }
Flow:
1. Verify admin token
2. Join mother_profiles, child_profiles, test_submissions, session_progress
3. Apply search filter if provided
4. Apply status filter if provided
5. Return respondent list with all data
```

**GET /api/admin/export**
```typescript
Request: Headers { Authorization: Bearer <admin_token> }
Response: Binary Excel file (.xlsx)
Flow:
1. Verify admin token
2. Fetch all respondent data with joins
3. Format data for Excel export
4. Generate .xlsx file using xlsx library
5. Set response headers for file download
6. Stream file to client
```

**GET /api/admin/questions**
```typescript
Request: Headers { Authorization: Bearer <admin_token> }
Response: { success: boolean, questions: QuizQuestion[] }
Flow:
1. Verify admin token
2. Query quiz_questions ordered by order_number
3. Return question list
```

**POST /api/admin/questions**
```typescript
Request: { question_text: string, correct_answer: boolean, order_number: number }
Response: { success: boolean, question_id: string }
Flow:
1. Verify admin token
2. Validate question data
3. Insert quiz_question record
4. Return question ID
```

**PUT /api/admin/questions/:id**
```typescript
Request: { question_text?: string, correct_answer?: boolean, order_number?: number }
Response: { success: boolean }
Flow:
1. Verify admin token
2. Validate question data
3. Update quiz_question record
4. Return success
```

**DELETE /api/admin/questions/:id**
```typescript
Request: Headers { Authorization: Bearer <admin_token> }
Response: { success: boolean }
Flow:
1. Verify admin token
2. Delete quiz_question record
3. Return success
```

### Data Flow Diagrams

**User Registration and Profile Setup Flow**
```
User → Enter Email → Send OTP API → Supabase Auth → Email Sent
                                                          ↓
User ← OTP Email ← Email Service ←─────────────────────┘
  ↓
Enter OTP → Verify OTP API → Supabase Auth → Token Created
                                                    ↓
                                            Check Profile Exists?
                                                    ↓
                                            No → Profile Setup Page
                                                    ↓
                                            Fill Forms → Create Profile API
                                                    ↓
                                            Insert mother_profiles
                                            Insert child_profiles
                                            Create session_progress (Day 1)
                                                    ↓
                                            Redirect to Dashboard
```

**Learning Progress Flow**
```
Dashboard → Pre-Test Button → Pre-Test Page
                                    ↓
                            Answer 23 Questions
                                    ↓
                            Submit Pre-Test API
                                    ↓
                            Calculate Score
                            Store Submission
                            Unlock Day 1
                                    ↓
Dashboard → Day 1 Card → Session Page
                                    ↓
                            View Content
                            Watch Videos
                                    ↓
                            Complete Session API
                                    ↓
                            Mark Completed
                            Create Day 2 (locked, +24h)
                                    ↓
Dashboard → Day 2 Card (Locked) → Countdown Timer
                                    ↓
                            Wait 24 Hours
                                    ↓
Dashboard → Day 2 Card (Unlocked) → Session Page
                                    ↓
                            ... Repeat for Days 3-5 ...
                                    ↓
Dashboard → Post-Test Button → Post-Test Page
                                    ↓
                            Answer 23 Questions
                                    ↓
                            Submit Post-Test API
                                    ↓
                            Calculate Score
                            Fetch Pre-Test Score
                            Store Submission
                                    ↓
                            Results Page → Score Comparison
```

**Admin Data Management Flow**
```
Admin Login → Admin Dashboard
                    ↓
            View Statistics
            (Total Users, Avg Scores, etc.)
                    ↓
            Navigate to Respondents
                    ↓
            View Respondent Table
            Apply Filters/Search
                    ↓
            Click Export Button
                    ↓
            Export API → Fetch All Data
                       → Generate Excel
                       → Download File
                    ↓
            Navigate to Questions
                    ↓
            View Question List
            Create/Edit/Delete Questions
                    ↓
            Changes Saved to Database
```

## Authentication and Authorization Patterns

### User Authentication (OTP-based)

**Implementation Strategy:**
- Use Supabase Auth's Magic Link functionality adapted for OTP
- Store OTP codes in a custom `otp_codes` table with expiry
- Generate 6-digit numeric codes for simplicity
- 10-minute expiry window
- Rate limiting: 3 attempts per email per hour

**Token Management:**
- Supabase JWT tokens with 30-day expiry
- Stored in httpOnly cookies (not localStorage for security)
- Automatic refresh before expiry
- Logout clears token and redirects to landing

**Middleware Protection:**
```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')
  const path = request.nextUrl.pathname

  // Public routes
  if (path === '/' || path.startsWith('/login')) {
    return NextResponse.next()
  }

  // Protected user routes
  if (path.startsWith('/dashboard') || path.startsWith('/session')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    const user = await verifyUserToken(token)
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Protected admin routes
  if (path.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/admin-login', request.url))
    }
    const admin = await verifyAdminToken(token)
    if (!admin) {
      return NextResponse.redirect(new URL('/admin-login', request.url))
    }
  }

  return NextResponse.next()
}
```

### Admin Authentication (Email + Password)

**Implementation Strategy:**
- Separate `admin_users` table (not in Supabase Auth)
- Bcrypt password hashing with salt rounds = 12
- Separate admin JWT tokens with different secret
- Admin tokens expire after 7 days (shorter than user tokens)
- No password reset flow (admin managed manually)

**Role Separation:**
- User tokens cannot access admin routes
- Admin tokens cannot access user routes
- Separate middleware checks for each role
- Different cookie names: `user-token` vs `admin-token`

### Row Level Security (RLS)

Supabase RLS policies ensure data isolation:
- Users can only read/write their own profile data
- Users can only read/write their own test submissions
- Users can only read/write their own session progress
- Quiz questions and session content are read-only for users
- Admin API bypasses RLS using service role key

## Animation and Interaction Patterns

### Animation Library Configuration

**framer-motion Setup:**
```typescript
// lib/animations/variants.ts
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } }
}

export const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
}

export const slideInFromRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
}

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}
```

### Progress Ring Animation

```typescript
// components/dashboard/ProgressRing.tsx
import { motion } from 'framer-motion'

export function ProgressRing({ percentage }: { percentage: number }) {
  const circumference = 2 * Math.PI * 90 // radius = 90
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <svg width="200" height="200" viewBox="0 0 200 200">
      {/* Background circle */}
      <circle
        cx="100"
        cy="100"
        r="90"
        fill="none"
        stroke="#E5E7EB"
        strokeWidth="12"
      />
      {/* Animated progress circle */}
      <motion.circle
        cx="100"
        cy="100"
        r="90"
        fill="none"
        stroke="url(#gradient)"
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        transform="rotate(-90 100 100)"
      />
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
      </defs>
      {/* Percentage text */}
      <motion.text
        x="100"
        y="100"
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-4xl font-bold"
        fill="#1F2937"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        {percentage}%
      </motion.text>
    </svg>
  )
}
```

### Quiz Question Transitions

```typescript
// components/test/QuestionCard.tsx
import { motion, AnimatePresence } from 'framer-motion'

export function QuestionCard({ question, onAnswer, direction }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: direction === 'next' ? 100 : -100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: direction === 'next' ? -100 : 100 }}
        transition={{ duration: 0.3 }}
        className="question-card"
      >
        <h2>{question.question_text}</h2>
        <div className="button-group">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAnswer(true)}
          >
            Benar
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAnswer(false)}
          >
            Salah
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
```

### Confetti Effect

```typescript
// components/results/ConfettiEffect.tsx
import confetti from 'canvas-confetti'
import { useEffect } from 'react'

export function ConfettiEffect() {
  useEffect(() => {
    const duration = 3000
    const end = Date.now() + duration

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#2563EB', '#10B981', '#F59E0B']
      })
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#2563EB', '#10B981', '#F59E0B']
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }

    frame()
  }, [])

  return null
}
```

### Scroll Animations

```typescript
// components/landing/HeroSection.tsx
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export function HeroSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={staggerContainer}
    >
      <motion.h1 variants={slideUp}>
        Belajar Pneumonia Balita
      </motion.h1>
      <motion.p variants={slideUp}>
        Program 5 hari untuk ibu Indonesia
      </motion.p>
      <motion.button variants={slideUp}>
        Mulai Sekarang
      </motion.button>
    </motion.section>
  )
}
```

### Loading States

```typescript
// components/shared/LoadingSpinner.tsx
import { motion } from 'framer-motion'

export function LoadingSpinner() {
  return (
    <motion.div
      className="spinner"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <div className="spinner-circle" />
    </motion.div>
  )
}
```

### Reduced Motion Support

```typescript
// lib/hooks/useReducedMotion.ts
import { useEffect, useState } from 'react'

export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const listener = (e) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', listener)
    return () => mediaQuery.removeEventListener('change', listener)
  }, [])

  return prefersReducedMotion
}

// Usage in components:
const prefersReducedMotion = useReducedMotion()
const animationDuration = prefersReducedMotion ? 0 : 0.3
```

## Media Asset Management Strategy

### Supabase Storage Configuration

**Bucket Setup:**
```typescript
// Create bucket via Supabase dashboard or migration
// Bucket name: 'media-assets'
// Public: true
// File size limit: 50MB
// Allowed MIME types: image/*, video/*
```

**Upload Strategy:**
- Admin uploads via admin panel
- Files stored with original names for easy reference
- Automatic image optimization (WebP conversion)
- Video transcoding for web playback
- CDN caching enabled

### Media Component Implementation

```typescript
// components/session/MediaEmbed.tsx
import Image from 'next/image'
import { useState } from 'react'

export function MediaEmbed({ type, filename, alt }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  
  const mediaUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media-assets/${type}/${filename}`

  if (type === 'image') {
    return (
      <div className="media-container">
        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message="Gagal memuat gambar" />}
        <Image
          src={mediaUrl}
          alt={alt}
          width={800}
          height={600}
          onLoadingComplete={() => setLoading(false)}
          onError={() => {
            setLoading(false)
            setError(true)
          }}
          className="rounded-lg shadow-lg"
        />
      </div>
    )
  }

  if (type === 'video') {
    return (
      <div className="media-container">
        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message="Gagal memuat video" />}
        <video
          src={mediaUrl}
          controls
          onLoadedData={() => setLoading(false)}
          onError={() => {
            setLoading(false)
            setError(true)
          }}
          className="rounded-lg shadow-lg w-full"
        >
          Browser Anda tidak mendukung video.
        </video>
      </div>
    )
  }

  return null
}
```

### Content Renderer with Media

```typescript
// components/session/ContentRenderer.tsx
export function ContentRenderer({ sections }) {
  return (
    <div className="content-renderer space-y-6">
      {sections.map((section, index) => {
        switch (section.type) {
          case 'heading':
            return <h2 key={index} className="text-2xl font-bold">{section.content}</h2>
          
          case 'paragraph':
            return <p key={index} className="text-gray-700">{section.content}</p>
          
          case 'list':
            return (
              <ul key={index} className="list-disc list-inside space-y-2">
                {section.content.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )
          
          case 'image':
            return (
              <MediaEmbed
                key={index}
                type="image"
                filename={section.media_url}
                alt={section.content}
              />
            )
          
          case 'video':
            return (
              <MediaEmbed
                key={index}
                type="video"
                filename={section.media_url}
                alt={section.content}
              />
            )
          
          default:
            return null
        }
      })}
    </div>
  )
}
```

### Performance Optimization

**Image Optimization:**
- Next.js Image component for automatic optimization
- Lazy loading for below-the-fold images
- Responsive images with srcset
- WebP format with fallback

**Video Optimization:**
- Preload metadata only (not full video)
- Lazy load video elements
- Poster images for video thumbnails
- Streaming from Supabase CDN

**Caching Strategy:**
```typescript
// next.config.js
module.exports = {
  images: {
    domains: [process.env.NEXT_PUBLIC_SUPABASE_URL],
    formats: ['image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
}
```

## Deployment and Environment Configuration

### Environment Variables

```bash
# .env.local (development)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Admin credentials (for initial setup)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD_HASH=bcrypt-hashed-password

# Email configuration (Supabase handles this)
# No additional env vars needed for OTP emails
```

```bash
# .env.production (Vercel)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Set via Vercel dashboard, encrypted at rest
```

### Vercel Deployment Configuration

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["sin1"],
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key",
    "SUPABASE_SERVICE_ROLE_KEY": "@supabase-service-key"
  }
}
```

### Supabase Production Setup

1. **Database Migration:**
   - Run migration SQL via Supabase dashboard
   - Enable RLS on all tables
   - Create indexes for performance
   - Seed initial quiz questions

2. **Storage Configuration:**
   - Create `media-assets` bucket
   - Set public access
   - Upload all media files
   - Enable CDN caching

3. **Auth Configuration:**
   - Enable email provider
   - Configure email templates (OTP)
   - Set token expiry to 30 days
   - Configure rate limiting

4. **API Configuration:**
   - Enable realtime (optional for future features)
   - Configure CORS for custom domain
   - Set up database backups (daily)

### Custom Domain Setup

1. Add domain in Vercel dashboard
2. Configure DNS records:
   - A record: @ → Vercel IP
   - CNAME record: www → cname.vercel-dns.com
3. Enable HTTPS (automatic via Vercel)
4. Update NEXT_PUBLIC_APP_URL environment variable

### Monitoring and Error Tracking

**Vercel Analytics:**
- Automatic page view tracking
- Web Vitals monitoring
- Real User Monitoring (RUM)

**Supabase Monitoring:**
- Database query performance
- API request logs
- Storage usage metrics

**Error Tracking (Optional - Sentry):**
```typescript
// lib/sentry.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
})
```

### Deployment Checklist

- [ ] Environment variables configured in Vercel
- [ ] Supabase production database migrated
- [ ] Media assets uploaded to Supabase Storage
- [ ] Admin user created in database
- [ ] Quiz questions seeded (23 questions)
- [ ] Session content populated (5 days)
- [ ] Custom domain configured and HTTPS enabled
- [ ] RLS policies tested and verified
- [ ] Mobile responsiveness tested (375px+)
- [ ] OTP email delivery tested
- [ ] Admin panel access verified
- [ ] Data export functionality tested
- [ ] Performance metrics reviewed (Lighthouse score > 90)
- [ ] Error tracking configured
- [ ] Database backups enabled

