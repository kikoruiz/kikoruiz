import {AppProps} from 'next/app'
import {Analytics} from '@vercel/analytics/react'
import {SpeedInsights} from '@vercel/speed-insights/next'
import {CookieConsentProvider} from '@use-cookie-consent/react'
import {SnipcartProvider} from 'use-snipcart'
import {SubcategoryProvider} from 'contexts/Subcategory'
import {LatestPicturesProvider} from 'contexts/LatestPictures'
import {LayoutProvider} from 'contexts/Layout'
import Layout from 'components/layout'
import '../styles/globals.css'

export default function App({Component, pageProps}: AppProps) {
  const {section, subSection, post, tag, alternates, heroImage} = pageProps
  const sectionData = {
    section,
    subSection,
    post,
    tag,
    hasHero: Boolean(heroImage)
  }
  const languageData = {alternates}

  return (
    <>
      <CookieConsentProvider
        useCookieConsentHooksOptions={{consentCookieAttributes: {expires: 365}}}
      >
        <SnipcartProvider>
          <LayoutProvider>
            <SubcategoryProvider>
              <LatestPicturesProvider>
                <Layout {...sectionData} {...languageData}>
                  <Component {...pageProps} />

                  <Analytics />
                  <SpeedInsights />
                </Layout>
              </LatestPicturesProvider>
            </SubcategoryProvider>
          </LayoutProvider>
        </SnipcartProvider>
      </CookieConsentProvider>
    </>
  )
}
