#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/.."

echo "Building new_shapes app..."
npm run build

echo ""
echo "Deploying to Vercel (you may need to log in once)..."
npx vercel deploy --prebuilt --prod
