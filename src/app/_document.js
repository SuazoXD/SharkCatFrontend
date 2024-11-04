import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Importar la fuente Protest Strike */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Protest+Strike&display=swap" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
