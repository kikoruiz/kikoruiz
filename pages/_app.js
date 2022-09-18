import Head from 'next/head'
import Link from 'next/link'
import '../styles/globals.css'

export default function App({Component, pageProps}) {
  return (
    <>
      <Head>
        <title>Kiko Ruiz</title>
        <meta name="description" content="Kiko Ruiz" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <nav>
          <ul>
            <li>
              <Link href="/">
                <a>Home</a>
              </Link>
            </li>

            <li>
              <Link href="/blog">
                <a>Blog</a>
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <Component {...pageProps} />
      </main>
      <footer></footer>
    </>
  )
}
