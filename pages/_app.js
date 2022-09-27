import {MenuContextProvider} from '../context/menu.js'
import Layout from '../components/layout.js'
import '../styles/globals.css'

export default function App({Component, pageProps}) {
  const {album} = pageProps

  return (
    <MenuContextProvider>
      <Layout album={album}>
        <Component {...pageProps} />
      </Layout>
    </MenuContextProvider>
  )
}
