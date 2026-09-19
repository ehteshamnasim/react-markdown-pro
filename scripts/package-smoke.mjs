import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { JSDOM } from "jsdom";

const require = createRequire(import.meta.url);
const projectRoot = resolve(dirname(new URL(import.meta.url).pathname), "..");
const npmCache = process.env.npm_config_cache || join(tmpdir(), "react-markdown-pro-npm-cache");
const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "http://localhost" });

Object.assign(globalThis, {
  document: dom.window.document,
  DOMParser: dom.window.DOMParser,
  window: dom.window,
});
Object.defineProperty(globalThis, "navigator", {
  configurable: true,
  value: dom.window.navigator,
});

const commonJsPackage = require("../lib/index.cjs");
const esmPackage = await import(pathToFileURL(new URL("../lib/index.js", import.meta.url).pathname).href);

assert.equal(typeof commonJsPackage, "function");
assert.equal(typeof esmPackage.default, "function");

const consumerDirectory = mkdtempSync(join(tmpdir(), "react-markdown-pro-consumer-"));

try {
  execFileSync("npm", ["pack", "--pack-destination", consumerDirectory, "--cache", npmCache], {
    cwd: projectRoot,
    stdio: "pipe",
  });

  const packageTarball = join(consumerDirectory, readdirSync(consumerDirectory).find((file) => file.endsWith(".tgz")) || "");
  assert.notEqual(packageTarball, consumerDirectory);

  writeFileSync(join(consumerDirectory, "package.json"), '{"private":true}');
  execFileSync(
    "npm",
    [
      "install",
      "--ignore-scripts",
      "--no-package-lock",
      packageTarball,
      resolve(projectRoot, "node_modules/react"),
      resolve(projectRoot, "node_modules/react-dom"),
    ],
    {
      cwd: consumerDirectory,
      env: { ...process.env, npm_config_cache: npmCache },
      stdio: "pipe",
    },
  );

  const consumerRequire = createRequire(join(consumerDirectory, "consumer.cjs"));
  assert.equal(typeof consumerRequire("react-markdown-pro"), "function");
  const consumerEsm = await import(pathToFileURL(join(consumerDirectory, "node_modules/react-markdown-pro/lib/index.js")).href);
  assert.equal(typeof consumerEsm.default, "function");
} finally {
  rmSync(consumerDirectory, { recursive: true, force: true });
}

console.log("Package smoke test passed for installed CommonJS and ESM consumers.");
