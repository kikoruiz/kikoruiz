import {AppProps} from 'next/app'
import {Analytics} from '@vercel/analytics/react'
import {CookieConsentProvider} from '@use-cookie-consent/react'
import Layout from 'components/layout'
import {SubcategoryProvider} from 'contexts/Subcategory'
import {LatestPicturesProvider} from 'contexts/LatestPictures'
import {LayoutProvider} from 'contexts/Layout'
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
      <CookieConsentProvider>
        <LayoutProvider>
          <SubcategoryProvider>
            <LatestPicturesProvider>
              <Layout {...sectionData} {...languageData}>
                <Component {...pageProps} />

                <Analytics />
              </Layout>
            </LatestPicturesProvider>
          </SubcategoryProvider>
        </LayoutProvider>
      </CookieConsentProvider>
    </>
  )
}
