#!/bin/bash

echo "=========================================="
echo "🧪 TEST API - Impro Manager v2.0"
echo "=========================================="
echo ""

BASE_URL="http://localhost:3001"

# Couleurs pour output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

test_count=0
pass_count=0

run_test() {
    test_count=$((test_count + 1))
    echo "Test $test_count: $1"
    if eval "$2" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PASS${NC}"
        pass_count=$((pass_count + 1))
    else
        echo -e "${RED}❌ FAIL${NC}"
        echo "Command: $2"
    fi
    echo ""
}

echo "=== 1. HEALTH CHECK ==="
curl -s $BASE_URL/api/health | python -m json.tool
echo ""
echo ""

echo "=== 2. GET /api/personnel ==="
run_test "Liste personnel" "curl -s $BASE_URL/api/personnel | python -m json.tool | grep person_001"

echo "=== 3. GET /api/personnel?role=mc ==="
curl -s "$BASE_URL/api/personnel?role=mc" | python -m json.tool | head -n 20
echo ""

echo "=== 4. GET /api/personnel/:id ==="
curl -s $BASE_URL/api/personnel/person_001 | python -m json.tool
echo ""

echo "=== 5. POST /api/matches (Créer match) ==="
NEW_MATCH=$(curl -s -X POST $BASE_URL/api/matches \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Match Test API",
    "date": "2025-10-20T19:00:00Z",
    "location": "Salle Test",
    "teams": {
      "home": {"name": "Équipe A", "color": "#FF0000", "score": 0},
      "away": {"name": "Équipe B", "color": "#0000FF", "score": 0}
    },
    "personnel": {
      "mc": {"personnel_id": "person_001", "name": "Julie Renard"},
      "sound": {"personnel_id": "person_002", "name": "Marc Dupont"}
    },
    "lines": [],
    "status": "draft"
  }')

echo "$NEW_MATCH" | python -m json.tool
MATCH_ID=$(echo "$NEW_MATCH" | python -c "import sys, json; print(json.load(sys.stdin).get('match_id', ''))" 2>/dev/null)
echo ""
echo "Match ID créé: $MATCH_ID"
echo ""

if [ -n "$MATCH_ID" ] && [ "$MATCH_ID" != "" ]; then
    echo "=== 6. GET /api/matches/:id ==="
    curl -s $BASE_URL/api/matches/$MATCH_ID | python -m json.tool | head -n 25
    echo ""

    echo "=== 7. PUT /api/matches/:id (Modifier match) ==="
    curl -s -X PUT $BASE_URL/api/matches/$MATCH_ID \
      -H "Content-Type: application/json" \
      -d '{
        "title": "Match Test API - MODIFIÉ",
        "date": "2025-10-20T19:00:00Z",
        "location": "Salle Test Modifiée",
        "teams": {
          "home": {"name": "Équipe A", "color": "#FF0000", "score": 5},
          "away": {"name": "Équipe B", "color": "#0000FF", "score": 3}
        },
        "personnel": {
          "mc": {"personnel_id": "person_001", "name": "Julie Renard"},
          "sound": {"personnel_id": "person_002", "name": "Marc Dupont"}
        },
        "lines": [],
        "status": "ready"
      }' | python -m json.tool | head -n 25
    echo ""

    echo "=== 8. DELETE /api/matches/:id ==="
    curl -s -X DELETE $BASE_URL/api/matches/$MATCH_ID | python -m json.tool
    echo ""

    echo "=== 9. Vérifier suppression ==="
    curl -s $BASE_URL/api/matches/$MATCH_ID | python -m json.tool
    echo ""
else
    echo "❌ ERREUR: Impossible de créer un match. Tests CRUD interrompus."
    echo ""
fi

echo "=== 10. POST /api/personnel (Créer membre) ==="
NEW_MEMBER=$(curl -s -X POST $BASE_URL/api/personnel \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "roles": ["player"],
    "status": "active"
  }')

echo "$NEW_MEMBER" | python -m json.tool
PERSON_ID=$(echo "$NEW_MEMBER" | python -c "import sys, json; print(json.load(sys.stdin).get('personnel_id', ''))" 2>/dev/null)
echo ""

if [ -n "$PERSON_ID" ] && [ "$PERSON_ID" != "" ]; then
    echo "=== 11. PUT /api/personnel/:id (Modifier membre) ==="
    curl -s -X PUT $BASE_URL/api/personnel/$PERSON_ID \
      -H "Content-Type: application/json" \
      -d '{
        "name": "Test User MODIFIÉ",
        "email": "test@example.com",
        "roles": ["player", "referee"],
        "status": "active",
        "bio": "Bio ajoutée lors du test"
      }' | python -m json.tool
    echo ""

    echo "=== 12. DELETE /api/personnel/:id ==="
    curl -s -X DELETE $BASE_URL/api/personnel/$PERSON_ID | python -m json.tool
    echo ""
else
    echo "❌ ERREUR: Impossible de créer un membre."
    echo ""
fi

echo "=== 13. GET /api/music (échantillon) ==="
curl -s $BASE_URL/api/music | python -c "import sys, json; data = json.load(sys.stdin); print(f'Total: {len(data)} pistes'); print(json.dumps(data[0] if data else {}, indent=2))"
echo ""

echo "=========================================="
echo "🏁 TESTS TERMINÉS"
echo "=========================================="
