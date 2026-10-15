import {ReactNode} from 'react'
import {useRouter} from 'next/router'
import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'
import {Inter} from 'next/font/google'
import Header from './header'
import Footer from './footer'
import {Alternate, SectionData} from 'types'
import {LEGAL_PAGES, SIMPLE_PAGES} from 'config'
import CookiesBanner from './cookies-banner'
import ThirdPartyScripts from './third-party-scripts'

interface LayoutProps extends SectionData {
  children: ReactNode
  alternates: Alternate[]
  isPrintable?: boolean
}

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
})

export default function Layout({
  children,
  alternates,
  isPrintable = false,
  ...sectionData
}: LayoutProps) {
  const {locale, defaultLocale} = useRouter()
  const {t} = useTranslation()
  const {hasHero, section} = sectionData
  const isLegalPage = LEGAL_PAGES.includes(section)
  const isSimplePage = SIMPLE_PAGES.includes(section)
  const canonical = alternates?.find(a => a.locale === locale)?.href
  const defaultHref = alternates?.find(a => a.locale === defaultLocale)?.href
  const needsBorder = hasHero || isLegalPage || isSimplePage
  const mainProps = {
    ...(!isPrintable && {
      className: `container mx-auto mb-auto overflow-hidden sm:pt-12${
        needsBorder ? ' border-t border-neutral-300/10' : ''
      }`
    })
  }

  return (
    <div className={`${inter.variable} font-sans flex min-h-screen flex-col`}>
      {canonical && (
        <Head>
          <link rel="canonical" href={canonical} key="canonical" />
          <link rel="alternate" hrefLang="x-default" href={defaultHref} />
        </Head>
      )}

      {!isPrintable && (
        <a
          href="#main"
          className="sr-only rounded-md bg-neutral-800 px-4 py-2 text-sm font-medium text-orange-300 ring-1 ring-orange-300 focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50"
        >
          {t('navigation.skip-to-content')}
        </a>
      )}

      {!isPrintable && <Header {...sectionData} />}

      <main id="main" tabIndex={-1} {...mainProps}>
        {children}
      </main>

      {!isPrintable && (
        <>
          <Footer alternates={alternates} />

          <CookiesBanner />

          <ThirdPartyScripts />
        </>
      )}
    </div>
  )
}

Layout.displayName = 'Layout'
