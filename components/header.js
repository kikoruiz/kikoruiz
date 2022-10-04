import Link from 'next/link'
import Breadcrumb from './breadcrumb.js'
import Navbar from './navbar.js'
import Logo from '../assets/brand/photo-logo.svg'

export default function Header({section}) {
  return (
    <header className="sticky top-0 z-10 w-full backdrop-blur">
      <div className="bg-neutral-900/90">
        <div className="container mx-auto flex justify-between pl-5 pr-3">
          <div className="flex justify-center py-8">
            <Link href="/">
              <a title="Kiko Ruiz">
                <Logo className="w-24 fill-neutral-300 transition-colors ease-in-out hover:fill-orange-200" />
              </a>
            </Link>
          </div>

          <Navbar />
        </div>
      </div>

      <Breadcrumb section={section} />
    </header>
  )
}
