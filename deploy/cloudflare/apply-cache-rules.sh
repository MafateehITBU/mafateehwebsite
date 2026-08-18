#!/usr/bin/env bash
# Apply Cloudflare cache rules for mafateehgroup.com
# Requires: CLOUDFLARE_API_TOKEN, CLOUDFLARE_ZONE_ID
set -euo pipefail

if [[ -z "${CLOUDFLARE_API_TOKEN:-}" || -z "${CLOUDFLARE_ZONE_ID:-}" ]]; then
  echo "Set CLOUDFLARE_API_TOKEN and CLOUDFLARE_ZONE_ID" >&2
  exit 1
fi

API="https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/rulesets"

create_ruleset() {
  local payload="$1"
  curl -sS -X POST "$API" \
    -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
    -H "Content-Type: application/json" \
    --data "$payload"
}

# Cache Rules phase ruleset (simplified — adjust in dashboard if API schema differs)
PAYLOAD='{
  "name": "Mafateeh SEO cache rules",
  "kind": "zone",
  "phase": "http_request_cache_settings",
  "rules": [
    {
      "description": "Cache hashed Vite assets",
      "expression": "(http.request.uri.path starts_with \"/assets/\")",
      "action": "set_cache_settings",
      "action_parameters": {
        "cache": true,
        "edge_ttl": { "mode": "respect_origin" }
      }
    },
    {
      "description": "Cache static images",
      "expression": "(http.request.uri.path matches \"\\.(png|webp|svg|ico)$\")",
      "action": "set_cache_settings",
      "action_parameters": {
        "cache": true,
        "edge_ttl": { "mode": "override_origin", "default": 604800 }
      }
    },
    {
      "description": "Bypass SPA shell HTML",
      "expression": "(http.request.uri.path eq \"/index.html\") or (not http.request.uri.path contains \".\")",
      "action": "set_cache_settings",
      "action_parameters": { "cache": false }
    }
  ]
}'

echo "Creating Cloudflare cache ruleset..."
create_ruleset "$PAYLOAD"
echo
echo "Verify with:"
echo "  curl -I https://www.mafateehgroup.com/assets/<hash>.js  # 2nd request: cf-cache-status: HIT"
