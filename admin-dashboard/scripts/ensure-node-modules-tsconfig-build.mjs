/**
 * @refinedev/antd ships a tsconfig.json that extends "../../tsconfig.build.json".
 * From node_modules/@refinedev/antd that resolves to node_modules/tsconfig.build.json,
 * which is not published — the IDE then reports a missing extended config.
 * This script writes a minimal stub after install.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const target = join(root, "node_modules", "tsconfig.build.json");

const body = {
  $schema: "https://json.schemastore.org/tsconfig",
  compilerOptions: {
    target: "ESNext",
    module: "ESNext",
    moduleResolution: "bundler",
    strict: true,
    skipLibCheck: true,
    noEmit: true,
    jsx: "react-jsx",
    isolatedModules: true,
    resolveJsonModule: true,
    allowSyntheticDefaultImports: true,
  },
  include: [],
};

mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, `${JSON.stringify(body, null, 2)}\n`, "utf8");
