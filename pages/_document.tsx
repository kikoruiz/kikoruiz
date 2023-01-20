import {Html, Head, Main, NextScript, DocumentProps} from 'next/document'

export default function Document({locale}: DocumentProps) {
  return (
    <Html lang={locale} className="scroll-smooth">
      <Head>
        <meta name="description" content="Kiko Ruiz" />
        <meta name="theme-color" content="#171717" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </Head>

      <body className="bg-gradient-to-bl from-neutral-900 via-neutral-900 to-black text-neutral-300 subpixel-antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
