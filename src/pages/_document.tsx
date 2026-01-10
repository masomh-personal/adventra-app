import { Html, Head, Main, NextScript } from 'next/document';

export default function Document(): React.JSX.Element {
  return (
    <Html lang="en">
      <Head>{/* Fonts are loaded via next/font in _app.js */}</Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
