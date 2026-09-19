// React Markdown renderer with GFM, math, code highlighting, and safe HTML controls.
import React, { FC } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { CopyToClipboard } from "react-copy-to-clipboard";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

import { Components } from "react-markdown/lib/ast-to-react";

const sanitizeSchema: any = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes?.code || []), ["className", "math", "math-inline", "math-display", "language-math"]],
    span: ["className"],
    div: [...(defaultSchema.attributes?.div || []), ["className", "math", "math-display"]],
  },
};

export interface MarkdownProProps {
  children?: string | string[] | null;
  value?: string | null;
  applyStyles?: boolean;
  inline?: boolean;
  allowHtml?: boolean;
  sanitizeHtml?: boolean;
  components?: Partial<Components>;
  remarkPlugins?: any[];
  rehypePlugins?: any[];
  codeTheme?: any | false;
  showLineNumbers?: boolean;
  showCopyButton?: boolean;
  onCopyCode?: (code: string, language: string) => void;
  linkTarget?: React.HTMLAttributeAnchorTarget;
  imageLoading?: "eager" | "lazy";
}

const MarkdownPro: FC<MarkdownProProps> = ({
  children,
  value,
  applyStyles = true,
  inline = false,
  allowHtml = true,
  sanitizeHtml = true,
  components: customComponents,
  remarkPlugins = [],
  rehypePlugins = [],
  codeTheme = atomDark,
  showLineNumbers = true,
  showCopyButton = true,
  onCopyCode,
  linkTarget,
  imageLoading = "lazy",
}) => {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  const components: Partial<Components> = {
    pre: ({ children }) => <>{children}</>,
    h1: ({ node, children, ...props }) => (
      <h1 id={`heading-${(node as any)?.position?.start?.line || "1"}`} {...props}>
        {children}
      </h1>
    ),
    h2: ({ node, children, ...props }) => (
      <h2 id={`heading-${(node as any)?.position?.start?.line || "2"}`} {...props}>
        {children}
      </h2>
    ),
    h3: ({ node, children, ...props }) => (
      <h3 id={`heading-${(node as any)?.position?.start?.line || "3"}`} {...props}>
        {children}
      </h3>
    ),
    h4: ({ node, children, ...props }) => (
      <h4 id={`heading-${(node as any)?.position?.start?.line || "4"}`} {...props}>
        {children}
      </h4>
    ),
    h5: ({ node, children, ...props }) => (
      <h5 id={`heading-${(node as any)?.position?.start?.line || "5"}`} {...props}>
        {children}
      </h5>
    ),
    h6: ({ node, children, ...props }) => (
      <h6 id={`heading-${(node as any)?.position?.start?.line || "6"}`} {...props}>
        {children}
      </h6>
    ),
    a: ({ href, children, node: _node, ...props }) => {
      return (
        <a
          href={href}
          target={linkTarget}
          rel={linkTarget === "_blank" ? "noopener noreferrer" : undefined}
          style={{
            color: "black",
            display: "flex",
            alignItems: "center",
          }}
          {...props}
        >
          {children}
        </a>
      );
    },
    code: ({ node, inline: isInline, className, children, ...props }) => {
      if (!applyStyles || codeTheme === false) {
        return <code {...props}>{children}</code>;
      }
      const match = /language-(\w+)/.exec(className || "");
      const language = match ? match[1] : "plaintext";
      const positionLine = (node as any)?.position?.start?.line || Math.random() * 1000;
      
      return !isInline && match ? (
        <div style={{ marginBottom: "1em" }}>
          {showCopyButton ? <CopyToClipboard
            text={children !== undefined && children !== null ? String(children).replace(/\n$/, "") : ""}
            onCopy={() => {
              setCopiedIndex(positionLine);
              onCopyCode?.(children !== undefined && children !== null ? String(children).replace(/\n$/, "") : "", language);
            }}
          >
            <button
              type="button"
              aria-label={`Copy ${language} code`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#f5f5f5",
                padding: "0.3em",
                borderTopLeftRadius: "4px",
                borderTopRightRadius: "4px",
                border: 0,
                width: "100%",
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  color: "#333",
                  padding: "0.3em",
                  fontSize: "0.8em",
                }}
              >
                {language}
              </span>
              <span
                style={{
                  color: copiedIndex === positionLine ? "#0D5244" : "#000",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "0.8em",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-clipboard"
                  viewBox="0 0 16 16"
                  style={{ marginRight: "0.2em" }}
                >
                  <path d="M10 1.5v1h-4v-1a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5z" />
                  <path d="M9.5 0a1.5 1.5 0 0 1 1.415 1H14a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h3.085A1.5 1.5 0 0 1 6.5 0h3zM14 4H2v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V4z" />
                </svg>
                {copiedIndex === positionLine ? "Copied!" : "Copy"}
              </span>
            </button>
          </CopyToClipboard> : null}
          <SyntaxHighlighter
            style={codeTheme as any}
            language={language}
            PreTag="div"
            {...props}
            customStyle={{
              fontSize: "14px",
              marginTop: "0",
              borderBottomLeftRadius: "4px",
              borderBottomRightRadius: "4px",
            }}
            showLineNumbers={showLineNumbers}
          >
            {children !== undefined && children !== null ? String(children).replace(/\n$/, "") : ""}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code
          {...props}
          style={{
            backgroundColor: "#f3f3f3",
            padding: "0.2rem",
            borderRadius: "4px",
            fontSize: "0.8em",
          }}
        >
          {children}
        </code>
      );
    },
    ul: ({ children, ordered: _ordered, depth: _depth, node: _node, ...props }) => (
      <ul
        style={
          applyStyles
            ? {
                display: "block",
                listStyleType: "disc",
                margin: "0em 0px 8px",
                paddingLeft: "20px",
              }
            : undefined
        }
        {...props}
      >
        {children}
      </ul>
    ),
    ol: ({ children, ordered: _ordered, depth: _depth, node: _node, ...props }) => (
      <ol
        style={
          applyStyles
            ? {
                display: "block",
                listStyleType: "decimal",
                marginTop: "1em",
                marginBottom: "1em",
                marginLeft: "0",
                marginRight: "0",
                paddingLeft: "20px",
              }
            : undefined
        }
        {...props}
      >
        {children}
      </ol>
    ),
    li: ({ children, ordered: _ordered, index: _index, checked: _checked, node: _node, ...props }) => (
      <li
        style={
          applyStyles
            ? {
                display: "list-item",
                marginTop: "0.5em",
                marginBottom: "0.5em",
                marginLeft: "0",
                marginRight: "0",
                paddingLeft: "0",
              }
            : undefined
        }
        {...props}
      >
        {children}
      </li>
    ),
    p: ({ children, node: _node, ...props }) =>
      inline ? <span {...props}>{children}</span> : <p {...props}>{children}</p>,
    sub: ({ children, node: _node, ...props }) => (
      <sub style={{ fontSize: "0.8em", verticalAlign: "sub" }} {...props}>
        {children}
      </sub>
    ),
    sup: ({ children, node: _node, ...props }) => (
      <sup style={{ fontSize: "0.8em", verticalAlign: "super" }} {...props}>
        {children}
      </sup>
    ),
    strong: ({ children, node: _node, ...props }) => (
      <strong style={{ fontWeight: "bold" }} {...props}>
        {children}
      </strong>
    ),
    em: ({ children, node: _node, ...props }) => (
      <em style={{ fontStyle: "italic" }} {...props}>
        {children}
      </em>
    ),
    blockquote: ({ children, node: _node, ...props }) => (
      <blockquote style={{ borderLeft: "5px solid #ccc", paddingLeft: "10px" }} {...props}>
        {children}
      </blockquote>
    ),
    hr: ({ node: _node, ...props }) => <hr style={{ borderTop: "2px solid #aaa" }} {...props} />,
    table: ({ children, node: _node, ...props }) => (
      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", width: "100%" }} {...props}>
          {children}
        </table>
      </div>
    ),
    tr: ({ children, isHeader: _isHeader, node: _node, ...props }) => <tr {...props}>{children}</tr>,
    td: ({ children, isHeader: _isHeader, node: _node, ...props }) => (
      <td style={{ border: "1px solid #ddd", padding: "8px" }} {...props}>
        {children}
      </td>
    ),
    th: ({ children, isHeader: _isHeader, node: _node, ...props }) => (
      <th style={{ border: "1px solid #ddd", padding: "8px", fontWeight: "bold" }} {...props}>
        {children}
      </th>
    ),
    img: ({ src, alt, node: _node, ...props }) => (
      <img
        src={src}
        alt={alt}
        loading={imageLoading}
        style={{ maxWidth: "100%", display: "block", margin: "10px 0" }}
        {...props}
      />
    ),
  };

  const childString: string = value !== undefined && value !== null
    ? value
    : Array.isArray(children)
      ? children.join("")
      : typeof children === "string"
        ? children
        : "";

  const isCurrencyContext = (text: string, index: number): boolean => {
    const afterDollar = text.substring(index + 1);
    const isFollowedByDigits = /^\d+(?:\.\d+)?/.test(afterDollar);

    if (!isFollowedByDigits) return false;

    if (index > 0) {
      const prevChar = text[index - 1];
      if (["$", "_", "^", "\\"].includes(prevChar)) return false;
    }

    return true;
  };

  const processedChildren = childString
    .replace(/\\n/g, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/\$/g, (match, offset, string) => {
      if (isCurrencyContext(string, offset)) {
        return "\\$";
      }

      return match;
    });

  const safeRemarkPlugins = [remarkGfm, remarkMath, ...remarkPlugins] as any[];
  const safeRehypePlugins = [
    ...(allowHtml ? [rehypeRaw, ...(sanitizeHtml ? [[rehypeSanitize, sanitizeSchema]] : [])] : []),
    rehypeSlug,
    rehypeKatex,
    ...rehypePlugins,
  ] as any[];

  return (
    <ReactMarkdown
      components={{ ...components, ...customComponents }}
      remarkPlugins={safeRemarkPlugins}
      rehypePlugins={safeRehypePlugins}
    >
      {processedChildren}
    </ReactMarkdown>
  );
};

export default MarkdownPro;
