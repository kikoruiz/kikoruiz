import {useEffect} from 'react'
import Script from 'next/script'
import {useRouter} from 'next/router'
import Layout from '../components/layout.js'
import {trackPage, GA_TRACKING_ID} from '../lib/tracking.js'
import '../styles/globals.css'

function handleRouteChange(url) {
  trackPage(url)
}

export default function App({Component, pageProps}) {
  const router = useRouter()
  const {section, post, alternates} = pageProps
  const sectionData = {
    section,
    post
  }
  const languageData = {alternates}

  useEffect(() => {
    trackPage(router.asPath)
  }, [router.asPath])

  useEffect(() => {
    router.events.on('routeChangeComplete', handleRouteChange)

    return function () {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="ga4-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag() { dataLayer.push(arguments); }
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname
            });
          `
        }}
      />

      <Layout {...sectionData} {...languageData}>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}
