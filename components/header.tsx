import Link from 'next/link'
import Breadcrumb from './breadcrumb'
import Navigation from './navigation'
import Logo from 'assets/brand/photo-logo.svg'
import {SectionData} from 'types'

export default function Header({...sectionData}: SectionData) {
  const {hasHero} = sectionData

  return (
    <header className="sticky top-0 z-10 w-full backdrop-blur">
      <div className={`${hasHero ? 'bg-transparent' : 'bg-neutral-900/90'}`}>
        <div className="container mx-auto flex justify-between pl-5 pr-3">
          <div className="flex justify-center py-8">
            <Link href="/" title="Kiko Ruiz">
              <Logo className="w-24 fill-neutral-300 transition-colors ease-in-out hover:fill-orange-200" />
            </Link>
          </div>

          <Navigation section={sectionData.section} hasHero={hasHero} />
        </div>
      </div>

      <Breadcrumb {...sectionData} />
    </header>
  )
}
