import {useLayoutEffect, useRef, useState, memo} from 'react'
import Link from 'next/link'
import useLayoutContext from 'contexts/Layout'
import Breadcrumb from './breadcrumb'
import Navigation from './navigation'
import Logo from 'assets/brand/photo-logo.svg'
import {SectionData} from 'types'

function Header({...sectionData}: SectionData) {
  const headerRef = useRef(null)
  const {setLayout} = useLayoutContext()
  const {hasHero, section, subSection} = sectionData
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false)
  const isHome = section === 'home'
  const logo = (
    <Logo
      className={`w-24 fill-neutral-100${
        !isHome ? ' transition-colors ease-in-out hover:fill-orange-200' : ''
      }`}
    />
  )

  useLayoutEffect(() => {
    setLayout({headerHeight: headerRef.current.offsetHeight})
  }, [setLayout])

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-20 w-full${isMenuOpen || isSearchBarOpen ? '' : ' backdrop-blur'}`}
    >
      <div className={`${hasHero ? 'bg-transparent' : 'bg-neutral-900/90'}`}>
        <div className="container mx-auto flex justify-between pl-5 pr-3">
          <div className="flex justify-center py-8">
            {!isHome ? (
              <Link href="/" title="Kiko Ruiz Photography">
                {logo}
              </Link>
            ) : (
              logo
            )}
          </div>

          <Navigation
            section={section}
            subSection={subSection}
            hasHero={hasHero}
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            isSearchBarOpen={isSearchBarOpen}
            setIsSearchBarOpen={setIsSearchBarOpen}
          />
        </div>
      </div>

      <Breadcrumb {...sectionData} />
    </header>
  )
}

export default memo(Header)

Header.displayName = 'Header'
