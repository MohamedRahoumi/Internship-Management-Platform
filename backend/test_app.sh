#!/bin/sh
# Register a new intern
echo "--- Register ---"
REG=$(curl -s -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "cin":"XY789012",
    "civility":"M.",
    "nom":"TEST",
    "prenom":"Intern",
    "telephone":"0600000000",
    "email":"intern_test2@test.com",
    "password":"password",
    "password_confirmation":"password"
  }')
echo "$REG"
TOKEN=$(echo "$REG" | sed 's/.*"token":"\([^"]*\)".*/\1/')
echo ""
echo "--- Create Application ---"
curl -s -X POST http://localhost:8000/api/applications \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "cin":"XY789012",
    "civility":"Monsieur",
    "nom":"TEST",
    "prenom":"Intern",
    "telephone":"0600000000",
    "email":"intern_test2@test.com",
    "cycle_formation":"Licence",
    "niveau_etude":"Bac+3",
    "ville_etablissement":"Casablanca",
    "type_etablissement":"Public",
    "nom_complet_etablissement":"Universite Hassan II",
    "specialite":"Informatique",
    "date_debut":"2026-06-29",
    "date_fin":"2026-08-29",
    "duree":2,
    "whatsapp_confirmed":true,
    "dossier_envoye":true,
    "conditions_acceptees":true
  }'


