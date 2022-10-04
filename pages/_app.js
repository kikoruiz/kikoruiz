import Layout from '../components/layout.js'
import '../styles/globals.css'

export default function App({Component, pageProps}) {
  const {section} = pageProps

  return (
    <Layout section={section}>
      <Component {...pageProps} />
    </Layout>
  )
}
