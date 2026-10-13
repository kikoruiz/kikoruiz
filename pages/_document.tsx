import {Html, Head, Main, NextScript, DocumentProps} from 'next/document'

export default function Document({locale}: DocumentProps) {
  return (
    <Html lang={locale} className="scroll-smooth" data-scroll-behavior="smooth">
      <Head>
        <meta name="theme-color" content="#171717" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@kikoruizlloret" />
        {/* These are PNGs because favicon.ico never was one: it holds PNG
            bytes under an .ico name, which is served as image/vnd.microsoft.icon
            and leaves Safari with an icon it cannot decode. */}
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Kiko Ruiz / Blog"
          href="/api/rss"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>

      <body className="bg-gradient-to-bl from-neutral-900 via-neutral-900 to-black text-neutral-300 subpixel-antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
