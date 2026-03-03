# E-Health Education Pneumonia Balita

Platform edukasi kesehatan berbasis web untuk meningkatkan pengetahuan ibu tentang pneumonia pada balita melalui program pembelajaran 5 hari yang terstruktur.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Animations**: framer-motion, react-intersection-observer
- **Backend**: Supabase (Auth, PostgreSQL, Storage)
- **Data Export**: xlsx
- **Celebrations**: canvas-confetti

## Design System

### Colors
- **Primary (Medical Blue)**: `#2563EB`
- **Secondary (Health Green)**: `#10B981`

### Typography
- **Headings**: Plus Jakarta Sans
- **Body**: Inter

### Visual Effects
- Glassmorphism effects on cards and panels
- Soft gradients on backgrounds
- Floating shapes as decorative elements
- Smooth animations with reduced motion support

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd e-health-pneumonia-balita
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
e-health-pneumonia-balita/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication routes
│   ├── (user)/              # User portal routes
│   ├── (admin)/             # Admin panel routes
│   ├── api/                 # API routes
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── auth/                # Authentication components
│   ├── dashboard/           # Dashboard components
│   ├── test/                # Quiz components
│   ├── session/             # Learning session components
│   ├── results/             # Results components
│   ├── admin/               # Admin panel components
│   ├── landing/             # Landing page components
│   └── shared/              # Shared components
├── lib/                     # Utilities and configurations
│   ├── supabase/            # Supabase client and types
│   ├── utils/               # Utility functions
│   ├── hooks/               # Custom React hooks
│   ├── constants/           # Constants and content
│   └── validations/         # Zod schemas
├── supabase/                # Supabase migrations
│   └── migrations/
└── public/                  # Static assets
```

## Features

### User Features
- **OTP Authentication**: Email-based one-time password login
- **Profile Setup**: Mother and child information collection
- **Pre-Test**: 23-question assessment before learning
- **5-Day Learning Program**: Progressive content unlocking with 24-hour intervals
- **Post-Test**: Final assessment after completing all sessions
- **Results Visualization**: Score comparison with confetti celebration
- **Progress Tracking**: Visual progress ring and session status

### Admin Features
- **Email+Password Authentication**: Secure admin login
- **Dashboard Analytics**: User statistics and average scores
- **Respondent Management**: View and search all user data
- **Data Export**: Export to Excel for analysis
- **Quiz Management**: CRUD operations for quiz questions

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow Next.js 14 App Router conventions
- Use Tailwind CSS for styling
- Implement responsive design (mobile-first, 375px+)
- Add framer-motion animations with reduced motion support

### Component Guidelines
- Use shadcn/ui components for consistency
- Create reusable components in `components/shared/`
- Keep components small and focused
- Use proper TypeScript interfaces

### API Guidelines
- All API routes in `app/api/`
- Use Supabase for data operations
- Implement proper error handling
- Return consistent response formats

## Deployment

The application is designed to be deployed on Vercel with Supabase as the backend.

### Deployment Checklist
- [ ] Set up Supabase production instance
- [ ] Run database migrations
- [ ] Upload media assets to Supabase Storage
- [ ] Configure environment variables in Vercel
- [ ] Set up custom domain
- [ ] Enable HTTPS
- [ ] Test all features in production

## License

This project is private and proprietary.

## Support

For support, please contact the development team.
