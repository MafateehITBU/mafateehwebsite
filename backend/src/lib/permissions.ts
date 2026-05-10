export const PERMISSIONS = [
  "static_info",
  "privacy",
  "tags",
  "blog_categories",
  "blogs",
  "partners",
  "portfolio_categories",
  "portfolios",
  "testimonials",
  "service_categories",
  "services",
  "packages",
  "contacts",
  "seo",
  "roles",
  "admins",
  "upload_assets",
] as const;

export type Permission = (typeof PERMISSIONS)[number] | "*";

export function parsePermissions(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((p): p is string => typeof p === "string");
}

export function hasPermission(
  permissions: string[],
  required: string | string[]
): boolean {
  if (permissions.includes("*")) return true;
  const need = Array.isArray(required) ? required : [required];
  return need.every((p) => permissions.includes(p));
}
