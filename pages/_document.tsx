import {Html, Head, Main, NextScript, DocumentProps} from 'next/document'

export default function Document({locale}: DocumentProps) {
  return (
    <Html lang={locale} className="scroll-smooth">
      <Head>
        <meta name="theme-color" content="#171717" />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <body className="bg-gradient-to-bl from-neutral-900 via-neutral-900 to-black text-neutral-300 subpixel-antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
