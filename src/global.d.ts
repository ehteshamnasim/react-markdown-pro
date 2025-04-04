import React from 'react';

declare global {
  namespace JSX {
    interface Element extends React.ReactElement<any, any> {}
    interface IntrinsicElements extends React.JSX.IntrinsicElements {}
  }
}

declare module 'rehype-raw' {
  import { Plugin } from 'unified';
  const rehypeRaw: Plugin;
  export default rehypeRaw;
}

declare module 'rehype-katex' {
  import { Plugin } from 'unified';
  const rehypeKatex: Plugin;
  export default rehypeKatex;
}

declare module 'rehype-slug' {
  import { Plugin } from 'unified';
  const rehypeSlug: Plugin;
  export default rehypeSlug;
}

declare module 'remark-gfm' {
  import { Plugin } from 'unified';
  const remarkGfm: Plugin;
  export default remarkGfm;
}

declare module 'remark-math' {
  import { Plugin } from 'unified';
  const remarkMath: Plugin;
  export default remarkMath;
}