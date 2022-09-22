import Head from 'next/head'
import Header from '../components/header.js'
import Navbar from '../components/navbar.js'
import Footer from '../components/footer.js'
import '../styles/globals.css'

export default function App({Component, pageProps}) {
  return (
    <>
      <Head>
        <title>Kiko Ruiz</title>
        <meta name="description" content="Kiko Ruiz" />
      </Head>

      <Header />
      <Navbar />
      <main>
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  )
}
