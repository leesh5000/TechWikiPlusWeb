/// <reference types="react" />
/// <reference types="react-dom" />

import 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements extends React.JSX.IntrinsicElements {}
  }
}
