/// <reference types="next" />
/// <reference types="next/image-types/global" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare module 'next/link' {
    import {LinkProps} from 'next/dist/client/link';
    import {AnchorHTMLAttributes, DetailedHTMLProps} from 'react';

    export type { LinkProps };
  
  const Link: React.FC<LinkProps & {
    children?: React.ReactNode;
  } & Omit<DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>, keyof LinkProps>>;
  
  export default Link;
}

declare module 'next/image' {
  const Image: any;
  export default Image;
}

declare module 'next/router' {
  export * from 'next/dist/client/router';
}