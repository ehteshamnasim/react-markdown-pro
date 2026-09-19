# react-markdown-pro

Production-ready React Markdown with GFM, KaTeX math, secure links and HTML policy controls, headings/TOC, callouts, frontmatter, footnotes, code metadata, line highlighting, and copy controls.

## Install

```bash
npm install react-markdown-pro
```

```tsx
import MarkdownPro from "react-markdown-pro";
import "react-markdown-pro/style.css";

export function Article({ markdown }: { markdown: string }) {
  return <MarkdownPro value={markdown} />;
}
```

## Live demo

[Open the interactive demo](https://ehteshamnasim.github.io/react-markdown-pro/demo.html) · [source](https://github.com/ehteshamnasim/react-markdown-pro/blob/main/demo.html)

The demo covers GFM, math, nested content, code metadata, TOC, callouts, frontmatter, footnotes, HTML security, custom components, plugins, inline mode, and every public setting. For local development run `npm start` and open `http://localhost:5173/demo.html` (localhost is only for your computer).

## What is included

- GFM tables, task lists, autolinks, strikethrough, and footnotes
- Inline/display KaTeX math and literal currency handling
- Lazy syntax highlighting, copy buttons, line numbers, metadata titles/collapse, and highlighted lines
- Stable heading IDs, permalink anchors, and generated table of contents
- `:::note`, `:::tip`, `:::info`, `:::warning`, and `:::danger` callouts
- YAML-like frontmatter with callback/render hooks
- Secure 2.0 defaults: raw HTML is disabled unless `allowHtml` is explicitly enabled
- URL protocol policy, custom URL transforms, allowed/disallowed elements, and Unified plugins
- ESM, CommonJS, TypeScript declarations, and a standalone stylesheet

## API

| Prop | Default | Purpose |
| --- | --- | --- |
| `children` / `value` | required input | Markdown source; `value` wins when both exist. |
| `applyStyles` | `true` | Apply the package's sensible element styles. |
| `inline` | `false` | Render paragraphs as inline spans. |
| `allowHtml` | `false` | Opt in to raw HTML parsing (secure 2.0 default). |
| `sanitizeHtml` | `true` | Sanitize raw HTML after opting in. Keep enabled for untrusted content. |
| `sanitizeSchema` | built-in | Extend/replace the `rehype-sanitize` schema. |
| `allowedElements` / `disallowedElements` | — | Restrict rendered Markdown tags. |
| `unwrapDisallowed` | `false` | Keep text children when a tag is disallowed. |
| `allowedProtocols` | `http`, `https`, `mailto`, `tel` | Allowed URL schemes for links and images. |
| `urlTransform` | built-in policy | Return a rewritten URL or `null` to block it. |
| `components` | built-ins | Override any `react-markdown` element renderer. |
| `remarkPlugins` / `rehypePlugins` | `[]` | Add compatible Unified plugins. |
| `codeTheme` | Atom Dark | Prism theme object, or `false` for plain code. |
| `lazyCodeHighlighting` | `true` | Load the highlighter only when a fenced block renders. |
| `showLineNumbers` | `true` | Default code line-number visibility. |
| `showCopyButton` | `true` | Show code copy buttons. |
| `onCopyCode` | — | Callback `(code, language)` after a copy. |
| `linkTarget` | — | Target for links; `_blank` gets `noopener noreferrer`. |
| `imageLoading` | `lazy` | Native image loading mode. |
| `toc` | `false` | `true` or `{ title, minDepth, maxDepth, className }`. |
| `headingLinks` | `true` | Add keyboard-safe `#` heading permalinks. |
| `callouts` | `true` | Transform fenced `:::kind` blocks into callouts. |
| `frontmatter` | `true` | Strip the opening frontmatter block from rendered content. |
| `onFrontmatter` | — | Receive parsed frontmatter data. |
| `renderFrontmatter` | — | Render a metadata banner before the document. |

## Recipes

### Secure user content

```tsx
<MarkdownPro value={comment} allowHtml={false} />
```

### Strict links and elements

```tsx
<MarkdownPro
  value={markdown}
  allowedProtocols={["https"]}
  disallowedElements={["img", "iframe"]}
  unwrapDisallowed
  urlTransform={(url, kind) => kind === "href" ? url : null}
/>
```

### Code metadata and line highlights

The info string supports `title="App.tsx"`, `filename=App.tsx`, `collapse`, `lineNumbers=false`, and ranges such as `{1,3-4}`:

````md
```tsx title="App.tsx" {1,3-4} collapse
const first = true;
const second = false;
const third = true;
```
````

### TOC, callouts, frontmatter, and footnotes

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

```tsx
<MarkdownPro
  value={document}
  toc={{ title: "On this page", minDepth: 2, maxDepth: 4 }}
  renderFrontmatter={(data) => <small>{String(data.title)}</small>}
  onFrontmatter={(data) => analytics.track("document", data)}
/>
```

### Full extension point

```tsx
<MarkdownPro
  value={markdown}
  components={{ a: Link }}
  remarkPlugins={[myRemarkPlugin]}
  rehypePlugins={[myRehypePlugin]}
  onCopyCode={(code, language) => console.log(language, code)}
/>
```

## Versioning

`2.0.0` combines the 1.3 URL/element/code controls and 1.4 document features with the secure HTML default, stricter declarations, and lazy code highlighting. The default `allowHtml={false}` is intentionally breaking; opt in explicitly for trusted HTML.

## Development

```bash
npm install
npm run check
```

`npm run check` runs strict TypeScript, unit tests, package consumer smoke tests, Playwright browser tests, and an npm dry-run. GitHub Pages deploys the demo from `main` after CI passes.

## License

[MIT](./LICENSE)
