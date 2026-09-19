import { execFileSync } from "node:child_process";
import { accessSync, constants } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const configuredCache = process.env.npm_config_cache;
let npmCache = join(tmpdir(), "react-markdown-pro-npm-cache");
if (configuredCache) {
  try { accessSync(configuredCache, constants.W_OK); npmCache = configuredCache; } catch { /* use a writable temporary cache */ }
}

execFileSync("npm", ["pack", "--dry-run", "--cache", npmCache], {
  env: { ...process.env, npm_config_cache: npmCache },
  stdio: "inherit",
});
