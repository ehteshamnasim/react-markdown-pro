var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React from "react";
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
var MarkdownPro = function (_a) {
    var children = _a.children, _b = _a.applyStyles, applyStyles = _b === void 0 ? true : _b, _c = _a.inline, inline = _c === void 0 ? false : _c;
    var _d = React.useState(null), copiedIndex = _d[0], setCopiedIndex = _d[1];
    // Create separate math component implementations
    var InlineMathComponent = function (_a) {
        var value = _a.value, props = __rest(_a, ["value"]);
        if (value === undefined || value === null) {
            return React.createElement("span", null, "$");
        }
        if (typeof value === 'string' && /^\s*\d+(\.\d+)?\s*$/.test(value)) {
            return React.createElement("span", null,
                "$",
                value);
        }
        try {
            return (React.createElement("span", __assign({ dangerouslySetInnerHTML: {
                    __html: katex.renderToString(String(value), { throwOnError: false }),
                } }, props)));
        }
        catch (e) {
            return React.createElement("span", null,
                "$",
                value,
                "$");
        }
    };
    var BlockMathComponent = function (_a) {
        var value = _a.value, props = __rest(_a, ["value"]);
        if (value === undefined || value === null) {
            return React.createElement("p", null, "$$");
        }
        if (typeof value === 'string' && /^\s*\d+(\.\d+)?\s*$/.test(value)) {
            return React.createElement("p", null,
                "$",
                value);
        }
        try {
            return (React.createElement("div", __assign({ style: {
                    display: "block",
                    background: "#f9f9f9",
                    borderRadius: "4px",
                    marginBottom: "1em",
                    overflowX: "auto",
                }, dangerouslySetInnerHTML: {
                    __html: katex.renderToString(String(value), { displayMode: true, throwOnError: false }),
                } }, props)));
        }
        catch (e) {
            return React.createElement("p", null,
                "$",
                value,
                "$");
        }
    };
    // Define the components with proper typing
    var components = {
        h1: function (_a) {
            var _b, _c;
            var node = _a.node, children = _a.children, props = __rest(_a, ["node", "children"]);
            return (React.createElement("h1", __assign({ id: "heading-".concat(((_c = (_b = node === null || node === void 0 ? void 0 : node.position) === null || _b === void 0 ? void 0 : _b.start) === null || _c === void 0 ? void 0 : _c.line) || "1") }, props), children));
        },
        h2: function (_a) {
            var _b, _c;
            var node = _a.node, children = _a.children, props = __rest(_a, ["node", "children"]);
            return (React.createElement("h2", __assign({ id: "heading-".concat(((_c = (_b = node === null || node === void 0 ? void 0 : node.position) === null || _b === void 0 ? void 0 : _b.start) === null || _c === void 0 ? void 0 : _c.line) || "2") }, props), children));
        },
        h3: function (_a) {
            var _b, _c;
            var node = _a.node, children = _a.children, props = __rest(_a, ["node", "children"]);
            return (React.createElement("h3", __assign({ id: "heading-".concat(((_c = (_b = node === null || node === void 0 ? void 0 : node.position) === null || _b === void 0 ? void 0 : _b.start) === null || _c === void 0 ? void 0 : _c.line) || "3") }, props), children));
        },
        h4: function (_a) {
            var _b, _c;
            var node = _a.node, children = _a.children, props = __rest(_a, ["node", "children"]);
            return (React.createElement("h4", __assign({ id: "heading-".concat(((_c = (_b = node === null || node === void 0 ? void 0 : node.position) === null || _b === void 0 ? void 0 : _b.start) === null || _c === void 0 ? void 0 : _c.line) || "4") }, props), children));
        },
        h5: function (_a) {
            var _b, _c;
            var node = _a.node, children = _a.children, props = __rest(_a, ["node", "children"]);
            return (React.createElement("h5", __assign({ id: "heading-".concat(((_c = (_b = node === null || node === void 0 ? void 0 : node.position) === null || _b === void 0 ? void 0 : _b.start) === null || _c === void 0 ? void 0 : _c.line) || "5") }, props), children));
        },
        h6: function (_a) {
            var _b, _c;
            var node = _a.node, children = _a.children, props = __rest(_a, ["node", "children"]);
            return (React.createElement("h6", __assign({ id: "heading-".concat(((_c = (_b = node === null || node === void 0 ? void 0 : node.position) === null || _b === void 0 ? void 0 : _b.start) === null || _c === void 0 ? void 0 : _c.line) || "6") }, props), children));
        },
        a: function (_a) {
            var href = _a.href, children = _a.children, props = __rest(_a, ["href", "children"]);
            // Create a safely typed version of the children
            var cleanChildren = children;
            // Only attempt string operations if children is actually a string
            if (Array.isArray(children)) {
                cleanChildren = children.map(function (child) {
                    return typeof child === "string" ? child.replace(/,/g, "") : child;
                });
            }
            else if (children !== null && children !== undefined && typeof children === "string") {
                // Use explicit type assertion to convince TypeScript this is a string
                var childrenAsString = children;
                cleanChildren = childrenAsString.replace(/,/g, "");
            }
            return (React.createElement("a", __assign({ href: href, style: {
                    color: "black",
                    display: "flex",
                    alignItems: "center",
                } }, props), cleanChildren));
        },
        code: function (_a) {
            var _b, _c;
            var node = _a.node, isInline = _a.inline, className = _a.className, children = _a.children, props = __rest(_a, ["node", "inline", "className", "children"]);
            if (!applyStyles) {
                return React.createElement("code", __assign({}, props), children);
            }
            var match = /language-(\w+)/.exec(className || "");
            var language = match ? match[1] : "plaintext";
            var positionLine = ((_c = (_b = node === null || node === void 0 ? void 0 : node.position) === null || _b === void 0 ? void 0 : _b.start) === null || _c === void 0 ? void 0 : _c.line) || Math.random() * 1000;
            return !isInline && match ? (React.createElement("div", { style: { marginBottom: "1em" } },
                React.createElement(CopyToClipboard, { text: children !== undefined && children !== null ? String(children).replace(/\n$/, "") : "", onCopy: function () { return setCopiedIndex(positionLine); } },
                    React.createElement("div", { style: {
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            background: "#f5f5f5",
                            padding: "0.3em",
                            borderTopLeftRadius: "4px",
                            borderTopRightRadius: "4px",
                        } },
                        React.createElement("span", { style: {
                                color: "#333",
                                padding: "0.3em",
                                fontSize: "0.8em",
                            } }, language),
                        React.createElement("span", { style: {
                                color: copiedIndex === positionLine ? "#0D5244" : "#000",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                fontSize: "0.8em",
                            } },
                            React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-clipboard", viewBox: "0 0 16 16", style: { marginRight: "0.2em" } },
                                React.createElement("path", { d: "M10 1.5v1h-4v-1a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5z" }),
                                React.createElement("path", { d: "M9.5 0a1.5 1.5 0 0 1 1.415 1H14a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h3.085A1.5 1.5 0 0 1 6.5 0h3zM14 4H2v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V4z" })),
                            copiedIndex === positionLine ? "Copied!" : "Copy"))),
                React.createElement(SyntaxHighlighter, __assign({ style: atomDark, language: language, PreTag: "div" }, props, { customStyle: {
                        fontSize: "14px",
                        marginTop: "0",
                        borderBottomLeftRadius: "4px",
                        borderBottomRightRadius: "4px",
                    }, showLineNumbers: true }), children !== undefined && children !== null ? String(children).replace(/\n$/, "") : ""))) : (React.createElement("code", __assign({}, props, { style: {
                    backgroundColor: "#f3f3f3",
                    padding: "0.2rem",
                    borderRadius: "4px",
                    fontSize: "0.8em",
                } }), children));
        },
        ul: function (_a) {
            var children = _a.children, props = __rest(_a, ["children"]);
            return (React.createElement("ul", __assign({ style: applyStyles
                    ? {
                        display: "block",
                        listStyleType: "disc",
                        margin: "0em 0px 8px",
                        paddingLeft: "20px",
                    }
                    : undefined }, props), children));
        },
        ol: function (_a) {
            var children = _a.children, props = __rest(_a, ["children"]);
            return (React.createElement("ol", __assign({ style: applyStyles
                    ? {
                        display: "block",
                        listStyleType: "decimal",
                        marginTop: "1em",
                        marginBottom: "1em",
                        marginLeft: "0",
                        marginRight: "0",
                        paddingLeft: "20px",
                    }
                    : undefined }, props), children));
        },
        li: function (_a) {
            var children = _a.children, props = __rest(_a, ["children"]);
            return (React.createElement("li", __assign({ style: applyStyles
                    ? {
                        display: "list-item",
                        marginTop: "0.5em",
                        marginBottom: "0.5em",
                        marginLeft: "0",
                        marginRight: "0",
                        paddingLeft: "0",
                    }
                    : undefined }, props), children));
        },
        p: function (_a) {
            var children = _a.children, props = __rest(_a, ["children"]);
            return inline ? React.createElement("span", __assign({}, props), children) : React.createElement("p", __assign({}, props), children);
        },
        sub: function (_a) {
            var children = _a.children, props = __rest(_a, ["children"]);
            return (React.createElement("sub", __assign({ style: { fontSize: "0.8em", verticalAlign: "sub" } }, props), children));
        },
        sup: function (_a) {
            var children = _a.children, props = __rest(_a, ["children"]);
            return (React.createElement("sup", __assign({ style: { fontSize: "0.8em", verticalAlign: "super" } }, props), children));
        },
        strong: function (_a) {
            var children = _a.children, props = __rest(_a, ["children"]);
            return (React.createElement("strong", __assign({ style: { fontWeight: "bold" } }, props), children));
        },
        em: function (_a) {
            var children = _a.children, props = __rest(_a, ["children"]);
            return (React.createElement("em", __assign({ style: { fontStyle: "italic" } }, props), children));
        },
        blockquote: function (_a) {
            var children = _a.children, props = __rest(_a, ["children"]);
            return (React.createElement("blockquote", __assign({ style: { borderLeft: "5px solid #ccc", paddingLeft: "10px" } }, props), children));
        },
        hr: function (props) { return React.createElement("hr", __assign({ style: { borderTop: "2px solid #aaa" } }, props)); },
        table: function (_a) {
            var children = _a.children, props = __rest(_a, ["children"]);
            return (React.createElement("div", __assign({ style: { overflowX: "auto" } }, props),
                React.createElement("table", { style: { borderCollapse: "collapse", width: "100%" } }, children)));
        },
        tr: function (_a) {
            var children = _a.children, props = __rest(_a, ["children"]);
            return React.createElement("tr", __assign({}, props), children);
        },
        td: function (_a) {
            var children = _a.children, props = __rest(_a, ["children"]);
            return (React.createElement("td", __assign({ style: { border: "1px solid #ddd", padding: "8px" } }, props), children));
        },
        th: function (_a) {
            var children = _a.children, props = __rest(_a, ["children"]);
            return (React.createElement("th", __assign({ style: { border: "1px solid #ddd", padding: "8px", fontWeight: "bold" } }, props), children));
        },
        img: function (_a) {
            var src = _a.src, alt = _a.alt, props = __rest(_a, ["src", "alt"]);
            return (React.createElement("img", __assign({ src: src, alt: alt, style: { maxWidth: "100%", display: "block", margin: "10px 0" } }, props)));
        },
        // Use the custom components for math rendering
        // Custom components added through index signature
    };
    // Add custom components for math via index signature
    components['inlineMath'] = InlineMathComponent;
    components['math'] = BlockMathComponent;
    // Ensure the markdown string is typed as a string with explicit typing
    var childString = Array.isArray(children)
        ? children.join("")
        : typeof children === "string"
            ? children
            : "";
    var isCurrencyContext = function (text, index) {
        // Check if the dollar sign is followed by one or more digits
        var afterDollar = text.substring(index + 1);
        var isFollowedByDigits = /^\d+(?:\.\d+)?/.test(afterDollar);
        // If not followed by digits, it's not a currency
        if (!isFollowedByDigits)
            return false;
        // If preceded by a character that suggests math context, it's not a currency
        if (index > 0) {
            var prevChar = text[index - 1];
            // If preceded by $ or _ or ^ or other math indicators, likely math not currency
            if (['$', '_', '^', '\\'].includes(prevChar))
                return false;
        }
        return true;
    };
    // First, preprocess the content to escape dollar signs in obvious currency contexts
    // Use explicit type check to make TypeScript happy
    var processedChildren = childString
        .replace(/\\n/g, "\n")
        .replace(/<br\s*\/?>/gi, "\n")
        // Use a custom replacement function to handle currency vs. math contexts
        .replace(/\$/g, function (match, offset, string) {
        if (isCurrencyContext(string, offset)) {
            return '\\$'; // Escape dollar signs in currency contexts
        }
        return match; // Keep dollar signs in math contexts
    })
        .replace(/\n/g, "\n");
    // Include both the basic plugins and the math plugins
    var safeRemarkPlugins = [remarkGfm, remarkMath];
    var safeRehypePlugins = [rehypeSlug, rehypeKatex, rehypeRaw];
    return (React.createElement(ReactMarkdown, { components: components, remarkPlugins: safeRemarkPlugins, rehypePlugins: safeRehypePlugins }, processedChildren));
};
export default MarkdownPro;
