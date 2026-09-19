# react-markdown-pro

A drop-in React Markdown renderer with GitHub Flavoured Markdown, KaTeX math, syntax-highlighted code, copy controls, responsive images, and safe HTML controls.

It keeps the original simple API while adding optional controls for applications that need more.

## Install

```bash
npm install react-markdown-pro
```

KaTeX styles are included by the component. No extra stylesheet import is required.

## Quick start

```tsx
import MarkdownPro from "react-markdown-pro";

const article = `# Hello

This supports **GFM**, tables, and math: $E = mc^2$.

\`\`\`tsx
const message = "Hello from MarkdownPro";
\`\`\``;

export function Article() {
  return <MarkdownPro>{article}</MarkdownPro>;
}
```

## Live examples

Run `npm start`, then open [http://localhost:5173/demo.html](http://localhost:5173/demo.html) for the interactive local showcase. It exercises every public option and is the source of truth for the rendered UI.

After the GitHub Pages workflow has run once on `main`, open the [live interactive demo](https://ehteshamnasim.github.io/react-markdown-pro/demo.html). Individual sections are available at:

- [Markdown and GFM](https://ehteshamnasim.github.io/react-markdown-pro/demo.html#gfm)
- [Math rendering](https://ehteshamnasim.github.io/react-markdown-pro/demo.html#math)
- [Code and copy controls](https://ehteshamnasim.github.io/react-markdown-pro/demo.html#code)
- [HTML safety](https://ehteshamnasim.github.io/react-markdown-pro/demo.html#security)
- [Custom renderers and images](https://ehteshamnasim.github.io/react-markdown-pro/demo.html#custom)
- [Inline Markdown and plugin hooks](https://ehteshamnasim.github.io/react-markdown-pro/demo.html#inline)

The Pages workflow builds the Vite demo and deploys `dist` on every successful push to `main`. In the GitHub repository, enable **Settings → Pages → Source: GitHub Actions** once if it is not already enabled.

## Features

- GitHub Flavoured Markdown: tables, task lists, strikethrough, and autolinks
- Inline and display LaTeX via KaTeX
- Syntax-highlighted fenced code blocks with copy feedback and line-number controls
- Responsive, lazy-loaded Markdown images
- Stable heading anchors
- Configurable external links and safe `_blank` behavior
- Extensible `remark`, `rehype`, and element component hooks
- Raw HTML compatibility with sanitization enabled by default
- TypeScript declarations

## API

The original props remain fully supported.

| Prop | Default | Description |
| --- | --- | --- |
| `children` | optional | Markdown string or string array. |
| `value` | none | Optional Markdown input; takes precedence over `children`. |
| `applyStyles` | `true` | Keeps the package’s original list, table, code, image, and typography styles. |
| `inline` | `false` | Renders paragraphs as spans for inline-only content. |
| `allowHtml` | `true` | Set `false` to display embedded HTML as text. |
| `sanitizeHtml` | `true` | Removes scripts, event attributes, and unsafe markup when HTML is enabled. Set `false` only for fully trusted content. |
| `components` | none | Override built-in Markdown element renderers. |
| `remarkPlugins` | `[]` | Additional remark plugins appended after GFM and math. |
| `rehypePlugins` | `[]` | Additional rehype plugins appended after the built-ins. |
| `codeTheme` | `atomDark` | A Prism theme object, or `false` for plain code. |
| `showLineNumbers` | `true` | Show line numbers in highlighted code blocks. |
| `showCopyButton` | `true` | Show or hide the code-copy control. |
| `onCopyCode` | none | Receives `(code, language)` after code is copied. |
| `linkTarget` | none | Link target. `_blank` automatically receives `noopener noreferrer`. |
| `imageLoading` | `"lazy"` | Use `"eager"` for above-the-fold images. |

Pass an empty string when there is no Markdown to render.

## Search keywords

React Markdown renderer, GitHub Flavoured Markdown, GFM tables, task lists, KaTeX, LaTeX math, syntax highlighting, code copy button, safe HTML, TypeScript, React 16, React 17, and React 18.

### Which setting should I use?

| Goal | Settings to use | Notes |
| --- | --- | --- |
| Render a normal article | `children` or `value` | The default configuration supports GFM, math, images, links, and code. |
| Render user comments safely | `allowHtml={false}` | Best default for community content; all embedded HTML is shown as text. |
| Render trusted rich content | `allowHtml sanitizeHtml` | Allows safe HTML while removing scripts and event handlers. |
| Preserve custom HTML exactly | `allowHtml sanitizeHtml={false}` | Only use for content you fully control. |
| Use Markdown inside a sentence | `inline applyStyles={false}` | Prevents a paragraph wrapper and list styling. |
| Match your design system code style | `codeTheme={false}` | Produces normal code elements instead of the built-in highlighter. |
| Track documentation usage | `onCopyCode` | Receives the copied source and detected language. |
| Replace a rendered tag | `components` | Pass a renderer for `a`, `img`, `code`, or any react-markdown element. |
| Add custom syntax | `remarkPlugins`, `rehypePlugins` | Use compatible Unified plugins. |

## Recipes

### Every option in one component

```tsx
<MarkdownPro
  value={markdown}
  applyStyles
  inline={false}
  allowHtml
  sanitizeHtml
  codeTheme={atomDark}
  showLineNumbers
  showCopyButton
  onCopyCode={(code, language) => console.log(language, code)}
  linkTarget="_blank"
  imageLoading="lazy"
  components={{ a: CustomLink }}
  remarkPlugins={[myRemarkPlugin]}
  rehypePlugins={[myRehypePlugin]}
