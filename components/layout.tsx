import Header from './header'
import Footer from './footer'
import {ReactNode} from 'react'
import {Alternate, SectionData} from 'types'

export default function Layout({
  children,
  alternates,
  ...sectionData
}: LayoutProps) {
  const {hasHero} = sectionData

  return (
    <div className="flex min-h-screen flex-col">
      <Header {...sectionData} />

      <main
        className={`container mx-auto mb-auto overflow-hidden sm:pt-12${
          hasHero ? ' border-t border-neutral-300/10' : ''
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
