import { rename, writeFile } from "node:fs/promises";

const entry = "lib/index.cjs";
const bundledEntry = "lib/index.bundle.cjs";
await rename(entry, bundledEntry);
await writeFile(
  entry,
  `"use strict";
const bundle = require("./index.bundle.cjs");
const MarkdownPro = bundle.default;
MarkdownPro.default = MarkdownPro;
MarkdownPro.defaultUrlTransform = bundle.defaultUrlTransform;
MarkdownPro.parseCodeMetadata = bundle.parseCodeMetadata;
MarkdownPro.parseFrontmatter = bundle.parseFrontmatter;
module.exports = MarkdownPro;
`,
);
