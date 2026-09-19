# react-markdown-pro

<p align="center">
  <strong>A Markdown renderer for React that stays simple for readers and configurable for teams.</strong><br />
  GFM · KaTeX · secure HTML policy · document navigation · code blocks · TypeScript
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/react-markdown-pro"><img src="https://img.shields.io/npm/v/react-markdown-pro?color=cb3837&logo=npm" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/react-markdown-pro"><img src="https://img.shields.io/npm/dm/react-markdown-pro?color=blue&logo=npm" alt="monthly downloads" /></a>
  <a href="https://github.com/ehteshamnasim/react-markdown-pro/actions"><img src="https://img.shields.io/github/actions/workflow/status/ehteshamnasim/react-markdown-pro/ci-and-pages.yml?branch=main&logo=github" alt="build status" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/npm/l/react-markdown-pro" alt="MIT license" /></a>
</p>

<p align="center"><a href="https://ehteshamnasim.github.io/react-markdown-pro/demo.html">View the live demo →</a></p>

## Why this package?

`react-markdown-pro` gives a React application one predictable component for articles, documentation, comments, changelogs, and user-authored content. It keeps the familiar `children` API from the original component, while adding opt-in controls for security, navigation, metadata, code, and custom rendering.

## Install

```bash
npm install react-markdown-pro
```

Import the stylesheet once, near your application entry point:

```tsx
import MarkdownPro from "react-markdown-pro";
import "react-markdown-pro/style.css";

export function Article({ markdown }: { markdown: string }) {
  return <MarkdownPro value={markdown} />;
}
```

`react` and `react-dom` are peer dependencies. The package ships ESM, CommonJS, and TypeScript declarations.

## Start in 30 seconds

```tsx
const markdown = `# Hello

This is **GitHub Flavored Markdown** with a safe link, a task list, and code:

- [x] headings and anchors
- [x] tables and footnotes

\`\`\`tsx
const message = "Hello from MarkdownPro";
\`\`\``;

<MarkdownPro>{markdown}</MarkdownPro>
```

## See every feature

The [interactive demo](https://ehteshamnasim.github.io/react-markdown-pro/demo.html) includes examples for GFM, math, nested lists, code metadata, copy controls, TOC, callouts, frontmatter, footnotes, HTML policy, custom components, plugins, inline rendering, and every setting.

For local development only:

```bash
npm start
```

Then open [http://localhost:5173/demo.html](http://localhost:5173/demo.html). `localhost` is a local preview; the public URL above is the GitHub Pages deployment.

## Capabilities

| Area | Included |
| --- | --- |
| Markdown | GFM tables, task lists, autolinks, strikethrough, footnotes, nested content |
| Math | Inline and display KaTeX, plus the original literal-currency handling |
| Code | Lazy syntax highlighting, themes, line numbers, copy feedback, titles, collapse, and highlighted ranges |
| Documents | Stable heading IDs, `#` permalinks, generated TOC, frontmatter, and callouts |
| Security | HTML off by default, sanitization, URL protocol policy, URL rewriting, and element allow/deny lists |
| Extensibility | Custom element renderers, `remark` plugins, and `rehype` plugins |
| Delivery | ESM, CommonJS, declaration files, and `react-markdown-pro/style.css` |

## Configuration reference

### Content and rendering

| Prop | Default | Description |
| --- | --- | --- |
| `children` | — | Markdown string or string array. |
| `value` | — | Alternative Markdown input; takes precedence over `children`. |
| `applyStyles` | `true` | Apply the component’s built-in list, table, image, and code styles. |
| `inline` | `false` | Render paragraphs as inline `<span>` content. |
| `components` | built-ins | Replace any rendered element, such as `a`, `img`, `code`, or `h2`. |
| `remarkPlugins` | `[]` | Additional Unified/remark plugins. |
| `rehypePlugins` | `[]` | Additional Unified/rehype plugins. |

### Security and URLs

| Prop | Default | Description |
| --- | --- | --- |
| `allowHtml` | `false` | Parse raw HTML only when explicitly enabled. This is the secure 2.0 default. |
| `sanitizeHtml` | `true` | Sanitize raw HTML after opting in. Keep enabled for untrusted content. |
| `sanitizeSchema` | built-in schema | Customize the `rehype-sanitize` schema. |
| `allowedElements` | — | Allow only the listed Markdown element names. |
| `disallowedElements` | — | Remove the listed element names. |
| `unwrapDisallowed` | `false` | Preserve text children when removing a disallowed element. |
| `allowedProtocols` | `http`, `https`, `mailto`, `tel` | Schemes accepted by links and images. |
| `urlTransform` | built-in policy | Receive `(url, kind)` and return a rewritten URL or `null` to block it. |

