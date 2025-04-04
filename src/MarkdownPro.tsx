import React, { FC, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { CopyToClipboard } from "react-copy-to-clipboard";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import katex from "katex";
import rehypeRaw from "rehype-raw";

// Import correct types for React Markdown components
import { Components } from 'react-markdown/lib/ast-to-react';

// Define math component props
interface MathComponentProps {
  value?: string;
  [key: string]: any;
}

export interface MarkdownProProps {
  children: string | string[] | null | undefined;
  applyStyles?: boolean;
  inline?: boolean;
}

const MarkdownPro: FC<MarkdownProProps> = ({
  children,
  applyStyles = true,
  inline = false,
}) => {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  // Create separate math component implementations
  const InlineMathComponent = ({ value, ...props }: MathComponentProps) => {
    if (value === undefined || value === null) {
      return <span>$</span>;
    }
    
    if (typeof value === 'string' && /^\s*\d+(\.\d+)?\s*$/.test(value)) {
      return <span>${value}</span>;
    }
    
    try {
      return (
        <span
          dangerouslySetInnerHTML={{
            __html: katex.renderToString(String(value), { throwOnError: false }),
          }}
          {...props}
        />
      );
    } catch (e) {
      return <span>${value}$</span>;
    }
  };

  const BlockMathComponent = ({ value, ...props }: MathComponentProps) => {
    if (value === undefined || value === null) {
      return <p>$$</p>;
    }
    
    if (typeof value === 'string' && /^\s*\d+(\.\d+)?\s*$/.test(value)) {
      return <p>${value}</p>;
    }
    
    try {
      return (
        <div
          style={{
            display: "block",
            background: "#f9f9f9",
            borderRadius: "4px",
            marginBottom: "1em",
            overflowX: "auto",
          }}
          dangerouslySetInnerHTML={{
            __html: katex.renderToString(String(value), { displayMode: true, throwOnError: false }),
          }}
          {...props}
        />
      );
    } catch (e) {
      return <p>${value}$</p>;
    }
  };

  // Define the components with proper typing
  const components: Partial<Components> = {
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
    a: ({ href, children, ...props }) => {
      // Create a safely typed version of the children
      let cleanChildren: React.ReactNode = children;
      
      // Only attempt string operations if children is actually a string
      if (Array.isArray(children)) {
        cleanChildren = children.map(child => 
          typeof child === "string" ? child.replace(/,/g, "") : child
        );
      } else if (children !== null && children !== undefined && typeof children === "string") {
        // Use explicit type assertion to convince TypeScript this is a string
        const childrenAsString = children as string;
        cleanChildren = childrenAsString.replace(/,/g, "");
      }
      
      return (
        <a
          href={href}
          style={{
            color: "black",
            display: "flex",
            alignItems: "center",
          }}
          {...props}
        >
          {cleanChildren}
        </a>
      );
    },
    code: ({ node, inline: isInline, className, children, ...props }) => {
      if (!applyStyles) {
        return <code {...props}>{children}</code>;
      }
      const match = /language-(\w+)/.exec(className || "");
      const language = match ? match[1] : "plaintext";
      const positionLine = (node as any)?.position?.start?.line || Math.random() * 1000;
      
      return !isInline && match ? (
        <div style={{ marginBottom: "1em" }}>
          <CopyToClipboard
            text={children !== undefined && children !== null ? String(children).replace(/\n$/, "") : ""}
            onCopy={() => setCopiedIndex(positionLine)}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#f5f5f5",
                padding: "0.3em",
                borderTopLeftRadius: "4px",
                borderTopRightRadius: "4px",
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
            </div>
          </CopyToClipboard>
          <SyntaxHighlighter
            style={atomDark as any}
            language={language}
            PreTag="div"
            {...props}
            customStyle={{
              fontSize: "14px",
              marginTop: "0",
              borderBottomLeftRadius: "4px",
              borderBottomRightRadius: "4px",
            }}
            showLineNumbers={true}
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
    ul: ({ children, ...props }) => (
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
    ol: ({ children, ...props }) => (
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
    li: ({ children, ...props }) => (
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
    p: ({ children, ...props }) =>
      inline ? <span {...props}>{children}</span> : <p {...props}>{children}</p>,
    sub: ({ children, ...props }) => (
      <sub style={{ fontSize: "0.8em", verticalAlign: "sub" }} {...props}>
        {children}
      </sub>
    ),
    sup: ({ children, ...props }) => (
      <sup style={{ fontSize: "0.8em", verticalAlign: "super" }} {...props}>
        {children}
      </sup>
    ),
    strong: ({ children, ...props }) => (
      <strong style={{ fontWeight: "bold" }} {...props}>
        {children}
      </strong>
    ),
    em: ({ children, ...props }) => (
      <em style={{ fontStyle: "italic" }} {...props}>
        {children}
      </em>
    ),
    blockquote: ({ children, ...props }) => (
      <blockquote style={{ borderLeft: "5px solid #ccc", paddingLeft: "10px" }} {...props}>
        {children}
      </blockquote>
    ),
    hr: (props) => <hr style={{ borderTop: "2px solid #aaa" }} {...props} />,
    table: ({ children, ...props }) => (
      <div style={{ overflowX: "auto" }} {...props}>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          {children}
        </table>
      </div>
    ),
    tr: ({ children, ...props }) => <tr {...props}>{children}</tr>,
    td: ({ children, ...props }) => (
      <td style={{ border: "1px solid #ddd", padding: "8px" }} {...props}>
        {children}
      </td>
    ),
    th: ({ children, ...props }) => (
      <th style={{ border: "1px solid #ddd", padding: "8px", fontWeight: "bold" }} {...props}>
        {children}
      </th>
    ),
    img: ({ src, alt, ...props }) => (
      <img
        src={src}
        alt={alt}
        style={{ maxWidth: "100%", display: "block", margin: "10px 0" }}
        {...props}
      />
    ),
    // Use the custom components for math rendering
    // Custom components added through index signature
  };

  // Add custom components for math via index signature
  (components as any)['inlineMath'] = InlineMathComponent;
  (components as any)['math'] = BlockMathComponent;

  // Ensure the markdown string is typed as a string with explicit typing
  const childString: string =
    Array.isArray(children)
      ? children.join("")
      : typeof children === "string"
      ? children
      : "";
      
  // First, preprocess the content to escape dollar signs in obvious currency contexts
  // Use explicit type check to make TypeScript happy
  const processedChildren = childString
    .replace(/\\n/g, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    // Escape dollar signs in currency contexts (number immediately following $)
    // This regex pattern matches $ followed by digits, with optional decimal part
    .replace(/\$(\d+(\.\d+)?)/g, '\\$$1')
    .replace(/\n/g, "\n");

  // Include both the basic plugins and the math plugins
  const safeRemarkPlugins = [remarkGfm, remarkMath] as any[];
  const safeRehypePlugins = [rehypeSlug, rehypeKatex, rehypeRaw] as any[];

  return (
    <ReactMarkdown
      components={components}
      remarkPlugins={safeRemarkPlugins}
      rehypePlugins={safeRehypePlugins}
    >
      {processedChildren}
    </ReactMarkdown>
  );
};

export default MarkdownPro;