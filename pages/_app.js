import Layout from '../components/layout.js'
import '../styles/globals.css'

export default function App({Component, pageProps}) {
  const {section, post} = pageProps
  const sectionData = {
    section,
    post
  }

  return (
    <Layout {...sectionData}>
      <Component {...pageProps} />
    </Layout>
  )
}
