#!/usr/bin/env bash
set -e
IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null)
cd "$(dirname "$0")/.."

if [ ! -d dist ]; then
  echo "Building app for phone preview..."
  npx vite build
fi

echo ""
echo "Open on your phone (same Wi-Fi):"
echo "  http://${IP}:4173/new_shapes.html"
echo ""
exec npx vite preview --host --port 4173