/>
```

`value` and `children` are compatible; `value` wins if both are passed. `remarkPlugins` and `rehypePlugins` use the standard Unified plugin format accepted by `react-markdown`.

### Secure user-generated Markdown

```tsx
<MarkdownPro value={comment} allowHtml={false} />
```

Raw HTML remains compatible with the legacy component, but is sanitized by default:

```tsx
<MarkdownPro value={trustedContent} allowHtml sanitizeHtml />
```

Do not use `sanitizeHtml={false}` with user-provided content.

### Custom links and images

```tsx
<MarkdownPro
  value={markdown}
  linkTarget="_blank"
  imageLoading="eager"
  components={{
    a: ({ href, children }) => <a className="brand-link" href={href}>{children}</a>
  }}
/>
```

### Capture copied code

```tsx
<MarkdownPro
  value={markdown}
  showLineNumbers={false}
  onCopyCode={(code, language) => analytics.track("code_copied", { language, code })}
/>
```

### Plain or themed code

```tsx
// Default highlighted Atom theme.
<MarkdownPro>{markdown}</MarkdownPro>

// Normal <code> elements for a design system that styles code itself.
<MarkdownPro value={markdown} codeTheme={false} showCopyButton={false} />
```

### Inline Markdown and parser extensions

```tsx
<p>
  Status: <MarkdownPro inline applyStyles={false}>**Ready**</MarkdownPro>
</p>

<MarkdownPro
  value={markdown}
  remarkPlugins={[myRemarkPlugin]}
  rehypePlugins={[myRehypePlugin]}
/>
```

### Currency and math

Use LaTeX delimiters for math, such as `$x^2$` and `$$\\frac{a}{b}$$`. For unambiguous literal currency in Markdown, write `\\$20`.

## Development and release checks

```bash
npm install
npm run check
```

The test suite validates legacy behavior plus GFM, math, safe and trusted HTML, code variants, copy callbacks, links, images, component overrides, inline mode, styles, TypeScript, compilation, and package contents.

## Compatibility

The package supports React 16.8, 17, and 18. It publishes both ESM and CommonJS entry points and is intended for React build tools such as Vite, Webpack, Parcel, and Next.js.

For user-generated content, use `allowHtml={false}`. The `allowHtml` default remains `true` for 1.x compatibility; a future 2.0 release can safely change that default.

See [CHANGELOG.md](./CHANGELOG.md) for release notes.

## License

[MIT](./LICENSE)
