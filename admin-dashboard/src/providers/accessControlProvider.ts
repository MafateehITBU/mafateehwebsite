import type { AccessControlProvider } from "@refinedev/core";
import { getToken } from "./authProvider";

const RESOURCE_PERMISSION_MAP: Record<string, string | null> = {
  dashboard: null,
  static_site_info: "static_info",
  privacy_policy: "privacy",
  terms_and_conditions: "privacy",
  seo: "seo",
  tags: "blogs",
  blog_categories: "blogs",
  blogs: "blogs",
  partners: "partners",
  portfolio_categories: "portfolios",
  portfolios: "portfolios",
  testimonials: "testimonials",
  service_categories: "services",
  services: "services",
  packages: "packages",
  contacts: "contacts",
  roles: "roles",
  admins: "admins",
};

let permissionsCache: { token: string; permissions: string[] } | null = null;

async function readPermissions(): Promise<string[]> {
  const token = getToken();
  if (!token) return [];

  if (permissionsCache && permissionsCache.token === token) {
    return permissionsCache.permissions;
  }

  const res = await fetch("/api/admin/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];

  const me = (await res.json()) as { role?: { permissions?: unknown } };
  const raw = me.role?.permissions;
  const permissions = Array.isArray(raw)
    ? raw.filter((p): p is string => typeof p === "string")
    : typeof raw === "string"
      ? (() => {
          try {
            const parsed = JSON.parse(raw) as unknown;
            return Array.isArray(parsed)
              ? parsed.filter((p): p is string => typeof p === "string")
              : [];
          } catch {
            return [];
          }
        })()
      : [];

  permissionsCache = { token, permissions };
  return permissions;
}

export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action }) => {
    const permissions = await readPermissions();
    const hasPermission = (permission: string) => permissions.includes(permission);

    if (permissions.includes("*")) {
      return { can: true };
    }

    if (!resource || resource === "dashboard") {
      return { can: true };
    }

    const requiredPermission = RESOURCE_PERMISSION_MAP[resource];
    if (!requiredPermission) {
      return { can: true };
    }

    // Listing permissions are used for sidebar visibility and view access.
    if (action === "list" || action === "show" || action === "create" || action === "edit") {
      return { can: hasPermission(requiredPermission) };
    }

    return { can: hasPermission(requiredPermission) };
  },
};
