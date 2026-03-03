# Pre-Test Unit Tests

This directory contains unit tests for the pre-test functionality of the E-Health Education Pneumonia Balita application.

## Test Coverage

### 1. Score Calculation Tests (`__tests__/lib/utils/score-calculator.test.ts`)

Tests the core score calculation logic:

- ✅ Calculates correct score when all answers are correct (23/23)
- ✅ Calculates correct score when all answers are wrong (0/23)
- ✅ Calculates partial scores correctly
- ✅ Handles mixed true/false answers
- ✅ Throws error for mismatched array lengths
- ✅ Handles empty arrays

### 2. Answer Validation Tests (`__tests__/lib/utils/score-calculator.test.ts`)

Tests input validation for answer submissions:

- ✅ Validates correct answers array (23 boolean values)
- ✅ Rejects non-array input
- ✅ Rejects arrays with wrong length (not 23)
- ✅ Rejects arrays with non-boolean values
- ✅ Rejects arrays with null values
- ✅ Rejects arrays with undefined values
- ✅ Validates mixed true/false answers

### 3. Percentage Calculation Tests (`__tests__/lib/utils/score-calculator.test.ts`)

Tests percentage score calculation:

- ✅ Calculates 100% for perfect score
- ✅ Calculates 0% for zero score
- ✅ Calculates 50% for half score
- ✅ Rounds to nearest integer
- ✅ Handles zero total gracefully
- ✅ Works with different totals

### 4. API Integration Tests (`__tests__/api/test/submit-pre.test.ts`)

Tests the complete pre-test submission API:

#### Score Calculation
- ✅ Calculates score correctly when all answers are correct
- ✅ Calculates score correctly when some answers are wrong
- ✅ Calculates score correctly when all answers are wrong

#### Answer Validation
- ✅ Rejects request without authorization header
- ✅ Rejects request with invalid token
- ✅ Rejects answers that are not an array
- ✅ Rejects answers with incorrect length
- ✅ Rejects answers with non-boolean values
- ✅ Rejects duplicate pre-test submission

#### Session Unlock
- ✅ Unlocks Day 1 session after successful pre-test submission
- ✅ Still succeeds even if session unlock fails (graceful degradation)

## Requirements Coverage

These tests satisfy the following requirements from the spec:

- **Requirement 3.6**: Test submission storage and score calculation
- **Requirement 3.7**: Test score calculation against correct answers
- **Requirement 3.8**: Test Day 1 session unlock after pre-test completion

## Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

## Test Framework

- **Vitest**: Modern, fast unit test framework
- **@testing-library/react**: React component testing utilities
- **@testing-library/jest-dom**: Custom matchers for DOM assertions

## Test Structure

Tests follow the AAA pattern:
1. **Arrange**: Set up test data and mocks
2. **Act**: Execute the function/API being tested
3. **Assert**: Verify the expected outcome

## Mocking Strategy

- Supabase client is mocked to avoid database dependencies
- Authentication token verification is mocked
- All external dependencies are isolated for unit testing

## Future Improvements

- Add integration tests with real Supabase instance
- Add E2E tests for complete user flow
- Add performance tests for large answer sets
- Add tests for concurrent submissions
