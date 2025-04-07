import { FC } from "react";
import "katex/dist/katex.min.css";
export interface MarkdownProProps {
    children: string | string[] | null | undefined;
    applyStyles?: boolean;
    inline?: boolean;
}
declare const MarkdownPro: FC<MarkdownProProps>;
export default MarkdownPro;
