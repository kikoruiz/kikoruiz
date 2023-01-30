import {useEffect} from 'react'
import {userAgentFromString} from 'next/server'
import Script from 'next/script'
import {useRouter} from 'next/router'
import {AppProps} from 'next/app'
import {Analytics} from '@vercel/analytics/react'
import Layout from 'components/layout'
import {trackPage, GA_TRACKING_ID} from 'lib/tracking'
import {SubcategoryContextProvider} from 'contexts/subcategory'
import {DeviceContext} from 'contexts/device'
import '../styles/globals.css'

function handleRouteChange(url: string) {
  trackPage(url)
}

export default function App({Component, pageProps, userAgent}: CustomAppProps) {
  const router = useRouter()
  const {section, post, tag, alternates, heroImages} = pageProps
  const sectionData = {section, post, tag, hasHero: Boolean(heroImages)}
  const languageData = {alternates}
  let device

  switch (userAgent.device.type) {
    case 'mobile':
    case 'tablet':
      device = userAgent.device.type
      break
    default:
      device = 'desktop'
      break
  }

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

      <DeviceContext.Provider value={device}>
        <SubcategoryContextProvider>
          <Layout {...sectionData} {...languageData}>
            <Component {...pageProps} />
            <Analytics />
          </Layout>
        </SubcategoryContextProvider>
      </DeviceContext.Provider>
    </>
  )
}

App.getInitialProps = async ({ctx}) => {
  const ua = ctx?.req?.headers['user-agent']
  const userAgent = userAgentFromString(ua)

  return {userAgent}
}

interface CustomAppProps extends AppProps {
  userAgent: {
    device: {
      model?: string
      type?: string
      vendor?: string
    }
  }
}
