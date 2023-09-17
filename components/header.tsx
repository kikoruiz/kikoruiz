import Link from 'next/link'
import Breadcrumb from './breadcrumb'
import Navigation from './navigation'
import Logo from 'assets/brand/photo-logo.svg'
import {SectionData} from 'types'

export default function Header({...sectionData}: SectionData) {
  const {hasHero, section} = sectionData
  const isHome = section === 'home'
  const logo = (
    <Logo
      className={`w-24 fill-neutral-100${
        !isHome ? ' transition-colors ease-in-out hover:fill-orange-200' : ''
      }`}
    />
  )

  return (
    <header id="header" className="sticky top-0 z-20 w-full backdrop-blur">
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

          <Navigation section={section} hasHero={hasHero} />
        </div>
      </div>

      <Breadcrumb {...sectionData} />
    </header>
  )
}
