#!/bin/bash

# Checkpoint 7: End-to-End Authentication and Profile Setup Testing
# This script tests all authentication flows and profile setup

set -e

echo "=========================================="
echo "Checkpoint 7: Authentication & Profile E2E Testing"
echo "=========================================="
echo ""

BASE_URL="http://localhost:3000"
TEST_EMAIL="test-user-$(date +%s)@example.com"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin123"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Helper function to print test results
print_test() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ PASS${NC}: $2"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC}: $2"
        ((TESTS_FAILED++))
    fi
}

# Helper function to check if server is running
check_server() {
    echo "Checking if development server is running..."
    if curl -s -o /dev/null -w "%{http_code}" "$BASE_URL" | grep -q "200\|404"; then
        echo -e "${GREEN}✓${NC} Server is running on $BASE_URL"
        return 0
    else
        echo -e "${RED}✗${NC} Server is not running. Please start with: npm run dev"
        exit 1
    fi
}

echo "1. Server Health Check"
echo "----------------------"
check_server
echo ""

echo "2. Testing Landing Page"
echo "----------------------"
LANDING_RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL")
LANDING_STATUS=$(echo "$LANDING_RESPONSE" | tail -n1)
if [ "$LANDING_STATUS" = "200" ]; then
    print_test 0 "Landing page loads successfully"
else
    print_test 1 "Landing page failed to load (Status: $LANDING_STATUS)"
fi
echo ""

echo "3. Testing User Login Page"
echo "----------------------"
LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/login")
LOGIN_STATUS=$(echo "$LOGIN_RESPONSE" | tail -n1)
if [ "$LOGIN_STATUS" = "200" ]; then
    print_test 0 "User login page loads successfully"
else
    print_test 1 "User login page failed to load (Status: $LOGIN_STATUS)"
fi
echo ""

echo "4. Testing Admin Login Page"
echo "----------------------"
ADMIN_LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/admin-login")
ADMIN_LOGIN_STATUS=$(echo "$ADMIN_LOGIN_RESPONSE" | tail -n1)
if [ "$ADMIN_LOGIN_STATUS" = "200" ]; then
    print_test 0 "Admin login page loads successfully"
else
    print_test 1 "Admin login page failed to load (Status: $ADMIN_LOGIN_STATUS)"
fi
echo ""

echo "5. Testing OTP Send API"
echo "----------------------"
OTP_SEND_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/send-otp" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$TEST_EMAIL\"}" \
    -w "\n%{http_code}")
OTP_SEND_STATUS=$(echo "$OTP_SEND_RESPONSE" | tail -n1)
OTP_SEND_BODY=$(echo "$OTP_SEND_RESPONSE" | head -n-1)

if [ "$OTP_SEND_STATUS" = "200" ]; then
    if echo "$OTP_SEND_BODY" | grep -q "success"; then
        print_test 0 "OTP send API works correctly"
        echo "   Response: $OTP_SEND_BODY"
    else
        print_test 1 "OTP send API returned unexpected response"
        echo "   Response: $OTP_SEND_BODY"
    fi
else
    print_test 1 "OTP send API failed (Status: $OTP_SEND_STATUS)"
    echo "   Response: $OTP_SEND_BODY"
fi
echo ""

echo "6. Testing OTP Verify API (Invalid OTP)"
echo "----------------------"
OTP_VERIFY_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/verify-otp" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$TEST_EMAIL\",\"otp\":\"000000\"}" \
    -w "\n%{http_code}")
OTP_VERIFY_STATUS=$(echo "$OTP_VERIFY_RESPONSE" | tail -n1)
OTP_VERIFY_BODY=$(echo "$OTP_VERIFY_RESPONSE" | head -n-1)

if echo "$OTP_VERIFY_BODY" | grep -q "error\|invalid\|Invalid"; then
    print_test 0 "OTP verify API correctly rejects invalid OTP"
    echo "   Response: $OTP_VERIFY_BODY"
else
    print_test 1 "OTP verify API should reject invalid OTP"
    echo "   Response: $OTP_VERIFY_BODY"
