import PropTypes from 'prop-types'
import Link from 'next/link'
import {useMenuContext} from '../context/menu.js'
import Navbar from '../components/navbar.js'
import LogoIcon from '../assets/icons/logo.svg'

export default function Header({album}) {
  const {isMenuOpen} = useMenuContext()

  return (
    <header className="sticky top-0 z-10 w-full backdrop-blur">
      <div className="bg-neutral-900/90">
        <div className="container mx-auto flex justify-between px-6">
          <div
            className={`flex justify-center py-8${
              isMenuOpen ? ' pointer-events-none' : ''
            }`}
          >
            <Link href="/">
              <a title="Kiko Ruiz">
                <LogoIcon className="w-24 fill-neutral-300 transition-colors ease-in-out hover:fill-orange-200" />
              </a>
            </Link>
          </div>

          <Navbar />
        </div>
      </div>

      {album && (
        <div
          className={`bg-neutral-800/75${
            isMenuOpen ? ' pointer-events-none' : ''
          }`}
        >
          <div className="container mx-auto py-3 px-3 text-xl">
            <Link href="/gallery">
              <a
                title="Back to Gallery"
                className="text-neutral-400/30 drop-shadow after:content-['\00a0/\00a0'] hover:text-neutral-300/60 hover:after:text-neutral-400/30"
              >
                Gallery
              </a>
            </Link>
            <span className="font-black text-orange-300/75">{album.name}</span>
          </div>
        </div>
      )}
    </header>
  )
}

Header.propTypes = {
  album: PropTypes.shape({
    name: PropTypes.string
  })
}
