#!/bin/bash

BASE_URL="${1:-http://localhost:3333}"

echo "=== Health ==="
curl -s "$BASE_URL/health" | jq .
echo ""

echo "=== Models ==="
curl -s "$BASE_URL/models" | jq .
echo ""

echo "=== Voices ==="
curl -s "$BASE_URL/voices" | jq .
echo ""

echo "=== Formats ==="
curl -s "$BASE_URL/formats" | jq .
echo ""

echo "=== Generating speech (WAV) ==="
curl -s -X POST "$BASE_URL/tts" \
    -H 'Content-Type: application/json' \
    -d '{"text":"Hello, this is a test of the Qwen3 text to speech system.","voice":"Chelsie","language":"English","format":"wav"}' \
    --output test-output.wav

if [ -f test-output.wav ] && [ -s test-output.wav ]; then
    SIZE=$(wc -c < test-output.wav | tr -d ' ')
    echo "Saved test-output.wav (${SIZE} bytes)"
else
    echo "Failed to generate audio"
    cat test-output.wav 2>/dev/null
    rm -f test-output.wav
fi