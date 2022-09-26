import Link from 'next/link'
import Navbar from '../components/navbar.js'
import LogoIcon from '../assets/icons/logo.svg'

export default function Header() {
  return (
    <header className="sticky top-0 z-10 w-full bg-neutral-900/75 backdrop-blur">
      <div className="container mx-auto flex justify-between px-6">
        <div className="flex justify-center py-6">
          <Link href="/">
            <a title="Kiko Ruiz">
              <LogoIcon className="w-24 fill-neutral-300 transition-colors ease-in-out hover:fill-orange-200" />
            </a>
          </Link>
        </div>
        <Navbar />
      </div>
    </header>
  )
}