### Code blocks

| Prop | Default | Description |
| --- | --- | --- |
| `codeTheme` | Atom Dark | A Prism theme object, or `false` for plain code. |
| `lazyCodeHighlighting` | `true` | Defer the highlighter until a fenced block is rendered. |
| `showLineNumbers` | `true` | Default line-number visibility. |
| `showCopyButton` | `true` | Show copy controls for fenced blocks. |
| `onCopyCode` | — | Callback receiving `(code, language)`. |

Fenced-code metadata supports `title="App.tsx"`, `filename=App.tsx`, `collapse`, `lineNumbers=false`, and highlight ranges:

````md
```tsx title="App.tsx" {1,3-4} collapse
const first = true;
const second = false;
const third = true;
const fourth = true;
```
````

### Navigation and document metadata

| Prop | Default | Description |
| --- | --- | --- |
| `toc` | `false` | Enable a TOC, or pass `{ title, minDepth, maxDepth, className }`. |
| `headingLinks` | `true` | Add stable, keyboard-safe `#` heading links. |
| `callouts` | `true` | Enable `:::note`, `:::tip`, `:::info`, `:::warning`, and `:::danger`. |
| `frontmatter` | `true` | Strip and parse the opening metadata block. |
| `onFrontmatter` | — | Receive the parsed metadata object. |
| `renderFrontmatter` | — | Render a metadata element before the document. |

## Common recipes

### User comments: safest defaults

```tsx
<MarkdownPro
  value={comment}
  allowHtml={false}
  allowedProtocols={["https"]}
  disallowedElements={["img", "iframe"]}
  unwrapDisallowed
/>
```

### Trusted HTML with sanitization

```tsx
<MarkdownPro value={trustedMarkdown} allowHtml sanitizeHtml />
```

Only use `sanitizeHtml={false}` for content your application fully controls. Never disable sanitization for user-submitted Markdown.

### TOC and frontmatter

```tsx
<MarkdownPro
  value={document}
  toc={{ title: "On this page", minDepth: 2, maxDepth: 4 }}
  renderFrontmatter={(data) => <header>{String(data.title)}</header>}
  onFrontmatter={(data) => analytics.track("document_loaded", data)}
/>
```

```md
---
title: Release guide
draft: false
tags: [react, markdown]
---
# Release guide

:::tip Start here
Use the secure defaults.[^1]
:::

[^1]: Footnotes are powered by GFM.
```

### Custom links and plugins

```tsx
<MarkdownPro
  value={markdown}
  linkTarget="_blank"
  imageLoading="eager"
  components={{ a: ({ href, children }) => <a className="brand-link" href={href}>{children}</a> }}
  remarkPlugins={[myRemarkPlugin]}
  rehypePlugins={[myRehypePlugin]}
/>
```

## 2.0 migration and feature map

Version 2.0 combines the complete roadmap rather than shipping isolated partial releases:

| Roadmap | Included in 2.0 |
| --- | --- |
| 1.3 URL policy | `allowedProtocols`, `urlTransform`, safe relative URLs, and blocked dangerous schemes |
| 1.3 element policy | `allowedElements`, `disallowedElements`, and `unwrapDisallowed` |
| 1.3 code controls | titles/filenames, collapsed blocks, line-number overrides, and `{1,3-4}` highlighting |
| 1.4 navigation | stable heading IDs, permalink links, and configurable TOC depth/title/class |
| 1.4 authoring | note/tip/info/warning/danger callouts, frontmatter callbacks/rendering, and GFM footnotes |
| 2.0 security | raw HTML disabled by default, opt-in sanitization, and stricter TypeScript declarations |
| 2.0 performance | lazy-loaded syntax highlighting and plain-code fallback |

The one breaking behavior is the secure HTML default:

```tsx
// 1.x behavior, only for trusted legacy content:
<MarkdownPro value={markdown} allowHtml />

// Recommended 2.x behavior for user content:
<MarkdownPro value={markdown} allowHtml={false} />
```

If your application relied on raw HTML being parsed implicitly, add `allowHtml` explicitly and keep `sanitizeHtml` enabled while you migrate.

## Development

```bash
npm install
npm run check
```

`npm run check` runs strict TypeScript, unit tests, package consumer tests for ESM/CommonJS, browser tests for the demo, and an npm dry-run. GitHub Actions deploys the demo to GitHub Pages after a successful push to `main`.

## License

[MIT](./LICENSE)
