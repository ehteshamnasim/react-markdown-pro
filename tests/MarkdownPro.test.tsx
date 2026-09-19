import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import MarkdownPro, { defaultUrlTransform, parseCodeMetadata, parseFrontmatter } from "../src";

describe("MarkdownPro additive API", () => {
  it("keeps the original children API, GFM, headings, tables and task lists", () => {
    render(<MarkdownPro>{"# Title\n\n- [x] shipped\n\n| A | B |\n|---|---|\n| 1 | 2 |"}</MarkdownPro>);
    expect(screen.getByRole("heading", { name: "Title" })).toHaveAttribute("id", "title");
    expect(screen.getByRole("checkbox")).toBeChecked();
    expect(screen.getByRole("table")).toHaveTextContent("1");
  });

  it("accepts value without breaking children, arrays, or empty values", () => {
    const { rerender, container } = render(<MarkdownPro value="**new API**">old API</MarkdownPro>);
    expect(screen.getByText("new API").tagName).toBe("STRONG");
    rerender(<MarkdownPro>{["hello", " world"]}</MarkdownPro>);
    expect(screen.getByText("hello world")).toBeInTheDocument();
    rerender(<MarkdownPro value="" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders inline and display math and retains the legacy currency behavior", () => {
    const { container } = render(<MarkdownPro>{"Price: $20. Math: $x^2$.\n\n$$\\frac{1}{2}$$"}</MarkdownPro>);
    expect(container).toHaveTextContent("Price: $20.");
    expect(container.querySelectorAll(".katex").length).toBeGreaterThanOrEqual(2);
  });

  it("can turn raw HTML off", () => {
    const { container } = render(<MarkdownPro allowHtml={false}>{"<b>not HTML</b>"}</MarkdownPro>);
    expect(container.querySelector("b")).toBeNull();
    expect(container).toHaveTextContent("<b>not HTML</b>");
  });

  it("sanitizes enabled raw HTML, including scripts and event attributes", () => {
    const { container } = render(<MarkdownPro allowHtml>{'<img src="x" onerror="alert(1)"><script>alert(1)</script><b>safe</b>'}</MarkdownPro>);
    expect(container.querySelector("script")).toBeNull();
    expect(container.querySelector("img")).not.toHaveAttribute("onerror");
    expect(screen.getByText("safe").tagName).toBe("B");
  });

  it("allows advanced trusted HTML compatibility when sanitization is explicitly disabled", () => {
    const { container } = render(<MarkdownPro allowHtml sanitizeHtml={false}>{"<mark data-note=\"x\">trusted</mark>"}</MarkdownPro>);
    expect(container.querySelector("mark")).toHaveAttribute("data-note", "x");
  });

  it("renders code options and reports copied code", () => {
    const onCopyCode = vi.fn();
    render(<MarkdownPro onCopyCode={onCopyCode} showLineNumbers={false}>{"```tsx\nconst a = 1;\n```"}</MarkdownPro>);
    fireEvent.click(screen.getByRole("button", { name: "Copy tsx code" }));
    expect(onCopyCode).toHaveBeenCalledWith("const a = 1;", "tsx");
    expect(screen.getByRole("button", { name: "Copy tsx code" })).toHaveTextContent("Copied!");
    expect(document.querySelector(".react-syntax-highlighter-line-number")).toBeNull();
  });

  it("supports plain code and hiding copy controls", () => {
    const { container, rerender } = render(<MarkdownPro codeTheme={false}>{"```js\nlet x\n```"}</MarkdownPro>);
    expect(container.querySelector(".react-syntax-highlighter-line-number")).toBeNull();
    rerender(<MarkdownPro showCopyButton={false}>{"```js\nlet x\n```"}</MarkdownPro>);
    expect(screen.queryByRole("button", { name: /Copy js code/ })).toBeNull();
  });

  it("uses safe external-link defaults and configurable image loading", () => {
    render(<MarkdownPro linkTarget="_blank" imageLoading="eager">{"[Hello, world](https://example.com)\n\n![logo](https://example.com/logo.png)"}</MarkdownPro>);
    expect(screen.getByRole("link", { name: "Hello, world" })).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByRole("img", { name: "logo" })).toHaveAttribute("loading", "eager");
  });

  it("lets consumers override elements and add plugins", () => {
    const Link = ({ children }: { children?: React.ReactNode }) => <span data-testid="custom-link">{children}</span>;
    render(<MarkdownPro components={{ a: Link }} remarkPlugins={[]}>[replace me](https://example.com)</MarkdownPro>);
    expect(screen.getByTestId("custom-link")).toHaveTextContent("replace me");
  });

  it("retains inline mode and optional original list styles", () => {
    const { rerender, container } = render(<MarkdownPro inline applyStyles={false}>one</MarkdownPro>);
    expect(screen.getByText("one").tagName).toBe("SPAN");
    rerender(<MarkdownPro applyStyles>{"- item"}</MarkdownPro>);
    expect(screen.getByRole("list")).toHaveStyle({ paddingLeft: "20px" });
    expect(container.querySelector("[node], [depth], [index], [ordered], [isHeader]")).toBeNull();
  });

  it("handles nested Markdown, hard breaks, autolinks, literal currency, and unknown code languages", () => {
    const source = `> quote with **bold**\n\n1. first\n   - nested\n\nline one  \nline two\n\n<https://example.com> \\$20\n\n\`\`\`unknown\ntext\n\`\`\``;
    render(<MarkdownPro>{source}</MarkdownPro>);
    expect(screen.getByText("quote with", { exact: false })).toBeInTheDocument();
    expect(screen.getAllByRole("list")).toHaveLength(2);
    expect(screen.getByRole("link", { name: "https://example.com" })).toHaveAttribute("href", "https://example.com");
    expect(screen.getByText("$20")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copy unknown code" })).toBeInTheDocument();
  });

  it("uses the secure HTML default and only parses HTML after explicit opt-in", () => {
    const { container, rerender } = render(<MarkdownPro>{"<em>literal</em>"}</MarkdownPro>);
    expect(container.querySelector("em")).toBeNull();
    expect(container).toHaveTextContent("<em>literal</em>");
    rerender(<MarkdownPro allowHtml>{"<em>rendered</em>"}</MarkdownPro>);
    expect(container.querySelector("em")).toHaveTextContent("rendered");
  });

  it("enforces protocol and element policies, including unwrap mode", () => {
    const { container, rerender } = render(<MarkdownPro>{"[bad](javascript:alert(1))\n\n![bad](data:image/png;base64,aaa)"}</MarkdownPro>);
    expect(screen.getByRole("link", { name: "bad" })).toHaveAttribute("href", "");
    expect(screen.getByRole("img", { name: "bad" })).toHaveAttribute("src", "");
    rerender(<MarkdownPro disallowedElements={["strong"]} unwrapDisallowed>{"**kept text**"}</MarkdownPro>);
    expect(container.querySelector("strong")).toBeNull();
    expect(container).toHaveTextContent("kept text");
  });

  it("creates stable table-of-contents links and optional heading permalinks", () => {
    render(<MarkdownPro toc={{ title: "Contents", minDepth: 2 }}># Ignored\n\n## Install\n\n## Install\n\n### Deep</MarkdownPro>);
    const nav = screen.getByRole("navigation", { name: "Contents" });
    expect(nav).toHaveTextContent("Install");
    expect(nav.querySelectorAll('a[href="#install"], a[href="#install-1"]')).toHaveLength(2);
    expect(document.getElementById("install-1")).toBeInTheDocument();
  });

  it("parses frontmatter, callouts, and GFM footnotes without leaking metadata into the document", () => {
    const onFrontmatter = vi.fn();
    render(<MarkdownPro onFrontmatter={onFrontmatter} renderFrontmatter={(data) => <output>{String(data.draft)}</output>}>{"---\ntitle: Guide\ndraft: false\ntags: [react, markdown]\n---\n:::warning Check this\nUse a safe URL.\n:::\n\nText.[^1]\n\n[^1]: Footnote text"}</MarkdownPro>);
    expect(screen.getByText("false")).toBeInTheDocument();
    expect(screen.queryByText("title: Guide")).toBeNull();
    expect(screen.getByRole("note")).toHaveTextContent("Check this");
    expect(screen.getByText("Footnote text")).toBeInTheDocument();
    expect(onFrontmatter).toHaveBeenCalledWith({ title: "Guide", draft: false, tags: ["react", "markdown"] });
  });

  it("reads fenced-code metadata for titles, collapse state, line ranges, and line-number opt-out", () => {
    const { container } = render(<MarkdownPro lazyCodeHighlighting={false}>{"```tsx title=\"App.tsx\" {1,3-4} collapse lineNumbers=false\nconst one = 1;\nconst two = 2;\n```"}</MarkdownPro>);
    expect(screen.getByText("App.tsx")).toBeInTheDocument();
    expect(container.querySelector("details")).not.toHaveAttribute("open");
    expect(container.querySelector(".react-syntax-highlighter-line-number")).toBeNull();
  });

  it("handles malformed metadata and frontmatter without throwing", () => {
    expect(parseCodeMetadata("{bad, 2-x title='safe name'" as string).highlightedLines.size).toBe(0);
    expect(parseFrontmatter("---\ntitle: unfinished\nbody").data).toEqual({});
    expect(parseFrontmatter("plain text")).toEqual({ content: "plain text", data: {} });
  });

  it("exposes a predictable URL policy and permits explicit protocol overrides", () => {
    expect(defaultUrlTransform("javascript:alert(1)")).toBeNull();
    expect(defaultUrlTransform("data:text/plain,blocked")).toBeNull();
    expect(defaultUrlTransform("#section")).toBe("#section");
    const { rerender } = render(<MarkdownPro urlTransform={(url) => `https://safe.test/?q=${encodeURIComponent(url)}`}>[link](https://example.com)</MarkdownPro>);
    expect(screen.getByRole("link")).toHaveAttribute("href", "https://safe.test/?q=https%3A%2F%2Fexample.com");
    rerender(<MarkdownPro allowedProtocols={["ftp"]}>[file](ftp://example.com/a)</MarkdownPro>);
    expect(screen.getByRole("link")).toHaveAttribute("href", "ftp://example.com/a");
  });

  it("does not turn callout-looking text inside a fenced code block into an aside", () => {
    const { container } = render(<MarkdownPro>{"```md\n:::warning\nnot a callout\n:::\n```"}</MarkdownPro>);
    expect(container.querySelector('[data-callout="warning"]')).toBeNull();
    expect(container).toHaveTextContent("not a callout");
  });

  it("supports TOC depth limits, disabled heading links, and duplicate heading slugs", () => {
    render(<MarkdownPro headingLinks={false} toc={{ minDepth: 3, maxDepth: 3 }}># One\n\n## Two\n\n### Three\n\n### Three</MarkdownPro>);
    expect(screen.getByRole("navigation")).toHaveTextContent("Three");
    expect(screen.getByRole("navigation").querySelectorAll("a")).toHaveLength(2);
    expect(screen.getByRole("heading", { name: "One" }).querySelector("a")).toBeNull();
    expect(document.getElementById("three-1")).toBeInTheDocument();
  });
});
