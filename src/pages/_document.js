import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Google Fonts: Montserrat for headings and Lexend for body */}
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Lexend:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
