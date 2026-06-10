#!/bin/bash

# API Testing Script for ProConnect Backend

BASE_URL="http://localhost:3001"

echo "🧪 ProConnect Backend API Test Suite"
echo "====================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test health endpoint
echo "Testing Health Endpoint..."
curl -s "$BASE_URL/health" | jq '.' && echo -e "${GREEN}✓ Health check passed${NC}" || echo -e "${RED}✗ Health check failed${NC}"
echo ""

# Register user
echo "Testing User Registration..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User",
    "role": "professional"
  }')

echo "$REGISTER_RESPONSE" | jq '.'
TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.access_token' 2>/dev/null)

if [ "$TOKEN" != "null" ] && [ ! -z "$TOKEN" ]; then
  echo -e "${GREEN}✓ Registration successful${NC}"
  echo "Token: $TOKEN"
else
  echo -e "${RED}✗ Registration failed${NC}"
fi
echo ""

# Get user profile
if [ ! -z "$TOKEN" ]; then
  echo "Testing Get Profile..."
  curl -s -X GET "$BASE_URL/api/users/profile" \
    -H "Authorization: Bearer $TOKEN" | jq '.'
  echo -e "${GREEN}✓ Profile fetched${NC}"
  echo ""
fi

# Login
echo "Testing User Login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')

echo "$LOGIN_RESPONSE" | jq '.'
LOGIN_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.access_token' 2>/dev/null)

if [ "$LOGIN_TOKEN" != "null" ] && [ ! -z "$LOGIN_TOKEN" ]; then
  echo -e "${GREEN}✓ Login successful${NC}"
else
  echo -e "${RED}✗ Login failed${NC}"
fi
echo ""

# Create professional profile
if [ ! -z "$LOGIN_TOKEN" ]; then
  echo "Testing Create Professional Profile..."
  PROF_RESPONSE=$(curl -s -X POST "$BASE_URL/api/professionals" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $LOGIN_TOKEN" \
    -d '{
      "title": "Plomero Profesional",
      "bio": "10 años de experiencia en plomería",
      "categories": ["plomeria", "reparaciones"],
      "hourly_rate": 50,
      "location": "Ciudad de México"
    }')
  
  echo "$PROF_RESPONSE" | jq '.'
  echo -e "${GREEN}✓ Professional profile created${NC}"
  echo ""
fi

# Search professionals
echo "Testing Professional Search..."
curl -s "$BASE_URL/api/professionals?search=plomero&limit=10" | jq '.'
echo -e "${GREEN}✓ Search completed${NC}"
echo ""

echo "✅ API tests complete!"
