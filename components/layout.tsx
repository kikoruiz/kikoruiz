import {ReactNode} from 'react'
import Header from './header'
import Footer from './footer'
import {Alternate, SectionData} from 'types'
import { LEGAL_PAGES } from 'config'

export default function Layout({
  children,
  alternates,
  ...sectionData
}: LayoutProps) {
  const {hasHero, section} = sectionData
  const needsBorder = hasHero || LEGAL_PAGES.includes(section)

  return (
    <div className="flex min-h-screen flex-col">
      <Header {...sectionData} />

      <main
        className={`container mx-auto mb-auto overflow-hidden sm:pt-12${
          needsBorder ? ' border-t border-neutral-300/10' : ''
        }`}
      >
        {children}
      </main>

      <Footer alternates={alternates} />
    </div>
  )
}

interface LayoutProps extends SectionData {
  children: ReactNode
  alternates: Alternate[]
}
