#!/bin/sh
# 1) Regenerate route HTML once at start (deploy / restart)
# 2) Start internal hook so backend can regenerate on blog publish
# 3) Start nginx
# Optional polling: set ROUTE_HTML_REFRESH_SECONDS > 0 (default 0 = off)
set -eu

API_BASE="${VITE_API_BASE_URL:-http://backend:4000/api}"
export VITE_API_BASE_URL="$API_BASE"
export HTML_DIST="${HTML_DIST:-/usr/share/nginx/html}"
HOOK_PORT="${ROUTE_SHELL_HOOK_PORT:-9090}"
REFRESH_SECONDS="${ROUTE_HTML_REFRESH_SECONDS:-0}"

regen() {
  echo "[website] Regenerating route HTML shells from ${API_BASE} → ${HTML_DIST}"
  if node /app/scripts/generate-route-html.mjs; then
    echo "[website] Route HTML shells updated."
  else
    echo "[website] WARN: route HTML regen failed (nginx will still start)."
  fi
}

i=0
while [ "$i" -lt 30 ]; do
  if node -e "fetch(process.env.VITE_API_BASE_URL+'/public/blogs').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"; then
    break
  fi
  i=$((i + 1))
  sleep 2
done

regen

node /app/scripts/route-shell-hook.mjs &

if [ "$REFRESH_SECONDS" -gt 0 ] 2>/dev/null; then
  echo "[website] Optional refresh loop every ${REFRESH_SECONDS}s"
  (
    while true; do
      sleep "$REFRESH_SECONDS"
      regen || true
    done
  ) &
fi

exec nginx -g 'daemon off;'
