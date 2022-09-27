import Link from 'next/link'
import Breadcrumb from './breadcrumb.js'
import Navbar from './navbar.js'
import LogoIcon from '../assets/icons/logo.svg'

export default function Header() {
  return (
    <header className="sticky top-0 z-10 w-full backdrop-blur">
      <div className="bg-neutral-900/90">
        <div className="container mx-auto flex justify-between px-6">
          <div className="flex justify-center py-8">
            <Link href="/">
              <a title="Kiko Ruiz">
                <LogoIcon className="w-24 fill-neutral-300 transition-colors ease-in-out hover:fill-orange-200" />
              </a>
            </Link>
          </div>

          <Navbar />
        </div>
      </div>

      <Breadcrumb />
    </header>
  )
}
