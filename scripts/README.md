# Scripts

This directory contains utility scripts for the E-Health Education Pneumonia Balita application.

## Quiz Questions Seeding

### seed-quiz-questions.ts

Seeds the database with 23 quiz questions about pneumonia balita in Indonesian language.

**Prerequisites:**
- Supabase project configured
- Environment variables set in `.env.local`:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`

**Usage:**

```bash
npx tsx scripts/seed-quiz-questions.ts
```

**What it does:**
- Checks if questions already exist (prevents duplicate seeding)
- Inserts 23 True/False questions about childhood pneumonia
- Questions are in Indonesian language
- Each question has a correct answer and order number

**Questions cover topics:**
- Pneumonia basics and causes
- Symptoms and danger signs
- Vital signs measurement
- Treatment and complications
- Prevention methods
- Home care practices

**Note:** If questions already exist, the script will skip seeding. To re-seed, delete existing questions from the database first.

## Admin User Seeding

### seed-admin.ts

Creates an admin user for accessing the admin panel.

**Usage:**

```bash
npx tsx scripts/seed-admin.ts
```

See the file for more details on admin user creation.
