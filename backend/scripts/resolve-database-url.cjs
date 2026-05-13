/**
 * Builds DATABASE_URL from POSTGRES_* when POSTGRES_PASSWORD is non-empty,
 * otherwise uses DATABASE_URL from the environment.
 */
function resolveDatabaseUrl() {
  const pw = process.env.POSTGRES_PASSWORD;
  if (pw !== undefined && String(pw).trim() !== "") {
    const u = process.env.POSTGRES_USER || "postgres";
    const h = process.env.POSTGRES_HOST || "localhost";
    const port = process.env.POSTGRES_PORT || "5432";
    const db = process.env.POSTGRES_DATABASE || "mafateeh";
    const encU = encodeURIComponent(u);
    const encP = encodeURIComponent(String(pw).trim());
    return `postgresql://${encU}:${encP}@${h}:${port}/${db}?schema=public`;
  }
  let url = process.env.DATABASE_URL;
  if (!url || !String(url).trim()) {
    throw new Error(
      "Set POSTGRES_PASSWORD or DATABASE_URL in backend/.env (see .env.example)."
    );
  }
  url = String(url).trim().replace(/^["']|["']$/g, "");
  if (url.includes("://postgres:postgres@")) {
    throw new Error(
      "POSTGRES_PASSWORD is empty and DATABASE_URL still uses postgres:postgres. " +
        "Set POSTGRES_PASSWORD in backend/.env to your pgAdmin password (and POSTGRES_USER if not postgres). " +
        "Or set a full DATABASE_URL with the real password."
    );
  }
  return url;
}

module.exports = { resolveDatabaseUrl };
