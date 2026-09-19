import React, { useState } from "react";
import ReactDOM from "react-dom";
import MarkdownPro from "./src";

const heroCode = `import MarkdownPro from "react-markdown-pro";

export function Article() {
  return (
    <MarkdownPro
      value={content}
      allowHtml={false}
      showCopyButton
    />
  );
}`;

const markdown = {
  gfm: `# Markdown that feels native

Use **bold text**, ~~strikethrough~~, task lists, and responsive tables.

- [x] GFM enabled
- [x] Heading anchors
- [x] Table support

| Feature | Status |
| --- | --- |
| Markdown | Ready |
| TypeScript | Ready |`,
  math: `## Math and currency

Inline math: $E = mc^2$. Display math:

$$\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

For literal currency, use \\$20.`,
  patterns: `## Content patterns

> A blockquote can contain **formatting** and a [safe link](https://example.com).

1. Ordered item
   - Nested bullet
   - Another nested bullet
2. Second ordered item

Inline code: \`const ready = true\`.<br />
Hard line break above.

---

<https://example.com> · ~~deprecated~~ · \\$20

\`\`\`unknown
Fallback language
\`\`\``,
  code: `## Code blocks

\`\`\`tsx
export function Welcome() {
  return <MarkdownPro value="# Hello" />;
}
\`\`\``,
  raw: `## HTML safety

<mark>Allowed presentation HTML</mark>
<img src="x" onerror="alert('blocked')" />
<script>alert('blocked')</script>`,
  custom: `## Custom renderers

[This link is rendered by a custom component](https://www.npmjs.com/package/react-markdown-pro).

![A responsive image](https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=900&q=80)`,
};

function App() {
  const [lastCopied, setLastCopied] = useState("Nothing copied yet");
  const BrandedLink = ({ href, children }: any) => <a className="brand-link" href={href} target="_blank" rel="noreferrer">↗ {children}</a>;

  return <>
    <header><div className="topbar"><div className="brand">react-markdown-pro <span>/ renderer reference</span></div><div className="version">v1.1.2</div></div></header>
    <div className="hero-wrap"><div className="hero"><div><div className="eyebrow">React Markdown, deliberately complete</div><h1>Render content without compromising your interface.</h1><p className="lead">A production-ready renderer for documentation, education, product content, and user-authored Markdown-with a small API and serious controls.</p></div><div className="hero-panel"><div className="panel-label"><span>Article.tsx</span><span>tsx</span></div><pre><code>{heroCode}</code></pre></div></div></div>
    <main className="layout">
      <aside><p>On this page</p><nav aria-label="Demo sections"><strong>Content</strong><a href="#gfm">Markdown and GFM</a><a href="#math">Math and currency</a><a href="#patterns">Content patterns</a><strong>Rendering</strong><a href="#code">Code rendering</a><a href="#security">HTML safety</a><a href="#custom">Custom components</a><a href="#inline">Inline and plugins</a><strong>Reference</strong><a href="#settings">All settings</a></nav></aside>
      <div>
        <section className="card" id="gfm"><MarkdownPro>{markdown.gfm}</MarkdownPro></section>
        <section className="card" id="math"><MarkdownPro value={markdown.math} /></section>
        <section className="card" id="patterns"><MarkdownPro value={markdown.patterns} /><p className="caption">Covers nested lists, blockquotes, inline code, hard line breaks, rules, autolinks, strikethrough, literal currency, and unknown code languages.</p></section>
        <section className="card" id="code"><MarkdownPro value={markdown.code} showLineNumbers={false} onCopyCode={(code, language) => setLastCopied(`Copied ${language}: ${code}`)} /><p className="event" role="status">{lastCopied}</p><p className="caption">Options shown: <code>value</code>, <code>showLineNumbers</code>, <code>onCopyCode</code>.</p><MarkdownPro value="```js\n// Plain code mode\nconst minimal = true;\n```" codeTheme={false} showCopyButton={false} /><p className="caption">Options shown: <code>codeTheme=false</code>, <code>showCopyButton=false</code>.</p></section>
        <section className="card" id="security"><MarkdownPro value={markdown.raw} allowHtml sanitizeHtml /><p className="caption">Sanitization leaves safe markup while removing scripts and event attributes. Set <code>allowHtml=false</code> to display all HTML as text.</p></section>
        <section className="card" id="custom"><MarkdownPro value={markdown.custom} components={{ a: BrandedLink }} imageLoading="eager" linkTarget="_blank" /><p className="caption">Options shown: <code>components</code>, <code>imageLoading</code>, <code>linkTarget</code>.</p></section>
        <section className="card" id="inline"><h2>Inline and plugin extension points</h2><p>Question: <MarkdownPro inline applyStyles={false}>What is **2 + 2**?</MarkdownPro> Answer: four.</p><p className="caption">Pass <code>remarkPlugins</code> and <code>rehypePlugins</code> arrays when your product needs custom Markdown transforms.</p></section>
        <section className="card" id="settings"><h2>Complete settings reference</h2><table className="settings"><thead><tr><th>Setting</th><th>Default</th><th>Use it for</th></tr></thead><tbody><tr><td><code>children</code> / <code>value</code></td><td>required input</td><td>Pass Markdown; <code>value</code> takes priority.</td></tr><tr><td><code>applyStyles</code>, <code>inline</code></td><td>true, false</td><td>Original visual styles or inline-only content.</td></tr><tr><td><code>allowHtml</code>, <code>sanitizeHtml</code></td><td>true, true</td><td>Control compatibility and safety for raw HTML.</td></tr><tr><td><code>components</code></td><td>—</td><td>Replace any rendered element.</td></tr><tr><td><code>remarkPlugins</code>, <code>rehypePlugins</code></td><td>[]</td><td>Add Unified processing plugins.</td></tr><tr><td><code>codeTheme</code>, <code>showLineNumbers</code>, <code>showCopyButton</code></td><td>atomDark, true, true</td><td>Control fenced code rendering.</td></tr><tr><td><code>onCopyCode</code></td><td>—</td><td>Track copied content.</td></tr><tr><td><code>linkTarget</code>, <code>imageLoading</code></td><td>—, lazy</td><td>Control external links and image loading.</td></tr></tbody></table></section>
      </div>
    </main>
  </>;
}

ReactDOM.render(<App />, document.getElementById("root"));
