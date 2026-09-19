import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

const npmCache = process.env.npm_config_cache || join(tmpdir(), "react-markdown-pro-npm-cache");

execFileSync("npm", ["pack", "--dry-run", "--cache", npmCache], {
  env: { ...process.env, npm_config_cache: npmCache },
  stdio: "inherit",
});
