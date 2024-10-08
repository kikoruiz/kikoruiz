import {ReactNode} from 'react'
import {Inter} from 'next/font/google'
import Header from './header'
import Footer from './footer'
import {Alternate, SectionData} from 'types'
import {LEGAL_PAGES, SIMPLE_PAGES} from 'config'
import CookiesBanner from './cookies-banner'
import ThirdPartyScripts from './third-party-scripts'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
})

export default function Layout({
  children,
  alternates,
  ...sectionData
}: LayoutProps) {
  const {hasHero, section} = sectionData
  const isLegalPage = LEGAL_PAGES.includes(section)
  const isSimplePage = SIMPLE_PAGES.includes(section)
  const needsBorder = hasHero || isLegalPage || isSimplePage

  return (
    <div className={`${inter.variable} font-sans flex min-h-screen flex-col`}>
      <Header {...sectionData} />

      <main
        className={`container mx-auto mb-auto overflow-hidden sm:pt-12${
          needsBorder ? ' border-t border-neutral-300/10' : ''
        }`}
      >
        {children}
      </main>

      <Footer alternates={alternates} />

      <CookiesBanner />

      <ThirdPartyScripts />
    </div>
  )
}

interface LayoutProps extends SectionData {
  children: ReactNode
  alternates: Alternate[]
}
