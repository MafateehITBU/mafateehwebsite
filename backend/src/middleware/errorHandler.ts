import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { HttpError } from "../lib/httpError";

function deepErrorText(err: unknown): string {
  if (err instanceof AggregateError) {
    return [
      err.message,
      ...err.errors.map((e) => (e instanceof Error ? e.message : String(e))),
    ].join(" ");
  }
  if (err instanceof Error) return err.message + (err.cause instanceof Error ? ` ${err.cause.message}` : "");
  return String(err);
}

function isDatabaseUnreachable(err: unknown): boolean {
  const text = deepErrorText(err);
  const code =
    err && typeof err === "object" && "code" in err ? String((err as { code: unknown }).code) : "";
  return (
    code === "P1001" ||
    code === "P1017" ||
    text.includes("ECONNREFUSED") ||
    text.includes("Can't reach database server") ||
    text.includes("Connection refused")
  );
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof HttpError) {
    res.status(err.status).json({
      error: err.message,
      details: err.details,
    });
    return;
  }
  if (err instanceof ZodError) {
    res.status(400).json({
      error: "Validation failed",
      details: err.flatten(),
    });
    return;
  }
  if (isDatabaseUnreachable(err)) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(503).json({
      error:
        "Database unreachable. Start PostgreSQL (Windows: Services → postgresql, or open pgAdmin so the server starts), then retry.",
    });
    return;
  }
  const message = err instanceof Error ? err.message : "Internal server error";
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({ error: message });
}
