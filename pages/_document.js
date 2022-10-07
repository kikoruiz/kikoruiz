import {Html, Head, Main, NextScript} from 'next/document'

export default function Document({locale}) {
  return (
    <Html lang={locale}>
      <Head>
        <meta name="description" content="Kiko Ruiz" />
        <meta name="theme-color" content="#171717" />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter&display=swap"
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
