const path = require("path");
const { execSync } = require("child_process");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const { resolveDatabaseUrl } = require("./resolve-database-url.cjs");

process.env.DATABASE_URL = resolveDatabaseUrl();

const env = { ...process.env, DATABASE_URL: process.env.DATABASE_URL };
const opts = { stdio: "inherit", env };

execSync("npx prisma migrate deploy", opts);
execSync("npm run db:seed", opts);
