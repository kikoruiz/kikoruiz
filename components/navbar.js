import {useState} from 'react'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {SECTIONS} from '../config/index.js'
import {useMediaQuery} from 'react-responsive'
import resolveConfig from 'tailwindcss/resolveConfig.js'
import tailwindConfig from '../tailwind.config.js'

const config = resolveConfig(tailwindConfig)
const {screens} = config.theme
const smallScreenWidth = Number(screens.sm.split('px')[0])

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const {asPath} = useRouter()

  useMediaQuery({minWidth: smallScreenWidth}, undefined, handleMediaQueryChange)

  function handleMediaQueryChange(matches) {
    if (matches) setIsMenuOpen(false)
  }

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className={`my-auto${isMenuOpen ? ' relative' : ''}`}>
      <button
        aria-hidden="true"
        tabIndex="-1"
        className={`fixed inset-0 top-0 left-0 h-screen w-screen bg-neutral-900/60 backdrop-blur transition-opacity sm:hidden ${
          isMenuOpen
            ? 'opacity-1 touch-none'
            : 'pointer-events-none touch-auto opacity-0'
        }`}
        onClick={isMenuOpen ? toggleMenu : () => {}}
      ></button>

      <button
        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        className="relative flex h-11 w-11 rounded-full bg-gradient-to-t from-neutral-800 text-neutral-400 hover:text-neutral-300 focus:outline-none sm:hidden"
        onClick={toggleMenu}
      >
        <span className="sr-only">
          {isMenuOpen ? 'Close menu' : 'Open menu'}
        </span>
        <div className="absolute left-1/2 top-1/2 w-5 -translate-x-1/2 -translate-y-1/2 transform">
          <span
            aria-hidden="true"
            className={`absolute flex h-0.5 w-5 transform bg-current transition duration-300 ease-in-out ${
              isMenuOpen ? 'rotate-45' : '-translate-y-1.5'
            }`}
          ></span>
          <span
            aria-hidden="true"
            className={`absolute flex h-0.5 w-5 transform bg-current transition duration-300 ease-in-out${
              isMenuOpen ? ' opacity-0' : ''
            }`}
          ></span>
          <span
            aria-hidden="true"
            className={`absolute flex h-0.5 w-5 transform bg-current transition duration-300 ease-in-out ${
              isMenuOpen ? '-rotate-45' : 'translate-y-1.5'
            }`}
          ></span>
        </div>
      </button>

      <ul
        className={`${
          isMenuOpen
            ? 'absolute right-0 top-full z-20 mt-3 w-[calc(100vw-1.5rem)] rounded-md bg-neutral-800 px-3 py-4 drop-shadow-lg'
            : 'hidden sm:flex'
        }`}
      >
        {SECTIONS.map(({name, slug}) => {
          const href = `/${slug}`
          const isActiveSection = asPath.includes(href)
          const isActualSection = asPath === href
          const content = (
            <a
              title={name}
              className={`relative block px-6 font-extrabold after:absolute after:bottom-0 after:left-0 after:block after:h-[1px] after:w-full after:bg-gradient-to-r after:from-transparent after:via-transparent ${
                isMenuOpen ? 'py-3' : 'py-2'
              }${isActualSection ? ' hover:cursor-default' : ''}${
                isActiveSection
                  ? ' text-orange-300 after:via-orange-300'
                  : ' hover:text-orange-200 hover:after:via-orange-200'
              }`}
              onClick={isMenuOpen && !isActualSection ? toggleMenu : () => {}}
            >
              <span>{name.toLowerCase()}</span>
            </a>
          )
          const itemProps = {
            key: slug,
            ...(isMenuOpen && {className: 'first:mt-1 last:mb-2'})
          }

          return (
            // eslint-disable-next-line
            <li {...itemProps}>
              {isActualSection ? content : <Link href={href}>{content}</Link>}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
