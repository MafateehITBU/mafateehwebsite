import type { AuthProvider, HttpError } from "@refinedev/core";

const TOKEN_KEY = "mafateeh_admin_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

type AdminMeResponse = {
  id: string;
  email: string;
  name: string | null;
  role: { name: string; permissions: unknown };
};

function normalizePermissions(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.filter((p): p is string => typeof p === "string");
  }
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw) as unknown;
      return Array.isArray(parsed)
        ? parsed.filter((p): p is string => typeof p === "string")
        : [];
    } catch {
      return [];
    }
  }
  return [];
}

async function readError(res: Response): Promise<HttpError> {
  const text = await res.text();
  let message = text || res.statusText;
  try {
    const j = JSON.parse(text) as { message?: string; error?: string };
    if (typeof j.message === "string") message = j.message;
    else if (typeof j.error === "string") message = j.error;
  } catch {
    /* use raw text */
  }
  return { message, statusCode: res.status };
}

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    const res = await fetch("/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await readError(res);
      return {
        success: false,
        error: { name: "LoginError", message: err.message },
      };
    }
    const body = (await res.json()) as { token: string };
    setToken(body.token);
    return { success: true, redirectTo: "/" };
  },

  logout: async () => {
    clearToken();
    return { success: true, redirectTo: "/login" };
  },

  check: async () => {
    const token = getToken();
    if (!token) {
      return { authenticated: false, redirectTo: "/login", logout: true };
    }
    const res = await fetch("/api/admin/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      clearToken();
      return { authenticated: false, redirectTo: "/login", logout: true };
    }
    return { authenticated: true };
  },

  getIdentity: async () => {
    const token = getToken();
    if (!token) return null;
    const res = await fetch("/api/admin/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const me = (await res.json()) as AdminMeResponse;
    return {
      id: me.id,
      name: me.name ?? me.email,
      email: me.email,
      role: me.role,
    };
  },

  getPermissions: async () => {
    const token = getToken();
    if (!token) return [];
    const res = await fetch("/api/admin/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return [];
    const me = (await res.json()) as AdminMeResponse;
    return normalizePermissions(me.role?.permissions);
  },

  onError: async (error: HttpError) => {
    if (error?.statusCode === 401) {
      return { logout: true, redirectTo: "/login", error };
    }
    return { error };
  },
};
