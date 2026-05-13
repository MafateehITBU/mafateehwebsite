export const PERMISSIONS = [
  "static_info",
  "privacy",
  "blogs",
  "partners",
  "portfolios",
  "testimonials",
  "services",
  "packages",
  "contacts",
  "seo",
  "roles",
  "admins",
  "upload_assets",
] as const;

export type Permission = (typeof PERMISSIONS)[number] | "*";

const LEGACY_TO_GROUPED: Record<string, Permission> = {
  tags: "blogs",
  blog_categories: "blogs",
  portfolio_categories: "portfolios",
  service_categories: "services",
};

export function parsePermissions(raw: unknown): string[] {
  const source = Array.isArray(raw)
    ? raw
    : typeof raw === "string"
      ? (() => {
          try {
            const parsed = JSON.parse(raw) as unknown;
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        })()
      : [];
  const normalized = source
    .filter((p): p is string => typeof p === "string")
    .map((p) => LEGACY_TO_GROUPED[p] ?? p)
    .filter((p) => p === "*" || PERMISSIONS.includes(p as (typeof PERMISSIONS)[number]));
  return Array.from(new Set(normalized));
}

export function hasPermission(
  permissions: string[],
  required: string | string[]
): boolean {
  if (permissions.includes("*")) return true;
  const need = Array.isArray(required) ? required : [required];
  return need.every((p) => permissions.includes(p));
}
