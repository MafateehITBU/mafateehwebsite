import { config } from "dotenv";
import { z } from "zod";

config();

function resolveDatabaseUrl(): string {
  const pw = process.env.POSTGRES_PASSWORD;
  if (pw !== undefined && String(pw).trim() !== "") {
    const u = process.env.POSTGRES_USER ?? "postgres";
    const h = process.env.POSTGRES_HOST ?? "localhost";
    const port = process.env.POSTGRES_PORT ?? "5432";
    const db = process.env.POSTGRES_DATABASE ?? "mafateeh";
    return `postgresql://${encodeURIComponent(u)}:${encodeURIComponent(String(pw).trim())}@${h}:${port}/${db}?schema=public`;
  }
  const url = process.env.DATABASE_URL?.trim().replace(/^["']|["']$/g, "");
  if (!url) {
    throw new Error(
      "Set POSTGRES_PASSWORD or DATABASE_URL in backend/.env (see .env.example)."
    );
  }
  // Template credentials almost never match a local pgAdmin install → P1000.
  if (url.includes("://postgres:postgres@")) {
    throw new Error(
      "PostgreSQL login failed because POSTGRES_PASSWORD is empty and DATABASE_URL still uses the default user postgres with password postgres. " +
        "In backend/.env set POSTGRES_PASSWORD to the exact password you use for that user in pgAdmin (same host/port/database as POSTGRES_*). " +
        "If your role is not named postgres, set POSTGRES_USER as well. " +
        "If you truly use password postgres, set POSTGRES_PASSWORD=postgres explicitly."
    );
  }
  return url;
}

process.env.DATABASE_URL = resolveDatabaseUrl();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_EXPIRES_IN: z.string().default("8h"),
  CORS_ORIGIN: z.string().default("*"),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_SECURE: z
    .string()
    .optional()
    .transform((value) => value === "true" || value === "1"),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().default("Mafateeh Contact <noreply@mafateeh.com>"),
  /** Comma-separated inbox addresses for new contact form alerts. */
  CONTACT_NOTIFY_TO: z.string().optional(),
  CONTACT_DASHBOARD_URL: z
    .string()
    .url()
    .default("https://dashboard.mafateehgroup.com"),
});

export type Env = z.infer<typeof envSchema>;

let cached: Env | null = null;

export function env(): Env {
  if (cached) return cached;
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const msg = parsed.error.flatten().fieldErrors;
    throw new Error(`Invalid environment: ${JSON.stringify(msg)}`);
  }
  cached = parsed.data;
  return cached;
}

export function cloudinaryConfigured(): boolean {
  const e = env();
  return Boolean(
    e.CLOUDINARY_CLOUD_NAME && e.CLOUDINARY_API_KEY && e.CLOUDINARY_API_SECRET
  );
}

export function smtpConfigured(): boolean {
  const e = env();
  return Boolean(e.SMTP_HOST && e.SMTP_USER && e.SMTP_PASS);
}
