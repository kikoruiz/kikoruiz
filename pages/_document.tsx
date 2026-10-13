import {Html, Head, Main, NextScript, DocumentProps} from 'next/document'

export default function Document({locale}: DocumentProps) {
  return (
    <Html lang={locale} className="scroll-smooth" data-scroll-behavior="smooth">
      <Head>
        <meta name="theme-color" content="#171717" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@kikoruizlloret" />
        {/* PNG rather than ICO because the old favicon.ico never held ICO data,
            and an .ico name has it served as image/vnd.microsoft.icon, which
            leaves Safari with an icon it cannot decode. The small one spares
            browsers a 512 to 16 downscale for the tab. */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon.png" />
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
