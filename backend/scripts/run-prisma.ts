/**
 * Loads backend env (including DATABASE_URL resolved from POSTGRES_*)
 * before invoking the Prisma CLI.
 */
import "../src/config/env";
import { spawnSync } from "node:child_process";
import path from "node:path";

const cwd = path.join(__dirname, "..");
const args = process.argv.slice(2);
const r = spawnSync("npx", ["prisma", ...args], {
  stdio: "inherit",
  shell: true,
  cwd,
  env: process.env,
});
process.exit(r.status ?? 1);
