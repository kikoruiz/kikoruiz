import {ReactNode, useEffect} from 'react'
import {useRouter} from 'next/router'
import Header from './header'
import Footer from './footer'
import useSubcategoryContext from 'contexts/subcategory'
import {Alternate, SectionData} from 'types'

export default function Layout({
  children,
  alternates,
  ...sectionData
}: LayoutProps) {
  const router = useRouter()
  const {hasHero} = sectionData
  const {setSubcategory} = useSubcategoryContext()

  useEffect(() => {
    function handleRouteChangeStart() {
      // Reset subcategory value.
      setSubcategory(null)
    }

    router.events.on('routeChangeStart', handleRouteChangeStart)

    return function () {
      router.events.off('routeChangeStart', handleRouteChangeStart)
    }
  }, [router.events, setSubcategory])

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
