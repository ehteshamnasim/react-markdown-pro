import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import MarkdownPro from "../src";

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
    const { container } = render(<MarkdownPro>{'<img src="x" onerror="alert(1)"><script>alert(1)</script><b>safe</b>'}</MarkdownPro>);
    expect(container.querySelector("script")).toBeNull();
    expect(container.querySelector("img")).not.toHaveAttribute("onerror");
    expect(screen.getByText("safe").tagName).toBe("B");
  });

  it("allows advanced trusted HTML compatibility when sanitization is explicitly disabled", () => {
    const { container } = render(<MarkdownPro sanitizeHtml={false}>{"<mark data-note=\"x\">trusted</mark>"}</MarkdownPro>);
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
});
