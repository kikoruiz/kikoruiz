import Layout from '../components/layout.js'
import '../styles/globals.css'

export default function App({Component, pageProps}) {
  const {section, post, alternates} = pageProps
  const sectionData = {
    section,
    post
  }
  const languageData = {alternates}

  return (
    <Layout {...sectionData} {...languageData}>
      <Component {...pageProps} />
    </Layout>
  )
}
