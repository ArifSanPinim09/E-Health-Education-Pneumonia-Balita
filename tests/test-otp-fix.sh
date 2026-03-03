#!/bin/bash

# Test Script untuk Verifikasi Perbaikan OTP
# Pastikan aplikasi sudah running di http://localhost:3000

echo "=========================================="
echo "Test Perbaikan OTP vs Magic Link"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test email
TEST_EMAIL="test-otp-$(date +%s)@example.com"

echo -e "${YELLOW}📧 Test Email: ${TEST_EMAIL}${NC}"
echo ""

# Test 1: Send OTP pertama kali
echo "Test 1: Kirim OTP pertama kali"
echo "================================"
RESPONSE1=$(curl -s -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${TEST_EMAIL}\"}")

echo "Response: $RESPONSE1"

if echo "$RESPONSE1" | grep -q "success.*true"; then
  echo -e "${GREEN}✅ Test 1 PASSED: OTP berhasil dikirim${NC}"
else
  echo -e "${RED}❌ Test 1 FAILED: OTP gagal dikirim${NC}"
  exit 1
fi

echo ""
echo -e "${YELLOW}⏳ Tunggu 5 detik sebelum test kedua...${NC}"
sleep 5
echo ""

# Test 2: Send OTP kedua kali (email yang sama)
echo "Test 2: Kirim OTP kedua kali (email sama)"
echo "=========================================="
RESPONSE2=$(curl -s -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${TEST_EMAIL}\"}")

echo "Response: $RESPONSE2"

if echo "$RESPONSE2" | grep -q "success.*true"; then
  echo -e "${GREEN}✅ Test 2 PASSED: OTP kedua berhasil dikirim${NC}"
else
  echo -e "${RED}❌ Test 2 FAILED: OTP kedua gagal dikirim${NC}"
  exit 1
fi

echo ""
echo "=========================================="
echo -e "${GREEN}✅ SEMUA TEST PASSED!${NC}"
echo "=========================================="
echo ""
echo "Langkah selanjutnya:"
echo "1. Cek email ${TEST_EMAIL}"
echo "2. Verifikasi bahwa KEDUA email berisi kode OTP (bukan magic link)"
echo "3. Pastikan kode OTP adalah 6-8 digit angka"
echo ""
echo "Jika email berisi magic link, periksa:"
echo "- Supabase Dashboard → Authentication → Providers → Email"
echo "- Pastikan 'Enable Magic Link' di-DISABLE"
echo "- Pastikan 'Confirm email' di-ENABLE"
echo ""
