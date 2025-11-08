#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:5173"
PASS=0
FAIL=0

echo "🚀 Creator Network API Test Suite"
echo "=================================="
echo ""

# Function to test endpoint
test_endpoint() {
  local method=$1
  local endpoint=$2
  local data=$3
  local expected_code=$4
  local description=$5

  if [ -z "$data" ]; then
    response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint" -H "Content-Type: application/json")
  else
    response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint" -H "Content-Type: application/json" -d "$data")
  fi

  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | head -n-1)

  if [ "$http_code" = "$expected_code" ]; then
    echo -e "${GREEN}✓${NC} $method $endpoint ($http_code) - $description"
    ((PASS++))
  else
    echo -e "${RED}✗${NC} $method $endpoint (expected $expected_code, got $http_code) - $description"
    echo "  Response: $body"
    ((FAIL++))
  fi
}

# Test 1: Health check
echo "Testing API Health..."
test_endpoint "GET" "/api/health" "" "200" "API is healthy"
echo ""

# Test 2: Get creators list
echo "Testing Creators Endpoints..."
test_endpoint "GET" "/api/creators" "" "200" "Get creators list"
test_endpoint "GET" "/api/creators?page=1&limit=10" "" "200" "Get creators with pagination"
test_endpoint "GET" "/api/creators?arm=gameforge" "" "200" "Get creators filtered by arm"
test_endpoint "GET" "/api/creators?search=test" "" "200" "Get creators with search"
test_endpoint "GET" "/api/creators/nonexistent" "" "404" "Get non-existent creator"
echo ""

# Test 3: Create creator (requires valid user_id in auth context)
echo "Testing Creator Creation..."
test_endpoint "POST" "/api/creators" '{"user_id":"test-123","username":"testcreator1","bio":"Test creator","experience_level":"intermediate","primary_arm":"gameforge"}' "201" "Create creator profile"
echo ""

# Test 4: Get opportunities list
echo "Testing Opportunities Endpoints..."
test_endpoint "GET" "/api/opportunities" "" "200" "Get opportunities list"
test_endpoint "GET" "/api/opportunities?page=1&limit=10" "" "200" "Get opportunities with pagination"
test_endpoint "GET" "/api/opportunities?arm=gameforge" "" "200" "Get opportunities filtered by arm"
test_endpoint "GET" "/api/opportunities?sort=oldest" "" "200" "Get opportunities sorted"
test_endpoint "GET" "/api/opportunities/nonexistent" "" "404" "Get non-existent opportunity"
echo ""

# Test 5: Create opportunity (should fail - no creator)
echo "Testing Opportunity Creation..."
test_endpoint "POST" "/api/opportunities" '{"user_id":"no-creator","title":"Test Job","description":"A test job"}' "404" "Create opportunity without creator profile"
echo ""

# Test 6: Get applications
echo "Testing Applications Endpoints..."
test_endpoint "GET" "/api/applications" "" "400" "Get applications without user_id (should fail)"
test_endpoint "GET" "/api/applications?user_id=test-user" "" "404" "Get applications for non-existent user"
echo ""

# Test 7: DevConnect endpoints
echo "Testing DevConnect Endpoints..."
test_endpoint "POST" "/api/devconnect/link" '{"user_id":"no-creator","devconnect_username":"testuser"}' "404" "Link DevConnect without creator profile"
test_endpoint "GET" "/api/devconnect/link" "" "400" "Get DevConnect link without user_id"
test_endpoint "DELETE" "/api/devconnect/link" '{"user_id":"no-user"}' "404" "Unlink DevConnect for non-existent user"
echo ""

# Summary
echo "=================================="
echo -e "Test Results: ${GREEN}$PASS passed${NC}, ${RED}$FAIL failed${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
  echo -e "${GREEN}✅ All tests passed!${NC}"
  exit 0
else
  echo -e "${RED}❌ Some tests failed${NC}"
  exit 1
fi
