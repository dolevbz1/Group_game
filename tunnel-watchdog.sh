#!/bin/bash
# Keeps a Cloudflare quick tunnel alive for the local Vite dev server.
# Restarts cloudflared automatically if it dies, and writes the current
# public URL to tunnel-url.txt every time it changes.

URL_FILE="$(dirname "$0")/tunnel-url.txt"
LOCAL_PORT=5173

while true; do
  echo "[watchdog] starting cloudflared tunnel..."
  cloudflared tunnel --url "http://localhost:${LOCAL_PORT}" 2>&1 | while IFS= read -r line; do
    echo "$line"
    if [[ "$line" == *"trycloudflare.com"* && "$line" == *"https://"* ]]; then
      url=$(echo "$line" | grep -oE 'https://[a-zA-Z0-9.-]+\.trycloudflare\.com')
      if [[ -n "$url" ]]; then
        echo "$url" > "$URL_FILE"
        echo "[watchdog] new URL saved: $url"
      fi
    fi
  done
  echo "[watchdog] cloudflared exited, restarting in 3s..."
  sleep 3
done
