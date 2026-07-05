import fs from "fs";
import path from "path";
import { config } from "dotenv";
import { z } from "zod";

config();

/** dotenv stops unquoted values at spaces — re-read SMTP keys from the env file. */
function repairSmtpEnvFromFile(): void {
  const keys = new Set([
    "SMTP_HOST",
    "SMTP_USER",
    "SMTP_PASS",
    "SMTP_FROM",
    "CONTACT_NOTIFY_TO",
  ]);
  const files = [
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), "deploy/config/backend.env"),
  ];

  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    const content = fs.readFileSync(file, "utf8");
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      if (!keys.has(key)) continue;
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
    return;
  }
}

repairSmtpEnvFromFile();

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
  SMTP_FROM: z.string().optional(),
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

export function contactNotifyRecipientCount(): number {
  const raw = env().CONTACT_NOTIFY_TO ?? "";
  return raw
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean).length;
}
