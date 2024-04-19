import {AppProps} from 'next/app'
import {Analytics} from '@vercel/analytics/react'
import {SpeedInsights} from '@vercel/speed-insights/next'
import {CookieConsentProvider} from '@use-cookie-consent/react'
import {CartProvider} from 'use-shopping-cart'
import I18nProvider from 'next-translate/I18nProvider'
import useTranslation from 'next-translate/useTranslation'
import {SubcategoryProvider} from 'contexts/Subcategory'
import {LatestPicturesProvider} from 'contexts/LatestPictures'
import {LayoutProvider} from 'contexts/Layout'
import Layout from 'components/layout'
import commonES from '../locales/es/common.json'
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
  const {lang} = useTranslation()

  return (
    <>
      <CookieConsentProvider
        useCookieConsentHooksOptions={{consentCookieAttributes: {expires: 365}}}
      >
        <CartProvider
          mode="payment"
          cartMode="client-only"
          stripe={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string}
          successUrl="/checkout/success"
          cancelUrl="/checkout/fail"
          currency="EUR"
          allowedCountries={['ES']}
          billingAddressCollection
          shouldPersist
        >
          <I18nProvider lang={lang} namespaces={{commonES}}>
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
          </I18nProvider>
        </CartProvider>
      </CookieConsentProvider>
    </>
  )
}
