/**
 * Ask the website container to regenerate SEO/route HTML shells
 * (so newly published blogs get working direct URLs).
 * Fire-and-forget — never blocks or fails the admin API response.
 */
const HOOK_URL =
  process.env.ROUTE_SHELL_HOOK_URL?.trim() ||
  "http://website:9090/regenerate";
const SECRET = process.env.ROUTE_SHELL_HOOK_SECRET?.trim() || "";

export function requestRouteShellRegen(reason = "blog-change"): void {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (SECRET) headers["x-route-shell-secret"] = SECRET;

  void fetch(HOOK_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ reason }),
    signal: AbortSignal.timeout(5000),
  })
    .then(async (res) => {
      if (!res.ok) {
        console.warn(
          `[route-shell] regen hook HTTP ${res.status} (${reason})`
        );
      }
    })
    .catch((err) => {
      console.warn(
        `[route-shell] regen hook unreachable (${reason}):`,
        err instanceof Error ? err.message : err
      );
    });
}
