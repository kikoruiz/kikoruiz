import {AppProps} from 'next/app'
import {useRouter} from 'next/router'
import {Analytics} from '@vercel/analytics/react'
import {SpeedInsights} from '@vercel/speed-insights/next'
import {CookieConsentProvider} from '@use-cookie-consent/react'
import I18nProvider from 'next-translate/I18nProvider'
import useTranslation from 'next-translate/useTranslation'
import {SubcategoryProvider} from 'contexts/Subcategory'
import {LatestPicturesProvider} from 'contexts/LatestPictures'
import {HeroImageProvider} from 'contexts/HeroImage'
import {LayoutProvider} from 'contexts/Layout'
import {CookiesSettingsProvider} from 'contexts/CookiesSettings'
import Layout from 'components/layout'
import StoreCartProvider from 'components/store-cart-provider'
import common from '../locales/es/common.json'
import '../styles/globals.css'

const ONE_YEAR = 365

export default function App({Component, pageProps}: AppProps) {
  const router = useRouter()
  const {query: {print} = {}} = router
  const {
    section,
    subSection,
    post,
    picture,
    albumId,
    tag,
    alternates,
    heroImage,
    heroImages
  } = pageProps
  const sectionData = {
    section,
    subSection,
    post,
    picture,
    albumId,
    tag,
    hasHero: Boolean(heroImages)
  }
  const languageData = {alternates}
  const {lang} = useTranslation()
  const isStorePage = router.pathname.startsWith('/tienda')

  return (
    <>
      <CookieConsentProvider
        useCookieConsentHooksOptions={{
          consentCookieAttributes: {expires: ONE_YEAR}
        }}
      >
        <I18nProvider lang={lang} namespaces={{common}}>
          <CookiesSettingsProvider>
            <LayoutProvider>
              <SubcategoryProvider>
                <LatestPicturesProvider>
                  <HeroImageProvider defaultImage={heroImage}>
                    {/* The cart wraps the page for the first time when the shop
                      is visited, which remounts everything below it, so it
                      goes under the providers that hold state to keep. */}
                    <StoreCartProvider isActive={isStorePage}>
                      <Layout
                        isPrintable={Boolean(print)}
                        {...sectionData}
                        {...languageData}
                      >
                        <Component {...pageProps} />

                        <Analytics />
                        <SpeedInsights />
                      </Layout>
                    </StoreCartProvider>
                  </HeroImageProvider>
                </LatestPicturesProvider>
              </SubcategoryProvider>
            </LayoutProvider>
          </CookiesSettingsProvider>
        </I18nProvider>
      </CookieConsentProvider>
    </>
  )
}
