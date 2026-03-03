# Checkpoint 7: Setup and Execution Guide

## Quick Start

Follow these steps to execute Checkpoint 7 testing:

### Step 1: Generate Admin Password Hash

```bash
npm run generate:hash admin123
```

Copy the generated hash and add it to your `.env.local`:

```env
ADMIN_PASSWORD_HASH=<paste-the-hash-here>
```

### Step 2: Seed Admin User

```bash
npm run seed:admin
```

Expected output:
```
Seeding admin user...
✓ Admin user created successfully
Email: admin@example.com
ID: <uuid>
```

### Step 3: Start Development Server

```bash
npm run dev
```

Wait for the server to start. You should see:
```
▲ Next.js 16.1.6 (Turbopack)
- Local:         http://localhost:3000
```

### Step 4: Run Automated Tests

Open a new terminal and run:

```bash
./tests/checkpoint-7-test.sh
```

This will test:
- Server health
- Page accessibility
- API endpoints
- Middleware protection
- Route structure

### Step 5: Manual Testing

Follow the checklist in `tests/checkpoint-7-manual-tests.md`:

1. **Test User OTP Login**
   - Go to http://localhost:3000
   - Click login button
   - Enter email: `test-user@example.com`
   - Check Supabase dashboard for OTP code
   - Complete verification

2. **Test Profile Setup**
   - Fill in mother and child information
   - Submit form
   - Verify redirect to dashboard

3. **Test Admin Login**
   - Go to http://localhost:3000/admin-login
   - Email: `admin@example.com`
   - Password: `admin123`
   - Verify successful login

4. **Test Middleware Protection**
   - Open incognito window
   - Try accessing protected routes
   - Verify redirects work

### Step 6: Verify Database

Login to Supabase dashboard and check:

1. **auth.users table**
   - Test user should exist

2. **mother_profiles table**
   - Profile data should be saved

3. **child_profiles table**
   - Child data with calculated age

4. **admin_users table**
   - Admin user should exist

### Step 7: Document Results

Fill in the test results in:
- `tests/checkpoint-7-manual-tests.md`
- `tests/checkpoint-7-report.md`

## Troubleshooting

### Issue: OTP not received

**Solution:**
1. Check Supabase dashboard > Authentication > Logs
2. Look for the OTP code in the logs
3. Verify email configuration in Supabase settings

### Issue: Admin login fails

**Solution:**
1. Verify admin user exists in database:
   ```sql
   SELECT * FROM admin_users WHERE email = 'admin@example.com';
   ```
2. Regenerate password hash if needed
3. Re-run seed script

### Issue: Middleware redirects not working

**Solution:**
1. Check middleware.ts is in root directory
2. Verify token is being set correctly
3. Check browser console for errors
4. Clear cookies and try again

### Issue: Profile setup fails

**Solution:**
1. Check Supabase RLS policies are enabled
2. Verify token is valid
3. Check browser console for API errors
4. Verify database tables exist

## Environment Variables Checklist

Ensure these are set in `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
JWT_SECRET=your-jwt-secret-min-32-chars

# Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD_HASH=<generated-hash>
```

## Database Migration Checklist

Ensure migrations are applied:

```bash
# Check if tables exist in Supabase dashboard
# Required tables:
# - mother_profiles
# - child_profiles
# - quiz_questions
# - test_submissions
# - session_progress
# - session_content
# - admin_users
```

If tables don't exist, apply migration:
1. Go to Supabase dashboard > SQL Editor
2. Copy content from `supabase/migrations/001_initial_schema.sql`
3. Run the SQL

## Success Criteria

Checkpoint 7 is complete when:

- [x] Build completes without errors
- [x] No TypeScript diagnostics errors
- [ ] Automated tests pass (run `./tests/checkpoint-7-test.sh`)
- [ ] User OTP login works end-to-end
- [ ] Profile setup saves data correctly
- [ ] Admin login works
- [ ] Middleware protects all routes
- [ ] Database contains test data
- [ ] All manual tests documented

## Next Steps

After completing Checkpoint 7:

1. Review test results
2. Fix any issues found
3. Document any edge cases
4. Get sign-off from team/stakeholder
5. Proceed to Task 8: Quiz Question Management

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review error messages in browser console
3. Check Supabase logs
4. Review middleware.ts and API route files
5. Verify environment variables are correct

## Test Files Reference

- `tests/checkpoint-7-test.sh` - Automated API tests
- `tests/checkpoint-7-manual-tests.md` - Manual testing checklist
- `tests/checkpoint-7-report.md` - Test results documentation
- `tests/CHECKPOINT-7-SETUP.md` - This file
