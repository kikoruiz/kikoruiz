import Head from 'next/head'
import Header from '../components/header.js'
import Footer from '../components/footer.js'
import '../styles/globals.css'

export default function App({Component, pageProps}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Head>
        <title>Kiko Ruiz</title>
        <meta name="description" content="Kiko Ruiz" />
      </Head>

      <Header />
      <main className="container mx-auto">
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  )
}