fi
echo ""

echo "7. Testing Admin Login API (Invalid Credentials)"
echo "----------------------"
ADMIN_LOGIN_API_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/admin-login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"wrong@example.com\",\"password\":\"wrongpass\"}" \
    -w "\n%{http_code}")
ADMIN_LOGIN_API_STATUS=$(echo "$ADMIN_LOGIN_API_RESPONSE" | tail -n1)
ADMIN_LOGIN_API_BODY=$(echo "$ADMIN_LOGIN_API_RESPONSE" | head -n-1)

if echo "$ADMIN_LOGIN_API_BODY" | grep -q "error\|invalid\|Invalid"; then
    print_test 0 "Admin login API correctly rejects invalid credentials"
    echo "   Response: $ADMIN_LOGIN_API_BODY"
else
    print_test 1 "Admin login API should reject invalid credentials"
    echo "   Response: $ADMIN_LOGIN_API_BODY"
fi
echo ""

echo "8. Testing Profile Setup Page (Without Auth)"
echo "----------------------"
PROFILE_RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/profile-setup")
PROFILE_STATUS=$(echo "$PROFILE_RESPONSE" | tail -n1)

# Should redirect to login (302/307) or show unauthorized
if [ "$PROFILE_STATUS" = "307" ] || [ "$PROFILE_STATUS" = "302" ] || [ "$PROFILE_STATUS" = "401" ]; then
    print_test 0 "Profile setup page is protected (redirects or blocks unauthenticated access)"
else
    print_test 1 "Profile setup page should be protected by middleware"
fi
echo ""

echo "9. Testing Middleware Protection"
echo "----------------------"
# Test protected routes without authentication
PROTECTED_ROUTES=("/profile-setup" "/dashboard" "/pre-test" "/post-test")
PROTECTED_COUNT=0

for route in "${PROTECTED_ROUTES[@]}"; do
    ROUTE_RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL$route" -L)
    ROUTE_STATUS=$(echo "$ROUTE_RESPONSE" | tail -n1)
    
    # Check if redirected or blocked
    if [ "$ROUTE_STATUS" = "307" ] || [ "$ROUTE_STATUS" = "302" ] || [ "$ROUTE_STATUS" = "401" ] || [ "$ROUTE_STATUS" = "404" ]; then
        ((PROTECTED_COUNT++))
    fi
done

if [ $PROTECTED_COUNT -ge 2 ]; then
    print_test 0 "Middleware correctly protects routes ($PROTECTED_COUNT routes protected)"
else
    print_test 1 "Middleware should protect user routes"
fi
echo ""

echo "10. Testing API Route Structure"
echo "----------------------"
API_ROUTES=(
    "/api/auth/send-otp"
    "/api/auth/verify-otp"
    "/api/auth/admin-login"
    "/api/profile/create"
    "/api/profile/get"
)

API_COUNT=0
for route in "${API_ROUTES[@]}"; do
    API_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL$route" \
        -H "Content-Type: application/json" \
        -d "{}")
    API_STATUS=$(echo "$API_RESPONSE" | tail -n1)
    
    # API should respond (not 404)
    if [ "$API_STATUS" != "404" ]; then
        ((API_COUNT++))
    fi
done

if [ $API_COUNT -eq ${#API_ROUTES[@]} ]; then
    print_test 0 "All API routes are accessible ($API_COUNT/${#API_ROUTES[@]})"
else
    print_test 1 "Some API routes are missing ($API_COUNT/${#API_ROUTES[@]} found)"
fi
echo ""

echo "=========================================="
echo "Test Summary"
echo "=========================================="
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Manually test OTP email delivery (check Supabase Auth logs)"
    echo "2. Complete OTP flow with real code from email"
    echo "3. Test profile setup form submission"
    echo "4. Verify admin login with seeded credentials"
    exit 0
else
    echo -e "${YELLOW}⚠ Some tests failed. Please review the failures above.${NC}"
    exit 1
fi
