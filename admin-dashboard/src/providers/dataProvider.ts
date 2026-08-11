import type {
  BaseRecord,
  BaseKey,
  CrudFilter,
  DataProvider,
  GetListParams,
  GetListResponse,
  GetOneParams,
  GetOneResponse,
  HttpError,
  CreateParams,
  CreateResponse,
  UpdateParams,
  UpdateResponse,
  DeleteOneParams,
  DeleteOneResponse,
} from "@refinedev/core";
import { getToken } from "./authProvider";

const API_BASE = "/api/admin";

/** Refine resource name → Express mount path (no trailing slash). */
export const RESOURCE_PATH: Record<string, string> = {
  dashboard: "",
  static_site_info: "/static-site-info",
  privacy_policy: "/privacy-policy",
  terms_and_conditions: "/terms-and-conditions",
  seo: "/seo",
  tags: "/tags",
  blog_categories: "/blog-categories",
  blogs: "/blogs",
  partners: "/partners",
  portfolio_categories: "/portfolio-categories",
  portfolios: "/portfolios",
  testimonials: "/testimonials",
  service_categories: "/service-categories",
  services: "/services",
  packages: "/packages",
  contacts: "/contacts",
  roles: "/roles",
  admins: "/admins",
};

const SINGLETON_RESOURCES = new Set([
  "static_site_info",
  "privacy_policy",
  "terms_and_conditions",
  "seo",
]);

/** Resources where GET /:id exists */
const GET_ONE_BY_ID = new Set(["contacts"]);

function authHeaders(): HeadersInit {
  const token = getToken();
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

async function parseError(res: Response): Promise<HttpError> {
  const text = await res.text();
  let message = text || res.statusText;
  try {
    const j = JSON.parse(text) as { message?: string; error?: string };
    if (typeof j.error === "string") message = j.error;
    else if (typeof j.message === "string") message = j.message;
  } catch {
    /* keep text */
  }
  return { message, statusCode: res.status };
}

function statusFilterQuery(resource: string, filters?: CrudFilter[]): string {
  if (resource !== "contacts" || !filters?.length) return "";
  for (const f of filters) {
    if (
      "field" in f &&
      f.field === "status" &&
      "operator" in f &&
      f.operator === "eq" &&
      f.value != null &&
      f.value !== ""
    ) {
      const v = String(f.value);
      if (v === "NEW" || v === "READ" || v === "ARCHIVED") {
        return `?status=${encodeURIComponent(v)}`;
      }
    }
  }
  return "";
}

async function readJsonRecord(res: Response): Promise<BaseRecord> {
  if (!res.ok) throw await parseError(res);
  return (await res.json()) as BaseRecord;
}

async function fetchListPath(path: string): Promise<BaseRecord[]> {
  const res = await fetch(`${API_BASE}${path}`, { headers: authHeaders() });
  if (!res.ok) throw await parseError(res);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

async function findOneFromList(
  resource: string,
  id: BaseKey
): Promise<BaseRecord> {
  const path = RESOURCE_PATH[resource];
  if (!path) {
    throw { message: `Unknown resource: ${resource}`, statusCode: 400 } satisfies HttpError;
  }
  const list = await fetchListPath(path);
  const row = list.find((r) => String(r.id) === String(id));
  if (!row) {
    throw { message: "Record not found", statusCode: 404 } satisfies HttpError;
  }
  return row;
}

export const dataProvider: DataProvider = {
  getApiUrl: () => API_BASE,

  getList: async <TData extends BaseRecord = BaseRecord>({
    resource,
    filters,
  }: GetListParams): Promise<GetListResponse<TData>> => {
    if (resource === "dashboard") {
      return { data: [] as TData[], total: 0 };
    }
    const path = RESOURCE_PATH[resource];
    if (!path) {
      throw { message: `Unknown resource: ${resource}`, statusCode: 400 } satisfies HttpError;
    }
    if (SINGLETON_RESOURCES.has(resource)) {
      const res = await fetch(`${API_BASE}${path}`, { headers: authHeaders() });
      const one = (await readJsonRecord(res)) as TData;
      return { data: [one], total: 1 };
    }
    const q = statusFilterQuery(resource, filters);
    const res = await fetch(`${API_BASE}${path}${q}`, { headers: authHeaders() });
    if (!res.ok) throw await parseError(res);
    const data = (await res.json()) as TData[];
    const list = Array.isArray(data) ? data : [];
    return { data: list, total: list.length };
  },

  getOne: async <TData extends BaseRecord = BaseRecord>({
    resource,
    id,
  }: GetOneParams): Promise<GetOneResponse<TData>> => {
    const path = RESOURCE_PATH[resource];
    if (!path) {
      throw { message: `Unknown resource: ${resource}`, statusCode: 400 } satisfies HttpError;
    }
    if (SINGLETON_RESOURCES.has(resource)) {
      const res = await fetch(`${API_BASE}${path}`, { headers: authHeaders() });
      const data = (await readJsonRecord(res)) as TData;
      return { data };
    }
    if (GET_ONE_BY_ID.has(resource)) {
      const res = await fetch(`${API_BASE}${path}/${id}`, { headers: authHeaders() });
      const data = (await readJsonRecord(res)) as TData;
      return { data };
    }
    const data = (await findOneFromList(resource, id)) as TData;
    return { data };
  },

  create: async <TData extends BaseRecord = BaseRecord, TVariables = Record<string, unknown>>({
    resource,
    variables,
  }: CreateParams<TVariables>): Promise<CreateResponse<TData>> => {
    if (SINGLETON_RESOURCES.has(resource) || resource === "dashboard") {
      throw {
        message: "Create is not supported for this resource",
        statusCode: 400,
      } satisfies HttpError;
    }
    const path = RESOURCE_PATH[resource];
    if (!path) {
      throw { message: `Unknown resource: ${resource}`, statusCode: 400 } satisfies HttpError;
    }
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(variables),
    });
    const data = (await readJsonRecord(res)) as TData;
    return { data };
  },

  update: async <TData extends BaseRecord = BaseRecord, TVariables = Record<string, unknown>>({
    resource,
    id,
    variables,
  }: UpdateParams<TVariables>): Promise<UpdateResponse<TData>> => {
    const path = RESOURCE_PATH[resource];
    if (!path) {
      throw { message: `Unknown resource: ${resource}`, statusCode: 400 } satisfies HttpError;
    }
    if (SINGLETON_RESOURCES.has(resource)) {
      const res = await fetch(`${API_BASE}${path}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(variables),
      });
      const data = (await readJsonRecord(res)) as TData;
      return { data };
    }
    const method = resource === "contacts" ? "PATCH" : "PUT";
    const res = await fetch(`${API_BASE}${path}/${id}`, {
      method,
      headers: authHeaders(),
      body: JSON.stringify(variables),
    });
    const data = (await readJsonRecord(res)) as TData;
    return { data };
  },

  deleteOne: async <TData extends BaseRecord = BaseRecord, TVariables = Record<string, unknown>>({
    resource,
    id,
  }: DeleteOneParams<TVariables>): Promise<DeleteOneResponse<TData>> => {
    if (SINGLETON_RESOURCES.has(resource) || resource === "dashboard") {
      throw {
        message: "Delete is not supported for this resource",
        statusCode: 400,
      } satisfies HttpError;
    }
    const path = RESOURCE_PATH[resource];
    if (!path) {
      throw { message: `Unknown resource: ${resource}`, statusCode: 400 } satisfies HttpError;
    }
    const res = await fetch(`${API_BASE}${path}/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok) throw await parseError(res);
    return { data: { id } as TData };
  },
};
