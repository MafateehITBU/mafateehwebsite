#!/bin/sh
# Regenerate per-route HTML shells (including newly published blogs) then start nginx.
# Direct blog URLs need these files — in-app SPA navigation does not.
set -eu

API_BASE="${VITE_API_BASE_URL:-http://backend:4000/api}"
export VITE_API_BASE_URL="$API_BASE"
export HTML_DIST="${HTML_DIST:-/usr/share/nginx/html}"

regen() {
  echo "[website] Regenerating route HTML shells from ${API_BASE} → ${HTML_DIST}"
  if node /app/scripts/generate-route-html.mjs; then
    echo "[website] Route HTML shells updated."
  else
    echo "[website] WARN: route HTML regen failed (nginx will still start)."
  fi
}

# Wait briefly for backend on first boot (compose start order is not a health guarantee).
i=0
while [ "$i" -lt 30 ]; do
  if node -e "fetch(process.env.VITE_API_BASE_URL+'/public/blogs').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"; then
    break
  fi
  i=$((i + 1))
  sleep 2
done

regen

# Periodically pick up blogs published after deploy (keeps direct links working).
REFRESH_SECONDS="${ROUTE_HTML_REFRESH_SECONDS:-120}"
(
  while true; do
    sleep "$REFRESH_SECONDS"
    regen || true
  done
) &

exec nginx -g 'daemon off;'
